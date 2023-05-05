import { modalStore } from "./stores";

export function closeModal() {
    modalStore.set(null);
}