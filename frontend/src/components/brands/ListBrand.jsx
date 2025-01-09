import React from 'react'
import './ListBrand.css'
import samsumIcon from '../../assets/icon/brands/samsung-icon.png'
import bonChaIcon from '../../assets/icon/brands/boncha.png'
import deliIcon from '../../assets/icon/brands/delilogo.png'
import InlIcon from '../../assets/icon/brands/lnl-icon.png'
import nikeIcon from '../../assets/icon/brands/nike-icon.png'
import rangdongIcon from '../../assets/icon/brands/rang-dong.png'
import cuckooIcon from '../../assets/icon/brands/cuckoo.png'
import thienLongIcon from '../../assets/icon/brands/thien-logn.png'
import unileverIcon from '../../assets/icon/brands/samsung-icon.png'
import adidasIcon from '../../assets/icon/brands/adidas-logo.png'


const ListBrand = () => {
  return (
    <div className='list-brands'>
       <div className="content">THƯƠNG HIỆU NỔI BẬT TRONG THÁNG</div> 
       <div className="brands">
          <div className="brand-item">
            <img src={samsumIcon}></img>
          </div>
          <div className="brand-item">
            <img src={bonChaIcon}></img>
          </div>
          <div className="brand-item">
            <img src={deliIcon}></img>
          </div>
          <div className="brand-item">
            <img src={InlIcon}></img>
          </div>
          <div className="brand-item">
            <img src={nikeIcon}></img>
          </div>
          <div className="brand-item">
            <img src={rangdongIcon}></img>
          </div>
          <div className="brand-item">
            <img src={thienLongIcon}></img>
          </div>
          <div className="brand-item">
            <img src={cuckooIcon}></img>
          </div>
          <div className="brand-item">
            <img src={unileverIcon}></img>
          </div>
          <div className="brand-item">
            <img src={adidasIcon}></img>
          </div>
       </div>   
    </div>
  )
}

export default ListBrand