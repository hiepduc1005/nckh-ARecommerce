import axiosInstance from "../utils/axiosInstance";

export const createVariant = async (data , token) => {
    try {
        const res = await axiosInstance.post("api/v1/variants",data,{
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })

        return res.data;
    } catch (error) {
        console.error(error)
        return null;
    }
} 