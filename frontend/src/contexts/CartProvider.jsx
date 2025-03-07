import React, { createContext, useEffect, useState } from 'react'
import useAuth from '../hooks/UseAuth';
import { addVariantToCart, clearFromCart, getCartByToken, removeVariantFromCart } from '../api/cartApi';
import useLoading from '../hooks/UseLoading';
import { toast } from 'react-toastify';

export const CartContext = createContext();

const CartProvider = ({children}) => {

    const [cart,setCart] = useState();

    const {setLoading} = useLoading();
    const {token} = useAuth();

    useEffect(() => {
        const fetchCart = async () => {
            const data = await getCartByToken(token);

            if(data){
                setCart(data);
            }
        }

        setLoading(true);
        fetchCart();
        setLoading(false);
    },[token])

    const removeItem = async (cartItemId) => {
        setLoading(true);
        const data = {
            id: cartItemId
        }

        if(cart){
            const cartResponse = await removeVariantFromCart(data,cart?.id,token);

            if(cartResponse){
                setCart(cartResponse);
                setLoading(false)
                toast.success("Xóa sản phẩm khỏi giỏ hàng thành công!")
                return;
            }
        }
        toast.error("Xóa sản phẩm khỏi thất bại!")
        setLoading(false)
    }

    const addItem = async (variantId,quantity) => {
        setLoading(true);

        const data = {
            variantId,
            quantity
        }

        if(cart){
            const cartResponse = await addVariantToCart(data,cart?.id,token);

            if(cartResponse){
                setCart(cartResponse);
                setLoading(false)
                toast.success("Thêm sản phẩm vào giỏ hàng thành công!")
                return;
            }
        }
        
        toast.error("Thêm sản phẩm vào giỏ hàng thất bại!")
        setLoading(false)
    }

    const clearCart = async () => {
        setLoading(true)
        if(cart && token){
            clearFromCart(cart?.id , token);
            setCart(null)
            toast.success("Clear giỏ hàng thành công")
        }else{
            toast.error("Clear giỏ hàng thất bại")
        }

        setLoading(false)

    }



  return (
    <CartContext.Provider value={{cart , addItem, removeItem , clearCart}}>
        {children}
    </CartContext.Provider>
  )
}

export default CartProvider