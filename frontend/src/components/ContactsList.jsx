import React from 'react'
import { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import UsersLoadingSkeleton from './UserLoadingSkeleton';
import NoChatsFound from './NoChatsFound';
import { useAuthStore } from '../store/useAuthStore';
const ContactsList = () => {
   const {getAllContacts,allContacts, isContactsLoading, setSelectuser } =useChatStore();
   const {onlineUsers}= useAuthStore();
  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);
  if (isContactsLoading) {
    return <UsersLoadingSkeleton />;
  }
  if (allContacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
        <p className="text-slate-400 text-sm">No contacts found</p>
      </div>
    );
  }

  return (
    <>
    {
      allContacts.map((contact)=>(
        <div key={contact._id} className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
            onClick={() => setSelectuser(contact)}
          >
            <div className="flex items-center gap-3">
              <div className={`avatar ${onlineUsers.includes(contact._id) ? "online" : "offline"}`}>
                <div className="size-12 rounded-full">
                  <img src={contact.profilePic || "/avatar.png"} alt={contact.fullName} />
                </div>
              </div>
              <h4 className="text-slate-200 font-medium truncate">{contact.fullName}</h4>
            </div>

          </div>

      ))
    }
    </>
  )
}

export default ContactsList