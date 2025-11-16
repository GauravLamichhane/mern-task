import React from "react";

export default function ProfileModal({
  show,
  onClose,
  profileName,
  setProfileName,
  profileEmail,
  setProfileEmail,
  profilePassword,
  setProfilePassword,
  onUpdate,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 p-4 rounded-md shadow-lg z-10">
        <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Your Profile
        </h3>
        <div className="mb-2">
          <label className="block text-sm text-gray-700 dark:text-gray-300">
            Name
          </label>
          <input
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            className="w-full px-2 py-1 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            value={profileEmail}
            onChange={(e) => setProfileEmail(e.target.value)}
            className="w-full px-2 py-1 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm text-gray-700 dark:text-gray-300">
            New password
          </label>
          <input
            type="password"
            value={profilePassword}
            onChange={(e) => setProfilePassword(e.target.value)}
            className="w-full px-2 py-1 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-green-500 text-white rounded"
            onClick={onUpdate}
          >
            Update
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded bg-gray-300 text-gray-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
