import { create } from "zustand"
import { persist } from "zustand/middleware"

type AuthState = {
    isLoading: boolean,
    isAuthenticated: boolean,
    username: string | null,
    login: (username:string) => void,
    logout: () => void
}



export const useAuthStore = create<AuthState>()(
    persist(
        (set)=>({
            isLoading: true,
            isAuthenticated: true,
            username: null,
            login: (username:string) => set({
                isLoading: false,
                isAuthenticated: true,
                username: username
            }),
            logout: () => set({
                isLoading: false,
                isAuthenticated: false,
                username: null
            })
        }),
        {
            name: "auth-storage",
        }
    )
)