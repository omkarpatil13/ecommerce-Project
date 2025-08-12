import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refreshData } = useContext(AppContext);

  const [product, setProduct] = useState({});
  const [image, setImage] = useState(null);
  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    releaseDate: "",
    productAvailable: false,
    stockQuantity: "",
  });

  // Convert blob to File
  const convertUrlToFile = async (blobData, fileName) => {
    return new File([blobData], fileName, { type: blobData.type });
  };

  // Fetch existing product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8091/api/product/${id}`);
        setProduct(response.data);
        setUpdateProduct(response.data);

        // Fetch and set image
        const responseImage = await axios.get(
          `http://localhost:8091/api/product/${id}/image`,
          { responseType: "blob" }
        );
        const imageFile = await convertUrlToFile(responseImage.data, response.data.imageName);
        setImage(imageFile);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdateProduct({
      ...updateProduct,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle image file change
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Submit updated product
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = new FormData();
    if (image) {
      updatedFormData.append("imageFile", image);
    }
    updatedFormData.append(
      "product",
      new Blob([JSON.stringify(updateProduct)], { type: "application/json" })
    );

    try {
      await axios.put(`http://localhost:8091/api/product/${id}`, updatedFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Product updated successfully!");
      refreshData(); // ✅ Refresh product list
      navigate("/"); // ✅ Go back to homepage
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    }
  };

  return (
    <div className="update-product-container">
      <div className="center-container" style={{ marginTop: "7rem" }}>
        <h1>Update Product</h1>
        <form className="row g-3 pt-1" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label className="form-label"><h6>Name</h6></label>
            <input
              type="text"
              className="form-control"
              value={updateProduct.name || ""}
              onChange={handleChange}
              name="name"
              placeholder={product.name}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label"><h6>Brand</h6></label>
            <input
              type="text"
              name="brand"
              className="form-control"
              value={updateProduct.brand || ""}
              onChange={handleChange}
              placeholder={product.brand}
            />
          </div>
          <div className="col-12">
            <label className="form-label"><h6>Description</h6></label>
            <input
              type="text"
              className="form-control"
              name="description"
              value={updateProduct.description || ""}
              onChange={handleChange}
              placeholder={product.description}
            />
          </div>
          <div className="col-5">
            <label className="form-label"><h6>Price</h6></label>
            <input
              type="number"
              className="form-control"
              value={updateProduct.price || ""}
              onChange={handleChange}
              name="price"
              placeholder={product.price}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label"><h6>Category</h6></label>
            <select
              className="form-select"
              value={updateProduct.category || ""}
              onChange={handleChange}
              name="category"
            >
              <option value="">Select category</option>
              <option value="Laptop">Laptop</option>
              <option value="Headphone">Headphone</option>
              <option value="Mobile">Mobile</option>
              <option value="Electronics">Electronics</option>
              <option value="Toys">Toys</option>
              <option value="Fashion">Fashion</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label"><h6>Stock Quantity</h6></label>
            <input
              type="number"
              className="form-control"
              value={updateProduct.stockQuantity || ""}
              onChange={handleChange}
              name="stockQuantity"
              placeholder={product.stockQuantity}
            />
          </div>
          <div className="col-md-8">
            <label className="form-label"><h6>Image</h6></label>
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt={product.imageName}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  padding: "5px",
                }}
              />
            )}
            <input
              className="form-control"
              type="file"
              onChange={handleImageChange}
            />
          </div>
          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="productAvailable"
                checked={updateProduct.productAvailable || false}
                onChange={handleChange}
              />
              <label className="form-check-label">Product Available</label>
            </div>
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
