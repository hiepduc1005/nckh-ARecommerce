// src/context/WishlistContext.js
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  addItemToWishlist,
  clearWishlist,
  existsInWishlist,
  getWishListByUser,
  removeItemFromWishlist,
  wishListToCart,
} from "../api/wishListApi";
import useAuth from "../hooks/UseAuth";
import { toast } from "react-toastify";
import useLoading from "../hooks/UseLoading";
import useCart from "./UseCart";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(null);
  const { token, user } = useAuth();
  const { setLoading } = useLoading();
  const { fetchCart } = useCart();

  const fetchWishlist = useCallback(async () => {
    if (!token || !user) return;
    setLoading(true);
    try {
      const data = await getWishListByUser(token);
      setWishlist(data);
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  const addToWishlist = async (variantId) => {
    if (!token || !user) return;
    setLoading(true);
    try {
      await addItemToWishlist(token, variantId);
      await fetchWishlist();

      toast.success("Đã thêm vào danh sách yêu thích!");
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (variantId) => {
    if (!token || !user) return;
    setLoading(true);
    try {
      await removeItemFromWishlist(token, variantId);

      setWishlist((prevWishlist) => {
        if (!prevWishlist) return null;
        return {
          ...prevWishlist,
          wishListItems: prevWishlist.wishListItems.filter(
            (item) => item.variantResponse.id !== variantId
          ),
        };
      });
      toast.success("Đã xóa khỏi danh sách yêu thích!");
    } finally {
      setLoading(false);
    }
  };

  const wishListItemToCart = async (wishListItemId) => {
    if (!token || !user) return;
    setLoading(true);
    try {
      await wishListToCart(token, wishListItemId);

      setWishlist((prevWishlist) => {
        if (!prevWishlist) return null;
        return {
          ...prevWishlist,
          wishListItems: prevWishlist.wishListItems.filter(
            (item) => item.id !== wishListItemId
          ),
        };
      });

      fetchCart();
      toast.success("Chuyển sản phẩm yêu thích sang giỏ hàng thành công");
    } finally {
      setLoading(false);
    }
  };

  const clearWishlistData = async () => {
    if (!token || !user) return;
    setLoading(true);
    try {
      await clearWishlist(token);
      setWishlist({ wishListItems: [] });
      toast.success("Đã xóa toàn bộ danh sách yêu thích!");
    } finally {
      setLoading(false);
    }
  };

  const checkWishlistItem = async (variantId) => {
    if (!token || !user) return false;
    return await existsInWishlist(token, variantId);
  };

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlistData,
        checkWishlistItem,
        wishListItemToCart,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
