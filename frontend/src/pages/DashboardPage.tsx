import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSlots } from '../hooks/useSlots';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { slots, loading, error } = useSlots();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('slots');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-700 text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error: {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const slotsList = Array.isArray(slots) ? slots : [];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-xl font-bold">SS</span>
            </div>
            <div>
              <h2 className="font-bold text-lg">Slot Swapper</h2>
              <p className="text-xs text-gray-400">v1.0.0</p>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="px-6 py-4 bg-gradient-to-r from-pink-600 to-pink-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white text-pink-600 flex items-center justify-center font-bold">
              {user?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-pink-200 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button
            onClick={() => {
              setActiveMenu('slots');
              navigate('/');
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded transition ${
              activeMenu === 'slots'
                ? 'bg-pink-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="text-xl">📅</span>
            <span>My Slots</span>
          </button>

          <button
            onClick={() => {
              setActiveMenu('suggestions');
              navigate('/suggestions');
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded transition ${
              activeMenu === 'suggestions'
                ? 'bg-pink-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="text-xl">💡</span>
            <span>Suggestions</span>
          </button>

          <button
            onClick={() => {
              setActiveMenu('history');
              navigate('/swaps');
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded transition ${
              activeMenu === 'history'
                ? 'bg-pink-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="text-xl">📜</span>
            <span>Swap History</span>
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded text-gray-400 hover:bg-gray-800 hover:text-white transition"
          >
            <span className="text-xl">🚪</span>
            <span>Logout</span>
          </button>
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800 text-xs text-gray-500">
          <p>© 2026 Slot Swapper</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Simple Header */}
        <header className="bg-white shadow px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-800">My Slots</h1>
          <p className="text-gray-600 mt-1">Manage your scheduled time slots</p>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          {slotsList.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📅</div>
              <p className="text-gray-600 text-lg mb-2">No slots yet</p>
              <p className="text-gray-500 text-sm mb-6">Create your first time slot to get started</p>
              <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition">
                + Create New Slot
              </button>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {slotsList.map((slot: any) => (
                  <div
                    key={slot.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      {slot.title}
                    </h3>
                    <div className="space-y-2 text-gray-600 text-sm">
                      <p className="flex items-center">
                        <span className="mr-2">📅</span>
                        {new Date(slot.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="flex items-center">
                        <span className="mr-2">🕐</span>
                        {slot.startTime} - {slot.endTime}
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
                      <button className="flex-1 bg-pink-600 hover:bg-pink-700 text-white px-3 py-2 rounded text-sm font-medium transition">
                        Edit
                      </button>
                      <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded text-sm font-medium transition">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Floating Action Button */}
        <button className="fixed bottom-8 right-8 w-14 h-14 bg-pink-600 hover:bg-pink-700 text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition">
          +
        </button>
      </main>
    </div>
  );
}