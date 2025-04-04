import axios from "axios";

const BASE_URL = 'http://localhost:3000/api/v1/users'

const getUserApi = async (token) => {
    const response = await axios.get(`${BASE_URL}/user`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    )
    return response.data
}

    

module.exports = {
    getUserApi
}