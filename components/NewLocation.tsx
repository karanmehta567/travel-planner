'use client'

import { useTransition } from "react"
import { Button } from "./ui/button"
import { addLocation } from "@/lib/add-location"

export default  function NewLocationClient({tripId}:{tripId:string}){
    const [isPending,startTransition]=useTransition()
    return (
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md mx-auto">
                <div className="bg-white p-8 shadow-lg rounded-lg">
                    <h1 className="text-2xl font-bold text-center mb-5">Add New Location</h1>
                    <form action={(formData:FormData)=>{
                        startTransition(()=>{
                            addLocation(formData,tripId)
                        })
                    }} className="space-y-6" >
                        <div>
                            <label htmlFor="" className="block text-sm font-medium text-gray-700 mb-2">
                                Address
                            </label>
                            <input type="text" required name="address"  className="w-full border border-gray-200 px-4 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"/>
                        </div>
                         <Button className="w-full" type="submit">{isPending?'Adding....':'Add Location'}</Button>
                    </form>
                </div>
            </div>
        </div>
    )
}