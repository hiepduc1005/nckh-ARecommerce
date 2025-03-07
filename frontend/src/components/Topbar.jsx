import React from 'react'
import "../assets/styles/components/Topbar.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faEnvelope, faHeart, faPhone, faUser } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
import useLoading from '../hooks/UseLoading'
import cartIcon from "../assets/icons/giohang.png"
import loveListIcon from "../assets/icons/heart-icon.png"
const Topbar = ({user,isAuthenticated}) => {

    const naviate = useNavigate();
    const {setLoading} = useLoading();
     

    const handleClickUser = () => {
        setLoading(true)

        if(user && isAuthenticated){
            naviate(`/profile/${user.id}`)
            setLoading(false)
            return;
        }

        naviate("/login")
        setLoading(false)
    }
  return (
    <div className='topbar-container'>
        <div className="left">
            <div className="email-contact">
                <FontAwesomeIcon size="lg" icon={faEnvelope} />
                <span>hhqvt@gmail.com</span>
            </div>
            <div className="phone-contact">
                <FontAwesomeIcon size="lg" icon={faPhone} />
                <span>0123456789</span>
            </div>
        </div>
        <div className="right">
            <Link className="lovelist-icon">
                <FontAwesomeIcon size="lg" color='#207355' icon={faHeart} />
                <span>Danh sách yêu thích</span>
            </Link>
            <Link className="cart-icon" to={'/cart'}>
                <FontAwesomeIcon size="lg" color='#207355' icon={faCartShopping} />
                <span>Giỏ hàng</span>
            </Link>
            <div className="user" onClick={() => handleClickUser()}>
                <FontAwesomeIcon size="lg" icon={faUser} />
                <span>{(isAuthenticated && user) ? user.firstname + " " + user.lastname : "Đăng nhập"}</span>
            </div>
        </div>
    </div>
  )
}

export default Topbar