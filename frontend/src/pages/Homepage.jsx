import React from 'react'
import AdsvertiseContainer from '../components/ads/AdsvertiseContainer'
import ListFeaturesProduct from '../components/listproducts/ListFeaturesProduct'
import ListCategories from '../components/categories/ListCategories'
import ListBrand from '../components/brands/ListBrand'
import ExploreMore from '../components/more/ExploreMore'
import Contact from '../components/more/Contact'

const Homepage = () => {
  return (
    <div className='homepage-container'>
      <div className='advertise-container'>
        <AdsvertiseContainer></AdsvertiseContainer>
      </div>

      <div className='feature-product-container'>
        <ListFeaturesProduct></ListFeaturesProduct>
      </div>

      <div className='list-categories-container'>
        <ListCategories></ListCategories>
      </div>

      <div className='list-brands-container'>
        <ListBrand></ListBrand>
      </div>

      <div className='explore-container'>
        <ExploreMore></ExploreMore>
      </div>

      <div className='contact-container'>
        <Contact></Contact>
      </div>
      
    </div>
  )
}

export default Homepage