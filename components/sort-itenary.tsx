import { Location } from "@/app/generated/prisma"
import {DndContext,closestCenter,DragEndEvent} from '@dnd-kit/core'
import {verticalListSortingStrategy,arrayMove,useSortable,SortableContext} from '@dnd-kit/sortable'
import { useId, useState } from "react"
import {CSS} from '@dnd-kit/utilities'
import { ReorderItenary } from "@/lib/actions/Reorder-itenary"
interface SortableItenaryProps{
    locations:Location[],
    tripId:string
}
function SortableItem({item}:{item:Location}){
    const {attributes,listeners,setNodeRef,transform,transition}=useSortable({id:item.id})
    return (
        <div 
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={{transform:CSS.Transform.toString(transform),transition}}
         className="p-4 border rounded-md flex justify-between items-center hover:shadow transition-shadow">
            <div>
            <h2 className="font-medium text-gray-800 truncate max-w-xs">{item.locationTitle}</h2>
            <p>Latitude:{`${item.lat}`} Longitude:{`${item.lng}`}</p>
            </div>
            <div className="text-sm text-gray-600">Day{item.order}</div>
        </div>
    )
}
export default function SortItenary({locations,tripId}:SortableItenaryProps){
    const id=useId()
    const [localLocation,setLocation]=useState(locations)
    const handleDragEnd=async(event:DragEndEvent)=>{
        const {active,over}=event
        if(active.id!==over?.id){
            const oldIndex=localLocation.findIndex((item)=>item.id===active.id)
            const newIndex=localLocation.findIndex((item)=>item.id===over?.id)

            const newlocationorder=arrayMove(localLocation,oldIndex,newIndex).map((item,index)=>(
                {...item,order:index}
            ))
            setLocation(newlocationorder)
            await ReorderItenary(tripId,newlocationorder.map((item)=>item.id))
        }
    }
    return (
       <DndContext id={id} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext  items={localLocation.map((loc)=>loc.id)} strategy={verticalListSortingStrategy}>
            {
                localLocation.map((item,key)=>(
                    <SortableItem key={key} item={item}/>
                ))
            }
        </SortableContext>
       </DndContext>
    )
}