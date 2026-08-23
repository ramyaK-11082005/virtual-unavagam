import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const localCart = localStorage.getItem('cart');
    return localCart ? JSON.parse(localCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (food, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.food === food._id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.food === food._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            food: food._id,
            name: food.name,
            price: food.price,
            image: food.image,
            category: food.category,
            isVeg: food.isVeg,
            quantity,
          },
        ];
      }
    });
  };

  const removeFromCart = (foodId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.food !== foodId));
  };

  const increaseQuantity = (foodId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.food === foodId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (foodId) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.food === foodId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const deliveryFee = subtotal > 0 ? 40 : 0;
    const tax = Math.round(subtotal * 0.09); // 9% tax
    const discount = subtotal > 500 ? 50 : 0;
    const grandTotal = Math.max(0, subtotal + deliveryFee + tax - discount);

    return {
      subtotal,
      deliveryFee,
      tax,
      discount,
      grandTotal,
    };
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        calculateTotals,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
