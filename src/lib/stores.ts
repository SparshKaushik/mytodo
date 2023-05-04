import { writable } from "svelte/store";
import type { task_t } from "./types";
import { cachedwritable } from "svelte-cached-store";
import { supabase } from "../supabase";
import type { Session } from "@supabase/supabase-js";

export const isLoading = writable<boolean>(true)

// export const authStore = writable<fauth_t | null>(null)
export const authStore = writable<Session | null>(null)

export const toDoStore = cachedwritable<task_t[]>([], "myToDo")

export const modalStore = writable<any>(null)

export const authHandlers = {
    login: async (email: string, password: string) => {
        await supabase.auth.signInWithPassword({
            email: email,
            password: password
        }).catch((error) => {
            console.log(error)
        })
    },
    register: async (name: string, email: string, password: string) => {
        await supabase.auth.signUp({
            email: email,
            password: password
        }).then((data) => {
            console.log(data)
        }).catch((error) => {
            console.log(error)
        })

    },
    logout: async () => {
        await supabase.auth.signOut()
        localStorage.clear()
        window.location.reload()
    },
}