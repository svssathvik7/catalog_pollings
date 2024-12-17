"use client"

import { startAuthentication, startRegistration } from "@simplewebauthn/browser";
import api from "./axios"
import toaster from "./toaster";

export default async function authenticator(username:string){
    try {
        const authStartResponse = (await api.post(`/auth/login/start/${username}`)).data;
        const attResponse = await startAuthentication({optionsJSON: authStartResponse.publicKey});
        const authFinishResponse = (await api.post(`/auth/login/finish/${username}`,attResponse)).data;
        toaster("success","User loggedin successfull!");
        return true;
    } catch (error:any) {
        console.log(error);
        const errorText = error.response.data;
        toaster("error",(errorText||"Error logging in!"));
        return false;
    }
}