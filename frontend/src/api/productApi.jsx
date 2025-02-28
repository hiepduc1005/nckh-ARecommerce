import axiosInstance from "../utils/axiosInstance";

 export const createProduct = async (data , token) => {
    try {
        const res = await axiosInstance.post("api/v1/products",data,{
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            }
        })

        return res.data;
    } catch (error) {
        console.error(error)
        return null;
    }
} 

export const getProductsPaginate = async ( page ) => {
    try {
        const res = await axiosInstance.get(`api/v1/products/pagination?page=${page - 1}&size=5`);

        return res.data;
    } catch (error) {
        console.error(error)
        return null;
    }
} 

export const deleteProduct = async ( token , productId ) => {
    try {
        const res = await axiosInstance.delete(`api/v1/products/${productId}`,{
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        return res.data
    } catch (error) {
        console.error(error)
        return null;
    }
} 