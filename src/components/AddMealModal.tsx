import React, {useState} from 'react';
import {Plus, X} from 'lucide-react';

interface Meal {
    name: string;
    quantity: number;
    price: number;
    description?: string;
}

interface AddMealModalProps {
    onClose: () => void;
    onSubmit: (meal: Meal) => void;
}

const AddMealModal: React.FC<AddMealModalProps> = ({onClose, onSubmit}) => {
    const [meal, setMeal] = useState<Meal>({
        name: '',
        quantity: 0,
        price: 0,
        description: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(meal);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Add New Meal</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="h-6 w-6"/>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Meal Name
                        </label>
                        <input
                            type="text"
                            required
                            value={meal.name}
                            onChange={(e) => setMeal({...meal, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter meal name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={meal.description}
                            onChange={(e) => setMeal({...meal, description: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter meal description"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Quantity
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={meal.quantity}
                                onChange={(e) => setMeal({...meal, quantity: parseInt(e.target.value)})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price (₹)
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={meal.price}
                                onChange={(e) => setMeal({...meal, price: parseInt(e.target.value)})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="flex space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                        >
                            <Plus className="h-4 w-4"/>
                            <span>Add Meal</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMealModal;