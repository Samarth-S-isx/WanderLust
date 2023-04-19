import React, { useEffect } from "react";
import { useParams,useHistory} from 'react-router-dom'
import { useContext ,useState} from "react";
import { AuthContext } from "../../shared/components/context/auth-context";
import ErrorModal from "../../shared/components/UIelements/ErrorModal";
import PlaceList from "../components/PlaceList";


function UserPlaces(){
    const auth = useContext(AuthContext)
    const userid = useParams().id
    const id = auth.userID
    const [error,setError] = useState()
    const [loadedPlaces,setLoadedPlace] = useState()
    const history = useHistory()
    useEffect(() => {
        const getplaces=async ()=>{
            try{
                const response = await fetch(`http://localhost:5000/api/places/user/${userid}`)
                const responseData = await response.json();
                setLoadedPlace(responseData.places)
                console.log(responseData)
                if(id===userid && !response.ok){
                    setLoadedPlace([])
                }else{
                    if(!response.ok){
                        throw new Error(responseData.message);
                    }
                    console.log(responseData.places)
                }
                
                

            }catch(e){
                setError(e.message||'Something went wrong userplace')
            }
        }
        getplaces();
    }, [])
    const onDelete=(id)=>{
        setLoadedPlace(loadedPlaces=>loadedPlaces.filter(place=>place.id!==id))
    }
    const errorhandler = ()=>{
        setError(null);
        history.push("/")
    }

  return (
    <>
    <ErrorModal error={error} onClear={errorhandler}></ErrorModal>
    {loadedPlaces&&<PlaceList places={loadedPlaces} onDelete={onDelete}></PlaceList>}
    </>
  )
}


export default UserPlaces