import axios from "axios";

const BASE_URL = "http://localhost:3000/api/v1/users";

// Get User Profile Data
export const getUserProfile = async (token) => {
    try {
        const response = await axios.get(`${BASE_URL}/user`, {
            headers: { 
                Authorization: `Bearer ${token}` 
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user profile:", error.response?.data || error.message);
        return { error: "Failed to fetch user profile." };
    }
};

// Register New Client
export const RegisterNewClient = async (userData) => {
    try {
        if (!userData.firstName || !userData.lastName || !userData.phoneNo || !userData.email || !userData.password) {
            return { error: "All fields are required." };
        }

        const response = await axios.post(`${BASE_URL}/signup`, userData, {
            headers: { "Content-Type": "application/json" }
        });
        return response.data;
    } catch (error) {
        console.error("Error registering client:", error.response?.data || error.message);
        return { error: "Registration failed." };
    }
};

// Login User
export const LoginUser = async (userData) => {
    try {
        if (!userData.email || !userData.password) {
            return { error: "Email and password are required." };
        }

        const response = await axios.post(`${BASE_URL}/signin`, userData, {
            headers: { "Content-Type": "application/json" }
        });
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error.response?.data || error.message);
        return { error: "Login failed." };
    }
};

// Update User (Admin or User)
export const updateUser = async (userData) => {
    try {
        if (!userData) {
            return { error: "Missing User Data. Please check your input." };
        }

        const token = localStorage.getItem("token");
        if (!token) return { error: "Unauthorized. Please log in." };

        const response = await axios.put(`${BASE_URL}/updateuser`, userData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error updating user:", error.response?.data || error.message);
        return { error: "Failed to update user." };
    }
};

// Get All Users (Admin Only)
export const getAllUserData = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) return { error: "Unauthorized. Please log in." };

        const response = await axios.get(`${BASE_URL}/all`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching all users:", error.response?.data || error.message);
        return { error: "Failed to fetch users." };
    }
};
