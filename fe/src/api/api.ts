const BASE_URL = "http://localhost:3000/api";

export const api = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  const headers: any = {
    ...(token ? { Authorization: "Bearer " + token } : {}),
    ...(options.headers || {}),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  const res = await fetch(BASE_URL + url, { ...options, headers });
  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    if (res.status === 401) localStorage.removeItem("token");
    throw data || { message: "API error" };
  }

  return data;
};
