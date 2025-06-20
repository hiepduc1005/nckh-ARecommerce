import React, { createContext, useEffect, useState } from "react";
import useAuth from "../hooks/UseAuth";
import {
  addVariantToCart,
  clearFromCart,
  getCartByToken,
  removeVariantFromCart,
} from "../api/cartApi";
import useLoading from "../hooks/UseLoading";
import { toast } from "react-toastify";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState();
  const { token, user } = useAuth();

  const { setLoading } = useLoading();

  const fetchCart = async () => {
    try {
      setLoading(true);
      if (token && user) {
        const data = await getCartByToken(token);
        if (data) {
          setCart(data);
        }
      }
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user) {
      // User đã đăng nhập - fetch cart
      fetchCart();
    } else {
      // User chưa đăng nhập hoặc đã đăng xuất - clear cart
      setCart(null);
    }
  }, [token, user]);

  const removeItem = async (cartItemId) => {
    setLoading(true);
    try {
      if (!cart || !user) return;

      const data = { id: cartItemId };
      const cartResponse = await removeVariantFromCart(data, cart?.id, token);

      if (cartResponse) {
        fetchCart();
        toast.success("Xóa sản phẩm khỏi giỏ hàng thành công!");
      } else {
        toast.error("Xóa sản phẩm khỏi giỏ hàng thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      toast.error("Lỗi hệ thống khi xóa sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (variantId, quantity) => {
    setLoading(true);

    const data = {
      variantId,
      quantity,
    };

    if (cart) {
      const cartResponse = await addVariantToCart(data, cart?.id, token);

      if (cartResponse) {
        fetchCart();
        setLoading(false);
        toast.success("Thêm sản phẩm vào giỏ hàng thành công!");
        return;
      }
    }

    toast.error("Thêm sản phẩm vào giỏ hàng thất bại!");
    setLoading(false);
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      if (cart && token) {
        await clearFromCart(cart?.id, token);
        setCart(null);
        toast.success("Clear giỏ hàng thành công");
      } else {
        toast.error("Clear giỏ hàng thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi clear giỏ hàng:", error);
      toast.error("Có lỗi xảy ra khi clear giỏ hàng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addItem, removeItem, clearCart, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
