import { useState, useEffect, useRef } from "react";
import "../assets/styles/pages/SearchPage.scss"
import { useNavigate, useSearchParams } from "react-router-dom";

import CheckBoxList from "../components/CheckBoxList";
import Select from 'react-select';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShare, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import ReactStars from 'react-stars'
import { getProductsFilter } from "../api/productApi";
import useCart from '../hooks/UseCart';
const selectOptions = [
  { value: "latest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  {value: "rating-asc", label: "Đánh giá tăng dần"},
  {value: "rating-desc", label: "Đánh giá giảm dần"},
  { value: "price-asc", label: "Giá tăng dần" },
  { value: "price-desc", label: "Giá giảm dần" },
]

const categories = [
  { id: 1, name: "Kính râm" },
  { id: 2, name: "Kính thời trang" },
  { id: 3, name: "Kính cận" },
  { id: 4, name: "Kính viễn" },
  { id: 5, name: "Kính lão" },
  { id: 6, name: "Giày thể thao" },
  { id: 7, name: "Giày thời trang" },
  { id: 8, name: "Giày du lịch" }
];

const brands = [
  { id: 1, name: "Cyxus" },
  { id: 2, name: "JINS" },
  { id: 3, name: "Lenskart" },
  { id: 4, name: "Oakley" },
  { id: 5, name: "Persol" },
  { id: 6, name: "Gucci" },
  { id: 7, name: "Dior" },
  { id: 8, name: "Gentle Monster" }
];

const priceRanges = [
  { id: 1, name: "100.000đ trở xuống", min: 0, max: 100000 },
  { id: 2, name: "100.000đ - 500.000đ", min: 100000, max: 500000 },
  { id: 3, name: "500.000đ - 2.000.000đ", min: 500000, max: 2000000 },
  { id: 4, name: "2.000.000đ trở lên", min: 2000000, max: null }
];


const SearchPage = () => {
  const [selectedCategories,setSelectedCategories] = useState([]);
  const [selectedBrands,setSelectedBrands] = useState([])
  const [selectedPriceRange,setSelectedPriceRange] = useState([])
  const [maxPrice,setMaxPrice] = useState(1000000000)
  const [minPrice,setMinPrice] = useState(0)
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(0)
  
  const [filterProducts, setFilterProducts] = useState();

  const [searchParams, setSearchParams] = useSearchParams();
  const isFirstRender = useRef(true);

  const navigate = useNavigate();
  
  const handleCartOnclick = (productId) => {
    navigate(`${productId}`);
  }

  const fetchFilterProduct = async (newFilters) => { 
    console.log("filter " , newFilters)
    const data = await getProductsFilter(newFilters);

    if (data) {
      setTotalPage(data?.totalPages);
      setFilterProducts(data?.content);
    }
  };

  useEffect(() => {
  
    const categoriesString = searchParams.get("categories") || "";
    const brandsString = searchParams.get("brands") || "";
    const pricesString = searchParams.get("priceRange") || "";
    const search = searchParams.get("s") || "";

    if(categoriesString){
      setSelectedCategories(() => (
        categories.filter(item => categoriesString.split(",").includes(item.name))
      ))
    }

    if(brandsString){
      setSelectedBrands(() => (
        brands.filter(item => brandsString.split(",").includes(item.name))
      ))
    }

    if(pricesString){
      setSelectedPriceRange(() => (
        priceRanges.filter(item => pricesString.split(",").includes(item.name))
      ))
    }

    const newFilters = {
      size: 8,
      brands: brandsString,
      categories: categoriesString,
      maxPrice,
      minPrice,
      page: currentPage,
      keyword: search,
    };
    
    fetchFilterProduct(newFilters)
  
  }, [searchParams, maxPrice, minPrice, currentPage]);
  

  const updateUrlParams = (key, values, extractKey = "id") => {
    const params = new URLSearchParams(searchParams);
    if (values.length > 0) {
      // Chuyển danh sách object thành mảng giá trị (id hoặc name)
      params.set(key, values?.map(item => item[extractKey]).join(","));
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const handleCategoryChange = (newSelected) => {
    setSelectedCategories(newSelected);
    updateUrlParams("categories", newSelected, "name");
  };

  const handleBrandChange = (newSelected) => {
    setSelectedBrands(newSelected);
    updateUrlParams("brands", newSelected, "name");
  };

  const handlePriceChange = (newSelected) => {
    setSelectedPriceRange(newSelected);
    updateUrlParams("priceRange", newSelected, "name");

    const minPrice = Math.min(...newSelected.map(p => p.min));
    const maxPrice = Math.max(...newSelected.map(p => p.max).filter(p => p !== null));
  
    setMinPrice(minPrice);
    setMaxPrice(maxPrice);
  };


  return (
    <div className="product-search">
      <div className="search-background-image">
          <span>Tìm kiếm</span>
          {searchParams.get("s") 
            ? 
            <p>Kết quả cho từ khóa: {searchParams.get("s")}</p>
            :
             ""
          }
      </div>
      <div className="body">
        <div className="left">
          <CheckBoxList 
            title={"Thương hiệu"}
            listCheckBox={brands}
            setSelect={handleBrandChange}
            selected={selectedBrands}
          />
          <CheckBoxList 
            title={"Phân loại"}
            listCheckBox={categories}
            setSelect={handleCategoryChange}
            selected={selectedCategories}
          />
          <CheckBoxList 
            title={"Khoảng giá"}
            listCheckBox={priceRanges}
            setSelect={handlePriceChange}
            selected={selectedPriceRange}
          />
        </div>
        <div className="right">
          <div className="sort-container">
            <div className="title">Sắp xếp theo</div>
            <Select
              className="basic-single"
              classNamePrefix="select"
              defaultValue={selectOptions[0]}
              isDisabled={false}
              isLoading={false}
              isClearable={true}
              isRtl={false}
              isSearchable={true}
              name="sort"
              options={selectOptions}
            />
          </div>
          <div className="product-list">
            {filterProducts?.map(product => (
              <div className="item">
                <div className="" style={{display:"flex", flexDirection: "row" , gap: "12px" , }}>
                  <div className="img">
                    <img src={`http://localhost:8080${product.imagePath}`} alt="" />
                  </div>
                  <div className="product-info">
                    <div className="product-name" onClick={() => handleCartOnclick(product.id)}>{product.productName}</div>
                    <div className="prices">
                      <div className="discount">{product.price}</div>
                      <div className="original">{product.price}</div>
                    </div>
                    <div className="short-description">{product.shortDescription}</div>
                    <div className="product-actions">
                        <FontAwesomeIcon icon={faShoppingCart} onClick={() => handleCartOnclick(product.id)} className="icon cart" />
                        <FontAwesomeIcon icon={faHeart} onClick={() => handleCartOnclick(product.id)} className="icon heart" />
                        <FontAwesomeIcon icon={faShare} className="icon info" />
                      </div>
                  </div>
                </div>
                <div className="rating">
                  <ReactStars
                      count={5}
                      value={product.ratingValue}
                      size={18}
                      color2={"#f8b400"}
                      edit={false}
                      className={"react-stars"}
                      half={true}
                      style={{ display: 'flex', alignItems: 'center'}} 
                  />
                  <span>({product?.ratingResponses?.length})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
