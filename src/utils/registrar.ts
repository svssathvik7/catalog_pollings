"use client"

import { startRegistration } from "@simplewebauthn/browser";
import api from "./axios"
import toaster from "./toaster";
// import { useRouter } from "next/navigation";

export default async function registrar(username:string){
    try {
        const regStartResponse = (await api.post(`/auth/register/start/${username}`)).data;
        console.log(regStartResponse)
        const attResponse = await startRegistration({optionsJSON: regStartResponse.publicKey});
        const regFinishResponse = (await api.post(`/auth/register/finish/${username}`,attResponse)).data;
        toaster("success","User registration successfull!");
        return true;
    } catch (error:any) {
        console.log(error);
        const errorText = error.response.data;
        toaster("error",(errorText||"Error registering"));
        return false;
    }
}