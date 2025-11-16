import React from "react";

export default function MessageInput({ message, setMessage, onSend }) {
  return (
    <div className="flex gap-2 mt-3">
      <input
        className="flex-1 border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSend()}
      />
      <button
        className="px-4 py-2 bg-indigo-600 text-white rounded"
        onClick={onSend}
      >
        Send
      </button>
    </div>
  );
}
