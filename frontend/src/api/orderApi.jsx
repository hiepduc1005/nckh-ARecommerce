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

export const getOrderById = async (id) => {
    try {
        const res = await axiosInstance.get(`api/v1/orders/${id}`);

        return res.data;
    } catch (error) {
        console.error(error)
        return null;
    }
} 

export const getOrdersPaginate = async (token,page) => {
    try {
        const res = await axiosInstance.get(`api/v1/orders/pagination?page=${page-1}&size=${5}`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        });

        return res.data;
    } catch (error) {
        console.error(error)
        return null;
    }
} 