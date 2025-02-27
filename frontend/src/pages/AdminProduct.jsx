import React, { useEffect, useState } from "react";
import "../assets/styles/pages/AdminProducts.scss";
import useAuth from "../hooks/UseAuth";
import { createProduct } from "../api/productApi";
import { toast } from "react-toastify";

const AdminProduct = () => {
  // State lưu danh sách attributes
  const [name,setName] = useState("");
  const [description,setDescription] = useState("");
  const [sortDescription,setSortDescription] = useState("");

  const [attributes, setAttributes] = useState([]);
  const [image, setImage] = useState();
  const [imagePreview, setImagePreview] = useState();

  const {token} = useAuth();

  // Hàm thêm attribute
  const addAttribute = () => {
    setAttributes([...attributes, {  name: ""}]);
  };

  useEffect(() => {
    if(image){
      const objectURL = URL.createObjectURL(image);
      setImagePreview(objectURL);
      return () => URL.revokeObjectURL(objectURL); // Giải phóng bộ nhớ
    }
  },[image,setImage])

  // Hàm cập nhật giá trị attribute
  const handleAttributeChange = (index,  value) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index].name = value;
    setAttributes(updatedAttributes);
  };

  // Hàm xóa attribute
  const removeAttribute = (id) => {
    setAttributes(attributes.filter(attr => attr.id !== id));
  };

  const handleSubmit = async  (e) => {
    e.preventDefault()
    console.log(attributes)
    const productData = {productName:name, shortDescription:sortDescription,description:description,attributeCreateRequests: attributes}
    const formData = new FormData();
    console.log(productData)
    formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
    formData.append('image', image); 

    
    const data = await createProduct(formData,token);
    toast.success("Tao moi product thanh cong");
  }

  return (
    <div className="product-management">
      <div className="title">Product Admin</div>
      <div>Add Product</div>
      <form onSubmit={(e) => handleSubmit(e)}>
      <label htmlFor="productName">Name</label>
        <input
          type="text"
          id="productName"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label htmlFor="sortDescription">Short Description</label>
        <input
          type="text"
          id="sortDescription"
          value={sortDescription}
          onChange={(e) => setSortDescription(e.target.value)}
        />

        <label htmlFor="image">Image</label>
        <input onChange={(e) => setImage(e.target.files[0])}  type="file" id="image" />

        <img src={imagePreview}/>

        {/* Danh sách các attribute */}
        <div className="attributes">
          <h3>Attributes</h3>
          {attributes.map((attr, index) => (
            <div key={attr.id} className="attribute-item">
              <input
                type="text"
                placeholder="Attribute Name"
                value={attr.name}
                onChange={(e) =>
                  handleAttributeChange(index, e.target.value)
                }
              />
             
              <button type="button" onClick={() => removeAttribute(attr.id)}>
                ❌
              </button>
            </div>
          ))}
        </div>

        {/* Nút thêm attribute */}
        <button type="button" onClick={addAttribute}>
          Add attribute
        </button>

        <button type="submit" >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AdminProduct;
