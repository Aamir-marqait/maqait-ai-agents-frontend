/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Check,
  Download,
  Calendar,
  DollarSign,
  Crown,
  Star,
} from "lucide-react";

const plans = [
  {
    name: "Free Tier",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "100 credits per month",
      "Access to 5 basic agents",
      "Standard support",
      "Basic analytics",
    ],
    limitations: [
      "Limited agent usage",
      "No priority support",
      "Basic features only",
    ],
    current: false,
    popular: false,
  },
  {
    name: "Pro Plan",
    price: "$29",
    period: "per month",
    description: "Best for professionals and growing businesses",
    features: [
      "2,000 credits per month",
      "Access to all 75+ agents",
      "Priority support",
      "Advanced analytics",
      "Custom integrations",
      "Team collaboration",
      "API access",
    ],
    limitations: [],
    current: true,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For large teams and organizations",
    features: [
      "Unlimited credits",
      "All premium agents",
      "24/7 dedicated support",
      "Custom AI models",
      "White-label solutions",
      "Advanced security",
      "SLA guarantee",
    ],
    limitations: [],
    current: false,
    popular: false,
  },
];

const invoices = [
  {
    id: "INV-001",
    date: "2024-01-15",
    amount: "$29.00",
    status: "paid",
    plan: "Pro Plan",
  },
  {
    id: "INV-002",
    date: "2023-12-15",
    amount: "$29.00",
    status: "paid",
    plan: "Pro Plan",
  },
  {
    id: "INV-003",
    date: "2023-11-15",
    amount: "$29.00",
    status: "paid",
    plan: "Pro Plan",
  },
];

const BillingPage = () => {
  const [paymentMethod, _setPaymentMethod] = useState({
    cardNumber: "**** **** **** 4242",
    expiryDate: "12/25",
    cardHolder: "John Doe",
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Billing & Subscription
          </h1>
          <p className="text-gray-400 mt-1">
            Manage your subscription and billing information
          </p>
        </div>
      </div>

      {/* Current Plan */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Crown className="w-5 h-5 mr-2 text-violet-400" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">Pro Plan</h3>
              <p className="text-gray-400">$29.00 per month</p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                Next billing date: February 15, 2024
              </div>
            </div>
            <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30">
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Plans */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`bg-gray-900/50 border-gray-800 relative ${
                plan.popular
                  ? "border-violet-500/50 shadow-lg shadow-violet-500/10"
                  : ""
              } ${plan.current ? "ring-2 ring-violet-500/30" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-violet-600 to-purple-600 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              {plan.current && (
                <div className="absolute -top-3 right-4">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Current Plan
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-white">{plan.name}</CardTitle>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-white">
                    {plan.price}
                  </span>
                  {plan.period !== "contact us" && (
                    <span className="text-gray-400 ml-1">/{plan.period}</span>
                  )}
                </div>
                <CardDescription className="text-gray-400">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center text-gray-300"
                    >
                      <Check className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {plan.current ? (
                  <Button disabled className="w-full bg-gray-700 text-gray-400">
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                        : "bg-gray-800 hover:bg-gray-700 text-white"
                    }`}
                  >
                    {plan.name === "Enterprise" ? "Contact Sales" : "Upgrade"}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Method */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-8 h-5 bg-blue-600 rounded mr-2 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">VISA</span>
                  </div>
                  <span className="text-white">{paymentMethod.cardNumber}</span>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-green-500/20 text-green-400 border-green-500/30"
                >
                  Active
                </Badge>
              </div>
              <div className="text-sm text-gray-400">
                <p>Expires: {paymentMethod.expiryDate}</p>
                <p>Cardholder: {paymentMethod.cardHolder}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
            >
              Update Payment Method
            </Button>
          </CardContent>
        </Card>

        {/* Billing History */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Billing History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
                >
                  <div>
                    <p className="text-white font-medium">{invoice.id}</p>
                    <p className="text-gray-400 text-sm">
                      {invoice.plan} - {invoice.date}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-white font-medium">
                      {invoice.amount}
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-green-500/20 text-green-400 border-green-500/30"
                    >
                      {invoice.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BillingPage;
