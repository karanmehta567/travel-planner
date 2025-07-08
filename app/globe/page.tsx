'use client'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useEffect, useRef, useState } from "react"
import {GlobeMethods} from 'react-globe.gl'
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false, // This disables server-side rendering for this component
});
export interface TranformedLocation{
    lat:number,
    lng:number,
    name:string,
    country:string
}
export default function GlobeFunction(){
    const globeRef=useRef<GlobeMethods|undefined>(undefined)
    const [visitedCounries,setVisitedCounntries]=useState<Set<string>>(new Set())
    const [loading,setLoading]=useState<boolean>(true)
    const [locations,setLocations]=useState<TranformedLocation[]>([])
    useEffect(()=>{
        const fetchedCountries=async()=>{
            try {
               const response= await fetch('/api/trips')
               const data=await response.json()
               setLocations(data)
               const countries=new Set<string>(data.map((loc:TranformedLocation)=>(
                loc.country
               )))
               setVisitedCounntries(countries)
            } catch (error) {
                console.log('error',error)
            }finally{
                setLoading(false)
            }
        }
        fetchedCountries()
    },[])
    useEffect(()=>{
        if(globeRef.current){
            globeRef.current.controls().autoRotate=true
            globeRef.current.controls().autoRotateSpeed=0.7
        }
    })
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-center text-4xl font-bold mb-12">Your Travel Journey</h1>
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg">
                            <div className="p-6">
                                <h2 className="text-2xl font-semibold mb-4">See where you have been....</h2>
                                <div className="h-[600px] w-full relative">
                                   {loading?(
                                    <div className="flex items-center justify-center h-full">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900">
                                        </div>
                                    </div>
                                   ):
                                   ( <Globe ref={globeRef}
                                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                                    bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                                    backgroundColor="rgba(0,0,0,0)"
                                    pointColor={() => "#FF5733"}
                                    pointLabel="name"
                                    pointRadius={0.5}
                                    pointAltitude={0.1}
                                    pointsData={locations}
                                    pointsMerge={true}
                                    width={800}
                                    height={600}/>)}
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-1">
                                <Card className="sicky top-8">
                                <CardHeader>
                                    Countries Visited
                                </CardHeader>
                                <CardContent>
                                    {loading?(
                                    <div className="flex items-center justify-center h-full">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900">
                                        </div>
                                    </div>
                                   ):
                                   ( 
                                   <div className="space-y-4">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <p>You've Visited <span>{visitedCounries.size} {visitedCounries.size<=1?'Country':'Countries'}</span> </p>
                                    </div>
                                    <div className="space-y-2 max-h[500px] overflow-y-auto pr-2">
                                        {
                                            Array.from(visitedCounries).sort().map((country,key)=>(
                                                <div key={key} className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                                                    <MapPin className="h-4 w-4 text-red-300"/>
                                                    <span>{country}</span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                   </div>)}
                                </CardContent>
                                </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}