import { generateProductsFromImages } from "./imageLoader";

export type ProductType = {
  id: number;
  name: string;
  price: number;
  brand: string;
  variantId: number;
  imageUrl: string;
  sizes: number[];
  stock: { [size: number]: number };
};

// Khởi tạo ban đầu
const initialProducts: ProductType[] = generateProductsFromImages();

// Hàm lấy dữ liệu
export const getMockProducts = (): ProductType[] => {
  const saved = localStorage.getItem("snk_products");
  if (saved) {
    return JSON.parse(saved);
  }
  localStorage.setItem("snk_products", JSON.stringify(initialProducts));
  return initialProducts;
};

// Hàm lưu dữ liệu
export const saveMockProducts = (products: ProductType[]) => {
  localStorage.setItem("snk_products", JSON.stringify(products));
};

// Vẫn export ra mảng tĩnh (giá trị lúc khởi tạo) để dự phòng
export const mockProducts: ProductType[] = getMockProducts();
