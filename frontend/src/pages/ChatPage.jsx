import { useAuthStore } from "../store/useAuthStore";
import { LoaderIcon } from "lucide-react";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { useChatStore } from "../store/useChatStore";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatPartnersList from "../components/ChatPartnersList";
import ContactsList from "../components/ContactsList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

const ChatPage = () => {
   const { activeTab, selectedUser } = useChatStore();
  return (
     <div className="relative w-full max-w-6xl h-[800px]">
        <BorderAnimatedContainer>
          
        {/* LEFT SIDE — hidden on small screens when a user is selected */}
        <div className={`w-full lg:w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col ${selectedUser ? "hidden lg:flex" : "flex"}`}>
         <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab==="chats"?<ChatPartnersList />:<ContactsList />}
          </div>
         
        </div>
           {/* RIGHT SIDE — hidden on small screens when no user is selected */}
        <div className={`flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm ${selectedUser ? "flex" : "hidden lg:flex"}`}>
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
          
        </BorderAnimatedContainer>

      </div>
  )
}

export default ChatPage