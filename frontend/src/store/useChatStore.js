import { create } from "zustand";
import axiosInstance from '../libs/axios';
import { toast } from 'react-hot-toast';
export const useChatStore = create((set,get)=>({
allContacts:[],
chats:[],
messages:[],
activeTab:"chats",
selectedUser:null,
isContactsLoading:false,
isChatsLoading:false,
isMessagesLoading:false,
isSoundEnabled:localStorage.getItem("isSoundEnabled")==="true"?true:false,

toggleSound:()=>
{
    const newValue = !get().isSoundEnabled;
    localStorage.setItem("isSoundEnabled", newValue);
    set({ isSoundEnabled: newValue });
},
setActiveTab:(tab)=>{
    set({activeTab:tab});
},
setSelectuser:(user)=>{
    set({selectedUser:user});
},
getAllContacts:async()=>{
    set({isContactsLoading:true});
    try {
        const res=await axiosInstance.get("/messages/contacts");
        set({allContacts:res.data});
        
    } catch (error) {
        console.log("Error fetching contacts:", error);
        toast.error("Failed to fetch contacts");
    }
    finally{
        set({isContactsLoading:false});
    }
},
getMyChatPartners:async()=>{
    set({isChatsLoading:true});
    try {
        const res=await axiosInstance.get("/messages/chats");
        set({chats:res.data});
        
    } catch (error) {
        console.log("Error fetching chat partners:", error);
        toast.error("Failed to fetch chat partners");  
    }
    finally{
        set({isChatsLoading:false});
    }

},

}));