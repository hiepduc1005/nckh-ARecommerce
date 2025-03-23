import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { createVariant } from "../../api/variantApi";
import CreatableSelect from 'react-select/creatable';
import ImageDropUploader from "../ImageDropUploader";

const VariantModal = ({ show, handleClose, product, variant, token, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    price: "",
    discountPrice: "",
    quantity: "",
    attributeValues: []
  });
  const isEditMode = Boolean(variant);
  const [image,setImage] = useState(null)

  useEffect(() => {
    if (product?.attributeResponses) {
      // Initialize attribute values
      const initialAttributes = product.attributeResponses.map((attr) => ({
        attributeId: attr.id,
        attributeValue: "",
      }));
      
      setFormData({
        price: "",
        discountPrice: "",
        quantity: "",
        attributeValues: initialAttributes
      });
    }
    
    // If variant is provided, we're in edit mode, so populate fields
    if (variant) {
      setFormData({
        price: variant.price.toString(),
        discountPrice: variant.discountPrice ? variant.discountPrice.toString() : "",
        quantity: variant.quantity.toString(),
        attributeValues: variant.attributeValueResponses.map(attr => ({
          attributeId: attr.attributeId,
          attributeValue: attr.attributeValue
        }))
      });

      console.log(variant)
    }
  }, [product, variant]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSelectValue = (attributeId, value) => {
    setFormData(prev => ({
      ...prev,
      attributeValues: prev.attributeValues.map((attr) =>
        attr.attributeId === attributeId ? { ...attr, attributeValue: value } : attr
      )
    }));
  };

  const handleSubmit = async () => {
    if (!formData.price || !formData.quantity) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    // Validate attribute values are all filled
    const missingAttributes = formData.attributeValues.some(attr => !attr.attributeValue);
    if (missingAttributes) {
      toast.error("Vui lòng nhập đầy đủ thuộc tính cho biến thể!");
      return;
    }

    // If editing, add variant ID
    if (isEditMode) {
      variantData.id = variant.id;
    }

    setIsLoading(true);
    try {
      if (isEditMode) {
        // await updateVariant(variantData, token);
        toast.success("Cập nhật biến thể thành công!");
      } else {
        const variantData = {
          productId: product.id,
          price: parseFloat(formData.price),
          discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : 0,
          quantity: parseInt(formData.quantity, 10),
          attributeValueCreateRequests: formData.attributeValues,
        };

        const formCreateVariant = new FormData();
        formCreateVariant.append('variant', new Blob([JSON.stringify(variantData)], { type: "application/json" }));
        formCreateVariant.append("image", image);

        const data = await createVariant(formCreateVariant, token);
        
        if(data){
          toast.success("Thêm biến thể thành công!");
          console.log(data);
        }
          
      }
      
      if (onSuccess) onSuccess();
      closeModal();
    } catch (error) {
      toast.error(isEditMode ? "Cập nhật biến thể thất bại!" : "Thêm biến thể thất bại!");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setFormData({
      price: "",
      discountPrice: "",
      quantity: "",
      attributeValues: []
    })

    setImage(null)
    handleClose()
  }

  const getAttributeName = (attributeId) => {
    const attribute = product?.attributeResponses?.find(attr => attr.id === attributeId);
    return attribute?.attributeName || "Thuộc tính";
  };

  const getAttributeOptions = (attributeId) => {
    const attribute = product?.attributeResponses?.find(attr => attr.id === attributeId);
    return attribute?.attributeValueResponses?.map((val) => ({
      label: val.attributeValue,
      value: val.attributeValue,
    })) || [];
  };

  return (
    <Modal show={show} centered size="xl" onHide={closeModal} backdrop="static">
      <Modal.Header closeButton className="bg-light">
        <Modal.Title>
          {isEditMode ? "Cập nhật biến thể" : "Thêm biến thể"} cho {product?.productName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Giá gốc (VNĐ)</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="Nhập giá gốc của sản phẩm"
                  className="shadow-sm"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Giá khuyến mãi (VNĐ)</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.discountPrice}
                  onChange={(e) => handleInputChange("discountPrice", e.target.value)}
                  placeholder="Nhập giá khuyến mãi (nếu có)"
                  className="shadow-sm"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">Số lượng</Form.Label>
            <Form.Control
              type="number"
              value={formData.quantity}
              onChange={(e) => handleInputChange("quantity", e.target.value)}
              placeholder="Nhập số lượng sản phẩm"
              className="shadow-sm"
            />
          </Form.Group>


          <div className="mt-4 mb-3">
            <h5 className="border-bottom pb-2">Thuộc tính sản phẩm</h5>
          </div>
          
          {formData.attributeValues.length > 0 ? (
            formData.attributeValues.map((attr) => (
              <Row key={attr.attributeId} className="mb-3">
                <Col md={4}>
                  <Form.Label className="fw-bold">{getAttributeName(attr.attributeId)}</Form.Label>
                </Col>
                <Col md={8}>
                  <CreatableSelect
                    value={attr.attributeValue ? { label: attr.attributeValue, value: attr.attributeValue } : null}
                    onChange={(selectedOption) => handleSelectValue(attr.attributeId, selectedOption.value)}
                    options={getAttributeOptions(attr.attributeId)}
                    placeholder={`Chọn hoặc nhập giá trị cho ${getAttributeName(attr.attributeId)}`}
                    isClearable
                    isSearchable
                    onCreateOption={(newValue) => handleSelectValue(attr.attributeId, newValue)}
                    className="shadow-sm"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: '#ced4da',
                        '&:hover': {
                          borderColor: '#86b7fe'
                        }
                      })
                    }}
                  />
                </Col>
              </Row>
            ))
          ) : (
            <p className="text-muted">Không có thuộc tính cho sản phẩm này</p>
          )}
        </Form>
        <Form.Group className="mb-4">
          <Form.Label className="fw-bold">Image</Form.Label>
          <ImageDropUploader 
            onUpload={setImage}
            imagePreview={variant?.imagePath}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer className="bg-light">
        <Button variant="secondary" onClick={closeModal} disabled={isLoading}>
          Đóng
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit} 
          disabled={isLoading}
          className="d-flex align-items-center"
        >
          {isLoading && <Spinner animation="border" size="sm" className="me-2" />}
          {isEditMode ? "Cập nhật biến thể" : "Thêm biến thể"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VariantModal;