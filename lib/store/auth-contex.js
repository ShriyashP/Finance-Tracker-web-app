"use client"

import { createContext } from "react"
import {auth}  from "@/lib/firebase/index"
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"; 
import {useAuthState} from  'react-firebase-hooks/auth'

export const authContext = createContext({
    user: null,
    loading: false,
    googleLoginHandler: async () => {},
    logout: async  () => {}
})

export default function  AuthContextProvider({ children }) {
    const [user, loading ] = useAuthState(auth);
    
    const googleProvider = new GoogleAuthProvider();

    const googleLoginHandler = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log("Successful Google Sign-In", result.user);
            return result.user;
        } catch (error) {
            // Specific error handling
            if (error.code === 'auth/popup-closed-by-user' || 
                error.code === 'auth/cancelled-popup-request') {
                console.log("Google Sign-In popup was closed");
                return null;
            }

            // Log other authentication errors
            console.error("Google Sign-In Error:", error.message);
            
            // Optional: You might want to show a user-friendly error message
            throw error;
        }
    }

    const logout = async () => {
        try {
            await signOut(auth);
            console.log("User logged out successfully");
        } catch (error) {
            console.error("Logout Error:", error.message);
            throw error;
        }
    };

    const values = {
        user,
        loading,
        googleLoginHandler,
        logout
    }

    return <authContext.Provider value={values}>{ children }</authContext.Provider>
}