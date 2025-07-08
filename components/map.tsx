'use client'
import { Location } from "@/app/generated/prisma";
import {GoogleMap,Marker,useLoadScript} from '@react-google-maps/api'
interface MapProps{
    itenaries:Location[]
}
export default function Map({itenaries}:MapProps){
    const {isLoaded,loadError}=useLoadScript({
        googleMapsApiKey:process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
    })
    if(loadError){
        return (
            <div>
                Error Loading...
            </div>
        )
    }
    if(!isLoaded){
        return (
            <div>
               Loading Maps....
            </div>
        )
    }
    const center=itenaries.length>0?{lat:itenaries[0].lat,lng:itenaries[0].lng}:{lat:0,lng:0}
    return (
       <GoogleMap mapContainerStyle={{width:'100%',height:'100%'}}zoom={8} center={center}>
        {
            itenaries.map((location,key)=>(
                <Marker position={{lat:location.lat,lng:location.lng}} key={key} title={location.locationTitle}/>
            ))
        }
       </GoogleMap>
    )
}