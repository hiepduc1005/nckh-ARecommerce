import React from 'react'
import "../assets/styles/components/AccountPopper.scss"
import { Link } from 'react-router-dom'
const AccountPopper = ({isOpen , logout}) => {
  return (
    <div className={`account-popper ${isOpen ? "" : "hidden"}`}>
      <ul>
        <li onClick={(e) => e.stopPropagation() }>
          <Link to="/profile">Tài khoản của tôi</Link>
        </li>
        <li onClick={(e) => e.stopPropagation() }>
          <Link to="/orders">Đơn mua</Link>
        </li>
        <li  className="logout" onClick={(e) => {e.stopPropagation(); logout()}}>
          Đăng xuất
        </li>
      </ul>
    </div>
  )
}

export default AccountPopper