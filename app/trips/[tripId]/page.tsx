import TripDetailClient, { TripwithLocation } from "@/components/trip-detail";
import { prisma } from "@/lib/prisma"
import { auth } from "@/next-auth"

export default async function TripDetail({params}:{params:Promise<{tripId:string}>}){
    const {tripId}=await params
    const session=await auth();
    if(!session){
        return (
            <div>
                Please Sign in.
            </div>
        )
    }
    const trip=await prisma.trip.findFirst({
        where:{id:tripId,userId:session.user?.id},
        include:{locations:true}
    })
    if(!trip){
        return (
            <div>
                No trip found.
            </div>
        )
    }
    return (
        <TripDetailClient trip={trip as TripwithLocation}/>
    )
}