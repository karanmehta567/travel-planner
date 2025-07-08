'use server'

import { auth } from "@/next-auth"
import { prisma } from "../prisma";

export async function ReorderItenary(tripId:string,newOrder:string[]){
    const session=await auth();
    if(!session){
        throw new Error('You have to sign in first.')
    }
    await prisma.$transaction(newOrder.map((locationId:string,key:number)=>
        prisma.location.update({
            where:{id:locationId},
            data:{order:key}
        })
    ))
}