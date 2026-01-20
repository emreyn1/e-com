import { NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe";

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cart } = body as { cart: CartItem[] };

    // Cart validation
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty or invalid" },
        { status: 400 }
      );
    }

    const line_items = cart.map((item: CartItem) => {
      if (!item.title || !item.price || !item.quantity) {
        throw new Error(`Invalid cart item: ${JSON.stringify(item)}`);
      }
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
          },
          unit_amount: Math.round(item.price * 100), // USD cents
        },
        quantity: item.quantity,
      };
    });

    const origin = req.headers.get("origin") || req.headers.get("host") || "http://localhost:3000";
    const protocol = origin.includes("localhost") ? "http" : "https";
    const baseUrl = origin.startsWith("http") ? origin : `${protocol}://${origin}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${baseUrl}/cart?success=true`,
      cancel_url: `${baseUrl}/cart?canceled=true`,
    });

    if (!session.url) {
      throw new Error("Stripe session created but no URL returned");
    }

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("Checkout API error:", err);
    
    // Daha detaylı hata mesajı
    let errorMessage = "Unknown error occurred";
    let errorStack: string | undefined;
    
    if (err instanceof Error) {
      errorMessage = err.message;
      errorStack = err.stack;
      
      // Stripe-specific errors
      if ("type" in err && err.type === "StripeInvalidRequestError") {
        errorMessage = `Stripe Error: ${err.message}`;
      } else if (err.message?.includes("API key")) {
        errorMessage = "Invalid Stripe API key. Please check your .env.local file and restart the server.";
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? errorStack : undefined
      },
      { status: 500 }
    );
  }
}