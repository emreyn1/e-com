"use client";

import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";
import { useCart } from "@/context/CartContext"; // <- buraya ekliyoruz

const categories = ["All", "Audio", "Wearables", "Accessories", "Monitors"];

export default function ProductsPage() {
  const { addToCart } = useCart(); // context hook'u burada kullanıyoruz

  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((p: any) => (
        <ProductCard
          key={p.id}
          id={p.id}
          title={p.title}
          price={p.price}
          image={p.image}
          onAddToCart={() => addToCart({ id: p.id, title: p.title, price: p.price, image: p.image })}
        />
      ))}
    </div>
  );
}