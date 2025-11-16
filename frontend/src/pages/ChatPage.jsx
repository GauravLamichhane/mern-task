import React from "react";
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import ProfileModal from "../components/ProfileModal";

export default function ChatPage({
  name,
  messages,
  message,
  setMessage,
  sendMessage,
  totalMessages,
  totalUsers,
  onLogout,
  onEditProfile,
  showProfile,
  onCloseProfile,
  profileName,
  setProfileName,
  profileEmail,
  setProfileEmail,
  profilePassword,
  setProfilePassword,
  onUpdateProfile,
}) {
  return (
    <div className="p-6 max-w-3xl mx-auto relative">
      <ChatHeader
        name={name}
        totalMessages={totalMessages}
        totalUsers={totalUsers}
        onLogout={onLogout}
        onEditProfile={onEditProfile}
      />

      <ProfileModal
        show={showProfile}
        onClose={onCloseProfile}
        profileName={profileName}
        setProfileName={setProfileName}
        profileEmail={profileEmail}
        setProfileEmail={setProfileEmail}
        profilePassword={profilePassword}
        setProfilePassword={setProfilePassword}
        onUpdate={onUpdateProfile}
      />

      <MessageList messages={messages} name={name} />
      <MessageInput
        message={message}
        setMessage={setMessage}
        onSend={sendMessage}
      />
    </div>
  );
}
