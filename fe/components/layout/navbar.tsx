"use client";
import { useState } from "react";
import Image from "next/image";
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline';

type User = {
  name: string;
};

const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <nav className="bg-white shadow-md py-1 px-4 flex justify-between items-center">

      {/* LOGO */}
      <div className="flex items-center">
        <Image src="/logo.svg" alt="logo" width={60} height={15} />
      </div>

      {/* MENU */}
      <ul className="hidden md:flex space-x-6">
        <li className="hover:text-blue-500 cursor-pointer">Home</li>
        <li className="hover:text-blue-500 cursor-pointer">Products</li>
        <li className="hover:text-blue-500 cursor-pointer">Brands</li>
        <li className="hover:text-blue-500 cursor-pointer">About</li>
      </ul>

      {/* RIGHT SIDE */}
      <div className="flex items-center space-x-5">

        {/* CART */}
        <div className="relative cursor-pointer hover:text-blue-500 transition-colors duration-200">
          <ShoppingCartIcon className="h-6 w-6 text-gray-800" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full" alt="cart-count">
            2
          </span>
        </div>

        {/* AUTH */}
        {!user ? (
          <div className="flex space-x-2 text-sm">
            <button className="hover:text-blue-500">Login</button>
            <span>/</span>
            <button className="hover:text-blue-500">Register</button>
          </div>
        ) : (
          <div className="relative group">
            <div className="flex items-center space-x-2 cursor-pointer hover:text-blue-500 transition-colors duration-200">
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300">
                <UserIcon className="h-5 w-5 text-gray-700" />
              </div>
              <span className="text-sm font-medium text-gray-800 leading-none" alt="user-name">{user.name}</span>
            </div>

            <div className="absolute right-0 top-10 hidden group-hover:block bg-white shadow-md rounded-md w-32">
              <div className="p-2 hover:bg-gray-100 text-sm text-red-500 cursor-pointer">
                Logout
              </div>
            </div>
          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;