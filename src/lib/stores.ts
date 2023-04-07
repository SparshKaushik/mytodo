import { writable } from "svelte/store";
import type { fauth_t } from "./types";
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import toast from "svelte-french-toast";


export const authStore = writable<fauth_t | null>(null)

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