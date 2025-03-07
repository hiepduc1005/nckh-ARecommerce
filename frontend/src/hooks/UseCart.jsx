import { useContext } from "react"
import { CartContext } from "../contexts/CartProvider"

const useCart = () => {
  return (
    useContext(CartContext)
  )
}

export default useCart