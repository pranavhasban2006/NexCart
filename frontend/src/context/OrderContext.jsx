import React, { createContext, useState, useContext } from 'react';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    // Array to hold the user's order history
    const [orders, setOrders] = useState([]);

    // Function to add a new order securely to the top of the history list
    const addOrder = (order) => {
        setOrders((prevOrders) => [order, ...prevOrders]);
    };

    return (
        <OrderContext.Provider value={{ orders, addOrder }}>
            {children}
        </OrderContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useOrder = () => useContext(OrderContext);
