"use client"

import { startAuthentication } from "@simplewebauthn/browser";
import api from "./axios"
import toaster from "./toaster";
import { AxiosError } from "axios";

export default async function authenticator(username:string){
    try {
        const authStartResponse = (await api.post(`/auth/login/start`,{
            username
        })).data;
        const attResponse = await startAuthentication({optionsJSON: authStartResponse?.result?.publicKey});
        const authFinishResponse = (await api.post(`/auth/login/finish/${username}`,attResponse)).data;
        console.log(authFinishResponse);
        toaster("success","User loggedin successfull!");
        return true;
    } catch (error:unknown) {
        console.log(error);
        if(error instanceof AxiosError){
            const errorText = error?.response?.data?.error??"Failed logging in...";
            toaster("error",errorText);
        }
        else{
            toaster("error","Something went wrong!");
        }
        return false;
    }
}