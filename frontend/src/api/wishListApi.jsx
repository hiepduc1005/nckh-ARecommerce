import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";
const WISHLIST_API_BASE = "/api/v1/wishlist";

export const getWishListByUser = async (token) => {
  try {
    const response = await axiosInstance.get(`${WISHLIST_API_BASE}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
  }
};

export const addItemToWishlist = async (token, variantId) => {
  try {
    await axiosInstance.post(
      `${WISHLIST_API_BASE}/add/${variantId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    toast.error("Thêm sản phẩm vào danh sách yêu thích thất bại!");
    console.error("Error adding item to wishlist:", error);
  }
};

export const removeItemFromWishlist = async (token, variantId) => {
  try {
    await axiosInstance.delete(`${WISHLIST_API_BASE}/remove/${variantId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error removing item from wishlist:", error);
    toast.error("Xóa sản phẩm vào danh sách yêu thích thất bại!");
  }
};

export const wishListToCart = async (token, wishListItemId) => {
  try {
    await axiosInstance.post(
      `${WISHLIST_API_BASE}/to-cart/${wishListItemId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error removing item from wishlist:", error);
    toast.error("Chuyển sản phẩm yêu thích sang giỏ hàng thất bại");
  }
};

export const clearWishlist = async (token) => {
  try {
    await axiosInstance.delete(`${WISHLIST_API_BASE}/clear`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    toast.error("Clear danh sách sản phẩm trong danh sách yêu thích thất bại!");
  }
};

export const existsInWishlist = async (token, variantId) => {
  try {
    const response = await axiosInstance.get(
      `${WISHLIST_API_BASE}/exists/${variantId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error checking wishlist item existence:", error);
  }
};
