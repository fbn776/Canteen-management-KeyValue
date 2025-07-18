"use client"

import {useEffect, useState} from "react"
import {Bell, Calendar, Clock, History, MessageCircle, Star} from "lucide-react"

interface MenuItem {
    id: string
    name: string
    price: number
    available: number
    total: number
    category: "meals" | "chai" | "snacks" | "breakfast"
    isSpecial?: boolean
    description?: string
}

interface Order {
    id: string
    item: string
    quantity: number
    time: string
    status: "pending" | "ready" | "completed"
}

export default function TodaysSpecial() {
    const [currentTime, setCurrentTime] = useState(new Date())
    const [selectedCategory, setSelectedCategory] = useState<string>("recommended")
    const [orders, setOrders] = useState<Order[]>([
        {id: "1", item: "Meals", quantity: 1, time: "12:30 PM", status: "pending"},
        {id: "2", item: "Chai", quantity: 2, time: "10:45 AM", status: "completed"},
    ])

    const menuItems: MenuItem[] = [
        {
            id: "1",
            name: "Meals",
            price: 45,
            available: 180,
            total: 240,
            category: "meals",
            description: "Rice, Dal, Curry, Pickle",
        },
        {
            id: "2",
            name: "Chai",
            price: 8,
            available: 195,
            total: 210,
            category: "chai",
            description: "Hot Tea with Milk"
        },
        {
            id: "3",
            name: "Samosa",
            price: 12,
            available: 18,
            total: 25,
            category: "snacks",
            isSpecial: true,
            description: "Crispy & Hot",
        },
        {
            id: "4",
            name: "Vada Pav",
            price: 15,
            available: 22,
            total: 25,
            category: "snacks",
            description: "Mumbai Special",
        },
        {
            id: "5",
            name: "Idli Sambhar",
            price: 25,
            available: 45,
            total: 50,
            category: "breakfast",
            description: "South Indian Breakfast",
        },
        {
            id: "6",
            name: "Poha",
            price: 20,
            available: 30,
            total: 40,
            category: "breakfast",
            isSpecial: true,
            description: "Today's Special!",
        },
    ]

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const getGreeting = () => {
        const hour = currentTime.getHours()
        const name = "Hari" // This would come from user context

        if (hour < 12) return `Good Morning, ${name}! 🌅`
        if (hour < 17) return `Good Afternoon, ${name}! ☀️`
        return `Good Evening, ${name}! 🌆`
    }

    const getRecommendedItems = () => {
        const hour = currentTime.getHours()

        if (hour >= 8 && hour < 11) {
            return menuItems.filter((item) => item.category === "breakfast" || item.category === "chai")
        } else if (hour >= 11 && hour < 15) {
            return menuItems.filter((item) => item.category === "meals" || item.category === "chai")
        } else if (hour >= 15 && hour < 18) {
            return menuItems.filter((item) => item.category === "snacks" || item.category === "chai")
        }
        return menuItems.filter((item) => item.category === "chai" || item.category === "snacks")
    }

    const getAvailabilityColor = (available: number, total: number) => {
        const percentage = (available / total) * 100
        if (percentage > 50) return "text-green-600"
        if (percentage > 20) return "text-yellow-600"
        return "text-red-600"
    }

    const getAvailabilityBg = (available: number, total: number) => {
        const percentage = (available / total) * 100
        if (percentage > 50) return "bg-green-100"
        if (percentage > 20) return "bg-yellow-100"
        return "bg-red-100"
    }

    const handleQuickOrder = (item: MenuItem) => {
        const newOrder: Order = {
            id: Date.now().toString(),
            item: item.name,
            quantity: 1,
            time: currentTime.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"}),
            status: "pending",
        }
        setOrders([newOrder, ...orders])

        // Simulate Telegram bot notification
        alert(
            `Order placed! 🎉\n${item.name} x1\nTelegram notification sent!\nEstimated ready time: ${new Date(currentTime.getTime() + 15 * 60000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            })}`,
        )
    }

    const specialItems = menuItems.filter((item) => item.isSpecial)
    const recommendedItems = getRecommendedItems()

    return (
        <div className="min-h-screen pb-10 px-4 py-6 space-y-6">
            {/* Time & Status */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-orange-600"/>
                        <span className="font-semibold text-gray-800">
                {currentTime.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}
              </span>
                    </div>
                    <div className="text-sm text-gray-600">Account Balance: ₹450</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <div className="text-sm text-green-700 font-medium">Kitchen Status</div>
                        <div className="text-lg font-bold text-green-800">Open</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <div className="text-sm text-blue-700 font-medium">Queue Length</div>
                        <div className="text-lg font-bold text-blue-800">12 people</div>
                    </div>
                </div>
            </div>

            {/* Special Items */}
            {specialItems.length > 0 && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-4 text-white shadow-lg">
                    <div className="flex items-center space-x-2 mb-3">
                        <Star className="w-5 h-5"/>
                        <h2 className="font-bold text-lg">Today's Special!</h2>
                    </div>
                    <div className="space-y-2">
                        {specialItems.map((item) => (
                            <div key={item.id} className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold">{item.name}</h3>
                                        <p className="text-sm opacity-90">{item.description}</p>
                                        <p className="text-lg font-bold">₹{item.price}</p>
                                    </div>
                                    <button
                                        onClick={() => handleQuickOrder(item)}
                                        className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
                                    >
                                        Order Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Category Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden">
                <div className="flex border-b border-gray-100">
                    {["recommended", "meals", "chai", "snacks", "breakfast"].map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`flex-1 py-3 px-2 text-sm font-medium capitalize transition-colors ${
                                selectedCategory === category ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-orange-50"
                            }`}
                        >
                            {category === "recommended" ? "For You" : category}
                        </button>
                    ))}
                </div>

                {/* Menu Items */}
                <div className="p-4 space-y-3">
                    {(selectedCategory === "recommended"
                            ? recommendedItems
                            : menuItems.filter((item) => item.category === selectedCategory)
                    ).map((item) => (
                        <div
                            key={item.id}
                            className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                        {item.isSpecial && <Star className="w-4 h-4 text-yellow-500 fill-current"/>}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                                    <p className="text-lg font-bold text-orange-600">₹{item.price}</p>
                                </div>
                                <div className="text-right">
                                    <div
                                        className={`text-sm font-medium ${getAvailabilityColor(item.available, item.total)}`}>
                                        {item.available}/{item.total} left
                                    </div>
                                    <div
                                        className={`w-16 h-2 rounded-full mt-1 ${getAvailabilityBg(item.available, item.total)}`}>
                                        <div
                                            className="h-full bg-current rounded-full transition-all"
                                            style={{width: `${(item.available / item.total) * 100}%`}}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleQuickOrder(item)}
                                    disabled={item.available === 0}
                                    className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    {item.available === 0 ? "Sold Out" : "Quick Order"}
                                </button>
                                <button
                                    className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors">
                                    <Calendar className="w-4 h-4"/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    className="bg-blue-500 text-white p-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-blue-600 transition-colors">
                    <MessageCircle className="w-5 h-5"/>
                    <span className="font-medium">Telegram Bot</span>
                </button>
                <button
                    className="bg-purple-500 text-white p-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-purple-600 transition-colors">
                    <Bell className="w-5 h-5"/>
                    <span className="font-medium">Set Reminders</span>
                </button>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
                <div className="flex items-center space-x-2 mb-3">
                    <History className="w-5 h-5 text-gray-600"/>
                    <h2 className="font-semibold text-gray-800">Recent Orders</h2>
                </div>
                <div className="space-y-2">
                    {orders.slice(0, 3).map((order) => (
                        <div
                            key={order.id}
                            className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                        >
                            <div>
                                <p className="font-medium text-gray-800">
                                    {order.item} x{order.quantity}
                                </p>
                                <p className="text-sm text-gray-600">{order.time}</p>
                            </div>
                            <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    order.status === "completed"
                                        ? "bg-green-100 text-green-800"
                                        : order.status === "ready"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-yellow-100 text-yellow-800"
                                }`}
                            >
                  {order.status}
                </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
