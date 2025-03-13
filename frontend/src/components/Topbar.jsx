import React, { useState } from 'react'
import "../assets/styles/components/Topbar.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell,  faCircleQuestion, faEnvelope, faPhone, faUser } from '@fortawesome/free-solid-svg-icons'
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";

import { Link, useNavigate } from 'react-router-dom'
import useLoading from '../hooks/UseLoading'

import AccountPopper from './AccountPopper'
const Topbar = ({user,isAuthenticated}) => {

    const [isOpen,setIsOpen] = useState(false);

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
            <div className="follow-us">
                <span>Follow us on</span>
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faFacebook} />
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faInstagram} />
                </a>
            </div>
        </div>
        <div className="right">
            <Link className="notification-icon">
                <FontAwesomeIcon size="lg" color='#207355' icon={faBell} />
                <span>Thông báo</span>
            </Link>
            <Link className="support-icon" to={'/'}>
                <FontAwesomeIcon size="lg" color='#207355' icon={faCircleQuestion} />
                <span>Hỗ trợ</span>
            </Link>
            <div 
                className="user" 
                onClick={() => handleClickUser()}
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
            >
                <FontAwesomeIcon size="lg" icon={faUser} />
                <span>{(isAuthenticated && user) ? user.firstname + " " + user.lastname : "Đăng nhập"}</span>
                {(isAuthenticated && user) ? <AccountPopper isOpen = {isOpen}/> : "" }
            </div>
        </div>
    </div>
  )
}

export default Topbar