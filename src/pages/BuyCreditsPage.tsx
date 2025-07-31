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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Coins,
  CreditCard,
  Zap,
  Star,
  Clock,
  CheckCircle,
  DollarSign,
} from "lucide-react";

const creditPacks = [
  {
    credits: 100,
    price: 9.99,
    bonus: 0,
    popular: false,
    description: "Perfect for trying out new agents",
  },
  {
    credits: 300,
    price: 24.99,
    bonus: 50,
    popular: true,
    description: "Most popular choice for regular users",
  },
  {
    credits: 500,
    price: 39.99,
    bonus: 100,
    popular: false,
    description: "Best value for power users",
  },
  {
    credits: 1000,
    price: 69.99,
    bonus: 250,
    popular: false,
    description: "Maximum credits for heavy usage",
  },
];

const transactions = [
  {
    id: "TXN-001",
    date: "2024-01-15",
    credits: 300,
    amount: "$24.99",
    status: "completed",
  },
  {
    id: "TXN-002",
    date: "2024-01-10",
    credits: 100,
    amount: "$9.99",
    status: "completed",
  },
  {
    id: "TXN-003",
    date: "2024-01-05",
    credits: 500,
    amount: "$39.99",
    status: "completed",
  },
];

const BuyCreditsPage = () => {
  const [selectedPack, setSelectedPack] = useState<number | null>(null);
  const [currentBalance] = useState(300);

  const handlePurchase = (pack: (typeof creditPacks)[0]) => {
    setSelectedPack(pack.credits);
    // Handle purchase logic here
    console.log("Purchasing:", pack);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Buy Credits</h1>
          <p className="text-gray-400 mt-1">
            Purchase credits to use AI agents and unlock more features
          </p>
        </div>
      </div>

      {/* Current Balance */}
      <Card className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 border-violet-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Coins className="w-6 h-6 mr-2 text-violet-400" />
            Current Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold text-white mb-2">
                {currentBalance}
              </div>
              <p className="text-violet-200">Credits available</p>
            </div>
            <div className="text-right">
              <p className="text-violet-200 text-sm">Estimated usage</p>
              <p className="text-white font-medium">~12 agent runs remaining</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credit Packs */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">
          Choose Your Credit Pack
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {creditPacks.map((pack, index) => (
            <Card
              key={index}
              className={`bg-gray-900/50 border-gray-800 relative cursor-pointer transition-all duration-300 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/10 ${
                pack.popular
                  ? "border-violet-500/50 shadow-lg shadow-violet-500/10"
                  : ""
              } ${
                selectedPack === pack.credits ? "ring-2 ring-violet-500/50" : ""
              }`}
              onClick={() => setSelectedPack(pack.credits)}
            >
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-violet-600 to-purple-600 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Best Value
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coins className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white text-2xl">
                  {pack.credits + pack.bonus}
                  {pack.bonus > 0 && (
                    <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                      +{pack.bonus} bonus
                    </Badge>
                  )}
                </CardTitle>
                <div className="text-3xl font-bold text-white">
                  ${pack.price}
                </div>
                <CardDescription className="text-gray-400">
                  {pack.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-gray-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    {pack.credits} base credits
                  </div>
                  {pack.bonus > 0 && (
                    <div className="flex items-center text-gray-300 text-sm">
                      <Zap className="w-4 h-4 text-violet-400 mr-2" />
                      {pack.bonus} bonus credits
                    </div>
                  )}
                  <div className="flex items-center text-gray-300 text-sm">
                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                    Never expires
                  </div>
                </div>
                <Button
                  onClick={() => handlePurchase(pack)}
                  className={`w-full ${
                    pack.popular
                      ? "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                      : "bg-gray-800 hover:bg-gray-700 text-white"
                  }`}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Purchase
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Information */}
      {selectedPack && (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Complete Your Purchase</CardTitle>
            <CardDescription className="text-gray-400">
              Secure payment processing with 256-bit SSL encryption
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-violet-600/10 border border-violet-500/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">
                  {creditPacks.find((p) => p.credits === selectedPack)?.credits}{" "}
                  Credits
                  {creditPacks.find((p) => p.credits === selectedPack)
                    ?.bonus && (
                    <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                      +
                      {
                        creditPacks.find((p) => p.credits === selectedPack)
                          ?.bonus
                      }{" "}
                      bonus
                    </Badge>
                  )}
                </span>
                <span className="text-white font-bold">
                  ${creditPacks.find((p) => p.credits === selectedPack)?.price}
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                Total credits:{" "}
                {(creditPacks.find((p) => p.credits === selectedPack)
                  ?.credits || 0) +
                  (creditPacks.find((p) => p.credits === selectedPack)?.bonus ||
                    0)}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber" className="text-white">
                  Card Number
                </Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate" className="text-white">
                  Expiry Date
                </Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cvv" className="text-white">
                  CVV
                </Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardHolder" className="text-white">
                  Cardholder Name
                </Label>
                <Input
                  id="cardHolder"
                  placeholder="John Doe"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
            </div>

            <Button className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white py-6">
              <CreditCard className="w-5 h-5 mr-2" />
              Complete Purchase - $
              {creditPacks.find((p) => p.credits === selectedPack)?.price}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Transaction History */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Transaction History
          </CardTitle>
          <CardDescription className="text-gray-400">
            Your recent credit purchases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-violet-600/20 rounded-full flex items-center justify-center">
                    <Coins className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {transaction.credits} Credits
                    </p>
                    <p className="text-gray-400 text-sm">{transaction.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-white font-medium">
                    {transaction.amount}
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-green-500/20 text-green-400 border-green-500/30"
                  >
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuyCreditsPage;
