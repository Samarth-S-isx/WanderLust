import Card from "../../shared/components/UIelements/Card"
import Button from "../../shared/components/FormElements/Button"
import { AuthContext } from "../../shared/components/context/auth-context"
import { useContext } from "react"
import Modal from '../../shared/components/UIelements/Modal'
import './PlaceItem.css'
function PlaceItem(props){
    const auth = useContext(AuthContext)

    const handleClick=async()=>{
        console.log("clicked")
        try{
            const response = await fetch(`http://localhost:5000/api/places/${props.id}`,{
                method:'DELETE'
            })
            props.onDelete(props.id)
        }catch (err){

        }
    }


    return (
    <>
    <li className="place-item">
        <Card className="place-item__content">
        <div className="place-item__image">
            <img src={`http://localhost:5000/${props.image}`} alt={props.title}></img>
        </div>
        <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description} </p>
        </div>
        {auth.userID===props.creatorID && <div className="place-item__actions">
            <Button to={`/places/${props.id}`}>EDIT</Button>
            <Button danger onClick={handleClick}>DELETE</Button>
        </div>}
        </Card>
    </li>
    </>
    )
}

export default PlaceItem