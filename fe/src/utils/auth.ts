// SNK/src/utils/auth.ts
import * as jwt_decode from "jwt-decode";

export const decodeToken = (token: string): any => {
  try {
    // ✅ hỗ trợ JSON (fake)
    if (token.startsWith("{")) {
      return JSON.parse(token);
    }

    // ✅ hỗ trợ fake token từ backend
    if (token.startsWith("fake-jwt-token")) {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    }

    // ✅ JWT thật
    const decoded = (jwt_decode as any)(token);
    return decoded;
  } catch (err) {
    console.error("Token lỗi:", err);
    return null;
  }
};
