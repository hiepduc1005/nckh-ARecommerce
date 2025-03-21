import React, { useState, useEffect } from 'react';
import '../assets/styles/pages/AttributeAdmin.scss';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import useLoading from '../hooks/UseLoading';
import { createAttribute, deleteAttribute, getAttributesPaginate, updateAttribute } from '../api/attributeApi';
import { formatToVNDate } from '../utils/ultils';
import useAuth from '../hooks/UseAuth';

const AttributeAdmin = () => {
  // State for attributes list
  const [attributes, setAttributes] = useState([]);
  // State for the form
  const [formData, setFormData] = useState({
    attributeName: '',
    active: true
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages,setTotalPages] = useState(1);
  const [sortOption, setSortOption] = useState('Name (A-Z)');
  
  const {setLoading,loading} = useLoading();
  const {token} = useAuth();

  const pageSize = 5;

  // Fetch attributes from the API
  useEffect(() => {
    fetchAttributes();
  }, [currentPage]);

  const fetchAttributes = async () => {
    setLoading(true);
    try {
      const data = await getAttributesPaginate(currentPage,pageSize);
      if(data){
        setAttributes(data.content);
        setTotalPages(data.totalPages)
      }
    } catch (err) {
      console.error('Error fetching attributes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const openModal = (attribute = null) => {
    if (attribute) {
      // Editing existing attribute
      setFormData({
        attributeName: attribute.attributeName,
        active: attribute.active
      });
      setEditingId(attribute.id);
    } else {
      // Creating new attribute
      setFormData({
        attributeName: '',
        active: true
      });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      attributeName: '',
      active: true
    });
    setEditingId(null);
  };

  const handleAddAttribute = async () => {
    const data = {
      name: formData.attributeName,
      active: formData.active
    }
    const createdAttribute = await createAttribute(data,token);
    if(createdAttribute){
      setAttributes((prev) => [...prev,createAttribute]);
      closeModal()
      
    }
  }

  const handleUpdateAttribute = async (attributeId) => {
    const data = {
      id: attributeId,
      name: formData.attributeName,
      active: formData.active
    }
    const updatedAttribute = await updateAttribute(data,token)
    if(updatedAttribute){
      fetchAttributes()
      closeModal()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.attributeName.trim()) {
        toast.warning("Attribute name is required");
        return
      }

      if(editingId){
        handleUpdateAttribute(editingId)
      }else handleAddAttribute();

     
    } catch (err) {
      console.error('Error saving attribute:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAttribute = async (id) => {
    if (!window.confirm('Are you sure you want to delete this attribute?')) {
      return;
    }

    setLoading(true);
    try {
      await deleteAttribute(id,token);
      setAttributes(attributes.filter(attr => attr.id !== id));
    } catch (err) {
      console.error('Error deleting attribute:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle checkbox selection
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    
    if (checked) {
      setSelectedAttributes(attributes.map(attr => attr.id));
    } else {
      setSelectedAttributes([]);
    }
  };

  const handleSelectAttribute = (e, id) => {
    const checked = e.target.checked;
    
    if (checked) {
      setSelectedAttributes([...selectedAttributes, id]);
    } else {
      setSelectedAttributes(selectedAttributes.filter(attrId => attrId !== id));
    }
  };

  // Handle pagination
  const goToPage = (page) => {
    setCurrentPage(page);
  };


  return (
    <div className="attribute-admin">
      <div className="attribute-admin__header">
        <h1 className="attribute-admin__title">Attributes Management</h1>
        <button 
          className="attribute-admin__add-btn"
          onClick={() => openModal()}
        >
          <span className="attribute-admin__add-icon">+</span> Add Attribute
        </button>
      </div>

      <div className="attribute-admin__controls">
        <div className="attribute-admin__search">
          <input 
            type="text"
            placeholder="Search attributes..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="attribute-admin__search-input"
          />
        </div>

        <div className="attribute-admin__filters">
          <button className="attribute-admin__filter-btn">
            <span className="attribute-admin__filter-icon">⚡</span> Filters
          </button>
          <select 
            className="attribute-admin__sort-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option>Name (A-Z)</option>
            <option>Name (Z-A)</option>
            <option>Created (Newest)</option>
            <option>Created (Oldest)</option>
          </select>
        </div>
      </div>

      <div className="attribute-admin__table-container">
        <table className="attribute-admin__table">
          <thead>
            <tr>
              <th className="attribute-admin__select-all">
                <input 
                  type="checkbox" 
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
                <span className="attribute-admin__select-text">Select All</span>
              </th>
              <th>ID</th>
              <th>Attribute Name</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attributes.length === 0 ? (
              <tr>
                <td colSpan="7" className="attribute-admin__no-data">
                  No attributes found.
                </td>
              </tr>
            ) : (
              attributes.map(attribute => (
                <tr key={attribute.id}>
                  <td>
                    <input 
                      type="checkbox"
                      checked={selectedAttributes.includes(attribute.id)}
                      onChange={(e) => handleSelectAttribute(e, attribute.id)}
                    />
                  </td>
                  <td>{attribute.id}</td>
                  <td>{attribute.attributeName}</td>
                  <td>
                    <span className={`attribute-admin__status ${attribute.active ? 'active' : 'inactive'}`}>
                      {attribute.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{formatToVNDate(attribute?.createdAt)}</td>
                  <td>{formatToVNDate(attribute?.updateAt)}</td>
                  <td className="attribute-admin__actions-cell">
                    <button 
                      className="attribute-admin__edit-btn"
                      onClick={() => openModal(attribute)}
                    >
                      <span className="attribute-admin__edit-icon">✏️</span>
                    </button>
                    <button 
                      className="attribute-admin__delete-btn"
                      onClick={() => handleDeleteAttribute(attribute.id)}
                    >
                      <span className="attribute-admin__delete-icon">🗑️</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="attribute-admin__pagination">
        <button 
          className="attribute-admin__pagination-btn"
          disabled={currentPage === 1}
          onClick={() => goToPage(currentPage - 1)}
        >
          Previous
        </button>
        
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`attribute-admin__pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => goToPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        
        <button 
          className="attribute-admin__pagination-btn"
          disabled={currentPage === totalPages}
          onClick={() => goToPage(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {/* Modal form */}
      {showModal && (
        <div className="attribute-admin__modal">
          <div className="attribute-admin__modal-content">
            <h2 className="attribute-admin__modal-title">
              {editingId ? 'Edit Attribute' : 'Add New Attribute'}
            </h2>
            
            <form onSubmit={handleSubmit} className="attribute-admin__form">
              <div className="attribute-admin__form-group">
                <label htmlFor="attributeName">Attribute Name</label>
                <input
                  type="text"
                  id="attributeName"
                  name="attributeName"
                  value={formData.attributeName}
                  onChange={handleInputChange}
                  className="attribute-admin__input"
                  required
                />
              </div>
              
              <div className="attribute-admin__form-group attribute-admin__checkbox-group">
                <label htmlFor="active">
                  <input
                    type="checkbox"
                    id="active"
                    name="active"
                    checked={formData.active}
                    onChange={handleInputChange}
                    className="attribute-admin__checkbox"
                  />
                  Active
                </label>
              </div>
              
              <div className="attribute-admin__form-actions">
                <button
                  type="button"
                  onClick={closeModal}
                  className="attribute-admin__cancel-btn"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="attribute-admin__submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttributeAdmin;