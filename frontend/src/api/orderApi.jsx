import axiosInstance from "../utils/axiosInstance";

export const getOrderByCode = async (code) => {
    try {
        const res = await axiosInstance.get(`api/v1/orders/code/${code}`);

        return res.data;
    } catch (error) {
        console.error(error)
        return null;
    }
} 