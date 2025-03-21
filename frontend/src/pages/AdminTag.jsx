import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Check, X, Search, RefreshCw } from 'lucide-react';
import '../assets/styles/pages/AdminTag.scss';
import { createTag, deleteTag, getTagsPaginate, updateTag } from  '../api/tagApi';
import useAuth from '../hooks/UseAuth';
import useLoading from '../hooks/UseLoading';
import { formatToVNDate } from '../utils/ultils';

const AdminTag = () => {
  const [tags, setTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    tagName: '',
    active: true
  });
  const [error, setError] = useState('');
  const {token} = useAuth();
  const {setLoading,loading} = useLoading();

  const pageSize = 5;
  // Fetch tags from API
  useEffect(() => {
    
    fetchTags();
  }, [currentPage]);
  
  const fetchTags = async () => {
    setLoading(true)
    const data = await getTagsPaginate(currentPage,pageSize)
  
    if(data){
      setTotalPages(data.totalPages)
      setTags(data.content)
    }

    setLoading(false)
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!formData.tagName.trim()) {
      setError('Tag name cannot be empty');
      return;
    }

    const newTag = {
      tagName: formData.tagName,
      active: formData.active,
    };

    const data = await createTag(newTag,token);

    if(data){
      setTags((prev) => [...prev,data]);
      setFormData({
        tagName: '',
        active: true
      })
    }

    
  };

  const handleEditClick = (tag) => {
    setEditingTag(tag.id);
    setFormData({
      tagName: tag.tagName,
      active: tag.active
    });
  };

  const handleUpdateTag = async (e, id) => {
    setLoading(true)
    e.preventDefault();
    if (!formData.tagName.trim()) {
      setError('Tag name cannot be empty');
      return;
    }

    const dataEditTag = {
      id,
      tagName: formData.tagName,
      active: formData.active,
    }

    const data = await updateTag(dataEditTag,token);
    if(data){
      fetchTags();
      setEditingTag(null)
      setFormData({
        tagName: '',
        active: true
      })
    }

    setLoading(false)
  };

  const handleDeleteTag = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tag?')) {
      return;
    }
    setLoading(true);
    
    await deleteTag(id,token);

    const newTags = tags.filter(tag => tag.id !== id )
    setTags(newTags);
    setLoading(false)
  };

  const handleToggleActive = async (id) => {
    const updatedTags = tags.map(tag => 
      tag.id === id ? { 
        ...tag, 
        active: !tag.active,
      } : tag
    );
        
    setTags(updatedTags);      
  };

  const cancelEdit = () => {
    setEditingTag(null);
    setFormData({ tagName: '', active: true });
  };

  return (
    <div className="admin-tag">
      <div className="admin-tag__header">
        <h1>Tag Management</h1>
        <div className="admin-tag__actions">
          <div className="admin-tag__search">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search tags..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="admin-tag__add-btn"
          >
            <PlusCircle size={18} />
            Add New Tag
          </button>
          
          <button 
            onClick={fetchTags}
            className="admin-tag__refresh-btn"
            disabled={loading}
          >
            <RefreshCw size={18} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </div>
      
      {error && <div className="admin-tag__error">{error}</div>}
      
      {showAddForm && (
        <div className="admin-tag__form-container">
          <h2>Add New Tag</h2>
          <form onSubmit={handleAddTag} className="admin-tag__form">
            <div className="form-group">
              <label>Tag Name:</label>
              <input
                type="text"
                name="tagName"
                value={formData.tagName}
                onChange={handleFormChange}
                placeholder="Enter tag name"
              />
            </div>
            
            <div className="form-group form-checkbox">
              <label>
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleFormChange}
                />
                Active
              </label>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn-submit">
                Add Tag
              </button>
              <button 
                type="button" 
                className="btn-cancel"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="admin-tag__table-container">
        <table className="admin-tag__table">
          <thead>
            <tr>
              <th>Tag Name</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tags.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">
                  {loading ? 'Loading...' : 'No tags found'}
                </td>
              </tr>
            ) : (
              tags.map(tag => (
                <tr key={tag.id}>
                  <td>
                    {editingTag === tag.id ? (
                      <input
                        type="text"
                        name="tagName"
                        value={formData.tagName}
                        onChange={handleFormChange}
                        className="edit-input"
                      />
                    ) : (
                      tag.tagName
                    )}
                  </td>
                  <td>
                    {editingTag === tag.id ? (
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          name="active"
                          checked={formData.active}
                          onChange={handleFormChange}
                        />
                        <span className="slider"></span>
                      </label>
                    ) : (
                      <span 
                        className={`status-badge ${tag.active ? 'active' : 'inactive'}`}
                        onClick={() => handleToggleActive(tag.id)}
                      >
                        {tag.active ? 'Active' : 'Inactive'}
                      </span>
                    )}
                  </td>
                  <td>{formatToVNDate(tag.createdAt)}</td>
                  <td>{formatToVNDate(tag.updateAt)}</td>
                  <td>
                    {editingTag === tag.id ? (
                      <div className="action-buttons">
                        <button 
                          onClick={(e) => handleUpdateTag(e, tag.id)}
                          className="btn-action save"
                        >
                          <Check size={18} />
                        </button>
                        <button 
                          onClick={cancelEdit}
                          className="btn-action cancel"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleEditClick(tag)}
                          className="btn-action edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteTag(tag.id)}
                          className="btn-action delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
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
  );
};

export default AdminTag;