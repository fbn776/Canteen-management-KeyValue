
"use client"

import { useState } from "react"
import {
    Wallet,
    Plus,
    ArrowUpRight,
    ArrowDownLeft,
    CreditCard,
    Smartphone,
    Banknote,
    TrendingUp,
    PieChart,
    AlertCircle,
    Gift,
    Target,
    History,
    Settings,
    Home,
    Receipt,
} from "lucide-react"

interface Transaction {
    id: string
    type: "debit" | "credit"
    amount: number
    description: string
    category: "food" | "topup" | "refund" | "bonus"
    timestamp: Date
    status: "completed" | "pending" | "failed"
}

interface SpendingData {
    category: string
    amount: number
    percentage: number
    color: string
}

export default function WalletPage() {
    const [currentBalance, setCurrentBalance] = useState(450)
    const [showAddMoney, setShowAddMoney] = useState(false)
    const [selectedPeriod, setSelectedPeriod] = useState("week")
    const [addAmount, setAddAmount] = useState("")

    const transactions: Transaction[] = [
        {
            id: "1",
            type: "debit",
            amount: 45,
            description: "Meals + Pickle",
            category: "food",
            timestamp: new Date(2024, 0, 18, 12, 30),
            status: "completed",
        },
        {
            id: "2",
            type: "debit",
            amount: 16,
            description: "Chai x2",
            category: "food",
            timestamp: new Date(2024, 0, 18, 10, 45),
            status: "completed",
        },
        {
            id: "3",
            type: "credit",
            amount: 500,
            description: "UPI Payment",
            category: "topup",
            timestamp: new Date(2024, 0, 17, 14, 20),
            status: "completed",
        },
        {
            id: "4",
            type: "debit",
            amount: 12,
            description: "Samosa",
            category: "food",
            timestamp: new Date(2024, 0, 17, 16, 15),
            status: "completed",
        },
        {
            id: "5",
            type: "credit",
            amount: 25,
            description: "Refund - Cancelled Order",
            category: "refund",
            timestamp: new Date(2024, 0, 16, 11, 30),
            status: "completed",
        },
        {
            id: "6",
            type: "debit",
            amount: 8,
            description: "Chai",
            category: "food",
            timestamp: new Date(2024, 0, 16, 15, 45),
            status: "completed",
        },
        {
            id: "7",
            type: "credit",
            amount: 50,
            description: "Loyalty Bonus",
            category: "bonus",
            timestamp: new Date(2024, 0, 15, 9, 0),
            status: "completed",
        },
    ]

    const spendingData: SpendingData[] = [
        { category: "Meals", amount: 315, percentage: 65, color: "bg-blue-500" },
        { category: "Chai", amount: 96, percentage: 20, color: "bg-green-500" },
        { category: "Snacks", amount: 72, percentage: 15, color: "bg-yellow-500" },
    ]

    const weeklySpending = [
        { day: "Mon", amount: 53 },
        { day: "Tue", amount: 45 },
        { day: "Wed", amount: 67 },
        { day: "Thu", amount: 41 },
        { day: "Fri", amount: 78 },
        { day: "Sat", amount: 23 },
        { day: "Sun", amount: 12 },
    ]

    const monthlyBudget = 2000
    const currentMonthSpent = 1247
    const budgetRemaining = monthlyBudget - currentMonthSpent

    const handleAddMoney = (amount: number) => {
        setCurrentBalance(currentBalance + amount)
        setShowAddMoney(false)
        setAddAmount("")
        // Here you would integrate with payment gateway
        alert(`₹${amount} added successfully! 🎉`)
    }

    const getTransactionIcon = (transaction: Transaction) => {
        if (transaction.type === "credit") {
            return <ArrowDownLeft className="w-5 h-5 text-green-600" />
        }
        return <ArrowUpRight className="w-5 h-5 text-red-600" />
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "text-green-600"
            case "pending":
                return "text-yellow-600"
            case "failed":
                return "text-red-600"
            default:
                return "text-gray-600"
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white">
                <div className="max-w-md mx-auto px-4 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <Wallet className="w-8 h-8" />
                            <div>
                                <h1 className="text-xl font-bold">My Wallet</h1>
                                <p className="text-blue-100">Manage your canteen expenses</p>
                            </div>
                        </div>
                        <Settings className="w-6 h-6 text-blue-100" />
                    </div>

                    {/* Balance Card */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-4">
                        <div className="text-center">
                            <p className="text-blue-100 text-sm mb-2">Available Balance</p>
                            <p className="text-4xl font-bold mb-4">₹{currentBalance.toLocaleString()}</p>

                            {currentBalance < 100 && (
                                <div className="bg-red-500/20 border border-red-300 rounded-lg p-3 mb-4">
                                    <div className="flex items-center space-x-2">
                                        <AlertCircle className="w-5 h-5 text-red-200" />
                                        <p className="text-red-200 text-sm">Low balance! Add money to avoid missing meals.</p>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => setShowAddMoney(true)}
                                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center space-x-2 mx-auto"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Add Money</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-md mx-auto px-4 py-6 space-y-6">
                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-4">
                    <button className="bg-white p-4 rounded-xl shadow-sm border hover:border-blue-300 transition-colors">
                        <div className="text-center">
                            <Smartphone className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                            <p className="text-sm font-medium text-gray-800">UPI Pay</p>
                        </div>
                    </button>
                    <button className="bg-white p-4 rounded-xl shadow-sm border hover:border-green-300 transition-colors">
                        <div className="text-center">
                            <Receipt className="w-6 h-6 mx-auto mb-2 text-green-600" />
                            <p className="text-sm font-medium text-gray-800">Bills</p>
                        </div>
                    </button>
                    <button className="bg-white p-4 rounded-xl shadow-sm border hover:border-purple-300 transition-colors">
                        <div className="text-center">
                            <Gift className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                            <p className="text-sm font-medium text-gray-800">Rewards</p>
                        </div>
                    </button>
                </div>

                {/* Budget Tracker */}
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <Target className="w-5 h-5 text-blue-600" />
                            <h2 className="font-semibold text-gray-800">Monthly Budget</h2>
                        </div>
                        <span className="text-sm text-gray-600">Jan 2024</span>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Spent</span>
                            <span className="font-semibold text-gray-800">₹{currentMonthSpent.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Budget</span>
                            <span className="font-semibold text-gray-800">₹{monthlyBudget.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Remaining</span>
                            <span className={`font-semibold ${budgetRemaining > 0 ? "text-green-600" : "text-red-600"}`}>
                ₹{Math.abs(budgetRemaining).toLocaleString()}
              </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                            <div
                                className={`h-3 rounded-full transition-all ${
                                    currentMonthSpent > monthlyBudget ? "bg-red-500" : "bg-blue-500"
                                }`}
                                style={{ width: `${Math.min((currentMonthSpent / monthlyBudget) * 100, 100)}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-600 text-center">
                            {Math.round((currentMonthSpent / monthlyBudget) * 100)}% of budget used
                        </p>
                    </div>
                </div>

                {/* Spending Breakdown */}
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="flex items-center space-x-2 mb-4">
                        <PieChart className="w-5 h-5 text-blue-600" />
                        <h2 className="font-semibold text-gray-800">Spending Breakdown</h2>
                    </div>

                    <div className="space-y-3">
                        {spendingData.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                                    <span className="text-gray-700">{item.category}</span>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-800">₹{item.amount}</p>
                                    <p className="text-sm text-gray-600">{item.percentage}%</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Weekly Spending Chart */}
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                            <h2 className="font-semibold text-gray-800">Weekly Spending</h2>
                        </div>
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="text-sm border border-gray-300 rounded-lg px-3 py-1"
                        >
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </select>
                    </div>

                    <div className="flex items-end justify-between space-x-2 h-32">
                        {weeklySpending.map((day, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center">
                                <div
                                    className="bg-blue-500 rounded-t-lg w-full transition-all hover:bg-blue-600"
                                    style={{ height: `${(day.amount / 80) * 100}%` }}
                                ></div>
                                <p className="text-xs text-gray-600 mt-2">{day.day}</p>
                                <p className="text-xs font-semibold text-gray-800">₹{day.amount}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-xl shadow-sm border">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <History className="w-5 h-5 text-blue-600" />
                                <h2 className="font-semibold text-gray-800">Recent Transactions</h2>
                            </div>
                            <button className="text-blue-600 text-sm font-medium">View All</button>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="space-y-4">
                            {transactions.slice(0, 5).map((transaction) => (
                                <div key={transaction.id} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-gray-100 p-2 rounded-full">{getTransactionIcon(transaction)}</div>
                                        <div>
                                            <p className="font-medium text-gray-800">{transaction.description}</p>
                                            <p className="text-sm text-gray-600">
                                                {transaction.timestamp.toLocaleDateString("en-IN")} •{" "}
                                                {transaction.timestamp.toLocaleTimeString("en-IN", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-semibold ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                                            {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount}
                                        </p>
                                        <p className={`text-sm ${getStatusColor(transaction.status)}`}>{transaction.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Add Money Modal */}
                {showAddMoney && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Add Money</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Enter Amount</label>
                                    <input
                                        type="number"
                                        value={addAmount}
                                        onChange={(e) => setAddAmount(e.target.value)}
                                        placeholder="₹ 0"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg font-semibold text-center"
                                    />
                                </div>

                                {/* Quick Amount Buttons */}
                                <div className="grid grid-cols-3 gap-3">
                                    {[100, 200, 500].map((amount) => (
                                        <button
                                            key={amount}
                                            onClick={() => setAddAmount(amount.toString())}
                                            className="border border-gray-300 rounded-lg py-2 text-sm font-medium hover:border-blue-500 hover:text-blue-600 transition-colors"
                                        >
                                            ₹{amount}
                                        </button>
                                    ))}
                                </div>

                                {/* Payment Methods */}
                                <div className="space-y-3">
                                    <p className="text-sm font-medium text-gray-700">Payment Method</p>
                                    <div className="space-y-2">
                                        <button className="w-full flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                                            <Smartphone className="w-5 h-5 text-blue-600" />
                                            <span className="font-medium">UPI</span>
                                        </button>
                                        <button className="w-full flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                                            <CreditCard className="w-5 h-5 text-green-600" />
                                            <span className="font-medium">Debit/Credit Card</span>
                                        </button>
                                        <button className="w-full flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                                            <Banknote className="w-5 h-5 text-orange-600" />
                                            <span className="font-medium">Cash (Pay at Counter)</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex space-x-3 pt-4">
                                    <button
                                        onClick={() => setShowAddMoney(false)}
                                        className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleAddMoney(Number.parseInt(addAmount) || 0)}
                                        disabled={!addAmount || Number.parseInt(addAmount) <= 0}
                                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Add Money
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
