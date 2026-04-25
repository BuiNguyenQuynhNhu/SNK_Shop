// LOAD ẢNH HÀNG LOẠT (VITE)
const rawImages = import.meta.glob("./anh/*.{png,jpg,jpeg}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

// LIST BRAND
const brands = ["Nike", "Adidas", "Puma", "Reebok", "New Balance"];

// RANDOM
const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// CHUẨN HÓA STRING
const normalize = (str: string) => str.toLowerCase().replace(/[\s\-]+/g, "");

// LẤY BRAND TỪ TÊN FILE
const getBrand = (name: string) => {
  return brands.find((b) => normalize(name).includes(normalize(b))) || "Other";
};

// MAIN FUNCTION
export const generateProductsFromImages = () => {
  return Object.entries(rawImages).map(([path, img], index) => {
    const fileName = path.split("/").pop() || "";

    const name = fileName.replace(/\.(png|jpg|jpeg)/i, "");

    const brand = getBrand(name);

    return {
      id: index + 1,
      name,
      brand,
      price: random(1500000, 4000000),
      variantId: 1000 + index,
      imageUrl: img,
      sizes: [38, 39, 40, 41, 42],
      stock: {
        38: random(1, 10),
        39: random(1, 10),
        40: random(1, 10),
        41: random(1, 10),
        42: random(1, 10),
      },
    };
  });
};
