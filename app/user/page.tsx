// import React from 'react';
// import Link from 'next/link';
// import { FaUser, FaShoppingBag, FaHeart, FaCog, FaSignOutAlt } from 'react-icons/fa';

// export default function UserPortal() {
//   // Mock user data - replace with actual user data from your database
//   const user = {
//     name: 'John Doe',
//     email: 'john@example.com',
//     mobile: '+91 98765 43210',
//     address: '123 Main Street, City, Country',
//     totalOrders: 5,
//     totalSpent: 1250,
//   };

//   // Mock recent orders - replace with actual order data
//   const recentOrders = [
//     {
//       id: 'ORD-001',
//       date: '2024-03-15',
//       total: 250,
//       status: 'Delivered',
//       items: ['Alphonso Mango (2kg)', 'Kesar Mango (1kg)'],
//     },
//     {
//       id: 'ORD-002',
//       date: '2024-03-10',
//       total: 180,
//       status: 'Processing',
//       items: ['Totapuri Mango (1.5kg)'],
//     },
//   ];

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//         {/* Sidebar Navigation */}
//         <div className="md:col-span-1">
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <div className="flex items-center mb-6">
//               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
//                 <FaUser className="text-2xl text-green-600" />
//               </div>
//               <div className="ml-4">
//                 <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
//                 <p className="text-gray-600">{user.email}</p>
//               </div>
//             </div>
//             <nav className="space-y-2">
//               <Link
//                 href="/user"
//                 className="flex items-center p-3 text-green-600 bg-green-50 rounded-lg"
//               >
//                 <FaUser className="mr-3" />
//                 Profile
//               </Link>
//               <Link
//                 href="/user/orders"
//                 className="flex items-center p-3 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg"
//               >
//                 <FaShoppingBag className="mr-3" />
//                 Orders
//               </Link>
//               <Link
//                 href="/user/wishlist"
//                 className="flex items-center p-3 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg"
//               >
//                 <FaHeart className="mr-3" />
//                 Wishlist
//               </Link>
//               <Link
//                 href="/user/settings"
//                 className="flex items-center p-3 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg"
//               >
//                 <FaCog className="mr-3" />
//                 Settings
//               </Link>
//               <button className="flex items-center p-3 text-red-600 hover:bg-red-50 rounded-lg w-full">
//                 <FaSignOutAlt className="mr-3" />
//                 Logout
//               </button>
//             </nav>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="md:col-span-3">
//           {/* Profile Overview */}
//           <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//             <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Overview</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-600">Name</label>
//                     <p className="mt-1 text-gray-800">{user.name}</p>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-600">Email</label>
//                     <p className="mt-1 text-gray-800">{user.email}</p>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-600">Mobile</label>
//                     <p className="mt-1 text-gray-800">{user.mobile}</p>
//                   </div>
//                 </div>
//               </div>
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Address</h3>
//                 <p className="text-gray-800">{user.address}</p>
//               </div>
//             </div>
//             <div className="mt-6">
//               <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
//                 Edit Profile
//               </button>
//             </div>
//           </div>

//           {/* Recent Orders */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold text-gray-800">Recent Orders</h2>
//               <Link
//                 href="/user/orders"
//                 className="text-green-600 hover:text-green-700"
//               >
//                 View All Orders
//               </Link>
//             </div>
//             <div className="space-y-4">
//               {recentOrders.map((order) => (
//                 <div
//                   key={order.id}
//                   className="border rounded-lg p-4 hover:shadow-md transition-shadow"
//                 >
//                   <div className="flex justify-between items-start mb-2">
//                     <div>
//                       <h3 className="font-semibold text-gray-800">Order #{order.id}</h3>
//                       <p className="text-sm text-gray-600">{order.date}</p>
//                     </div>
//                     <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
//                       {order.status}
//                     </span>
//                   </div>
//                   <div className="text-sm text-gray-600 mb-2">
//                     {order.items.join(', ')}
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="font-semibold text-gray-800">
//                       Total: ${order.total}
//                     </span>
//                     <Link
//                       href={`/user/orders/${order.id}`}
//                       className="text-green-600 hover:text-green-700"
//                     >
//                       View Details
//                     </Link>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// } 