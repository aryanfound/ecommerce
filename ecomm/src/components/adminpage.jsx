import React, { useState } from "react";
import { Upload } from "lucide-react";

const AdminProductForm = () => {
  const [product, setProduct] = useState({
    productImage: null,
    gender: "",
    company: "",
    shoeType: "",
    shoeSize: "",
    quantity: "",
    price: "",
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct({ ...product, productImage: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
   
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-4">Add Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <label className="block text-center cursor-pointer">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-4 hover:border-black">
              <Upload className="w-10 h-10 text-gray-500 mb-2" />
              <span className="text-gray-500">Upload Product Image</span>
              <input
                type="file"
                accept="image/*"
                name="productImage"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </label>

          {/* Image Preview */}
          {imagePreview && (
            <div className="flex justify-center mt-2">
              <img
                src={imagePreview}
                alt="Product Preview"
                className="w-32 h-32 object-cover rounded-lg shadow-md"
              />
            </div>
          )}

          {/* Gender */}
          <select
            name="gender"
            value={product.gender}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Select Gender</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
            <option value="Unisex">Unisex</option>
          </select>

          {/* Company */}
          <select
            name="company"
            value={product.company}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Select Company</option>
            <option value="Nike">Nike</option>
            <option value="Adidas">Adidas</option>
            <option value="Puma">Puma</option>
          </select>

          {/* Shoe Type */}
          <select
            name="shoeType"
            value={product.shoeType}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Select Shoe Type</option>
            <option value="Running">Running</option>
            <option value="Sneakers">Sneakers</option>
            <option value="Sports">Sports</option>
          </select>

          {/* Shoe Size */}
          <select
            name="shoeSize"
            value={product.shoeSize}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Select Shoe Size</option>
            <option value="8">8</option>
            <option value="8,9">9</option>
            <option value="8,9,10">10</option>
            <option value="8,9,10,11">11</option>
          </select>

          {/* Quantity */}
          <input
            type="number"
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            min="0"
          />

          {/* Price */}
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            min="0"
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition duration-300"
            onClick={async ()=>{
                

                 

            
            const formData = new FormData();
            formData.append("productImage", product.productImage);
            formData.append("gender", product.gender);
            formData.append("company", product.company);
            formData.append("shoeType", product.shoeType);
            formData.append("shoeSize", product.shoeSize);
            formData.append("quantity", product.quantity);
            formData.append("price", product.price);
            console.log('form data is '+formData);
            try {
              const response = await fetch("http://localhost:5000/upload", {
                method: "POST",
                body: formData,
                credentials:"include"
              });
          
              const data = await response.json();
              if (response.ok) {
                alert(data.message);
              } else {
                alert("Error: " + data.error);
              }
            } catch (error) {
              console.error("Upload failed:", error);
            }




















            }}
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminProductForm;
