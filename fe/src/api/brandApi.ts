const API = "http://localhost:3000/api";

export const getBrands = async () => {
  const res = await fetch(`${API}/brands`);
  return res.json();
};
