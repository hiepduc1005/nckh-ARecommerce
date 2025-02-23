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

export const registerUser = async (email, firstname, lastname, password) => {
    try {
        const res = await axiosInstance.post("api/v1/auth/register", {
            email: email,
            firstname: firstname,
            lastname: lastname,
            password: password,
        })
        
        return res.data
    } catch (error) {
        if(error.response){
            throw new Error(error.response.data || "Có lỗi xảy ra khi đăng ký!");
        }

        throw new Error("Không thể kết nối đến máy chủ!");
    }

   
} 