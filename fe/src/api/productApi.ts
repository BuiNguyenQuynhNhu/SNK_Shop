import { api } from "./api";

export const getProducts = () => api("/products");

export const getProductById = (id: number) => api(`/products/${id}`);
