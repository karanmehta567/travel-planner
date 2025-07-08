'use client'

import { Location, Trip } from "@/app/generated/prisma"
import Image from "next/image"
import {Calendar,  MapPin, Plus} from 'lucide-react'
import Link from "next/link"
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { useState } from "react"
import Map from "./map"
import SortItenary from "./sort-itenary"

export type TripwithLocation=Trip&{
    locations:Location[]
}
interface TripDetailProps{
    trip:TripwithLocation
}
export default function TripDetailClient({trip}:TripDetailProps){
    const [active,setActive]=useState('overview');
    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {trip.imageUrl&&(
                <div className="w-full h-72 md:h-96 overflow-hidden rounded-xl shadow-lg relative">
                    <Image src={trip.imageUrl} alt={trip.title} priority className="object-cover" fill/>
                </div>
            )}
            <div className="bg-white p-6 shadow rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">{trip.title}</h1>
                <div className="flex items-center text-gray-500 mt-2">
                    <Calendar className="h-5 w-5 mr-2"/>
                    <span className="text-lg">
                        {trip.startDate.toLocaleDateString()}-{trip.endDate.toLocaleDateString()}
                    </span>
                </div>
            </div>
            <div className="mt-4 md:mt-0">
                <Link href={`/trips/${trip.id}/itenary/new`}>
                <Button> <Plus className="mr-1 h-5 w-5"/>Add Location</Button>
                </Link>
            </div>
             </div>
             <div className="bg-white p-6 shadow-md rounded-lg">
            <Tabs value={active} onValueChange={setActive}>
                <TabsList className="mb-6">
                    <TabsTrigger value="overview" className="text-lg">Overview</TabsTrigger>
                    <TabsTrigger value="itenary" className="text-lg">Itineary</TabsTrigger>
                    <TabsTrigger value="map" className="text-lg">Google Map</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="">
                            <h2 className="text-2xl font-semibold mb-4">Trip Summary</h2>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <Calendar className="h-5 w-5 mr-4 text-gray-500"/>
                                    <div>
                                        <p className="font-medium text-gray-700">Dates</p>
                                        <p className="text-sm text-gray-500">
                                              {trip.startDate.toLocaleDateString()}-{trip.endDate.toLocaleDateString()}
                                              <br />
                                              {
                                                `${Math.round(trip.endDate.getTime()-trip.startDate.getTime())/(1000*60*60*24)} day(s)`
                                              }
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <MapPin className="w-6 h-6 mr-3 text-gray-500"/>
                                    <div>
                                        <p>Destinations</p>
                                        <p>{trip.locations.length} {`${trip.locations.length==1?'Location':'Locations'}`}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="h-72 rounded-lg overflow-hidden shadow-md">
                                <Map itenaries={trip.locations}/>
                        </div>
                        {
                            trip.locations.length===0&&(
                                <div className="text-center p-4">
                                    <p>Add some locations to map</p>
                                        <Link href={`/trips/${trip.id}/itenary/new`}>
                                            <Button> <Plus className="mr-1 h-5 w-5"/>Add Location</Button>
                                        </Link>
                                </div>
                            )
                        }
                        <div>
                            <p className="text-gray-600 leading-relaxed">{trip.description}</p>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="itenary" className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-semibold">Full Itinerary</h2>
                        </div>
                           {
                            trip.locations.length===0?(
                                <div className="text-center p-4">
                                    <p>Add some locations to map</p>
                                        <Link href={`/trips/${trip.id}/itenary/new`}>
                                            <Button> <Plus className="mr-1 h-5 w-5"/>Add Location</Button>
                                        </Link>
                                </div>
                            ):(
                                <SortItenary locations={trip.locations}
                                tripId={trip.id}/>
                            )
                        }
                </TabsContent>
                 <TabsContent value="map" className="space-y-6">
                        <div className="h-72 rounded-lg overflow-hidden shadow-md">
                                <Map itenaries={trip.locations}/>
                        </div>
                        {
                            trip.locations.length===0&&(
                                <div className="text-center p-4">
                                    <p>Add some locations to map</p>
                                        <Link href={`/trips/${trip.id}/itenary/new`}>
                                            <Button> <Plus className="mr-1 h-5 w-5"/>Add Location</Button>
                                        </Link>
                                </div>
                            )
                        }
                </TabsContent>
            </Tabs>
             </div>
             <div className="text-center">
                      <Link href={`/trips`}>
                                <Button>Back to trips</Button>
                      </Link>
             </div>
        </div>
    )
}