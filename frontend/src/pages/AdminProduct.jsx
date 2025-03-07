import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Image, Pagination, Form, Row, Col, Container } from "react-bootstrap";
import "../assets/styles/pages/AdminProducts.scss";
import useAuth from "../hooks/UseAuth";
import { createProduct, deleteProduct, getProductsPaginate } from "../api/productApi";
import { toast } from "react-toastify";
import AddVariantModal from "../components/AddVariantModal";
import useLoading from "../hooks/UseLoading";
import { useNavigate } from "react-router-dom";

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
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [products, setProducts] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showVariantModal, setShowVariantModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigate = useNavigate();
  const { token } = useAuth();
  const {setLoading} = useLoading();

  useEffect(() => {
    if (image) {
      const objectURL = URL.createObjectURL(image);
      setImagePreview(objectURL);
      return () => URL.revokeObjectURL(objectURL);
    }
  }, [image]);

  const handleAttributeChange = useCallback((index, value) => {
    setAttributes((prev) => prev.map((attr, i) => (i === index ? { name: value } : attr)));
  }, []);

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    if (!name || !shortDescription || !description) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const productData = {
      productName: name,
      shortDescription,
      description,
      attributeCreateRequests: attributes,
    };

    const formData = new FormData();
    formData.append("product", new Blob([JSON.stringify(productData)], { type: "application/json" }));
    if (image) formData.append("image", image);

    try {
      await createProduct(formData, token);
      toast.success("Tạo mới product thành công!");
      setLoading(false)
    } catch (error) {
      toast.error("Tạo mới product thất bại!");
      setLoading(false)
    }
  };

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

  const handleViewDetails = (product) => {
    setLoading(true);
    navigate(`${product.id}`);
    setLoading(false);
  }

  return (
    <Container className="product-management mt-4">
      <h2 className="text-center mb-4">Product Management</h2>

      <Form onSubmit={handleSubmit} className="mb-4 p-3 border rounded">
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Short Description</Form.Label>
              <Form.Control type="text" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Image</Form.Label>
          <Form.Control type="file" onChange={(e) => setImage(e.target.files[0])} />
          {imagePreview && <Image src={imagePreview} alt="Preview" fluid className="mt-2" />}
        </Form.Group>

        <AttributeInput attributes={attributes} onAdd={() => setAttributes([...attributes, { name: "" }])} onRemove={(index) => setAttributes(attributes.filter((_, i) => i !== index))} onChange={handleAttributeChange} />

        <Button type="submit" className="mt-3 w-100">Submit</Button>
      </Form>

      <h2 className="my-3 text-center">Product List</h2>
      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Name</th>
            <th>Short Description</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product, index) => (
              <tr key={product.id}>
                <td>{index + 1 + (currentPage - 1) * 5}</td>
                <td>
                  <Image src={`http://localhost:8080${product.imagePath}`} alt={product.productName} width={50} height={50} rounded />
                </td>
                <td>{product.productName}</td>
                <td>{product.shortDescription}</td>
                <td>{product.description}</td>
                <td>{product.active ? "Active" : "Inactive"}</td>
                <td>
                  <Button variant="info" size="sm" className="me-2" onClick={() => handleViewDetails(product)}>View Variants</Button>
                  <Button variant="warning" size="sm" className="me-2">Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteProduct(product.id)}>Delete</Button>
                  <Button
                    variant="success"
                    size="sm"
                    className="ms-2"
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowVariantModal(true);
                    }}
                  >
                    Add Variant
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No products available</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Pagination className="justify-content-center mt-3">
        {[...Array(totalPages).keys()].map((num) => (
          <Pagination.Item key={num + 1} active={num + 1 === currentPage} onClick={() => { setLoading(true); setCurrentPage(num + 1); setLoading(false);}}>
            {num + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      {selectedProduct && (
        <AddVariantModal
          show={showVariantModal}
          handleClose={() => setShowVariantModal(false)}
          product={selectedProduct}
          token={token}
        />
      )}
    </Container>
  );
};

export default AdminProduct;
