import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import '../assets/styles/pages/AdminProductDetails.scss'
const AdminProductDetails = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [activeTab, setActiveTab] = useState('details');
    const [loading, setLoading] = useState(true);
  
    // In a real application, you'd fetch product data from an API
    useEffect(() => {
      // Simulating API fetch
      const fetchProductData = () => {
        // Mock data - in a real app, you would fetch from an API
        const products = [
          { 
            id: "1", 
            name: 'iPhone 15 Pro', 
            category: 'Electronics', 
            brand: 'Apple', 
            price: '999 - 1299', 
            stock: 120, 
            status: 'Active',
            description: 'The latest iPhone with A17 Pro chip, titanium design, and Action button.',
            image: '/images/iphone15pro.jpg', 
            variants: [
              { id: "101", name: 'iPhone 15 Pro 128GB Black', price: 999, stock: 40, sku: 'IP15P-128-BLK', attributes: [{name: 'Storage', value: '128GB'}, {name: 'Color', value: 'Black'}] },
              { id: "102", name: 'iPhone 15 Pro 256GB Black', price: 1099, stock: 35, sku: 'IP15P-256-BLK', attributes: [{name: 'Storage', value: '256GB'}, {name: 'Color', value: 'Black'}] },
              { id: "103", name: 'iPhone 15 Pro 512GB Silver', price: 1299, stock: 25, sku: 'IP15P-512-SLV', attributes: [{name: 'Storage', value: '512GB'}, {name: 'Color', value: 'Silver'}] },
              { id: "104", name: 'iPhone 15 Pro 128GB Silver', price: 999, stock: 20, sku: 'IP15P-128-SLV', attributes: [{name: 'Storage', value: '128GB'}, {name: 'Color', value: 'Silver'}] },
            ]
          },
          { 
            id: "2", 
            name: 'Samsung Galaxy S23', 
            category: 'Electronics', 
            brand: 'Samsung', 
            price: '899 - 1099', 
            stock: 85, 
            status: 'Active',
            description: 'Samsung Galaxy S23 with Snapdragon 8 Gen 2 processor and advanced camera system.',
            image: '/images/galaxys23.jpg', 
            variants: [
              { id: "201", name: 'Galaxy S23 128GB Black', price: 899, stock: 30, sku: 'SGS23-128-BLK', attributes: [{name: 'Storage', value: '128GB'}, {name: 'Color', value: 'Black'}] },
              { id: "202", name: 'Galaxy S23 256GB Black', price: 999, stock: 25, sku: 'SGS23-256-BLK', attributes: [{name: 'Storage', value: '256GB'}, {name: 'Color', value: 'Black'}] },
              { id: "203", name: 'Galaxy S23 256GB White', price: 999, stock: 15, sku: 'SGS23-256-WHT', attributes: [{name: 'Storage', value: '256GB'}, {name: 'Color', value: 'White'}] },
              { id: "204", name: 'Galaxy S23 512GB White', price: 1099, stock: 15, sku: 'SGS23-512-WHT', attributes: [{name: 'Storage', value: '512GB'}, {name: 'Color', value: 'White'}] }
            ]
          },
          { 
            id: "3", 
            name: 'MacBook Pro 16', 
            category: 'Computers', 
            brand: 'Apple', 
            price: '2499 - 3499', 
            stock: 45, 
            status: 'Active',
            description: 'Powerful MacBook Pro 16 with M2 chip, Liquid Retina XDR display, and up to 32GB unified memory.',
            image: '/images/macbookpro16.jpg',
            variants: [
              { id: "301", name: 'MacBook Pro 16 M2 16GB 512GB', price: 2499, stock: 20, sku: 'MBP16-M2-16-512', attributes: [{name: 'Processor', value: 'M2'}, {name: 'RAM', value: '16GB'}, {name: 'Storage', value: '512GB'}] },
              { id: "302", name: 'MacBook Pro 16 M2 32GB 1TB', price: 3299, stock: 15, sku: 'MBP16-M2-32-1TB', attributes: [{name: 'Processor', value: 'M2'}, {name: 'RAM', value: '32GB'}, {name: 'Storage', value: '1TB'}] },
              { id: "303", name: 'MacBook Pro 16 M2 Pro 32GB 1TB', price: 3499, stock: 10, sku: 'MBP16-M2P-32-1TB', attributes: [{name: 'Processor', value: 'M2 Pro'}, {name: 'RAM', value: '32GB'}, {name: 'Storage', value: '1TB'}] }
            ] 
          },
        ];
  
        const foundProduct = products.find(p => p.id === productId);
        setProduct(foundProduct);
        setLoading(false);
      };
  
      fetchProductData();
    }, [productId]);
  
    if (loading) {
      return <div className="loading">Loading product details...</div>;
    }
  
    if (!product) {
      return (
        <div className="product-not-found">
          <h2>Product not found</h2>
          <button onClick={() => navigate('/admin/products')}>Back to Products</button>
        </div>
      );
    }
  
    const handleAddVariant = () => {
      // Navigate to add variant page or show modal
      navigate(`/admin/products/${productId}/variants/add`);
    };
  
    const handleEditVariant = (variantId) => {
      navigate(`/admin/products/${productId}/variants/${variantId}/edit`);
    };
  
    const handleDeleteVariant = (variantId) => {
      // In a real app, you would call an API to delete the variant
      console.log(`Delete variant ${variantId}`);
      // Then refresh product data
    };
  
    return (
      <div className="product-detail-page">
        <div className="page-header">
          <div className="back-button-container">
            <button className="back-button" onClick={() => navigate('/admin/products')}>
              <FiArrowLeft />
              <span>Back to Products</span>
            </button>
          </div>
          <h1>Product Details</h1>
        </div>
  
        <div className="product-detail-container">
          <div className="product-detail-tabs">
            <button 
              className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Product Details
            </button>
            <button 
              className={`tab-btn ${activeTab === 'variants' ? 'active' : ''}`}
              onClick={() => setActiveTab('variants')}
            >
              Variants ({product.variants?.length || 0})
            </button>
          </div>
  
          <div className="product-detail-content">
            {activeTab === 'details' ? (
              <div className="product-details">
                <div className="product-detail-grid">
                  <div className="product-image-container">
                    <img 
                      src={product.image || "/api/placeholder/300/300"} 
                      alt={product.name} 
                      className="product-image"
                    />
                  </div>
                  
                  <div className="product-info">
                    <div className="info-group">
                      <h3>Basic Information</h3>
                      <div className="info-row">
                        <span className="info-label">ID:</span>
                        <span className="info-value">{product.id}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Name:</span>
                        <span className="info-value">{product.name}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Category:</span>
                        <span className="info-value">{product.category}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Brand:</span>
                        <span className="info-value">{product.brand}</span>
                      </div>
                    </div>
  
                    <div className="info-group">
                      <h3>Inventory</h3>
                      <div className="info-row">
                        <span className="info-label">Price Range:</span>
                        <span className="info-value">${product.price}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Total Stock:</span>
                        <span className="info-value">{product.stock}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Status:</span>
                        <span className={`status-badge ${product.status === 'Active' ? 'active' : 'low-stock'}`}>
                          {product.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
  
                <div className="product-description">
                  <h3>Description</h3>
                  <p>{product.description}</p>
                </div>
  
                <div className="product-actions">
                  <button className="edit-btn">
                    <FiEdit2 />
                    <span>Edit Product</span>
                  </button>
                  <button className="delete-btn">
                    <FiTrash2 />
                    <span>Delete Product</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="product-variants">
                <div className="variants-header">
                  <h3>Product Variants</h3>
                  <button className="add-variant-btn" onClick={handleAddVariant}>
                    <FiPlus />
                    <span>Add Variant</span>
                  </button>
                </div>
  
                <div className="variants-table-container">
                  <table className="variants-table">
                    <thead>
                      <tr>
                        <th>Variant Name</th>
                        <th>SKU</th>
                        <th>Attributes</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.variants.map(variant => {
                        const status = variant.stock > 10 ? 'Active' : 'Low Stock';
                        
                        return (
                          <tr key={variant.id}>
                            <td>{variant.name}</td>
                            <td>{variant.sku}</td>
                            <td>
                              {variant.attributes.map((attr, index) => (
                                <span key={index} className="attribute-badge">
                                  {attr.name}: {attr.value}
                                </span>
                              ))}
                            </td>
                            <td>${variant.price}</td>
                            <td>{variant.stock}</td>
                            <td>
                              <span className={`status-badge ${status === 'Active' ? 'active' : 'low-stock'}`}>
                                {status}
                              </span>
                            </td>
                            <td className="actions">
                              <button 
                                className="edit-btn" 
                                title="Edit"
                                onClick={() => handleEditVariant(variant.id)}
                              >
                                <FiEdit2 />
                              </button>
                              <button 
                                className="delete-btn" 
                                title="Delete"
                                onClick={() => handleDeleteVariant(variant.id)}
                              >
                                <FiTrash2 />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
export default AdminProductDetails