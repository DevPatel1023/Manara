// utils/auth.js
export const getUserRoleFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
  
    try {
      const base64Payload = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(base64Payload));
      return decodedPayload.role || null;
    } catch (e) {
      console.error("Invalid token");
      return null;
    }
  };
  