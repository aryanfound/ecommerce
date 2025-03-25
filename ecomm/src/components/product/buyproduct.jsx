import React, { useState, useEffect } from "react";
import { useServiceFile } from "../hooks/useServiceFile";
import axios from "axios";
import Lottie from "lottie-react";
import successAnimation from "../../assets/success.json";
import cartAnimation from "../../assets/addtocart.json";
import reviewSuccessAnimation from "../../assets/review.json";

const BuyProduct = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [isCartSuccess, setIsCartSuccess] = useState(false);
  const [isReviewSuccess, setIsReviewSuccess] = useState(false);
  const [warning, setWarning] = useState(null);
  const [loading, setLoading] = useState(true);
  const { ProductId } = useServiceFile();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productResponse, reviewsResponse] = await Promise.all([
          axios.get(`http://localhost:5000/product/productInfo?id=${ProductId}`, { 
            withCredentials: true 
          }),
          axios.get(`http://localhost:5000/getreview?product=${ProductId}`, { 
            withCredentials: true 
          })
        ]);

        setProducts([productResponse.data]);
        setSelectedProduct(productResponse.data);
        setReviews(reviewsResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setWarning("Failed to load product information. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (ProductId) fetchData();
  }, [ProductId]);

  useEffect(() => {
    if (warning) {
      const timer = setTimeout(() => setWarning(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [warning]);

  const handleBuyClick = async () => {
    try {
      if (!selectedSize) {
        setWarning("Please select a size before purchasing.");
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
      setWarning("Failed to place order. Please try again.");
    }
  };

  const addToCart = async () => {
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
      setWarning("Failed to add item to cart. Please try again.");
    }
  };

  const handleSubmitReview = async () => {
    try {
      if (!review.trim()) {
        setWarning("Please write a review before submitting.");
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/review?productid=${ProductId}`,
        { review },
        { withCredentials: true }
      );
      
      setIsReviewSuccess(true);
      setTimeout(() => setIsReviewSuccess(false), 3000);
      setReviews([...reviews, response.data]);
      setReview("");
      setRating(0);
    } catch (err) {
      console.log("Error submitting review:", err);
      setWarning("Failed to submit review. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
        {/* Theme-colored loading bar with container */}
        <div className="w-full max-w-md mx-auto mb-8">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200">
                  Loading
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-purple-600">
                  66%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
              <div 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-500 to-purple-800 animate-pulse"
                style={{ width: '66%' }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Product card skeleton loader */}
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          <div className="md:flex">
            <div className="md:w-1/2 bg-gray-300 h-64"></div>
            <div className="p-8 md:w-1/2 space-y-4">
              <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              <div className="h-6 bg-gray-300 rounded w-1/4"></div>
              
              <div className="pt-4">
                <div className="h-4 bg-gray-300 rounded mb-2 w-1/3"></div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-8 w-8 bg-gray-300 rounded"></div>
                  ))}
                </div>
              </div>
              
              <div className="pt-6 space-y-2">
                <div className="h-10 bg-gray-300 rounded"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <div className="text-center text-xl mt-10">No products available</div>;
  }

  if (!selectedProduct) {
    return <div className="text-center text-xl mt-10">Product not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Warning message display */}
      {warning && (
        <div className="fixed top-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg z-50">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{warning}</span>
          </div>
        </div>
      )}

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

      {isReviewSuccess && (
        <div className="flex flex-col items-center justify-center h-screen">
          <Lottie animationData={reviewSuccessAnimation} loop={false} className="w-72 h-72" />
          <h2 className="text-2xl font-semibold text-purple-600 mt-4">Review Submitted!</h2>
        </div>
      )}

      {!isPaymentSuccess && !isCartSuccess && !isReviewSuccess && (
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
                  className="w-full bg-black text-white py-3 rounded-lg text-lg font-semibold hover:bg-gray-900 transition"
                  onClick={handleBuyClick}
                >
                  BUY
                </button>
                <button
                  className="w-full border py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
                  onClick={addToCart}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Customer Reviews</h3>
            {reviews.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {reviews.map((r, index) => (
                  <li key={index} className="border p-3 rounded-lg bg-gray-100">
                    <div className="flex mb-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${
                            i < (r.rating || 0) ? "text-yellow-400" : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p>{r.review}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>

          <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Leave a Review</h3>
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
            <textarea
              className="border w-full p-2 mt-3 rounded-lg focus:ring-2 focus:ring-black transition"
              placeholder="Leave a review..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows="4"
            />
            <button
              className="w-full bg-black text-white py-3 mt-2 rounded-lg text-lg font-semibold hover:bg-gray-900 transition"
              onClick={handleSubmitReview}
            >
              Submit Review
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BuyProduct;