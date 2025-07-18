import React from 'react';
import {CheckCircle, Clock, XCircle} from 'lucide-react';

interface Order {
    _id: string;
    mealId: string;
    mealName: string;
    price: number;
    status: 'pending' | 'confirmed' | 'completed';
    createdAt: string;
}

interface OrderHistoryProps {
    orders: Order[];
}

const OrderHistory: React.FC<OrderHistoryProps> = ({orders}) => {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="h-5 w-5 text-yellow-500"/>;
            case 'confirmed':
                return <CheckCircle className="h-5 w-5 text-blue-500"/>;
            case 'completed':
                return <CheckCircle className="h-5 w-5 text-green-500"/>;
            default:
                return <XCircle className="h-5 w-5 text-red-500"/>;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-red-100 text-red-800';
        }
    };

    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <p className="text-gray-500">No orders found. Start by ordering a meal!</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Order History</h2>
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order._id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-center">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                        {getStatusIcon(order.status)}
                                        <h3 className="font-medium">{order.mealName}</h3>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Ordered on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                                        {new Date(order.createdAt).toLocaleTimeString()}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {Math.random() > 0.5 ? <span className="text-blue-500">Seen</span> : 'Not yet seen'}
                                    </p>
                                </div>
                                <div className="flex items-center justify-center px-6 h-full">
                                    <button className="bg-blue-500 text-white rounded-lg px-5 py-2">Pay Now</button>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-semibold mb-2">₹{order.price}</div>
                                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;