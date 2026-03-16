import React, { useState, useEffect } from "react";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

const orderStages = [
  "Pending",
  "Approved",
  "Processing",
  "Shipped",
  "In Transit",
  "Out for Delivery",
  "Delivered",
  "Completed"
];

export const TrackorderPage = () => {

  const [order, setOrder] = useState(null);
  const [orderId, setOrderId] = useState("");

  // Fetch order from localStorage
  const getOrder = (id) => {
    const orders = JSON.parse(localStorage.getItem("user_orders")) || [];
    return orders.find((o) => o.id === id);
  };

  // Track order
  const trackOrder = () => {

    if (!orderId) {
      alert("Please enter an Order ID");
      return;
    }

    const found = getOrder(orderId);

    if (!found) {
      alert("Order not found");
      return;
    }

    setOrder(found);
  };

  // Auto refresh order every 3 seconds
  useEffect(() => {

    if (!orderId) return;

    const interval = setInterval(() => {

      const updated = getOrder(orderId);

      if (updated) {
        setOrder(updated);
      }

    }, 3000);

    return () => clearInterval(interval);

  }, [orderId]);


  // Confirm order received
  const confirmReceived = () => {

    if (!window.confirm("Confirm you have received this order?")) return;

    const orders = JSON.parse(localStorage.getItem("user_orders")) || [];

    const updatedOrders = orders.map((o) => {

      if (o.id === order.id) {
        return {
          ...o,
          status: "Completed",
          received: true,
          receivedAt: new Date().toISOString()
        };
      }

      return o;

    });

    localStorage.setItem("user_orders", JSON.stringify(updatedOrders));

    setOrder({
      ...order,
      status: "Completed",
      received: true,
      receivedAt: new Date().toISOString()
    });

    alert("Thank you! Order marked as received.");

  };

  // Check stage completion
  const isCompleted = (stage) => {

    if (!order) return false;

    const orderIndex = orderStages.indexOf(order.status);
    const stageIndex = orderStages.indexOf(stage);

    return stageIndex <= orderIndex;

  };

  return (

    <div className="min-h-screen bg-gray-100 flex flex-col">

      <Header />

      <div className="flex-grow max-w-3xl mx-auto py-10 px-4">

        <h1 className="text-3xl font-bold mb-8 text-center">
          Track Your Order
        </h1>

        {/* Order Search */}

        <div className="flex gap-3 mb-10">

          <input
            type="text"
            placeholder="Enter Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2"
          />

          <button
            onClick={trackOrder}
            className="bg-green-600 text-white px-6 rounded-lg"
          >
            Track
          </button>

        </div>


        {/* Order Card */}

        {order && (

          <div className="bg-white shadow-lg rounded-xl p-6">

            {/* Order Info */}

            <div className="flex gap-4 border-b pb-4 mb-6">

              <img
                src={order.image}
                alt={order.productName}
                className="w-20 h-20 object-cover rounded"
              />

              <div>

                <h3 className="font-semibold text-lg">
                  {order.productName}
                </h3>

                <p className="text-sm text-gray-500">
                  Order ID: {order.id}
                </p>

                <p className="text-green-600 font-semibold">
                  Status: {order.status}
                </p>

              </div>

            </div>


            {/* Timeline */}

            <div className="space-y-5">

              {orderStages.map((stage) => (

                <div key={stage} className="flex items-start gap-3">

                  <div
                    className={`w-4 h-4 mt-1 rounded-full ${
                      isCompleted(stage)
                        ? "bg-green-600"
                        : "bg-gray-300"
                    }`}
                  />

                  <div>

                    <p
                      className={`font-medium ${
                        isCompleted(stage)
                          ? "text-black"
                          : "text-gray-400"
                      }`}
                    >
                      {stage}
                    </p>

                    <p className="text-xs text-gray-400">

                      {order.stageTimestamps?.[stage] &&
                        new Date(
                          order.stageTimestamps[stage]
                        ).toLocaleString()}

                    </p>

                  </div>

                </div>

              ))}

            </div>


            {/* Confirm Received Button */}

            {order.status === "Delivered" && !order.received && (

              <div className="mt-8">

                <button
                  onClick={confirmReceived}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  ✔ Confirm Order Received
                </button>

                <p className="text-xs text-gray-400 text-center mt-2">
                  Click only if you have received the product.
                </p>

              </div>

            )}


            {/* Completed Message */}

            {order.received && (

              <div className="mt-8 bg-green-100 text-green-700 p-4 rounded-lg text-center">

                🎉 Order Received Successfully  
                <br />
                Thank you for shopping with LantaXpress.

                {order.receivedAt && (

                  <p className="text-sm mt-2 text-gray-600">

                    Received on:{" "}
                    {new Date(order.receivedAt).toLocaleDateString()}

                  </p>

                )}

              </div>

            )}

          </div>

        )}

      </div>

      <Footer />

    </div>

  );

};