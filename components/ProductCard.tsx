"use client";

import { useCart } from "@/context/CartContext";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  image: string;
  onAddToCart: () => void;
}

export default function ProductCard({ id, title, price, image, onAddToCart }: ProductCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <img src={image} alt={title} className="w-full h-48 object-cover rounded-md" />
        <p className="mt-2 text-lg font-semibold">${price}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={onAddToCart} className="w-full">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}