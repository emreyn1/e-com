    "use client";

    import { createContext, useContext, useEffect, useState, ReactNode } from "react";

    interface CartItem {
    id: number;
    title: string;
    price: number;
    image: string;
    quantity: number;
    }

    interface CartContextType {
    cart: CartItem[];
    addToCart: (item: Omit<CartItem, "quantity">) => void;
    removeFromCart: (id: number) => void;
    }

    const CartContext = createContext<CartContextType | undefined>(undefined);

    export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    // localStorage'dan yükle
    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
        setCart(JSON.parse(storedCart));
        }
    }, []);

    // localStorage'a kaydet
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item: Omit<CartItem, "quantity">) => {
        setCart((prev) => {
        const existingItem = prev.find((p) => p.id === item.id);
        if (existingItem) {
            return prev.map((p) =>
            p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
            );
        }
        return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (id: number) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
        {children}
        </CartContext.Provider>
    );
    };

    export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
    };