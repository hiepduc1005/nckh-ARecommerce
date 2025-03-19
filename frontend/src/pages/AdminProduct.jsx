import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Image, Pagination, Form, Row, Col, Container } from "react-bootstrap";
import "../assets/styles/pages/AdminProducts.scss";
import useAuth from "../hooks/UseAuth";
import { createProduct, deleteProduct, getProductsPaginate } from "../api/productApi";
import { toast } from "react-toastify";
import AddVariantModal from "../components/AddVariantModal";
import useLoading from "../hooks/UseLoading";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiSearch, FiFilter, FiTrash2, FiEdit2, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import ProductFormModal from "../components/AdminProductFormModal";

const AttributeInput = ({ attributes, onAdd, onRemove, onChange }) => (
  <div>
    <h5 className="mt-3">Attributes</h5>
    {attributes.map((attr, index) => (
      <Row key={index} className="mb-2 align-items-center">
        <Col md={10}>
          <Form.Control
            type="text"
            placeholder="Attribute Name"
            value={attr.name}
            onChange={(e) => onChange(index, e.target.value)}
          />
        </Col>
        <Col md={2}>
          <Button variant="danger" size="sm" onClick={() => onRemove(index)}>❌</Button>
        </Col>
      </Row>
    ))}
    <Button variant="primary" onClick={onAdd}>➕ Add Attribute</Button>
  </div>
);

const sizeProduct = 5;

const AdminProduct = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [expandedProducts, setExpandedProducts] = useState([]);

  const [productUpdate,setProductUpdate] = useState();
  const [products,setProducts] = useState([]);

  const navigate = useNavigate();
  const { token } = useAuth();
  const {setLoading} = useLoading();


  useEffect(() => {
    setLoading(true)
    const fetchProducts = async () => {
      const data = await getProductsPaginate(currentPage,sizeProduct);
      setProducts(data.content);
      setTotalPages(data.totalPages);
    };
    fetchProducts();
    setLoading(false)
  }, [currentPage]); 

  const handleDeleteProduct = async (productId) => {
    setLoading(true);
    const data = await deleteProduct(token,productId);

    if(data){
      setProducts((pre) => {
        const newProducts = pre.filter(product => product.id !== productId);
        return newProducts;
      })
      toast.success("Xóa sản phẩm thành công!");
      setLoading(false)
      return;
    }else {
      toast.error("Có lỗi xảy ra!");
      setLoading(false)
      return;
    }
  }

  const handleOpenEditModal = (product) => {
    setIsModalOpen(true);
    setProductUpdate(product)
  }
  
  // Handle select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(products.map(product => product.id));
    } else {
      setSelectedProducts([]);
    }
  };
  
  // Handle select individual product
  const handleSelectProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };
  
  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  // Toggle product expansion
  const toggleProductExpansion = (productId) => {
    if (expandedProducts.includes(productId)) {
      setExpandedProducts(expandedProducts.filter(id => id !== productId));
    } else {
      setExpandedProducts([...expandedProducts, productId]);
    }
  };

  // Format price display
  const formatPrice = (min, max) => {
    min = min ? min : 0;
    if (min === max) {
      return `$${min}`;
    }
    return `$${min} - $${max}`;
  };
  
  return (
    <div className="admin-product">
      <div className="page-header">
        <h1>Products Management</h1>
        <button className="add-product-btn" onClick={() => setIsModalOpen(true)}>
          <FiPlus />
          <span>Add Product</span>
        </button>
      </div>
      
      <div className="product-controls">
        <div className="search-container">
          <div className="search-input">
            <FiSearch />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="filter-options">
          <button className="filter-btn">
            <FiFilter />
            <span>Filters</span>
          </button>
          
          <select className="sort-select">
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
            <option value="price_asc">Price (Low-High)</option>
            <option value="price_desc">Price (High-Low)</option>
            <option value="stock_asc">Stock (Low-High)</option>
            <option value="stock_desc">Stock (High-Low)</option>
          </select>
        </div>
      </div>
      
      <div className="product-list-container">
        <div className="bulk-actions">
          <div className="select-all">
            <input 
              type="checkbox" 
              id="select-all" 
              checked={selectedProducts.length === products.length && products.length > 0}
              onChange={handleSelectAll}
            />
            <label htmlFor="select-all">Select All</label>
          </div>
          
          {selectedProducts.length > 0 && (
            <div className="bulk-action-buttons">
              <button className="delete-btn">
                <FiTrash2 />
                <span>Delete Selected</span>
              </button>
            </div>
          )}
        </div>
        
        <div className="product-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Attribute</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <React.Fragment key={product.id}>
                  <tr className=''>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                      />
                    </td>
                    
                    <td>
                      <div className="product-image">
                        <img 
                          src={"http://localhost:8080/uploads/22df2ba3-0757-4909-8611-e406706d7eb3_giaoducqp.jpg"} 
                          alt={product.name}
                          onError={(e) => {e.target.src = '/api/placeholder/60/60'; e.target.alt = 'No image'}}
                          width="60" 
                          height="60" 
                        />
                      </div>
                    </td>
                    <td>{product.productName}</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td>Attribute</td>
                    <td>{formatPrice(product.minPrice, product.maxPrice)}</td>
                    <td>{product.stock}</td>
                    <td>
                      <span className={`status-badge ${product.active ? 'active' : 'low-stock'}`}>
                        {product.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="actions">
                      <button className="edit-btn" onClick={() => handleOpenEditModal(product)}>
                        <FiEdit2 />
                      </button>
                      <button className="delete-btn" onClick={() => handleDeleteProduct(product.id)}>
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                 
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="pagination">
          <button 
            className="prev-btn" 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button 
                key={index} 
                className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          
          <button 
            className="next-btn" 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {isModalOpen && (
        <ProductFormModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          product={currentProduct}
        />
      )}
    </div>
  );
};

// Placeholder for ProductFormModal component


export default AdminProduct;