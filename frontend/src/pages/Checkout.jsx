import React, { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { clearCart } from "../redux/cartSlice";

const Checkout = () => {
  const { user, logout } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );

  const saveOrder = async (paymentId) => {
    const saveOrderRes = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        items: cartItems.map((item) => ({
          product: item._id,
          qty: item.qty,
          price: item.price,
        })),
        totalAmount: totalPrice,
        address,
        paymentId,
      }),
    });

    if (!saveOrderRes.ok) {
      const errorData = await saveOrderRes.json().catch(() => ({}));
      if (saveOrderRes.status === 401) {
        logout();
        navigate("/login");
        throw new Error("Your session expired. Please log in again.");
      }
      throw new Error(errorData.message || "Order saving failed");
    }

    dispatch(clearCart());
    navigate("/ordersuccess");
  };

  const bypassPayment = async () => {
    try {
      await saveOrder("bypass_txn_" + Date.now());
    } catch (error) {
      console.error("Bypass order failed:", error);
      alert(error.message);
    }
  };

  const offerBypass = () => {
    const fallback = window.confirm(
      "Razorpay is unavailable. Use Student Bypass Mode to place a test order?",
    );
    if (fallback) {
      return bypassPayment();
    }
    return alert("Payment failed to initialize");
  };

  const handlePayment = async () => {
    try {
      const orderRes = await fetch("/api/payment/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice }),
      });
      const orderData = await orderRes.json().catch(() => ({}));

      if (!orderRes.ok) {
        return offerBypass();
      }

      const options = {
        key: orderData.key_id || "rzp_test_dummykey123",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Broochier",
        description: "Test Transaction",
        order_id: orderData.id,
        handler: async function (response) {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          if (verifyRes.ok) {
            try {
              await saveOrder(response.razorpay_payment_id);
            } catch (error) {
              alert(error.message);
            }
          } else {
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: address.fullName,
          email: user?.email,
          contact: "9999999999",
        },
        theme: {
          color: "#f97316",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Payment initialization failed:", error);
      return offerBypass();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }
    handlePayment();
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="shipping-form">
          <h3>Shipping Address</h3>
          <input
            type="text"
            placeholder="Full Name"
            required
            value={address.fullName}
            onChange={(e) =>
              setAddress({ ...address, fullName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Street"
            required
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
          />
          <input
            type="text"
            placeholder="City"
            required
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
          />
          <input
            type="text"
            placeholder="State"
            required
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
          />
          <input
            type="text"
            placeholder="Postal Code"
            required
            value={address.zipCode}
            onChange={(e) =>
              setAddress({ ...address, zipCode: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Country"
            required
            value={address.country}
            onChange={(e) =>
              setAddress({ ...address, country: e.target.value })
            }
          />
          <div className="checkout-summary">
            <h4>Total to Pay: INR {totalPrice.toFixed(2)}</h4>
            <button type="submit" className="btn">
              Pay Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
