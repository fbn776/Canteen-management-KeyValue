import React, {useEffect, useState} from 'react';
import {useAuth} from '../contexts/AuthContext';
import {mealsAPI, ordersAPI} from '../services/api';
import {Clock, CreditCard, LogOut, RefreshCw, ShoppingCart} from 'lucide-react';
import MealCard from './MealCard';
import OrderHistory from './OrderHistory';
import TodaysSpecial from "./TodaysSpecial.tsx";
import WalletPage from "./WalletPage.tsx";

interface Meal {
    _id: string;
    name: string;
    quantity: number;
    price: number;
    description?: string;
}

interface Order {
    _id: string;
    mealId: string;
    mealName: string;
    price: number;
    status: 'pending' | 'confirmed' | 'completed';
    createdAt: string;
}

const StudentDashboard: React.FC = () => {
    const [meals, setMeals] = useState<Meal[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'meals' | 'orders' | 'payments' | 'today'>('meals');
    const [totalDue, setTotalDue] = useState(0);
    const [orderDialog, setOrderDialog] = useState(false);


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
            const response = await ordersAPI.getMyOrders();
            setOrders(response.data.data);

            // Calculate total due
            const due = response.data.data
                .filter((order: Order) => order.status === 'pending')
                .reduce((sum: number, order: Order) => sum + order.price, 0);
            setTotalDue(due);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOrderMeal = async (mealId: string) => {
        try {
            await ordersAPI.createOrder(mealId);
            await fetchOrders();
            await fetchMeals();
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    const handleRefresh = () => {
        setLoading(true);
        Promise.all([fetchMeals(), fetchOrders()]).finally(() => setLoading(false));
    };

    const [selectedCategory, setSelectedCategory] = useState('All');

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
                                Welcome, {user?.collegeId}
                            </h1>
                            <p className="text-sm text-gray-600">St. Xavier's Canteen</p>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Clock className="h-6 w-6 text-blue-600"/>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Available Meals</p>
                                <p className="text-2xl font-semibold text-gray-900">{meals.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-full">
                                <ShoppingCart className="h-6 w-6 text-green-600"/>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">My Orders</p>
                                <p className="text-2xl font-semibold text-gray-900">{orders.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="flex items-center">
                            <div className="p-3 bg-red-100 rounded-full">
                                <CreditCard className="h-6 w-6 text-red-600"/>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Amount Due</p>
                                <p className="text-2xl font-semibold text-gray-900">₹{totalDue}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="border-b border-gray-200 mb-8">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('today')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'payments'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Your Space
                        </button>
                        <button
                            onClick={() => setActiveTab('meals')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'meals'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Today's Meals
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'orders'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            My Orders
                        </button>
                        <button
                            onClick={() => setActiveTab('payments')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'payments'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Payment Status
                        </button>
                        <button
                            onClick={() => setActiveTab('wallet')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'wallet'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Wallet
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                {activeTab === 'meals' && (
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Today's Meals</h2>

                        {/* Category Badges */}
                        <div className="mb-4 flex gap-2">
                            {['All', 'Veg', 'Non-Veg', 'Snacks', 'Special'].map((cat) => (
                                <button
                                    key={cat}
                                    className={`px-3 py-1 rounded-full text-sm font-medium border ${
                                        selectedCategory === cat
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-700'
                                    }`}
                                    onClick={() => setSelectedCategory(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/*
    Dynamic banner based on time of day
*/}
                        {(() => {
                            const now = new Date();
                            const hour = now.getHours();
                            let bannerText = '';
                            let actionText = '';
                            let quote = '';
                            let bgColor = '';
                            if (hour < 12) {
                                bannerText = 'Good Morning!';
                                actionText = 'Book your breakfast now';
                                quote = '“Eat breakfast like a king.”';
                                bgColor = 'bg-yellow-100 border-yellow-400 text-yellow-900';
                            } else if (hour < 17) {
                                bannerText = 'Good Afternoon!';
                                actionText = 'Book your meal now';
                                quote = '“Lunch is the best time to refuel.”';
                                bgColor = 'bg-green-100 border-green-400 text-green-900';
                            } else {
                                bannerText = 'Good Evening!';
                                actionText = 'Book your tea now';
                                quote = '“A cup of tea makes everything better.”';
                                bgColor = 'bg-blue-100 border-blue-400 text-blue-900';
                            }
                            return (
                                <div
                                    className={`mb-6 p-4 rounded-xl border flex items-center justify-between shadow-sm ${bgColor}`}>
                                    <div>
                                        <div className="text-lg font-bold">{bannerText}</div>
                                        <div className="text-sm">{actionText}</div>
                                        <div className="text-xs italic mt-1">{quote}</div>
                                    </div>
                                    <div className="text-xs text-right">
                                        {now.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                                    </div>
                                </div>
                            );
                        })()}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {meals.map((meal) => (
                                <MealCard
                                    key={meal._id}
                                    meal={meal}
                                    onOrder={(e) => {
                                        setOrderDialog(true);

                                        handleOrderMeal(e)
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <OrderHistory orders={orders}/>
                )}

                {activeTab === 'wallet' && <WalletPage/>}

                {activeTab === 'today' && <TodaysSpecial/>}

                {activeTab === 'payments' && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold mb-4">Payment Status</h3>
                        <div className="space-y-4">
                            {orders.filter(order => order.status === 'pending').map((order) => (
                                <div key={order._id}>
                                    <div
                                        className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                                        <div>
                                            <p className="font-medium">{order.mealName}</p>
                                            <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-red-600 font-semibold">₹{order.price}</div>
                                    </div>
                                    <hr/>
                                    <div className="flex w-full justify-between items-center p-4 bg-yellow-50 rounded-lg mt-2">
                                        <p className="">Being late to the payment can incur a penalty</p>
                                        <h2>+₹{order.price / 10}</h2>
                                    </div>
                                </div>
                            ))}
                            {orders.filter(order => order.status === 'pending').length === 0 && (
                                <p className="text-center text-gray-500 py-8">No pending payments</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;