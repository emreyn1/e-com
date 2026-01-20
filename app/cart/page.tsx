"use client";

import { Suspense } from "react";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

function CartContent() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  // Clear cart on successful payment
  useEffect(() => {
    if (success === "true") {
      clearCart();
    }
  }, [success, clearCart]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart }),
      });

      // Content-Type kontrolü - HTML dönerse (error page) JSON parse etme
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response received:", text.substring(0, 200));
        alert(
          "Server Error: API returned HTML instead of JSON.\n\n" +
          "This usually means:\n" +
          "1. Stripe keys are missing or invalid in .env.local\n" +
          "2. Server needs to be restarted after adding keys\n" +
          "3. Check server terminal for detailed error\n\n" +
          "Please check your .env.local file and restart the server."
        );
        return;
      }

      const data = await response.json();

      // Response status kontrolü
      if (!response.ok) {
        const errorMessage = data.error || data.message || "Unknown error occurred";
        console.error("Checkout API error:", errorMessage);
        alert(`Checkout Error: ${errorMessage}\n\nPlease check:\n1. Stripe keys are set in .env.local\n2. Server was restarted after adding keys\n3. Keys are valid test keys from Stripe Dashboard`);
        return;
      }

      if (data.error) {
        console.error("Checkout error:", data.error);
        alert(`Error: ${data.error}`);
        return;
      }

      if (!data.url) {
        console.error("No checkout URL returned:", data);
        alert("No checkout URL received. Please try again.");
        return;
      }

      const stripe = await stripePromise;
      if (stripe && data.url) {
        // Iframe içinde olup olmadığını kontrol et
        const isInIframe = window.self !== window.top && window.top !== null;
        
        if (isInIframe && window.top) {
          // Iframe içindeyse parent window'da aç veya yeni pencerede aç
          try {
            // Önce parent window'da açmayı dene
            window.top.location.href = data.url;
          } catch {
            // Eğer cross-origin ise yeni pencerede aç
            window.open(data.url, '_blank', 'noopener,noreferrer');
          }
        } else {
          // Normal sayfadaysa direkt yönlendir
          window.location.href = data.url;
        }
      } else {
        alert("Stripe not initialized. Please refresh the page.");
      }
    } catch (error: unknown) {
      console.error("Checkout error:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred during checkout";
      alert(`Checkout Error: ${errorMessage}\n\nCheck the browser console for more details.`);
    } finally {
      setIsLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted mb-4">
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground">Start shopping to add items to your cart</p>
          <Button asChild size="lg">
            <Link href="/products">
              Browse Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Shopping Cart</h1>

      {/* Success Message */}
      {success === "true" && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          <div>
            <p className="font-semibold text-green-900 dark:text-green-100">Payment Successful!</p>
            <p className="text-sm text-green-700 dark:text-green-300">Thank you for your purchase. Your order has been processed.</p>
          </div>
        </div>
      )}

      {/* Cancel Message */}
      {canceled === "true" && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-center gap-3">
          <XCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          <div>
            <p className="font-semibold text-yellow-900 dark:text-yellow-100">Payment Canceled</p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">Your payment was canceled. Your cart items are still saved.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border rounded-lg p-4 bg-card hover:shadow-md transition-shadow"
            >
              <Image
                src={item.image}
                alt={item.title}
                width={96}
                height={96}
                className="w-full sm:w-24 h-24 object-cover rounded-md"
                unoptimized
              />
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-lg mb-1">{item.title}</h2>
                <p className="text-muted-foreground">${item.price.toFixed(2)} each</p>
                <p className="text-lg font-bold text-primary mt-2">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      if (item.quantity > 1) {
                        updateQuantity(item.id, item.quantity - 1);
                      } else {
                        removeFromCart(item.id);
                      }
                    }}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromCart(item.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 bg-card sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
            <Button
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? "Processing..." : "Proceed to Checkout"}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Secure checkout powered by Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-8"></div>
          <div className="space-y-4">
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    }>
      <CartContent />
    </Suspense>
  );
}