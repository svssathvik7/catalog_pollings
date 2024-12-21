import { create } from "zustand"
import { persist } from "zustand/middleware"

type AuthState = {
    isAuthenticated: boolean,
    username: string | null,
    login: (username:string) => void,
    logout: () => void
}



export const useAuthStore = create<AuthState>()(
    persist(
        (set)=>({
            isAuthenticated: false,
            username: null,
            login: (username:string) => set({
                isAuthenticated: true,
                username: username
            }),
            logout: () => set({
                isAuthenticated: false,
                username: null
            })
        }),
        {
            name: "auth-storage",
        }
    )
)