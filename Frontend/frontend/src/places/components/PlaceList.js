import React from "react"
import PlaceItem from "./PlaceItem"
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIelements/Card'
import './PlaceList.css'

function PlaceList({places,onDelete}){
    if(places.length===0){
        return <div className="place-list center"> 
            <Card>
                <h2>No Places Found</h2>
                <Button to ="/places/new">Share Place</Button>
            </Card>
        </div>
    }

    return<ul className="place-list">
        {places.map(place=><PlaceItem key={place.id} id={place.id} image={place.image} title={place.title} description={place.description} address={place.address} creatorID={place.creator} onDelete={onDelete}  ></PlaceItem>)}
    </ul>
}

export default PlaceList