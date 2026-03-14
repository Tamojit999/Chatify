import { create } from 'zustand';
import axiosInstance from '../libs/axios';
import { toast } from 'react-hot-toast';

import { io } from 'socket.io-client';
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";
export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLogging: false,
    isUpdatingProfile: false,
    socket:null,
    onlineUsers:[],

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
            get().connectSocket();
        } catch (error) {
            console.log("Error checking auth:", error);
            set({ authUser: null });


        }
        finally {
            set({ isCheckingAuth: false });
        }

    },
    SignUp: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account Created Successfully");
            get().connectSocket();
        } catch (error) {
            console.log("Error signing up:", error);
            set({ authUser: null });
            toast.error(error.response?.data?.message || "Error signing up");
        }
        finally {
            set({ isSigningUp: false });
        }

    },
    Login: async (data) => {
        set({ isLogging: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in Successfully");
            get().connectSocket();

        } catch (error) {
            console.log("Error logging in:", error);
            set({ authUser: null });
            toast.error(error.response?.data?.message || "Error logging in");

        }
        finally
        {
            set({ isLogging: false });
        }
   },
   updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("Error updating profile:", error);
            toast.error(error.response?.data?.message || "Error updating profile");
        } finally {
            set({ isUpdatingProfile: false });
        }
   },
   Logout:async()=>{
  
    try {
        await axiosInstance.post("/auth/logout");
        set({ authUser: null });
        toast.success("Logged out successfully");
        get().disconnectSocket();
        
    } catch (error) {
        console.log("Error logging out:", error);
        toast.error(error.response?.data?.message || "Error logging out");  
    }
   


   },
   connectSocket:()=>{
    const {authUser} = get();
    if(!authUser || get().socket?.connected){
        return;
    }
    const socket=io(BASE_URL,{withCredentials:true});
    socket.connect();
    set({socket:socket});

    socket.on("getOnlineUsers",(userIds)=>{
        set({onlineUsers:userIds});
    })
   },
    disconnectSocket:()=>{
        if(get().socket?.connected){
        get().socket?.disconnect();
        }
        set({socket:null,onlineUsers:[]});
    }
   
    
   

}))