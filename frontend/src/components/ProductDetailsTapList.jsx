import React, { useEffect, useState } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import ProductRating from './ProductRating';


const ProductDetailsTapList = ({product}) => {



  return (
    <div style={{marginTop: "20px"}}> <Tabs>
    <TabList>
      <Tab>Description</Tab>
      <Tab>Reviews</Tab>
     
    </TabList>

    <TabPanel>
      <p>
        {product?.description}
      </p>
      
    </TabPanel>
    <TabPanel>
      <ProductRating />
    </TabPanel>
   
  </Tabs></div>
  )
}

export default ProductDetailsTapList