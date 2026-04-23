import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleGenerativeAI, FunctionDeclaration, SchemaType, Content } from '@google/generative-ai';

@Injectable()
export class ChatbotService {
  private readonly genAI: GoogleGenerativeAI;
  private readonly logger = new Logger(ChatbotService.name);

  constructor(private readonly prisma: PrismaService) {
    this.genAI = new GoogleGenerativeAI(process.env.API_KEY || '');
  }

  private get functionDeclarations(): FunctionDeclaration[] {
    return [
      {
        name: "searchProducts",
        description: "Search for sneakers by name, description, brand, or category. Use this to help customers find products.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            query: { type: SchemaType.STRING, description: "Search query for sneaker name or description" },
            brandName: { type: SchemaType.STRING, description: "Filter by brand name (e.g., Nike, Adidas, Puma)" },
            categoryName: { type: SchemaType.STRING, description: "Filter by category name (e.g., Running, Lifestyle, Basketball)" },
          },
        },
      },
      {
        name: "getProductDetails",
        description: "Get detailed information about a specific sneaker, including its variants (size, color, price, stock).",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            sneakerId: { type: SchemaType.NUMBER, description: "The ID of the sneaker to get details for" },
          },
          required: ["sneakerId"],
        },
      },
      {
        name: "createOrder",
        description: "Create an order for the customer. Call this when the customer confirms they want to buy specific variants.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            address: { type: SchemaType.STRING, description: "Delivery address" },
            phone: { type: SchemaType.STRING, description: "Customer phone number" },
            paymentMethod: { type: SchemaType.STRING, description: "Payment method (COD, BANK_TRANSFER, MOMO, VNPAY). Defaults to COD if not specified." },
            items: {
              type: SchemaType.ARRAY,
              description: "List of variant IDs and quantities to order",
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  variantId: { type: SchemaType.NUMBER, description: "The ID of the variant" },
                  quantity: { type: SchemaType.NUMBER, description: "The quantity to order" },
                },
                required: ["variantId", "quantity"],
              },
            },
          },
          required: ["address", "phone", "items"],
        },
      }
    ];
  }

  async handleChat(userId: number, message: string, history: any[]) {
    try {
      const model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: "You are a helpful and polite sneaker consultant. When a user wants to find a sneaker, ask about their preferences (brand, color, budget) if they haven't provided them. When a user asks what size they should buy, ask them for their foot length in cm, and recommend the standard sneaker size based on it (e.g., 26cm is usually US 8 / EU 41).",
        tools: [{ functionDeclarations: this.functionDeclarations }],
      });

      const formattedHistory: Content[] = history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }],
      }));

      const chat = model.startChat({
        history: formattedHistory,
      });

      let response = await chat.sendMessage(message);
      let functionCalls = response.response.functionCalls();

      // Handle function calls loop
      while (functionCalls && functionCalls.length > 0) {
        const call = functionCalls[0];
        this.logger.log(`Function call: ${call.name}`, call.args);

        let functionResult: any = {};

        if (call.name === 'searchProducts') {
          functionResult = await this.handleSearchProducts(call.args as any);
        } else if (call.name === 'getProductDetails') {
          functionResult = await this.handleGetProductDetails(call.args as any);
        } else if (call.name === 'createOrder') {
          functionResult = await this.handleCreateOrder(userId, call.args as any);
        }

        response = await chat.sendMessage([{
          functionResponse: {
            name: call.name,
            response: functionResult
          }
        }]);

        functionCalls = response.response.functionCalls();
      }

      return { response: response.response.text() };
    } catch (error) {
      this.logger.error('Error handling chat', error);
      throw error;
    }
  }

  private async handleSearchProducts(args: { query?: string, brandName?: string, categoryName?: string }) {
    const sneakers = await this.prisma.sneaker.findMany({
      where: {
        AND: [
          args.query ? {
            OR: [
              { name: { contains: args.query, mode: 'insensitive' } },
              { description: { contains: args.query, mode: 'insensitive' } },
            ]
          } : {},
          args.brandName ? { brand: { name: { contains: args.brandName, mode: 'insensitive' } } } : {},
          args.categoryName ? { category: { name: { contains: args.categoryName, mode: 'insensitive' } } } : {},
          { deletedAt: null }
        ]
      },
      include: {
        brand: true,
        category: true,
        variants: {
          select: { price: true, color: true, size: true, stock: true }
        }
      },
      take: 5, // Limit results
    });

    return sneakers;
  }

  private async handleGetProductDetails(args: { sneakerId: number }) {
    const sneaker = await this.prisma.sneaker.findUnique({
      where: { id: args.sneakerId },
      include: {
        brand: true,
        category: true,
        variants: true,
      }
    });

    return sneaker || { error: "Sneaker not found" };
  }

  private async handleCreateOrder(userId: number, args: { address: string, phone: string, paymentMethod?: string, items: { variantId: number, quantity: number }[] }) {
    try {
      const customer = await this.prisma.customer.findUnique({
        where: { userId }
      });

      if (!customer) {
        return { error: "Customer profile not found. Please setup customer profile first." };
      }

      // Calculate totals
      let totalAmount = 0;
      const orderItemsData: any[] = [];

      for (const item of args.items) {
        const variant = await this.prisma.variant.findUnique({
          where: { id: item.variantId },
          include: { sneaker: true }
        });

        if (!variant) {
          return { error: `Variant ID ${item.variantId} not found` };
        }

        if (variant.stock < item.quantity) {
          return { error: `Not enough stock for ${variant.sneaker.name} (Variant ID: ${item.variantId}). Only ${variant.stock} left.` };
        }

        const itemTotal = Number(variant.price) * item.quantity;
        totalAmount += itemTotal;

        orderItemsData.push({
          variantId: variant.id,
          name: variant.sneaker.name,
          color: variant.color,
          size: variant.size,
          price: variant.price,
          quantity: item.quantity,
          total: itemTotal,
        });
      }

      const shippingFee = 0; // Default or calculated
      const discountAmount = 0;
      const finalAmount = totalAmount + shippingFee - discountAmount;

      const validPaymentMethods = ["COD", "BANK_TRANSFER", "MOMO", "VNPAY"];
      const paymentMethod = args.paymentMethod && validPaymentMethods.includes(args.paymentMethod.toUpperCase())
        ? args.paymentMethod.toUpperCase() as any
        : "COD";

      // Create order
      const order = await this.prisma.order.create({
        data: {
          customerId: customer.id,
          address: args.address,
          phone: args.phone,
          paymentMethod: paymentMethod,
          totalAmount: totalAmount,
          shippingFee: shippingFee,
          discountAmount: discountAmount,
          finalAmount: finalAmount,
          items: {
            create: orderItemsData,
          }
        },
        include: {
          items: true
        }
      });

      // Update stock
      for (const item of args.items) {
        await this.prisma.variant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      return {
        success: true,
        orderId: order.id,
        message: "Order created successfully",
        totalAmount: order.finalAmount,
      };
    } catch (e: any) {
      return { error: `Failed to create order: ${e.message}` };
    }
  }
}
