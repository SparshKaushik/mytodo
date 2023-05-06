import { modalStore } from "./stores";

export function closeModal() {
    modalStore.set(null);
}

export function visualDate(datetime: Date) {
    return datetime.toDateString();
}