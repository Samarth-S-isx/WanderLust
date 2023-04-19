import React from 'react'
import {Link} from 'react-router-dom'
import Avatar from '../../shared/components/UIelements/Avatar'
import Card from '../../shared/components/UIelements/Card'
import './UserItem.css'


function UserItem({id,image,name,placeCount}){
    let content=null


    return(
        <li className='user-item'>
        <Card className='user-item__content'>
            <Link to = {`/${id}/places`}>
            <div className='user-item__content'>
                <Avatar image={`http://localhost:5000/${image}`} alt={name}></Avatar>
            </div>
            <div className='user-item__info'>
                <h2>{name}</h2>
                <h3>{placeCount} Places</h3>
            </div>
            </Link>
        </Card>  
        </li>
    )
}

export default UserItem