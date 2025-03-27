import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";

export const createPayment = async (data) => {
    try {
        const res = await axiosInstance.post("payment/create-payment",data)
        if(res.status === 409){
            toast.error("Bạn có 1 đơn hàng chưa thanh toán.");
            return null;
        }
        return res.data;
    } catch (error) {
        console.error(error)
        return null;
    }
} 
