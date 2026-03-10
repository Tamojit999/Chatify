import { create } from 'zustand';
import axiosInstance from '../libs/axios';
import { toast } from 'react-hot-toast';
export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLogging: false,
    isUpdatingProfile: false,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
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
        
    } catch (error) {
        console.log("Error logging out:", error);
        toast.error(error.response?.data?.message || "Error logging out");  
    }
   


   }
}))