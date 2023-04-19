import React, { useState } from "react";
import { useParams,useHistory } from "react-router-dom";
import {useCallback,useReducer,useEffect,useContext} from "react";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button"
import {VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH} from "../../shared/Util/Validator"
import { AuthContext } from "../../shared/components/context/auth-context";
import './UpdatePlace.css'

const reducer=(state,action)=>{
    switch(action.type){
        case 'INPUTCHANGE':
            let formIsValid=true;
            for(const id in state.inputs){
                if(id===action.id){
                    formIsValid=formIsValid&&action.isValid;
                }else{
                    formIsValid=formIsValid&&state.inputs[id].isValid;
                }
            }
            return{
                ...state,
                inputs:{
                    ...state.inputs,
                    [action.id]: {value:action.value,isValid:action.isValid}
                },
                isValid:formIsValid
            }
        case 'UPDATETITLE':
            return{
                ...state,
                inputs:{
                    ...state.inputs,
                    ["title"]: {value:action.value,isValid:action.isValid},
    
                },
                isValid:true
            }
        case 'UPDATEDESC':
            return{
                ...state,
                inputs:{
                    ...state.inputs,
                    ["description"]: {value:action.value,isValid:action.isValid},
    
                },
                isValid:true
            }
        default :
        return state
    }
}

function UpdatePlace(){
    const id = useParams().placeID;
    const auth = useContext(AuthContext)
    const uid = auth.userID
    const [Place,setPlace] = useState()
    const [error,setError] = useState()

    useEffect(() => {
        const getplaces=async()=>{
          try{
              const response = await fetch(`http://localhost:5000/api/places/${id}`)
              const responseData = await response.json();
            //   console.log(responseData.place)
              dispatch({type:'UPDATETITLE',value:responseData.place.title,isValid:true})
              dispatch({type:'UPDATEDESC',value:responseData.place.description,isValid:true})
              setPlace(responseData.place)

              if(!response.ok){
                  throw new Error(responseData.message);
              }
              
          }catch(e){
              setError(e.message||'Something went wrong userplace')
          }
        }
        getplaces();
      }, [])

    const history = useHistory()
    const [state,dispatch ]=useReducer(reducer,{
        inputs:{
            title:{
                value:"",
                isValid: true
            },
            description:{
                value:"",
                isValid: true
            }
        },
        isValid:true
    })
    
    

    const inputHandler =useCallback((id,value,valid)=>{
        dispatch({type:'INPUTCHANGE',id:id,value:value,isValid:valid})
        
    },[])
    const placeSubmitHandler= async (event)=>{
        event.preventDefault();
        try{
            const response = await fetch(`http://localhost:5000/api/places/${id}`,{
                method:'PATCH',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    title:state.inputs.title.value,
                    description:state.inputs.description.value,
                })
            })
            const responsedata = await response.json()
            console.log(responsedata)
            if(!response.ok){
                throw new Error(responsedata.message);
            }else{
                history.push('/'+uid+'/places')
            }
        }
        catch(e){
            console.log(e)
            setError(e.message||'Something went wrong updateplace')
        }
    }
    // if(!Place){
    //         return(
    //             <div className="center">Could not find Place</div>
    //         )
    //     }
    return(
        <>
        {Place && <form className="place-form" onSubmit={placeSubmitHandler}>
            <Input id="title"  inputHandler={inputHandler} element='input' type='text' label='Title' validators={[VALIDATOR_REQUIRE()]} errorText='Please Enter Valid Title' valid={true} value={Place.title}></Input>
            <Input id="description" inputHandler={inputHandler} element='textarea'  label='Description' validators={[VALIDATOR_MINLENGTH(5)]} errorText='Please Enter Valid Description' valid={true} value={state.inputs.description.value}></Input>
            <Button type="submit" disabled={!state.isValid} >EDIT PLACE</Button>
        </form>}
        </>
    )
}


export default UpdatePlace