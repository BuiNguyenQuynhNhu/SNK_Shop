import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { ProductsModule } from './products/products.module';
import { BrandModule } from './brand/brand.module';
import { FavouriteModule } from './favourite/favourite.module';
import { CartModule } from './cart/cart.module';
import { PaymentModule } from './payment/payment.module';
import { MediaModule } from './media/media.module';
import { ChatbotModule } from './chatbot/chatbot.module';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
  imports: [AuthModule, OrderModule, ProductsModule, BrandModule, FavouriteModule, CartModule, PaymentModule, MediaModule],
})
export class PrismaModule {}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: Number(config.get('DB_PORT')),
        username: config.get('DB_USER'),
        password: config.get('DB_PASS'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    PrismaModule,
    AuthModule, ProductsModule, OrderModule, BrandModule, FavouriteModule, CartModule, PaymentModule, MediaModule, ChatbotModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
