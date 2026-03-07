import React from "react";
import AdminLayout from "../Layout/AdminLayout";
import StatCard from "../components/StatCard";

import {
  FaUsers,
  FaShoppingCart,
  FaStore,
  FaBoxOpen
} from "react-icons/fa";

export default function Dashboard() {
  return (

    
    <AdminLayout>
<main className="p-6">
      {/* PAGE TITLE */}
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">
        Dashboard Overview
      </h1>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">

        <StatCard
          title="Total Users"
          value="1,240"
          icon={<FaUsers />}
        />

        <StatCard
          title="Orders Today"
          value="87"
          icon={<FaShoppingCart />}
        />

        <StatCard
          title="Total Sellers"
          value="56"
          icon={<FaStore />}
        />

        <StatCard
          title="Pending Products"
          value="12"
          icon={<FaBoxOpen />}
        />

      </div>

      {/* LOWER SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* RECENT ORDERS */}
        <div className="xl:col-span-2 bg-white border shadow-sm p-4 sm:p-6 overflow-hidden">

          <h2 className="font-semibold text-slate-800 mb-4">
            Recent Orders
          </h2>

          {/* TABLE SCROLL AREA */}
          <div className="w-full overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="text-left text-slate-500 border-b">
                <tr>
                  <th className="pb-2 pr-4">Order ID</th>
                  <th className="pb-2 pr-4">Customer</th>
                  <th className="pb-2 pr-4">Amount</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>

              <tbody>

                <tr className="border-b">
                  <td className="py-3 pr-4">#LX1023</td>
                  <td className="pr-4">John Doe</td>
                  <td className="pr-4">₦45,000</td>
                  <td className="text-green-600">Completed</td>
                </tr>

                <tr className="border-b">
                  <td className="py-3 pr-4">#LX1022</td>
                  <td className="pr-4">Aisha Bello</td>
                  <td className="pr-4">₦18,500</td>
                  <td className="text-yellow-600">Pending</td>
                </tr>

                <tr>
                  <td className="py-3 pr-4">#LX1021</td>
                  <td className="pr-4">Michael James</td>
                  <td className="pr-4">₦72,300</td>
                  <td className="text-blue-600">Processing</td>
                </tr>

              </tbody>

            </table>

          </div>

        </div>

        {/* NEW USERS */}
        <div className="bg-white border shadow-sm p-4 sm:p-6">

          <h2 className="font-semibold text-slate-800 mb-4">
            New Users
          </h2>

          <ul className="space-y-4">

            <li className="flex justify-between items-center">
              <span className="font-medium">David</span>
              <span className="text-slate-400 text-xs sm:text-sm">2m ago</span>
            </li>

            <li className="flex justify-between items-center">
              <span className="font-medium">Sarah</span>
              <span className="text-slate-400 text-xs sm:text-sm">10m ago</span>
            </li>

            <li className="flex justify-between items-center">
              <span className="font-medium">Emeka</span>
              <span className="text-slate-400 text-xs sm:text-sm">30m ago</span>
            </li>

            <li className="flex justify-between items-center">
              <span className="font-medium">Grace</span>
              <span className="text-slate-400 text-xs sm:text-sm">1h ago</span>
            </li>

          </ul>

        </div>

      </div>
</main>
    </AdminLayout>
   
  );
}