import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const clearCart = () => {
        setCart([]);
    };
    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingProductIndex = prevCart.findIndex(
                (item) => item.id === product.id && item.size === product.size && item.color === product.color
            );

            if (existingProductIndex !== -1) {
                const updatedCart = [...prevCart];
                // Deep copy the specific item to avoid mutating the original state object
                updatedCart[existingProductIndex] = {
                    ...updatedCart[existingProductIndex],
                    quantity: updatedCart[existingProductIndex].quantity + product.quantity
                };
                return updatedCart;
            } else {
                return [...prevCart, { ...product }];
            }
        });
    };

    const removeFromCart = (productId, size, color) => {
        setCart((prevCart) => prevCart.filter(item => !(item.id === productId && item.size === size && item.color === color)));
    };

    const updateQuantity = (productId, size, color, newQuantity) => {
        if (newQuantity < 1) return;
        newQuantity = Math.min( newQuantity, 10);
        setCart((prevCart) => {
            const updatedCart = [...prevCart];
            const existingProductIndex = prevCart.findIndex(
                (item) => item.id === productId && item.size === size && item.color === color
            );
            if (existingProductIndex !== -1) {
                updatedCart[existingProductIndex].quantity = newQuantity;
            }
            return updatedCart;
        });
    }

    const toggleCartDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };
    

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, isDrawerOpen, setIsDrawerOpen, toggleCartDrawer , clearCart}}>
            {children}
        </CartContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
    return useContext(CartContext);
};
