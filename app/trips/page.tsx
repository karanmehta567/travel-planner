import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { auth } from "@/next-auth";
import Link from "next/link";

export default async function TripsPage(){
    const session=await auth();
    const trips=await prisma.trip.findMany({
        where:{userId:session?.user?.id}
    })
    const sortedTrips=[...trips].sort((a,b)=>new Date(b.startDate).getTime()-new Date(a.startDate).getTime())
    const today=new Date()
    today.setHours(0,0,0,0)
    const upcomingtrips=sortedTrips.filter((trip)=>
        new Date(trip.startDate)>=today
    )
    if(!session){
        return (
            <div className="flex justify-center items-center h-screen text-gray-800 text-3xl">
                Please Sign In
            </div>
        )
    }
    return (
        <div className="space-y-6 container mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <Link href={'/trips/add-new'}>
            <Button>New Trip</Button>
            </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Hello,Welcome back {session.user?.name}!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{trips.length==0?'Start planning your first trip by clicking here':`You have ${trips.length} ${trips.length===1?'trip':'trips'} planned. ${upcomingtrips.length>0 ?`${upcomingtrips.length} in your wish list`:``}` }</p>
                </CardContent>
            </Card>
                <div>
                    <h2 className="text-xl font-semibold mb-4">Your recent trips</h2>
                    {
                        trips.length==0?(
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-8">
                                    <h2 className="text-xl font-medium mb-2">No trips yet</h2>
                                    <p className="text-center mb-4 max-w-md">Start Planning your adventure by creating your first trip</p>
                                     <Link href={'/trips/add-new'}>
                                        <Button>Create Trip</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ):(
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {
                                    sortedTrips.slice(0,5).map((trip,key)=>(
                                        <Link key={key} href={`/trips/${trip.id}`}>
                                            <Card className="hover:shadow-md h-full transition-shadow ">
                                                <CardHeader>
                                                    <CardTitle className="line-clamp-1">{trip.title}</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <p className="text-sm line-clamp-2 mb-2">{trip.description}</p>
                                                        <div>
                                                            {
                                                                new Date(trip.startDate).toLocaleDateString()
                                                            }-{
                                                                new Date(trip.endDate).toLocaleDateString()
                                                            }
                                                        </div>
                                                        </CardContent>
                                            </Card>
                                        </Link>
                                    ))
                                }
                            </div>
                        )
                    }
                </div>
        </div>
    )
}