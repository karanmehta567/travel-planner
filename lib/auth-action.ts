'use server'
import { signIn,signOut } from "@/next-auth"
export const login=async()=>{
    await signIn('github',{
        redirectTo:'/'
    })
}
export const logout=async()=>{
    await signOut({
        redirectTo:'/'
    })
}