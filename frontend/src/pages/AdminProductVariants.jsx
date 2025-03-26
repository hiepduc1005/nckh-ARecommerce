import React, { useEffect, useState } from 'react'
import { Button, Image, Pagination, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { deleteVariant, getVariantsByProductId } from '../api/variantApi';
import useAuth from '../hooks/UseAuth';
import useLoading from '../hooks/UseLoading';
import { toast } from 'react-toastify';

const AdminProductVariants = () => {

    const [variants,setVariants] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); 

    const {productId} = useParams();
    const {token} = useAuth();
    const {setLoading} = useLoading();


    useEffect(() => {
      if (!token) return;

      const fetchVariantsByProductId = async () => {
          try {
              const data = await getVariantsByProductId(productId ,currentPage);

              if(data){
                  setVariants(data.content)
                  setTotalPages(data.totalPages)
                  console.log(data)
              }
          } catch (error) {
              toast.error("Fetch variants failed!")
          }
      }

      setLoading(true);
      fetchVariantsByProductId();
      setLoading(false);
    },[productId, token , currentPage])

    const handleDeleteVariant = async (variantId) => {
      setLoading(true);
      const data = await deleteVariant(token,variantId);

      if(data){
        setVariants((pre) => {
          const newVariants = pre.filter(variant => variant.id !== variantId);
          return newVariants;
        })
        toast.success("Xóa variant thành công!");
        setLoading(false)
        return;
      }else {
        toast.error("Có lỗi xảy ra!");
        setLoading(false)
        return;
      }
    }


  return (
    <div style={{marginLeft: "270px"}}>
      <h2 className="my-3 text-center">{variants[0]?.productResponse?.productName} #{variants[0]?.productResponse?.id}</h2>
      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Product Name</th>
            <th>Price</th>
            <th>Discount Price</th>
            <th>Stock</th>
            {variants?.length > 0 && variants[0]?.attributeResponses.map((attribute,index) => {
              return <th key={attribute.id}>{attribute.attributeName}</th>
            })}
            <th>Create At</th>
            <th>Update At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {variants.length > 0 ? (
            variants.map((variant, index) => (
              <tr key={variant.id}>
                <td>{index + 1 + (currentPage - 1) * 5}</td>
                <td>
                  {variant.productResponse.productName}
                </td>
                <td>{variant.price}</td>
                <td>{variant.discountPrice}</td>
                <td>{variant.quantity}</td>

                {variant.attributeValueResponses?.map((attributeValue) => {
                  return <td key={attributeValue.id}>{attributeValue.attributeValue}</td>
                })}


                <td>{variant.createdAt}</td>
                <td>{variant.updateAt}</td>
                <td>
                  <Button variant="warning" size="sm" className="me-2">Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteVariant(variant.id)}>Delete</Button>
                 
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">This product have no variant</td>
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
    </div>
  )
}

export default AdminProductVariants