import React, { useState, useEffect } from "react";
import { useServiceFile } from "../hooks/useServiceFile";
import axios from "axios";
import Lottie from "lottie-react";
import successAnimation from "../../assets/success.json";
import cartAnimation from "../../assets/addtocart.json";

const AddtoCart = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [isCartSuccess, setIsCartSuccess] = useState(false);
  const { ProductId } = useServiceFile()














  useEffect(() => {
    const fetchProductInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/product/productInfo?id=${ProductId}`,
          { withCredentials: true }
        );
        setProducts([response.data]);
        setSelectedProduct(response.data);
      } catch (err) {
        console.error("Error fetching product info:", err);
      }
    };
    if (ProductId) fetchProductInfo();
  }, [ProductId]);

  if (!products || products.length === 0) {
    return <div className="text-center text-xl mt-10">No products available</div>;
  }
  if (!selectedProduct) {
    return <div className="text-center text-xl mt-10">Loading...</div>;
  }

  const handleBuyClick = async () => {
    try {
      if (!selectedSize) {
        alert("Please select a size before purchasing.");
        return;
      }

      const order = {
        product_id: selectedProduct.product_id,
        size: selectedSize,
        price: selectedProduct.price,
        order_status: "pending",
        order_date: new Date().toISOString(),
      };

      const response = await axios.post(
        "http://localhost:5000/product/post_order",
        order,
        { withCredentials: true }
      );

      console.log("Order placed successfully:", response.data);
      setIsPaymentSuccess(true);
      setTimeout(() => setIsPaymentSuccess(false), 3000);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  async function addToCart() {
    try {
      const response = await axios.post(
        "http://localhost:5000/product/AddtoCart",
        { productId: ProductId },
        { withCredentials: true }
      );

      console.log("Added to cart successfully:", response.data);
      setIsCartSuccess(true);
      setTimeout(() => setIsCartSuccess(false), 3000);
    } catch (err) {
      console.log("Error adding to cart:", err);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {isPaymentSuccess && (
        <div className="flex flex-col items-center justify-center h-screen">
          <Lottie animationData={successAnimation} loop={false} className="w-72 h-72" />
          <h2 className="text-2xl font-semibold text-green-600 mt-4">Payment Successful!</h2>
        </div>
      )}

      {isCartSuccess && (
        <div className="flex flex-col items-center justify-center h-screen">
          <Lottie animationData={cartAnimation} loop={false} className="w-72 h-72" />
          <h2 className="text-2xl font-semibold text-blue-600 mt-4">Added to Cart!</h2>
        </div>
      )}

      {!isPaymentSuccess && !isCartSuccess && (
        <>
          <div className="flex space-x-4 overflow-x-auto py-3 scrollbar-hide">
            {products.map((product) => (
              <img
                key={product.product_id}
                src={`http://localhost:5000/product_images/${product.product_image}`}
                alt={product.company}
                className={`w-24 h-24 rounded-lg cursor-pointer border-2 transition ${
                  selectedProduct.product_id === product.product_id
                    ? "border-black scale-105"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>

          <div className="flex flex-col md:flex-row bg-white p-6 rounded-lg shadow-lg mt-6 gap-6">
            <div className="md:w-1/2 flex justify-center">
              <img
                src={`http://localhost:5000/product_images/${selectedProduct.product_image}`}
                alt={selectedProduct.company}
                className="w-full max-w-md rounded-lg shadow-md object-contain"
              />
            </div>

            <div className="md:w-1/2 space-y-4">
              <h2 className="text-2xl font-bold">{selectedProduct.company}</h2>
              <p className="text-gray-500">Gender: {selectedProduct.gender}</p>
              <p className="text-gray-500">Type: {selectedProduct.shoe_type}</p>
              <p className="text-lg font-semibold text-gray-800">
                ${parseFloat(selectedProduct.price).toFixed(2)}
              </p>

              <p className="mt-3 font-medium">Select Size:</p>
              <div className="flex gap-3">
                {(selectedProduct.shoe_size || "").split(",").map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`p-2 border rounded-lg w-12 text-center transition ${
                      selectedSize === size ? "bg-black text-white" : "bg-gray-200"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                
                <button
                  className="w-full border py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
                  onClick={addToCart}
                >
                  Add to Cart
                </button>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold">Customer Reviews</h3>
                <div className="flex mt-2">
                  {[...Array(5)].map((_, index) => (
                    <span
                      key={index}
                      onClick={() => setRating(index + 1)}
                      className={`cursor-pointer text-2xl transition ${
                        index < rating ? "text-yellow-400 scale-110" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AddtoCart;
