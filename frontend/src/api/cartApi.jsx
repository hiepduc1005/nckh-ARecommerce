import axiosInstance from "../utils/axiosInstance";

export const getCartByUserId = async (userId, token) => {
    try {
        const res = await axiosInstance.get(`api/v1/carts/${userId}`,{
            headers: {
                "Authorization" : `Bearer ${token}`
            }
        });

        return res.data;
    } catch (error) {
        console.error(error)
        return null;
    }
} 


export const getCartByToken = async (token) => {
    try {
        const res = await axiosInstance.get(`api/v1/carts`,{
            headers: {
                "Authorization" : `Bearer ${token}`
            }
        });

        return res.data;
    } catch (error) {
        console.error(error)
        return null;
    }
} 



export const addVariantToCart = async (data, cartId, token) => {
    try {
        const res = await axiosInstance.post(`api/v1/carts/add/${cartId}`,data,{
            headers: {
                "Authorization" : `Bearer ${token}`
            }
        });

        return res.data;
    } catch (error) {
        console.error(error)
        return null;
    }
}

export const removeVariantFromCart = async (data, cartId, token) => {
    try {
        const res = await axiosInstance.post(`api/v1/carts/remove/${cartId}`,data,{
            headers: {
                "Authorization" : `Bearer ${token}`
            }
        });

        return res.data;
    } catch (error) {
        console.error(error)
        return null;
    }
}


export const clearFromCart = async (cartId , token) => {
    try {
        const res = await axiosInstance.delete(`api/v1/carts/clear/${cartId}`,{
            headers: {
                "Authorization" : `Bearer ${token}`
            }
        });

        return res.data;
    } catch (error) {
        console.error(error)
        return null;
    }
}