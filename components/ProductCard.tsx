"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";

interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  image: string;
  onAddToCart: () => void;
}

export default function ProductCard({ id, title, price, image, onAddToCart }: ProductCardProps) {
  const { cart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const isInCart = cart.some((item) => item.id === id);

  const handleAddToCart = () => {
    setIsAdding(true);
    onAddToCart();
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <Card className="w-full group overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02]">
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={image}
            alt={title}
            width={500}
            height={500}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            unoptimized
          />
          {isInCart && (
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Check className="w-3 h-3" />
              In Cart
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg mb-2 line-clamp-2">{title}</CardTitle>
        <p className="text-2xl font-bold text-primary">${price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          className="w-full"
          disabled={isAdding}
          variant={isInCart ? "outline" : "default"}
        >
          {isAdding ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Added!
            </>
          ) : isInCart ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Already in Cart
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}