import React, { useEffect, useState, useCallback } from "react";
import "../assets/styles/pages/AdminProducts.scss";
import useAuth from "../hooks/UseAuth";
import { createProduct, deleteProduct, getProductsPaginate } from "../api/productApi";
import { toast } from "react-toastify";
import AddVariantModal from "../components/AddVariantModal";
import useLoading from "../hooks/UseLoading";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiSearch, FiFilter, FiTrash2, FiEdit2} from 'react-icons/fi';
import ProductFormModal from "../components/AdminProductFormModal";

const sizeProduct = 5;

const AdminProduct = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [productUpdate,setProductUpdate] = useState(null);
  const [products,setProducts] = useState([]);

  const navigate = useNavigate();
  const { token } = useAuth();
  const {setLoading} = useLoading();

  const fetchProducts = async () => {
    const data = await getProductsPaginate(currentPage,sizeProduct);
    setProducts(data.content);
    setTotalPages(data.totalPages);
  };

  useEffect(() => {
    setLoading(true)
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

  const handleAddProduct = async (data) => {
    setLoading(true);

    const createdProduct = await createProduct(data,token);

    if(createdProduct){
      setProducts((prev) => [...prev,createdProduct]);
      toast.success("Thêm sản phẩm thành công!")
    }else{
      toast.error("Có lỗi xảy ra!")
    }

    setLoading(false);
  }

  const handleUpdateProduct = async (data) => {
    setLoading(true);

    const updatedProduct = await createProduct(data,token);

    if(updatedProduct){
      fetchProducts();
      toast.success("Thêm sản phẩm thành công!")
    }else{
      toast.error("Có lỗi xảy ra!")
    }

    setLoading(false);
  }

  const handleOpenEditModal = (product) => {
    setIsModalOpen(true);
    setProductUpdate(product)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setProductUpdate(null);
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
        <button className="add-product-btn" onClick={() => {setProductUpdate(null);setIsModalOpen(true);}}>
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
                <th>Brand</th>
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
                    <td>{product.brandResponse}</td>
                    <td>{formatPrice(product.minPrice, product.maxPrice)}</td>
                    <td>{product.stock}</td>
                    <td>
                      <span className={`status-badge ${product.active ? 'active' : 'low-stock'}`}>
                        {product.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="actions">
                      <div style={{display: "flex", gap: "8px"}}>
                        <button className="edit-btn" onClick={() => handleOpenEditModal(product)}>
                          <FiEdit2 />
                        </button>
                        <button className="delete-btn" onClick={() => handleDeleteProduct(product.id)}>
                          <FiTrash2 />
                        </button>
                      </div>
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
          onClose={() => handleCloseModal()} 
          product={productUpdate}
          handleAddProduct={handleAddProduct}
          handleUpdateProduct={handleUpdateProduct}
        />
      )}
    </div>
  );
};

// Placeholder for ProductFormModal component


export default AdminProduct;