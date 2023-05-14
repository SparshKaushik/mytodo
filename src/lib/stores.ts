import { writable } from 'svelte/store';
import type { modalStore_t, task_t } from './types';
import { cachedwritable } from 'svelte-cached-store';
import { supabase } from '../supabase';
import type { Session } from '@supabase/supabase-js';
import toast from 'svelte-french-toast';
import { goto } from '$app/navigation';

export const isLoading = writable<boolean>(true);
export const isSaving = writable<boolean | null>(null);

// export const authStore = writable<fauth_t | null>(null)
export const authStore = writable<Session | null>(null);

export const toDoStore = cachedwritable<task_t[]>([], 'myToDo');

export const modalStore = writable<modalStore_t | null>(null);

export const authHandlers = {
	login: async (email: string, password: string) => {
		await supabase.auth
			.signInWithPassword({
				email: email,
				password: password
			})
			.catch((error) => {
				console.log(error);
			});
	},
	register: async (name: string, email: string, password: string) => {
		await supabase.auth
			.signUp({
				email: email,
				password: password
			})
			.then(() => {
				toast.success('Account created successfully');
				toast.success('Please check your email for verification');
				goto('/login');
			})
			.catch((error) => {
				console.log(error);
			});
	},
	logout: async () => {
		await supabase.auth.signOut();
		localStorage.clear();
		window.location.reload();
	}
};
