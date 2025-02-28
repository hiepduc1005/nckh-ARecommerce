import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { createVariant } from "../api/variantApi";
import ReactList from "react-list";
import CreatableSelect from 'react-select/creatable';

const AddVariantModal = ({ show, handleClose, product, token }) => {
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [attributeValues, setAttributeValues] = useState([]);

  useEffect(() => {
    if (product?.attributeResponses) {
      setAttributeValues(
        product.attributeResponses.map((attr) => ({
          attributeId: attr.id,
          attributeValue: "",
        }))
      );
    }

    
  }, [product]);

  const handleSelectValue = (attributeId, value) => {
    setAttributeValues((prev) =>
      prev.map((attr) =>
        attr.attributeId === attributeId ? { ...attr, attributeValue: value } : attr
      )
    );

  };

  const handleSubmit = async () => {
    if (!price || !quantity) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const variantData = {
      productId: product.id,
      price: parseFloat(price),
      discountPrice: discountPrice ? parseFloat(discountPrice) : 0,
      quantity: parseInt(quantity, 10),
      attributeValueCreateRequests: attributeValues,
    };

    try {
      await createVariant(variantData, token);
      toast.success("Thêm biến thể thành công!");
      handleClose();
    } catch (error) {
      toast.error("Thêm biến thể thất bại!");
    }
  };

  return (
    <Modal show={show} centered size="xl" onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Thêm biến thể cho {product.productName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Giá gốc</Form.Label>
            <Form.Control
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Nhập giá gốc của sản phẩm"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Giá khuyến mãi</Form.Label>
            <Form.Control
              type="number"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              placeholder="Nhập giá khuyến mãi (nếu có)"
            />  
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Số lượng</Form.Label>
            <Form.Control
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Nhập số lượng sản phẩm"
            />
          </Form.Group>

          <h5>Thuộc tính</h5>
          {attributeValues.length > 0 &&
            attributeValues.map((attr, index) => (
              <Row key={attr.attributeId} className="mb-2">
                <Col md={4}>
                  <Form.Label>{product.attributeResponses[index]?.attributeName}</Form.Label>
                </Col>
                <Col md={8}>
                  <CreatableSelect
                      value={attr.attributeValue ? { label: attr.attributeValue, value: attr.attributeValue } : null}
                      onChange={(selectedOption) => {handleSelectValue(attr.attributeId, selectedOption.value)}}
                      options={product?.attributeResponses[index]?.attributeValueResponses?.map((val) => ({
                        label: val.attributeValue,
                        value: val.attributeValue,
                      })) || []}
                      placeholder={`Chọn hoặc nhập ${product.attributeResponses[index]?.attributeName}`}
                      isClearable
                      isSearchable
                      onCreateOption={(newValue) => handleSelectValue(attr.attributeId, newValue)}
                    />
                </Col>
              </Row>
            ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Thêm biến thể
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddVariantModal;
