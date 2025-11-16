import React from "react";

export default function ChatHeader({
  // name,
  totalMessages,
  totalUsers,
  onLogout,
  onEditProfile,
}) {
  return (
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-xl font-semibold">Chat Room</h2>
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-medium">Messages:</span> {totalMessages}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-medium">Users:</span> {totalUsers}
        </div>
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded-md"
          onClick={onEditProfile}
        >
          Profile
        </button>
        <button
          className="px-3 py-1 bg-red-500 text-white rounded-md"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
