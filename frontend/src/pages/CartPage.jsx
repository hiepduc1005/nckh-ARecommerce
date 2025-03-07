import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faTrash, faTrashAlt, faTrashCan, faTrashRestore } from "@fortawesome/free-solid-svg-icons";
import "../assets/styles/pages/CartPage.scss"
const options = [
  { value: "time", label: "Thời gian" },
  { value: "price", label: "Giá" },
  { value: "name", label: "Tên" },
  { value: "rating", label: "Đánh giá" }
]


const CartPage = () => {

  const [cartItems,setCartItems] = useState();
  const [quantity,setQuantity] = useState();
  
  useEffect(() => {
    const fetchCartProducts  = () => {
      
    }
  },[])
  return (
    <div className='cart-container'>
        <div className="cart-background-image">
            <span>Giỏ hàng</span>
        </div>
        <div className="cart-body">
          {/* <div className="options">
            <div className="left">
              <input type="checkbox" />
              <span>Chọn tất cả</span>
            </div>
            <div className="right">
              <span>Sắp xếp theo:</span>
              <div className="select-container">
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue=""
                  placeholder="Sắp xếp"
                  isDisabled={false}
                  isLoading={false}
                  isClearable={true}
                  isRtl={false}
                  isSearchable={false}
                  name="sort"
                  options={options}
                />
              </div>
            </div>
          </div> */}
          
          <div className="cart-list">
            <div className="cart-button">
              <button className='update'>Update Cart</button>
              <button className='clear'>Clear Cart</button>
            </div>
            <div className="cart-item">
              <div className="left">
                <FontAwesomeIcon icon={faTrash} className='trash-icon'/>
              </div>
              <div className="right">
                <div className="img-container">
                  <img src="	http://localhost:8080/uploads/510ca92a-3638-4e8f-bb12-06b1cc4ebdcd_giaoducqp.jpg" alt="" />
                </div>
                <div className="product-cart-info">
                  <div className="product-name">Ten san pham</div>
                  <div className="product-price">
                    <div className="discount">1234d</div>
                    <div className="original">64353d</div>
                  </div>
                  <div className="list-variant">
                    <div className="item">
                      <div className="name">RAM</div>
                      <div className="value">16GB</div>
                    </div>
                    <div className="item">
                      <div className="name">CPU</div>
                      <div className="value">Intel</div>
                    </div>
                  </div>
                  <div className="quantity">
                    <span>So luong:</span>
                    <div className="button">
                      <button className="ex">
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                      <div className="value">1</div>
                      <button className="plus">
                        <FontAwesomeIcon icon={faPlus}/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="cart-item">
              <div className="left">
                <FontAwesomeIcon icon={faTrash} className='trash-icon'/>
              </div>
              <div className="right">
                <div className="img-container">
                  <img src="	http://localhost:8080/uploads/510ca92a-3638-4e8f-bb12-06b1cc4ebdcd_giaoducqp.jpg" alt="" />
                </div>
                <div className="product-cart-info">
                  <div className="product-name">Ten san pham</div>
                  <div className="product-price">
                    <div className="discount">1234d</div>
                    <div className="original">64353d</div>
                  </div>
                  <div className="list-variant">
                    <div className="item">
                      <div className="name">RAM</div>
                      <div className="value">16GB</div>
                    </div>
                    <div className="item">
                      <div className="name">CPU</div>
                      <div className="value">Intel</div>
                    </div>
                  </div>
                  <div className="quantity">
                    <span>So luong:</span>
                    <div className="button">
                      <button className="ex">
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                      <div className="value">1</div>
                      <button className="plus">
                        <FontAwesomeIcon icon={faPlus}/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="cart-item">
              <div className="left">
                <FontAwesomeIcon icon={faTrash} className='trash-icon'/>
              </div>
              <div className="right">
                <div className="img-container">
                  <img src="	http://localhost:8080/uploads/510ca92a-3638-4e8f-bb12-06b1cc4ebdcd_giaoducqp.jpg" alt="" />
                </div>
                <div className="product-cart-info">
                  <div className="product-name">Ten san pham</div>
                  <div className="product-price">
                    <div className="discount">1234d</div>
                    <div className="original">64353d</div>
                  </div>
                  <div className="list-variant">
                    <div className="item">
                      <div className="name">RAM</div>
                      <div className="value">16GB</div>
                    </div>
                    <div className="item">
                      <div className="name">CPU</div>
                      <div className="value">Intel</div>
                    </div>
                  </div>
                  <div className="quantity">
                    <span>So luong:</span>
                    <div className="button">
                      <button className="ex">
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                      <div className="value">1</div>
                      <button className="plus">
                        <FontAwesomeIcon icon={faPlus}/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="cart-item">
              <div className="left">
                <FontAwesomeIcon icon={faTrash} className='trash-icon'/>
              </div>
              <div className="right">
                <div className="img-container">
                  <img src="	http://localhost:8080/uploads/510ca92a-3638-4e8f-bb12-06b1cc4ebdcd_giaoducqp.jpg" alt="" />
                </div>
                <div className="product-cart-info">
                  <div className="product-name">Ten san pham</div>
                  <div className="product-price">
                    <div className="discount">1234d</div>
                    <div className="original">64353d</div>
                  </div>
                  <div className="list-variant">
                    <div className="item">
                      <div className="name">RAM</div>
                      <div className="value">16GB</div>
                    </div>
                    <div className="item">
                      <div className="name">CPU</div>
                      <div className="value">Intel</div>
                    </div>
                  </div>
                  <div className="quantity">
                    <span>So luong:</span>
                    <div className="button">
                      <button className="ex">
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                      <div className="value">1</div>
                      <button className="plus">
                        <FontAwesomeIcon icon={faPlus}/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="cart-item">
              <div className="left">
                <FontAwesomeIcon icon={faTrash} className='trash-icon'/>
              </div>
              <div className="right">
                <div className="img-container">
                  <img src="	http://localhost:8080/uploads/510ca92a-3638-4e8f-bb12-06b1cc4ebdcd_giaoducqp.jpg" alt="" />
                </div>
                <div className="product-cart-info">
                  <div className="product-name">Ten san pham</div>
                  <div className="product-price">
                    <div className="discount">1234d</div>
                    <div className="original">64353d</div>
                  </div>
                  <div className="list-variant">
                    <div className="item">
                      <div className="name">RAM</div>
                      <div className="value">16GB</div>
                    </div>
                    <div className="item">
                      <div className="name">CPU</div>
                      <div className="value">Intel</div>
                    </div>
                  </div>
                  <div className="quantity">
                    <span>So luong:</span>
                    <div className="button">
                      <button className="ex">
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                      <div className="value">1</div>
                      <button className="plus">
                        <FontAwesomeIcon icon={faPlus}/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="cart-item">
              <div className="left">
                <FontAwesomeIcon icon={faTrash} className='trash-icon'/>
              </div>
              <div className="right">
                <div className="img-container">
                  <img src="	http://localhost:8080/uploads/510ca92a-3638-4e8f-bb12-06b1cc4ebdcd_giaoducqp.jpg" alt="" />
                </div>
                <div className="product-cart-info">
                  <div className="product-name">Ten san pham</div>
                  <div className="product-price">
                    <div className="discount">1234d</div>
                    <div className="original">64353d</div>
                  </div>
                  <div className="list-variant">
                    <div className="item">
                      <div className="name">RAM</div>
                      <div className="value">16GB</div>
                    </div>
                    <div className="item">
                      <div className="name">CPU</div>
                      <div className="value">Intel</div>
                    </div>
                  </div>
                  <div className="quantity">
                    <span>So luong:</span>
                    <div className="button">
                      <button className="ex">
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                      <div className="value">1</div>
                      <button className="plus">
                        <FontAwesomeIcon icon={faPlus}/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
 
          </div>
          <div className="total">
            <div className="voucher">
              <div className="title">Nhap voucher:</div>
              <div className="voucher-input">
                <input type="text" />
                <button>Ap dung</button>
              </div>
            </div>
            <div className="cart-total">
              <div className="value"> <span>Tong: </span>1xxx.xxxd</div>              
            <button className="order">Thanh toan ngay</button>
            </div>
          </div>
        </div>
    </div>
  )
}

export default CartPage