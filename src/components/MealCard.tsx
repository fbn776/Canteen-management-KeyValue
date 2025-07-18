import React, {useState} from 'react';
import {Clock, ShoppingCart} from 'lucide-react';

interface Meal {
    _id: string;
    name: string;
    quantity: number;
    price: number;
    description?: string;
}

interface MealCardProps {
    meal: Meal;
    onOrder: (mealId: string) => void;
}

const MealCard: React.FC<MealCardProps> = ({meal, onOrder}) => {
    const [isOrdering, setIsOrdering] = useState(false);

    const handleOrder = async () => {
        setIsOrdering(true);
        try {
            await onOrder(meal._id);
        } finally {
            setIsOrdering(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{meal.name}</h3>
                <span className="text-2xl font-bold text-blue-600">₹{meal.price}</span>
            </div>

            {meal.description && (
                <p className="text-gray-600 mb-4">{meal.description}</p>
            )}

            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4"/>
                    <span>Available: {meal.quantity}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                    meal.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
          {meal.quantity > 0 ? 'In Stock' : 'Out of Stock'}
        </span>
            </div>

            <button
                onClick={handleOrder}
                disabled={meal.quantity === 0 || isOrdering}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                    meal.quantity === 0 || isOrdering
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
                <ShoppingCart className="h-4 w-4"/>
                <span>
          {isOrdering ? 'Ordering...' :
              meal.quantity === 0 ? 'Out of Stock' : 'Order Now'}
        </span>
            </button>
        </div>
    );
};

export default MealCard;