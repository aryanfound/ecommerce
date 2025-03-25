import React, { useState, useEffect } from "react";
import { useServiceFile } from "../hooks/useServiceFile";
import BuyProduct from "./buyproduct";
import AddtoCart from "./addtocart";

export default function ProductSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setService, setProductId } = useServiceFile();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:5000/frontDisplay", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data) && Array.isArray(data[0])) {
          setProducts(data[0]);
        } else {
          throw new Error("Unexpected data format received");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const categorizeProducts = () => {
    let choice = [];
    let trending = [];
    let shopIcons = [];

    products.forEach((product, index) => {
      if (index % 3 === 0) choice.push(product);
      else if (index % 3 === 1) trending.push(product);
      else shopIcons.push(product);
    });

    return {
      "Find Your Choice": choice,
      "Trending Now": trending,
      "Shop by Icons": shopIcons,
    };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 max-w-[1400px] mx-auto">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-gray-100 p-4 rounded-lg">
                <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
                <div className="flex space-x-2">
                  <div className="h-10 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-10 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10">
        <div className="inline-block p-4 bg-red-100 rounded-lg">
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

  const sections = categorizeProducts();

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      {Object.entries(sections).map(([category, items]) => (
        <div key={category} className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-center">{category}</h2>
          <div className="overflow-x-auto scrollbar-custom">
            <div className="flex space-x-6 min-w-max">
              {items.length === 0 ? (
                <p className="text-gray-500">No products available</p>
              ) : (
                items.map((product) => (
                  <div
                    key={product.product_id}
                    className="w-[350px] bg-gray-100 shadow-lg p-4 rounded-lg text-center flex flex-col justify-between"
                  >
                    <div>
                      <img
                        src={`http://localhost:5000/product_images/${product.product_image}`}
                        alt={product.company}
                        className="w-full h-auto object-cover mb-2 mx-auto rounded-lg"
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
                          if (product?.product_id) {
                            setProductId(product.product_id);
                            setService("cart");
                          }
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
      ))}
    </div>
  );
}