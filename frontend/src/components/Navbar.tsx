import React from 'react';
import { Link } from 'react-router-dom';
import TimezonePicker from './TimezonePicker';

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-indigo-400 hover:text-white">Dashboard</Link>
        <Link to="/swaps" className="text-indigo-400 hover:text-white">Swaps</Link>
        <Link to="/suggestions" className="text-indigo-400 hover:text-white">Suggestions</Link>
      </div>
      <TimezonePicker />
    </nav>
  );
}