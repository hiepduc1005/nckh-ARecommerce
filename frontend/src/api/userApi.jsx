import axiosInstance from "../utils/axiosInstance";

export const getAuthUser = async (token) => {
    try {
        const res = await axiosInstance.get("api/v1/users/authenticated",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        return res.data;
    } catch (error) {
        console.log(error);
        console.error()
        return null;
    }
}

export const loginUser = async (email,password) => {
    try {
        const res = await axiosInstance.post("api/v1/auth/login", {
            email: email,
            password : password
        })

        const token = res.data?.token;
        if(token){
            return res.data
        }else {
            throw new Error("No token received from server")
        }
        
    } catch (error) {
        console.error("Login failed",error)
        throw error;
    }
}