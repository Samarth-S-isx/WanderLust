import React,{useCallback,useReducer,useContext,useState} from "react";
import { useHistory } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button"
import {VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH} from "../../shared/Util/Validator"
import { AuthContext } from "../../shared/components/context/auth-context";
import ErrorModal from "../../shared/components/UIelements/ErrorModal";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import './NewPlace.css'


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
        default :
        return state
    }
}

function NewPlace(){
    const auth = useContext(AuthContext)
    const [error,setError]  = useState()
    const[state,dispatch] =  useReducer(reducer,{
        inputs:{
            title:{
                value:' ',
                isValid: false
            },
            description:{
                value:' ',
                isValid: false
            },
            address:{
                value:' ',
                isValid: false
            },
            image:{
                value:null,
                isValid:false
            }
        },
        isValid:false
    
    })
    const history = useHistory()
    const inputHandler =useCallback((id,value,valid)=>{
        dispatch({type:'INPUTCHANGE',id:id,value:value,isValid:valid})
    },[])
    
    const placeSubmitHandler= async(event)=>{
        event.preventDefault();
        try{
            const formData = new FormData();
                formData.append('title',state.inputs.title.value)
                formData.append('description',state.inputs.description.value)
                formData.append('address',state.inputs.address.value)
                formData.append('image',state.inputs.image.value)
                formData.append('creator',auth.userID)
                
            const response = await fetch('http://localhost:5000/api/places',{
                method:'POST',
                body:formData
            })
            const responsedata = await response.json()
            if(!response.ok){
                throw new Error(responsedata.message);
            }else{
                history.push('/')
            }
        }
        catch(e){
            console.log(e)
            setError(e.message||'Something went wrong newplace')
        }
        
    }
    const errorhandler = ()=>{
        setError(null);
    }

    return(
        <>
        <ErrorModal error={error} onClear={errorhandler}></ErrorModal>
        <form className="place-form" onSubmit={placeSubmitHandler}>
            <Input id="title" inputHandler={inputHandler}element='input' type='text' label='Title' validators={[VALIDATOR_REQUIRE()]} errorText='Please Enter Valid Title'></Input>
            <Input id="description" inputHandler={inputHandler}element='textarea'  label='Description' validators={[VALIDATOR_MINLENGTH(5)]} errorText='Please Enter Valid Description'></Input>
            <ImageUpload id="image" onInput={inputHandler} errorText="please provide the image"></ImageUpload>
            <Input id="address" inputHandler={inputHandler}element='input'  label='Address' validators={[VALIDATOR_REQUIRE()]} errorText='Please Enter Valid Address'></Input>
            <Button type="submit" disabled={!state.isValid}>ADD PLACE</Button>
        </form>
        </>
    )
}

export default NewPlace