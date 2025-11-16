import React, { useEffect, useRef } from "react";

export default function MessageList({ messages, name }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [messages]);

  const formatMessageTime = (time) => {
    if (!time) return "";
    const msgDate = new Date(time);
    const now = new Date();

    const isToday =
      msgDate.getDate() === now.getDate() &&
      msgDate.getMonth() === now.getMonth() &&
      msgDate.getFullYear() === now.getFullYear();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      msgDate.getDate() === yesterday.getDate() &&
      msgDate.getMonth() === yesterday.getMonth() &&
      msgDate.getFullYear() === yesterday.getFullYear();

    const options = { hour: "2-digit", minute: "2-digit" };

    if (isToday) return `Today, ${msgDate.toLocaleTimeString([], options)}`;
    if (isYesterday)
      return `Yesterday, ${msgDate.toLocaleTimeString([], options)}`;

    return `${msgDate.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    })}, ${msgDate.toLocaleTimeString([], options)}`;
  };

  return (
    <div
      ref={ref}
      className="border rounded p-3 h-72 overflow-auto flex flex-col gap-2 bg-white dark:bg-gray-800"
    >
      {messages.map((msg, i) => {
        if (msg.system)
          return (
            <div key={i} className="text-center text-sm text-gray-500">
              {msg.text}
            </div>
          );

        const isSender = msg.user === name;
        const align = isSender ? "justify-start" : "justify-end";
        const bubble = isSender
          ? "bg-blue-50 text-gray-900"
          : "bg-gray-100 text-gray-900";

        return (
          <div key={i} className={`flex ${align}`}>
            <div className={`max-w-3/4 p-3 rounded-lg ${bubble}`}>
              <div className="text-xs text-gray-600 mb-1">{msg.user}</div>
              <div>{msg.message}</div>
              <div
                className="text-[11px] text-gray-500 mt-2 text-right"
                title={msg.time ? new Date(msg.time).toLocaleString() : ""}
              >
                {formatMessageTime(msg.time)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
