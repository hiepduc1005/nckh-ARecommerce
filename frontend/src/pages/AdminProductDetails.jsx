import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import '../assets/styles/pages/AdminProductDetails.scss'
import { getProductBySlug } from '../api/productApi';
import useLoading from '../hooks/UseLoading';
import AddVariantModal from '../components/modal/AddVariantModal';
import useAuth from '../hooks/UseAuth';
import { deleteVariant, getVariantsByProductSlug } from '../api/variantApi';
import { toast } from 'react-toastify';

const AdminProductDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [activeTab, setActiveTab] = useState('details');
    const [showVariantModal,setShowVariantModal] = useState(false)
    const [variants,setVariants] = useState([])
    const [updateVariant,setUpdateVariant] = useState(null)
    const {loading, setLoading} = useLoading();
  
    const {token} = useAuth()

    const fetchVariantsByProductSlug = async () => {
      const data = await getVariantsByProductSlug(slug,token,1);
      if(data){
        setVariants(data.content);   
      }
    }
  
    useEffect(() => {
      const fetchProductData = async () => {
        setLoading(true);
        const data = await getProductBySlug(slug);
        
        if(data){
          setProduct(data);
        }
        setLoading(false);
      };
  
      fetchProductData();
      fetchVariantsByProductSlug()
    }, [slug]);
  
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
      navigate(`/admin/products/${slug}/variants/add`);
    };
  

  
    const handleDeleteVariant = async (variantId) => {
      setLoading(true)

      const data = await deleteVariant(token,variantId);
      if(data){
        fetchVariantsByProductSlug()
        toast.success("Delete variant success!")
      }else{
        toast.success("Delete variant failed!")
      }

      setLoading(false)

    };

    const handleAddAttribute = () => {
      navigate(`/admin/products/${slug}/attributes/add`);
    };

    const handleCloseModal = () => {
      fetchVariantsByProductSlug()
      setShowVariantModal(false)
      setUpdateVariant(null)
    }

    const handleOpenModal = () => {
      setShowVariantModal(true)
    }

    const handleOpenModalUpdate = (variant) => {
      setUpdateVariant(variant);
      setShowVariantModal(true)
    }
  
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
              Variants ({variants?.length || 0})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'attributes' ? 'active' : ''}`}
              onClick={() => setActiveTab('attributes')}
            >
              Attributes ({product.attributeResponses?.length || 0})
            </button>
          </div>
  
          <div className="product-detail-content">
            {activeTab === 'details' ? (
              <div className="product-details">
                <div className="product-detail-grid">
                  <div className="product-image-container">
                    <img 
                      src={`http://localhost:8080${product.imagePath}`} 
                      alt={product.productName} 
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
                        <span className="info-value">{product.productName}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Slug:</span>
                        <span className="info-value">{product.slug}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Brand:</span>
                        <span className="info-value">{product.brandResponse?.name || 'N/A'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Categories:</span>
                        <span className="info-value">
                          {product.categories?.length ? (
                            product.categories.map((cat) => (
                              <span key={cat.categoryName} className="badge badge-category">{cat.categoryName}</span>
                            ))
                          ) : (
                            <span className="badge badge-empty">N/A</span>
                          )}
                        </span>
                      </div>

                      <div className="info-row">
                        <span className="info-label">Tags:</span>
                        <span className="info-value">
                          {product.tags?.length ? (
                            product.tags.map((tag) => (
                              <span key={tag.tagName} className="badge badge-tag">{tag.tagName}</span>
                            ))
                          ) : (
                            <span className="badge badge-empty">N/A</span>
                          )}
                        </span>
                      </div>

                    </div>
  
                    <div className="info-group">
                      <h3>Inventory</h3>
                      <div className="info-row">
                        <span className="info-label">Price Range:</span>
                        <span className="info-value">
                          {product.minPrice ? `$${product.minPrice} - $${product.maxPrice}` : `$${product.maxPrice}`}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Stock:</span>
                        <span className="info-value">{product.stock}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Sold:</span>
                        <span className="info-value">{product.solded}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Rating:</span>
                        <span className="info-value">
                          {product.ratingValue?.toFixed(1) || 'N/A'} ({product.ratingResponses?.length || 0} reviews)
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Status:</span>
                        <span className={`status-badge ${product.active ? 'active' : 'inactive'}`}>
                          {product.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
  
                <div className="product-description">
                  <h3>Description</h3>
                  <p>{product.description}</p>
                  
                  <h3>Short Description</h3>
                  <p>{product.shortDescription}</p>
                </div>
  
                <div className="product-creation-info">
                  <div className="info-row">
                    <span className="info-label">Created At:</span>
                    <span className="info-value">{new Date(product.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Updated At:</span>
                    <span className="info-value">{new Date(product.updatedAt).toLocaleString()}</span>
                  </div>
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
            ) : activeTab === 'variants' ? (
              <div className="product-variants">
                <div className="variants-header">
                  <h3>Product Variants</h3>
                  <button className="add-variant-btn" onClick={handleOpenModal}>
                    <FiPlus />
                    <span>Add Variant</span>
                  </button>
                </div>
  
                <div className="variants-table-container">
                  {variants && variants.length > 0 ? (
                    <table className="variants-table">
                     <thead>
                       <tr>
                         <th>Variant ID</th>
                         <th>Image</th>
                         <th>Attributes</th>
                         <th>Price</th>
                         <th>Discount Price</th>
                         <th>Quantity</th>
                         <th>Actions</th>
                       </tr>
                     </thead>
                     <tbody>
                       {variants?.map(variant => {
                         return (
                           <tr key={variant.id}>
                             <td>{variant.id}</td>
                             <td>
                               {variant.imagePath && (
                                 <img 
                                   src={`http://localhost:8080${variant.imagePath}`} 
                                   alt="Variant" 
                                   style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                                 />
                               )}
                             </td>
                             <td>
                               {variant.attributeValueResponses && variant.attributeValueResponses.length > 0 ? (
                                 <div className="attribute-list">
                                   {variant.attributeValueResponses.map((attr, index) => (
                                     <div key={attr.id} className="attribute-item">
                                       <span className="attribute-name">{attr.attributeName}:</span> 
                                       <span className="attribute-value">{attr.attributeValue}</span>
                                       {index < variant.attributeValueResponses.length - 1 && ', '}
                                     </div>
                                   ))}
                                 </div>
                               ) : (
                                 <span className="no-attributes">No attributes</span>
                               )}
                             </td>
                             <td>${variant.price?.toFixed(2)}</td>
                             <td>${variant.discountPrice?.toFixed(2)}</td>
                             <td>{variant.quantity}</td>
                             <td className="actions">
                               <button 
                                 className="edit-btn" 
                                 title="Edit"
                                 onClick={() => handleOpenModalUpdate(variant)}
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
                  ) : (
                    <div className="no-data-message">
                      <p>No variants available for this product.</p>
                      <button className="add-btn" onClick={handleOpenModal}>
                        <FiPlus />
                        <span>Add First Variant</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="product-attributes">
                <div className="attributes-header">
                  <h3>Product Attributes</h3>
                  <button className="add-attribute-btn" onClick={handleAddAttribute}>
                    <FiPlus />
                    <span>Add Attribute</span>
                  </button>
                </div>
  
                <div className="attributes-table-container">
                  {product.attributeResponses && product.attributeResponses.length > 0 ? (
                    <table className="attributes-table">
                      <thead>
                        <tr>
                          <th>Attribute ID</th>
                          <th>Attribute Name</th>
                          <th>Created At</th>
                          <th>Updated At</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.attributeResponses.map(attribute => (
                          <tr key={attribute.id}>
                            <td>{attribute.id}</td>
                            <td>{attribute.attributeName}</td>
                            <td>{new Date(attribute.createdAt).toLocaleString()}</td>
                            <td>{new Date(attribute.updateAt).toLocaleString()}</td>
                            <td>
                              <span className={`status-badge ${attribute.active ? 'active' : 'inactive'}`}>
                                {attribute.active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="no-data-message">
                      <p>No attributes available for this product.</p>
                      <button className="add-btn" onClick={handleAddAttribute}>
                        <FiPlus />
                        <span>Add First Attribute</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {showVariantModal 
        
          ? 
          <AddVariantModal 
            show={showVariantModal}
            product={product}
            token={token}
            handleClose={handleCloseModal}
            variant={updateVariant}
          />

          : ""
        }
      </div>
    );
  };
  
export default AdminProductDetails;