import { writable } from "svelte/store";
import type { fauth_t } from "./types";
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import toast from "svelte-french-toast";
import { cachedwritable } from "svelte-cached-store";

export const isLoading = writable<boolean>(true)

// export const authStore = writable<fauth_t | null>(null)
export const authStore = cachedwritable<fauth_t | null>(null, "authStore")

export const authHandlers = {
    login: async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
            authStore.set({
                uid: userCredential.user.uid,
                displayName: userCredential.user.displayName,
                email: userCredential.user.email,
                emailVerified: userCredential.user.emailVerified,
                profile: userCredential.user.photoURL
            });
            toast.success("Logged in successfully!");
        })
    },
    register: async (name: string, email: string, password: string) => {
        if (!name || !email || !password) return toast.error("Please fill all the fields!")
        if (password.length < 6) return toast.error("Password should be at least 6 characters long!")
        if (!email.includes("@")) return toast.error("Invalid Email Address!")
        if (!name.trim()) return toast.error("Name cannot be empty!")
        if (name.length < 3) return toast.error("Name should be at least 3 characters long!")
        if (name.length > 20) return toast.error("Name should be less than 20 characters long!")
        await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            authStore.set({
                uid: userCredential.user.uid,
                displayName: userCredential.user.displayName,
                email: userCredential.user.email,
                emailVerified: userCredential.user.emailVerified,
                profile: userCredential.user.photoURL
            });
            return userCredential.user;
        }).then((user) => {
            updateProfile(user, {
                displayName: name
            }).then(() => {
                sendEmailVerification(user).then(() => {
                    toast.success("Email verification sent! Please check your inbox.");
                })
            })
        }).catch((error) => {
            switch (error.code) {
                case "auth/email-already-in-use":
                    toast.error("Email Already In Use! Please Login")
                    break;
                case "auth/invalid-email":
                    toast.error("Invalid Email Address")
                    break;
                case "auth/weak-password":
                    toast.error("Password is too weak! Please use a stronger password")
                    break;
                default:
                    toast.error("An Error Occured! Please Try Again Later")
                    break;
            }
            throw error
        })
    },
    logout: async () => {
        await signOut(auth)
        localStorage.clear()
        window.location.reload()
    },
}