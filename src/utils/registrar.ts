"use client"

import { startRegistration } from "@simplewebauthn/browser";
import api from "./axios"
import toaster from "./toaster";
import { AxiosError } from "axios";
// import { useRouter } from "next/navigation";

export default async function registrar(username:string){
    try {
        const regStartResponse = (await api.post(`/auth/register/start/${username}`)).data;
        const attResponse = await startRegistration({optionsJSON: regStartResponse.publicKey});
        const regFinishResponse = (await api.post(`/auth/register/finish/${username}`,attResponse)).data;
        console.log(regFinishResponse);
        toaster("success","User registration successfull!");
        return true;
    } catch (error: unknown) {
        console.log(error);
        if (error instanceof AxiosError) {
            const errorText = error.response?.data || "Error registering";
            toaster("error", errorText);
        } else {
            toaster("error", "An unexpected error occurred");
        }
        return false;
    }
}