import React from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';


const PaypalButton = ({ amount, onSuccess, onFailure }) => {
  return (
    <PayPalScriptProvider options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID || "test" ,
      currency: "USD"
    }}>
      <PayPalButtons
        style={{ layout: "vertical", height: 45 }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: Number(amount).toFixed(2),
                },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then((details) => {
            onSuccess(details);
          });
        }}
        onError={(err)=>{
            console.log(err);
            if(onFailure) onFailure(err);
        }}
        onCancel={(data) => {
            console.log("Payment Cancelled", data);
            if(onFailure) onFailure(new Error("Payment was cancelled."));
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PaypalButton;