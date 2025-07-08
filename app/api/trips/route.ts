import { getCountrythroughLatandLng } from "@/lib/Country"
import { prisma } from "@/lib/prisma"
import { auth } from "@/next-auth"
import { NextResponse } from "next/server"

export async function GET(){
    try {
        const session=await auth()
            if(!session){
                 return new NextResponse('not authenticated!',{status:401})
            }
        const locations=await prisma.location.findMany({
            where:{
                trip:{
                    userId:session.user?.id
                }
            },
            select:{
                locationTitle:true,
                lat:true,
                lng:true,
                trip:{
                    select:{
                        title:true
                    }
                }
            }
        })
        const transLocation=await Promise.all(locations.map(async(loc)=>{
            const geoCodeResult=await getCountrythroughLatandLng(loc.lat,loc.lng)
            return {
                name:`${loc.trip.title}-${geoCodeResult.formattedAddress}`,
                lat:loc.lat,
                lng:loc.lng,
                country:geoCodeResult.country
            }
    }))
    return NextResponse.json(transLocation)
    } catch (error) {
        console.log(error)
        return new NextResponse('Some error occcured',{status:404})
    }
}