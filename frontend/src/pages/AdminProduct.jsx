import React, { useState } from 'react'
import "../assets/styles/pages/AdminProducts.scss"
const AdminProduct = () => {
    const [products, setProducts] = useState([
        { id: 1, name: "Laptop Dell", price: 1200 },
        { id: 2, name: "iPhone 13", price: 999 },
        { id: 3, name: "Samsung Galaxy S21", price: 899 },
      ]);
      const [search, setSearch] = useState("");
      const [modalOpen, setModalOpen] = useState(false);
      const [currentProduct, setCurrentProduct] = useState({ id: null, name: "", price: "" });
    
      const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
          setProducts(products.filter((p) => p.id !== id));
        }
      };
    
      const handleSave = () => {
        if (currentProduct.id) {
          setProducts(products.map((p) => (p.id === currentProduct.id ? currentProduct : p)));
        } else {
          setProducts([...products, { ...currentProduct, id: Date.now() }]);
        }
        setModalOpen(false);
      };
    
      return (
        <div className="product-management">
          <h2>Quản lý sản phẩm</h2>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={() => { setCurrentProduct({ id: null, name: "", price: "" }); setModalOpen(true); }}>Thêm sản phẩm</button>
          <table>
            <thead>
              <tr>
                <th>Tên sản phẩm</th>
                <th>Giá</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>
                    <button onClick={() => { setCurrentProduct(product); setModalOpen(true); }}>Sửa</button>
                    <button onClick={() => handleDelete(product.id)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
    
          {modalOpen && (
            <div className="modal">
              <div className="modal-content">
                <h3>{currentProduct.id ? "Chỉnh sửa" : "Thêm"} sản phẩm</h3>
                <input
                  type="text"
                  placeholder="Tên sản phẩm"
                  value={currentProduct.name}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Giá"
                  value={currentProduct.price}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                />
                <button onClick={handleSave}>Lưu</button>
                <button onClick={() => setModalOpen(false)}>Hủy</button>
              </div>
            </div>
          )}
        </div>
      );
}

export default AdminProduct