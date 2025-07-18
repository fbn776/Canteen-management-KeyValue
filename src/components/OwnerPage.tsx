
"use client"

import { useState, useEffect } from "react"
import {
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    CheckCircle,
    Users,
    IndianRupee,
    Calendar,
    ChefHat,
    Package,
    Bell,
    Eye,
    EyeOff,
} from "lucide-react"

interface FoodItem {
    id: string
    name: string
    category: string
    todayMade: number
    todaySold: number
    price: number
    popularity: "high" | "medium" | "low"
    trend: "up" | "down" | "stable"
    suggestedQuantity: number
}

interface DueEntry {
    studentName: string
    amount: number
    days: number
    lastOrder: string
}

export default function OwnerDashboard() {
    const [currentTime, setCurrentTime] = useState(new Date())
    const [showDuesDetails, setShowDuesDetails] = useState(false)

    const todayDay = currentTime.toLocaleDateString("en-US", { weekday: "long" })
    const todayDate = currentTime.toLocaleDateString("en-IN")

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000) // Update every minute
        return () => clearInterval(timer)
    }, [])

    const foodItems: FoodItem[] = [
        {
            id: "1",
            name: "Meals (Rice + Dal + Curry)",
            category: "Main",
            todayMade: 240,
            todaySold: 195,
            price: 45,
            popularity: "high",
            trend: "up",
            suggestedQuantity: 260,
        },
        {
            id: "2",
            name: "Chai",
            category: "Beverage",
            todayMade: 210,
            todaySold: 180,
            price: 8,
            popularity: "high",
            trend: "stable",
            suggestedQuantity: 220,
        },
        {
            id: "3",
            name: "Samosa",
            category: "Snacks",
            todayMade: 25,
            todaySold: 22,
            price: 12,
            popularity: "high",
            trend: "up",
            suggestedQuantity: 30,
        },
        {
            id: "4",
            name: "Vada Pav",
            category: "Snacks",
            todayMade: 25,
            todaySold: 18,
            price: 15,
            popularity: "medium",
            trend: "down",
            suggestedQuantity: 20,
        },
        {
            id: "5",
            name: "Idli Sambhar",
            category: "Breakfast",
            todayMade: 50,
            todaySold: 35,
            price: 25,
            popularity: "medium",
            trend: "stable",
            suggestedQuantity: 45,
        },
        {
            id: "6",
            name: "Poha",
            category: "Breakfast",
            todayMade: 40,
            todaySold: 38,
            price: 20,
            popularity: "high",
            trend: "up",
            suggestedQuantity: 50,
        },
    ]

    const duesData: DueEntry[] = [
        { studentName: "Hari Kumar", amount: 180, days: 5, lastOrder: "Meals + Chai" },
        { studentName: "Priya Nair", amount: 95, days: 3, lastOrder: "Snacks" },
        { studentName: "Arjun M", amount: 240, days: 8, lastOrder: "Meals" },
        { studentName: "Sneha R", amount: 65, days: 2, lastOrder: "Chai" },
        { studentName: "Rahul S", amount: 320, days: 12, lastOrder: "Meals + Snacks" },
    ]

    const totalDues = duesData.reduce((sum, due) => sum + due.amount, 0)
    const totalRevenue = foodItems.reduce((sum, item) => sum + item.todaySold * item.price, 0)

    const getDayBasedSuggestions = () => {
        const suggestions = {
            Monday: {
                message: "Monday Blues! Students need comfort food",
                items: ["Extra Chai (250 cups)", "More Snacks (35 pieces)", "Keep Meals ready early"],
            },
            Tuesday: {
                message: "Regular day - stick to normal quantities",
                items: ["Standard Meals (240)", "Regular Chai (210)", "Light snacks (25)"],
            },
            Wednesday: {
                message: "Mid-week energy boost needed",
                items: ["Extra Samosas (30)", "More Chai (230)", "Add special curry"],
            },
            Thursday: {
                message: "Students are tired - comfort food day",
                items: ["Extra Meals (260)", "Hot Chai (240)", "Popular snacks (30)"],
            },
            Friday: {
                message: "Weekend mood! Students celebrate",
                items: ["Special items", "Extra snacks (40)", "More variety"],
            },
            Saturday: {
                message: "Light day - fewer students",
                items: ["Reduce Meals (180)", "Normal Chai (200)", "Less snacks (20)"],
            },
            Sunday: {
                message: "Very light day - minimal preparation",
                items: ["Minimal Meals (120)", "Basic Chai (150)", "Few snacks (15)"],
            },
        }
        return suggestions[todayDay as keyof typeof suggestions] || suggestions.Tuesday
    }

    const suggestions = getDayBasedSuggestions()

    const getPopularityColor = (popularity: string) => {
        switch (popularity) {
            case "high":
                return "text-green-600 bg-green-100"
            case "medium":
                return "text-yellow-600 bg-yellow-100"
            case "low":
                return "text-red-600 bg-red-100"
            default:
                return "text-gray-600 bg-gray-100"
        }
    }

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case "up":
                return <TrendingUp className="w-4 h-4 text-green-600" />
            case "down":
                return <TrendingDown className="w-4 h-4 text-red-600" />
            default:
                return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Canteen Dashboard</h1>
                            <p className="text-gray-600">Welcome back, Chandrettan! 👋</p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-600">{todayDate}</div>
                            <div className="text-lg font-semibold text-gray-800">
                                {currentTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg p-6 shadow-sm border">
                        <div className="flex items-center space-x-3">
                            <div className="bg-green-100 p-3 rounded-full">
                                <IndianRupee className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Today's Revenue</p>
                                <p className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border">
                        <div className="flex items-center space-x-3">
                            <div className="bg-red-100 p-3 rounded-full">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Pending Dues</p>
                                <p className="text-2xl font-bold text-red-600">₹{totalDues.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border">
                        <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Students Served</p>
                                <p className="text-2xl font-bold text-blue-600">156</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border">
                        <div className="flex items-center space-x-3">
                            <div className="bg-purple-100 p-3 rounded-full">
                                <Package className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Items Sold</p>
                                <p className="text-2xl font-bold text-purple-600">488</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Today's Suggestions */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                    <div className="flex items-center space-x-3 mb-4">
                        <ChefHat className="w-8 h-8" />
                        <div>
                            <h2 className="text-xl font-bold">Today's Preparation Guide</h2>
                            <p className="text-blue-100">
                                {todayDay} - {suggestions.message}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {suggestions.items.map((item, index) => (
                            <div key={index} className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="font-medium">{item}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dues Alert */}
                {totalDues > 1000 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Bell className="w-6 h-6 text-red-600" />
                                <div>
                                    <h3 className="font-semibold text-red-800">Payment Collection Alert!</h3>
                                    <p className="text-red-700">
                                        ₹{totalDues.toLocaleString()} pending from {duesData.length} students
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowDuesDetails(!showDuesDetails)}
                                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                {showDuesDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                <span>{showDuesDetails ? "Hide" : "View"} Details</span>
                            </button>
                        </div>

                        {showDuesDetails && (
                            <div className="mt-4 bg-white rounded-lg p-4">
                                <h4 className="font-semibold text-gray-800 mb-3">Students with Pending Dues:</h4>
                                <div className="space-y-2">
                                    {duesData.map((due, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                                        >
                                            <div>
                                                <p className="font-medium text-gray-800">{due.studentName}</p>
                                                <p className="text-sm text-gray-600">Last order: {due.lastOrder}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-red-600">₹{due.amount}</p>
                                                <p className="text-sm text-gray-600">{due.days} days ago</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Food Items Performance */}
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800">Today's Food Performance</h2>
                        <p className="text-gray-600">See what's selling well and what needs attention</p>
                    </div>

                    <div className="p-6">
                        <div className="grid gap-4">
                            {foodItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <h3 className="font-semibold text-gray-800 text-lg">{item.name}</h3>
                                            {getTrendIcon(item.trend)}
                                        </div>
                                        <div className="flex items-center space-x-2">
                      <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getPopularityColor(item.popularity)}`}
                      >
                        {item.popularity.toUpperCase()}
                      </span>
                                            <span className="text-lg font-bold text-green-600">₹{item.price}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-blue-600">{item.todayMade}</p>
                                            <p className="text-sm text-gray-600">Made Today</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-green-600">{item.todaySold}</p>
                                            <p className="text-sm text-gray-600">Sold Today</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-orange-600">{item.todayMade - item.todaySold}</p>
                                            <p className="text-sm text-gray-600">Remaining</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-purple-600">{item.suggestedQuantity}</p>
                                            <p className="text-sm text-gray-600">Tomorrow's Suggestion</p>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                                        <div
                                            className="bg-green-500 h-3 rounded-full transition-all duration-300"
                                            style={{ width: `${(item.todaySold / item.todayMade) * 100}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-sm text-gray-600 text-center">
                                        {Math.round((item.todaySold / item.todayMade) * 100)}% sold
                                    </p>

                                    {/* Recommendations */}
                                    {item.todayMade - item.todaySold > 10 && (
                                        <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                            <p className="text-yellow-800 text-sm">
                                                ⚠️ High wastage alert! Consider reducing quantity tomorrow.
                                            </p>
                                        </div>
                                    )}

                                    {item.todaySold === item.todayMade && (
                                        <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                                            <p className="text-green-800 text-sm">🎉 Sold out! Consider making more tomorrow.</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="bg-green-500 text-white p-6 rounded-lg hover:bg-green-600 transition-colors">
                        <div className="text-center">
                            <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                            <h3 className="font-semibold text-lg">Mark Items Ready</h3>
                            <p className="text-sm opacity-90">Update food availability</p>
                        </div>
                    </button>

                    <button className="bg-blue-500 text-white p-6 rounded-lg hover:bg-blue-600 transition-colors">
                        <div className="text-center">
                            <IndianRupee className="w-8 h-8 mx-auto mb-2" />
                            <h3 className="font-semibold text-lg">Collect Payments</h3>
                            <p className="text-sm opacity-90">Update student accounts</p>
                        </div>
                    </button>

                    <button className="bg-purple-500 text-white p-6 rounded-lg hover:bg-purple-600 transition-colors">
                        <div className="text-center">
                            <Calendar className="w-8 h-8 mx-auto mb-2" />
                            <h3 className="font-semibold text-lg">View Orders</h3>
                            <p className="text-sm opacity-90">Check pending orders</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}
