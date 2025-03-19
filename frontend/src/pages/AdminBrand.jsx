import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiPackage, FiSearch } from 'react-icons/fi';
import '../assets/styles/pages/AdminBrand.scss';
import AdminBrandModal from '../components/modal/AdminBrandModal.jsx';
import { toast } from 'react-toastify';
import useAuth from '../hooks/UseAuth';
import { formatToVNDate } from '../utils/ultils';
import { createBrand, deleteBrand, getBrandsPaginate, updateBrand } from '../api/brandApi.jsx';
import useLoading from '../hooks/UseLoading.jsx';

const AdminBrand = () => {
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    brandName: '',
    brandDescription: '',
    status: 'active',
    image: null,
    imagePreview: "",
  });

  const {token} = useAuth();
  const {setLoading} = useLoading();
  const pageSize = 5;

  useEffect(() => {
    const fetchBrands = async () => {
        setLoading(true);
        const data = await getBrandsPaginate(currentPage, pageSize);

        if(data){
            setTotalPages(data.totalPages);
            setBrands(data.content);
        }
        setLoading(false);
    };

    fetchBrands();
  }, [currentPage]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddBrandModal = () => {
    setEditingBrand(null);
    setShowModal(true);
  }
 
  const handleEditBrandModal = (brand) => {
    setEditingBrand(brand);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingBrand(null);
  }

  const handleCreateBrand = async () => {
    const formCreateBrand = {
        name: formData.brandName,
        description: formData.brandDescription
    }

    const imageCreateRequest = formData.image;

    if(imageCreateRequest){
        const formdata = new FormData();
        formdata.append('brand', new Blob([JSON.stringify(formCreateBrand)], { type: "application/json" }));
        formdata.append("image", imageCreateRequest);

        const createdBrand = await createBrand(formdata, token);

        if(createdBrand){
            setBrands(prev => [...prev, createdBrand]);
            toast.success("Tạo brand thành công!");
        }
    } else {
        toast.error("Thiếu hình ảnh!");
        return;
    }
  }

  const handleEditBrand = async () => {
    const formUpdateBrand = {
        id: editingBrand.id,
        name: formData.brandName,
        description: formData.brandDescription,
    }

    const imageUpdateRequest = formData.image;

    if(imageUpdateRequest){
        const formdata = new FormData();
        formdata.append('brand', new Blob([JSON.stringify(formUpdateBrand)], { type: "application/json" }));
        formdata.append("image", imageUpdateRequest);

        const updatedBrand = await updateBrand(formdata, token);

        if(updatedBrand){
            setBrands(prev =>
                prev.map(brand =>
                    brand.id === updatedBrand.id ? updatedBrand : brand
                )
            );
            toast.success("Cập nhập Brand thành công!");
        }
    } else {
        toast.error("Thiếu hình ảnh!");
        return;
    }
  }

  const handleDeleteBrand = async (brandId) => {
    if (window.confirm('Bạn có chắc muốn xóa Brand này?')) {
      await deleteBrand(token, brandId);
      const updatedBrands = brands.filter(brand => brand.id !== brandId);
      setBrands(updatedBrands);

      toast.success("Xóa Brand thành công!");
    }
  };

  // Count statistics
  const activeBrands = brands.filter(cat => cat.active).length;
  const totalProducts = brands.reduce((sum, cat) => sum + cat.totalProduct, 0);

  return (
    <div className="admin-brand">
      <div className="page-header">
        <h1>Product brands</h1>
        <button className="add-btn" onClick={handleAddBrandModal}>
          <FiPlus />
          <span>Add Brand</span>
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <div className="icon-wrapper">
              <FiPackage />
            </div>
          </div>
          <div className="stat-content">
            <h3>{brands.length}</h3>
            <p>Total brands</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon active">
            <div className="icon-wrapper">
              <FiPackage />
            </div>
          </div>
          <div className="stat-content">
            <h3>{activeBrands}</h3>
            <p>Active brands</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon products">
            <div className="icon-wrapper">
              <FiPackage />
            </div>
          </div>
          <div className="stat-content">
            <h3>{totalProducts}</h3>
            <p>Total Products</p>
          </div>
        </div>
      </div>

      <div className="brand-container">
        <div className="filter-bar">
          <div className="search-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search brands..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
        </div>

        <div className="brands-list">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Image</th>
                <th>Description</th>
                <th>Products</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map(brand => (
                <tr key={brand.id}>
                  <td className="brand-name">
                    <div className="name-with-icon">
                      <span className='truncate'>{brand.name}</span>
                    </div>
                  </td>
                  <td>
                      <div className="brand-image">
                        <img 
                          src={`http://localhost:8080${brand.imagePath}`}
                          alt={brand.name}
                          onError={(e) => {e.target.src = '/api/placeholder/60/60'; e.target.alt = 'No image'}}
                          width="60" 
                          height="60" 
                        />
                      </div>
                    </td>
                  <td className="brand-description truncate">{brand.description}</td>
                  <td className="brand-products truncate">{brand.totalProducts}</td>
                  
                  <td className="brand-date truncate">{formatToVNDate(brand.createdAt)}</td>
                  <td className="brand-actions">
                    <button 
                      className="edit-btn" 
                      title="Edit Brand"
                      onClick={() => handleEditBrandModal(brand)}
                    >
                      <FiEdit2 />
                    </button>
                    <button 
                      className="delete-btn" 
                      title="Delete Brand"
                      onClick={() => handleDeleteBrand(brand.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <button 
            className="prev-btn" 
            onClick={() => setCurrentPage(prev => prev - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button 
                key={index} 
                className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          
          <button 
            className="next-btn" 
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {showModal && <AdminBrandModal 
                        editingBrand={editingBrand} 
                        onClose={handleClose}
                        handleEditBrand={handleEditBrand}
                        handleCreateBrand={handleCreateBrand}
                        brands={brands}
                        setFormData={setFormData}
                        formData={formData}
                    />}
    </div>
  );
};

export default AdminBrand;