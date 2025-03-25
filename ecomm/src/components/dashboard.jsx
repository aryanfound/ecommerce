import React, { useState, useEffect } from "react";
import axios from "axios";
import { useServiceFile } from "./hooks/useServiceFile";
export default function UserDashboard() {
    const [user, setUser] = useState(null);
    const [carts, setCarts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {setService,setProductId}=useServiceFile();
    useEffect(() => {
        async function fetchDashboard() {
            try {
                const { data } = await axios.get("http://localhost:5000/dashboard", { withCredentials: true });
                setUser(data.user);
                setCarts(data.cart);
                setOrders(data.purchased);
            } catch (error) {
                setError("Failed to fetch data. Please try again later.");
                console.error("Error fetching dashboard:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-50">
                {/* Sidebar Skeleton with increased spacing */}
                <div className="w-1/4 bg-purple-700 p-6 pt-32">
                    <div className="w-24 h-24 rounded-full border-4 border-white bg-purple-600 mx-auto animate-pulse mt-16"></div>
                    <div className="h-8 bg-purple-600 rounded mt-12 w-3/4 mx-auto animate-pulse"></div>
                    <div className="h-4 bg-purple-600 rounded mt-6 w-1/2 mx-auto animate-pulse"></div>
                </div>
                
                {/* Main Content Skeleton */}
                <main className="flex-1 p-6 pt-16 space-y-6 overflow-y-auto">
                    {/* Profile Skeleton */}
                    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                        <div className="h-8 w-48 bg-purple-100 rounded mb-4"></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    </div>
                    
                    {/* Cart Skeleton */}
                    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                        <div className="h-8 w-48 bg-purple-100 rounded mb-4"></div>
                        <div className="space-y-4">
                            {[1, 2].map((item) => (
                                <div key={item} className="flex items-center p-4 bg-gray-100 rounded-lg">
                                    <div className="w-16 h-16 bg-gray-300 rounded"></div>
                                    <div className="ml-4 flex-1 space-y-2">
                                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                                    </div>
                                    <div className="h-6 bg-gray-300 rounded w-16"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Orders Skeleton */}
                    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                        <div className="h-8 w-48 bg-purple-100 rounded mb-4"></div>
                        <div className="space-y-4">
                            {[1, 2].map((item) => (
                                <div key={item} className="flex items-center p-4 bg-purple-50 rounded-lg">
                                    <div className="w-16 h-16 bg-gray-300 rounded"></div>
                                    <div className="ml-4 flex-1 space-y-2">
                                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                                    </div>
                                    <div className="h-6 bg-gray-300 rounded w-16"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar with avatar and email moved down */}
            <aside className="w-1/4 bg-purple-700 text-white p-6 shadow-lg pt-32">
                <div className="w-24 h-24 rounded-full border-4 border-white flex items-center justify-center mx-auto bg-purple-600 text-2xl font-bold mt-16">
                    {user?.username?.charAt(0).toUpperCase()}
                </div>
                <h2 className="mt-12 text-2xl font-semibold text-center">{user?.username || "Username"}</h2>
                <p className="mt-6 text-center">{user?.email || "Email"}</p>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 space-y-6 pt-16 overflow-y-auto">
                {/* Profile Information */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4 text-purple-700">Profile Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <p><strong>Name:</strong> {user?.username || "N/A"}</p>
                        <p><strong>Email:</strong> {user?.email || "N/A"}</p>
                    </div>
                </div>

                {/* Cart Details */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4 text-purple-700">Cart Details</h2>
                    {carts.length === 0 ? (
                        <p className="text-gray-500">No items in cart.</p>
                    ) : (
                        <div className="space-y-4">
                            {carts.map((cart) => (
                              <div 
                              key={cart.product_id} 
                              className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-md hover:cursor-pointer"
                              onClick={() => {
                                setProductId(cart.product_id);
                                setService('purchase');
                              }}
                            >
                              <img 
                                src={`http://localhost:5000/product_images/${cart.product_image}`} 
                                alt={cart.shoe_type} 
                                className="w-16 h-16 object-cover rounded" 
                              />
                              <div className="flex-1 ml-4">
                                <p className="font-semibold">{cart.shoe_type}</p>
                                <p className="text-sm text-gray-500">{cart.company}</p>
                              </div>
                              <span className="text-xl font-bold">{cart.price}</span>
                            </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Order History */}
                <div className="bg-white rounded-lg shadow-md p-6"
                
                >
                    <h2 className="text-2xl font-bold mb-4 text-purple-700">Order History</h2>
                    {orders.length === 0 ? (
                        <p className="text-gray-500">No orders placed yet.</p>
                    ) : (
                        <div className="space-y-4">
  {orders.map((order) => (
                                <div 
                                key={order.product_id} 
                                className="flex items-center justify-between p-4 bg-purple-100 rounded-lg shadow-md hover:cursor-pointer"
                                onClick={() => {
                                    console.log('clicking the product');
                                    setProductId(order.product_id);
                                    setService('purchase'); // Fixed typo from setSevrice to setService
                                }}
                                >
                                <img 
                                    src={`http://localhost:5000/product_images/${order.product_image}`} 
                                    className="w-16 h-16 object-cover rounded" 
                                />
                                <div className="flex-1 ml-4">
                                    <p className="font-semibold">{order.shoe_type}</p>
                                    <p className="text-sm text-gray-500">{order.company}</p>
                                </div>
                                <span className="text-xl font-bold">{order.price}</span>
                                </div>
                            ))}
                            </div>
                                                )}
                </div>
            </main>
        </div>
    );
}