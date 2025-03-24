import axiosInstance from "../utils/axiosInstance";

export const createRating = async (data , token) => {
    try {
        const res = await axiosInstance.post("api/v1/rating",data,{
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

export const getRatingsPaginate = async ( page , size) => {
    try {
        const res = await axiosInstance.get(`api/v1/rating/product/{productId}/pagination?page=${page - 1}&size=${size}`);

        return res.data;
    } catch (error) {
        console.error(error)
        return null;
    }
} 




export const deleteRating = async ( token , ratingId ) => {
    try {
        const res = await axiosInstance.delete(`api/v1/rating/${ratingId}`,{
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