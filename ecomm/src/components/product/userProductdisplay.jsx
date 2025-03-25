import React, { useState, useEffect } from "react";
import { useServiceFile } from "../hooks/useServiceFile";
import axios from "axios";

export default function UserProducts() {
  const { gender, price, company, size } = useServiceFile();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setService, setProductId, trending, setTrending } = useServiceFile();

  useEffect(() => {
    async function fetchUserProducts() {
      setLoading(true);
      setError(null);

      const queries = { gender, price, company, size, trending };

      try {
        const response = await axios.post(
          "http://localhost:5000/product/getProduct",
          queries,
          { withCredentials: true }
        );

        if (!response || !response.data) {
          throw new Error("Invalid response from server");
        }

        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching user products:", error);
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
        setTrending(false);
      }
    }

    fetchUserProducts();
  }, [gender, price, company, size]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-8 px-8 max-w-[1400px] mx-auto"> {/* Added pt-24 for navbar spacing */}
        {/* Product card skeleton loader positioned lower */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8"> {/* Added mt-8 */}
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-gray-100 p-4 rounded-lg animate-pulse">
              <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2 mx-auto"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2 mx-auto"></div>
              <div className="h-6 bg-gray-300 rounded w-1/4 mb-4 mx-auto"></div>
              <div className="flex space-x-2">
                <div className="h-10 bg-gray-300 rounded w-1/2"></div>
                <div className="h-10 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-8 px-8 max-w-[1400px] mx-auto"> {/* Added pt-24 for navbar spacing */}
        <div className="inline-block p-4 bg-red-100 rounded-lg mt-8"> {/* Added mt-8 */}
          <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-medium text-red-600 mb-1">Error Loading Products</h3>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pt-24 pb-8 px-8 max-w-[1400px] mx-auto"> {/* Added pt-24 for navbar spacing */}
      <h2 className="text-3xl font-bold mb-6 text-center">Your Products</h2>

      <div className="flex-grow overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center py-10">No products available</p>
          ) : (
            products.map((product) => (
              <div
                key={product.product_id}
                className="bg-gray-100 shadow-lg p-4 rounded-lg text-center flex flex-col justify-between"
              >
                <div>
                  <img
                    src={`http://localhost:5000/product_images/${product.product_image}`}
                    alt={product.company}
                    className="w-full h-60 object-cover mb-2 mx-auto rounded-lg"
                  />
                  <h3 className="text-xl font-bold">
                    {product.company} - {product.shoe_type}
                  </h3>
                  <p className="text-gray-600 text-lg">${product.price}</p>
                </div>
                <div className="flex space-x-2 mt-3">
                  <button
                    className="bg-black text-white px-4 py-2 rounded-md w-1/2 hover:bg-gray-800"
                    onClick={() => {
                      if (product?.product_id) {
                        setProductId(product.product_id);
                        setService("purchase");
                      }
                    }}
                  >
                    Buy
                  </button>
                  <button
                    className="bg-black text-white px-4 py-2 rounded-md w-1/2 hover:bg-gray-800"
                    onClick={() => {
                      setProductId(product.product_id);
                      setService("cart");
                    }}
                  >
                    Cart
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}