export interface fauth_t {
    uid: string,
    displayName: string | null,
    email: string | null,
    emailVerified: boolean,
    profile: string | null
}