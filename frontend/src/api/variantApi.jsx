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

export const getVariantsByProductId = async (productId , token , page) => {
    try {
        const res = await axiosInstance.get(`api/v1/variants/products/${productId}?page=${page-1}&size=5`,{
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })

        return res.data;
    } catch (error) {
        console.error(error)
        throw new Error(error);
    }
}

export const deleteVariant = async ( token , variantId ) => {
    try {
        const res = await axiosInstance.delete(`api/v1/variants/${variantId}`,{
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
