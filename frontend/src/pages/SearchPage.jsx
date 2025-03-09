import { useState, useEffect } from "react";
import "../assets/styles/pages/SearchPage.scss"
import CheckBoxList from "../components/CheckBoxList";
import Select from 'react-select';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShare, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import ReactStars from 'react-stars'

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


  useEffect(() => {
    console.log(selectedBrands)
    console.log(selectedPriceRange)

    console.log(selectedCategories)
  },[selectedCategories,selectedBrands,selectedPriceRange])

  return (
    <div className="product-search">
      <div className="search-background-image">
          <span>Tìm kiếm</span>
          <p>Kết quả cho từ khóa: ...</p>
      </div>
      <div className="body">
        <div className="left">
          <CheckBoxList 
            title={"Thương hiệu"}
            listCheckBox={brands}
            setSelect={setSelectedBrands}
            selected={selectedBrands}
          />
          <CheckBoxList 
            title={"Phân loại"}
            listCheckBox={categories}
            setSelect={setSelectedCategories}
            selected={selectedCategories}
          />
          <CheckBoxList 
            title={"Khoảng giá"}
            listCheckBox={priceRanges}
            setSelect={setSelectedPriceRange}
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
            <div className="item">
              <div className="img">
                <img src="https://sneakernews.com/wp-content/uploads/2023/01/nike-air-max-90-black-university-blue-FJ4218-001-5.jpg" alt="" />
              </div>
              <div className="info">
                <div className="product-name">TÊN SẢN PHẨM</div>
                <div className="prices">
                  <div className="discount">XXX.XXX đ</div>
                  <div className="original">XXX.XXX đ</div>
                </div>
                <div className="short-description">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ad veniam, id vel est officia rem? Numquam consectetur aspernatur earum atque accusantium debitis ex error? Facilis repellat iusto eveniet harum similique.</div>
                <div className="product-actions">
                    <FontAwesomeIcon icon={faShoppingCart} className="icon cart" />
                    <FontAwesomeIcon icon={faHeart} className="icon heart" />
                    <FontAwesomeIcon icon={faShare} className="icon info" />
                  </div>
              </div>
              <div className="rating">
                <ReactStars
                    count={5}
                    value={4}
                    size={18}
                    color2={"#f8b400"}
                    edit={false}
                    half={true}
                    style={{ display: 'flex', alignItems: 'center'}} 
                />
                <span>(5)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
