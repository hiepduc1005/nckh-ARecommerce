import React, { useState } from 'react'
import "../assets/styles/components/SearchFilters.scss"
const SearchFilters = ({ onFilterChange }) => {
    const [filters, setFilters] = useState({
      gender: "",
      minPrice: "",
      maxPrice: "",
      color: "",
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFilters({ ...filters, [name]: value });
      onFilterChange({ ...filters, [name]: value });
    };
  
    return (
      <div className="search-filters">
        <h2>BỘ LỌC</h2>
        <div className="filter-group">
          <label>Giới tính:</label>
          <button onClick={() => handleChange({ target: { name: "gender", value: "Nam" } })}>Nam</button>
          <button onClick={() => handleChange({ target: { name: "gender", value: "Nữ" } })}>Nữ</button>
        </div>
  
        <div className="filter-group">
          <label>Mức giá:</label>
          <input type="number" name="minPrice" placeholder="Từ" onChange={handleChange} />
          <input type="number" name="maxPrice" placeholder="Đến" onChange={handleChange} />
        </div>
  
        <div className="filter-group">
          <label>Màu sắc:</label>
          <div className="color-options">
            {["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#000000"].map((color) => (
              <button key={color} className="color-btn" style={{ background: color }} onClick={() => handleChange({ target: { name: "color", value: color } })}></button>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default SearchFilters;