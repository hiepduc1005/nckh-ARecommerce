import React from 'react'
import "../assets/styles/components/AccountPopper.scss"
import { Link } from 'react-router-dom'
const AccountPopper = ({isOpen}) => {
  return (
    <div className={`account-popper ${isOpen ? "" : "hidden"}`}>
      <ul>
        <li>
          <Link to="/profile">Tài khoản của tôi</Link>
        </li>
        <li>
          <Link to="/orders">Đơn mua</Link>
        </li>
        <li  className="logout">
          Đăng xuất
        </li>
      </ul>
    </div>
  )
}

export default AccountPopper