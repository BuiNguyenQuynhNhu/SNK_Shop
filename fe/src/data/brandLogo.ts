import nike from "../assets/logos/nike.png";
import adidas from "../assets/logos/adidas.png";
import puma from "../assets/logos/puma.png";
import reebok from "../assets/logos/reebok.png";
import newbalance from "../assets/logos/newbalance.png";

export const brandLogos: Record<string, string> = {
  nike,
  adidas,
  puma,
  reebok,
  "new balance": newbalance,
};

export const getBrandLogo = (brand: string) => {
  return brandLogos[brand.toLowerCase()] || "";
};
