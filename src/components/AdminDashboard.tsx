import React, {useEffect, useState} from 'react';
import {useAuth} from '../contexts/AuthContext';
import {mealsAPI, ordersAPI} from '../services/api';
import {AlertCircle, LogOut, Plus, RefreshCw, ShoppingCart, Users} from 'lucide-react';
import AddMealModal from './AddMealModal';
import OwnerDashboard from "./OwnerPage.tsx";

interface Meal {
    _id: string;
    name: string;
    quantity: number;
    price: number;
    description?: string;
}

interface Order {
    _id: string;
    userId: string;
    studentId: string;
    mealId: string;
    mealName: string;
    price: number;
    status: 'pending' | 'confirmed' | 'completed';
    createdAt: string;
}

const AdminDashboard: React.FC = () => {
    const [meals, setMeals] = useState<Meal[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddMeal, setShowAddMeal] = useState(false);
    const [activeTab, setActiveTab] = useState<'meals' | 'orders' | 'dues' | 'suggestions'>('meals');

    const {user, logout} = useAuth();

    useEffect(() => {
        fetchMeals();
        fetchOrders();
    }, []);

    const fetchMeals = async () => {
        try {
            const response = await mealsAPI.getTodaysMeals();
            setMeals(response.data.data);
        } catch (error) {
            console.error('Error fetching meals:', error);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await ordersAPI.getAllOrders();
            setOrders(response.data.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMeal = async (mealData: Omit<Meal, '_id'>) => {
        try {
            await mealsAPI.createMeal(mealData);
            await fetchMeals();
            setShowAddMeal(false);
        } catch (error) {
            console.error('Error adding meal:', error);
        }
    };

    const handleRefresh = () => {
        setLoading(true);
        Promise.all([fetchMeals(), fetchOrders()]).finally(() => setLoading(false));
    };

    const totalRevenue = orders.reduce((sum, order) => sum + order.price, 0);
    const pendingDues = orders.filter(order => order.status === 'pending').reduce((sum, order) => sum + order.price, 0);

    const [showNewOrder, setShowNewOrder] = useState(false);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">
                                Canteen Admin Dashboard
                            </h1>
                            <p className="text-sm text-gray-600">Welcome, Chandrettan</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleRefresh}
                                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                            >
                                <RefreshCw className="h-5 w-5"/>
                            </button>
                            <button
                                onClick={logout}
                                className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                            >
                                <LogOut className="h-5 w-5"/>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Users className="h-6 w-6 text-blue-600"/>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Total Orders</p>
                                <p className="text-2xl font-semibold text-gray-900">{orders.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-full">
                                <ShoppingCart className="h-6 w-6 text-green-600"/>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Available Meals</p>
                                <p className="text-2xl font-semibold text-gray-900">{meals.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="flex items-center">
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <AlertCircle className="h-6 w-6 text-yellow-600"/>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Pending Dues</p>
                                <p className="text-2xl font-semibold text-gray-900">₹{pendingDues}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-full">
                                <ShoppingCart className="h-6 w-6 text-purple-600"/>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-semibold text-gray-900">₹{totalRevenue}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="border-b border-gray-200 mb-8">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('suggestions')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'suggestions'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Suggestions
                        </button>
                        <button
                            onClick={() => setActiveTab('meals')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'meals'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Manage Meals
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'orders'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            View Orders
                        </button>
                        <button
                            onClick={() => setActiveTab('dues')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'dues'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Payment Dues
                        </button>

                        <button
                            onClick={() => setActiveTab('no-dues')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'no-dues'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            No Dues
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}

                {activeTab === 'no-dues' && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4">Monthly Pending Dues Report</h2>
                        <p className="mb-4 text-gray-600">This report contains all students with pending dues for the current month. You can generate and send this report to the college.</p>

                        <table className="w-full mb-6">
                            <thead>
                            <tr className="border-b">
                                <th className="text-left py-3 px-4">Student ID</th>
                                <th className="text-left py-3 px-4">Meal</th>
                                <th className="text-left py-3 px-4">Price</th>
                                <th className="text-left py-3 px-4">Date</th>
                            </tr>
                            </thead>
                            <tbody>
                            {orders
                                .filter(order => order.status === 'pending' && new Date(order.createdAt).getMonth() === new Date().getMonth())
                                .map(order => (
                                    <tr key={order._id} className="border-b">
                                        <td className="py-3 px-4">{order.studentId}</td>
                                        <td className="py-3 px-4">{order.mealName}</td>
                                        <td className="py-3 px-4">₹{order.price}</td>
                                        <td className="py-3 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                id="agree"
                                className="mr-2"
                                required
                            />
                            <label htmlFor="agree" className="text-gray-700">
                                I fully agree to all legal blah blah stuff and this is verified by me with a report ID.
                                <span className="ml-2 text-blue-600 underline cursor-pointer" onClick={() => alert('Report ID: 2024-XYZ. You can cross-reference this report.')}>
            View Report
        </span>
                            </label>
                        </div>

                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            onClick={() => alert('Demo: Report generated and sent to college!')}
                        >
                            Generate & Download
                        </button>
                    </div>
                )}

                {activeTab === 'meals' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold">Today's Meals</h2>
                            <button
                                onClick={() => setShowAddMeal(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                            >
                                <Plus className="h-4 w-4"/>
                                <span>Add Meal</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {meals.map((meal) => (
                                <div key={meal._id} className="bg-white rounded-xl shadow-sm p-6">
                                    <h3 className="text-lg font-semibold mb-2">{meal.name}</h3>
                                    <p className="text-gray-600 mb-4">{meal.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-2xl font-bold text-blue-600">₹{meal.price}</span>
                                        <span className="text-sm text-gray-500">Qty: {meal.quantity}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="p-6">
                            <h2 className="text-lg font-semibold mb-4">All Orders</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4">Student ID</th>
                                        <th className="text-left py-3 px-4">Meal</th>
                                        <th className="text-left py-3 px-4">Price</th>
                                        <th className="text-left py-3 px-4">Status</th>
                                        <th className="text-left py-3 px-4">Date</th>
                                        <th className="text-left py-3 px-4">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id} className="border-b">
                                            <td className="py-3 px-4">{order.studentId}</td>
                                            <td className="py-3 px-4">{order.mealName}</td>
                                            <td className="py-3 px-4">₹{order.price}</td>
                                            <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                      'bg-green-100 text-green-800'
                          }`}>
                            {order.status}
                          </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td>

                                                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2">
                                                    Complete Order
                                                </button>
                                                <button  className="bg-red-500 text-white px-4 py-2 rounded-lg">
                                                    Report Issue
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'suggestions' && <OwnerDashboard/>}

                {activeTab === 'dues' && (
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="p-6">
                            <h2 className="text-lg font-semibold mb-4">Payment Dues Alert</h2>
                            <div className="space-y-4">
                                {orders.filter(order => order.status === 'pending').map((order) => (
                                    <div key={order._id} className="bg-red-50 rounded-lg p-4 space-y-4">
                                        <div
                                            className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium">{order.studentId}</p>
                                                <p className="text-sm text-gray-600">{order.mealName} - {new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-red-600 font-semibold">₹{order.price}</div>
                                                <button className="bg-red-200 py-2 px-4 rounded-lg text-red-600">Notify
                                                    For
                                                    Payment
                                                </button>
                                            </div>
                                        </div>
                                        <hr/>
                                        <div className="flex justify-between items-center">
                                            <h1>Total Pending:</h1>
                                            <div className="text-2xl">₹{order.price * 10}</div>
                                        </div>
                                        <hr/>
                                        <div className="flex items-center justify-end">
                                            {order.price > 80 &&
                                                <button
                                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                                    Inform College
                                                </button>
                                            }
                                        </div>
                                    </div>
                                ))}
                                {orders.filter(order => order.status === 'pending').length === 0 && (
                                    <p className="text-center text-gray-500 py-8">No pending dues</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Meal Modal */}
            {showAddMeal && (
                <AddMealModal
                    onClose={() => setShowAddMeal(false)}
                    onSubmit={handleAddMeal}
                />
            )}

            {showNewOrder && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4 text-blue-600">New Order Received!</h2>
                        <div className="mb-4">
                            <p><span className="font-semibold">Student ID:</span> {orders[orders.length - 1].studentId}</p>
                            <p><span className="font-semibold">Meal:</span> {orders[orders.length - 1].mealName}</p>
                            <p><span className="font-semibold">Price:</span> ₹{orders[orders.length - 1].price}</p>
                            <p><span className="font-semibold">Date:</span> {new Date(orders[orders.length - 1].createdAt).toLocaleString()}</p>
                        </div>
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full"
                            onClick={() => {setShowNewOrder(false)}}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;