export const getUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
  
    try {
      const payloadBase64 = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      return decodedPayload; // Contains name, role, etc.
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  };
  