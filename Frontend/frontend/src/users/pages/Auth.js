import React,{useReducer,useCallback,useEffect,useState} from "react";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIelements/Card";
import Button from "../../shared/components/FormElements/Button";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import {VALIDATOR_EMAIL,VALIDATOR_MINLENGTH,VALIDATOR_REQUIRE} from '../../shared/Util/Validator'
import ErrorModal from "../../shared/components/UIelements/ErrorModal";
import { useContext } from "react";
import { AuthContext } from "../../shared/components/context/auth-context";
import './Auth.css'
const reducer=(state,action)=>{
    
    switch (action.type){
        case 'INPUTCHANGE':
            let isFromValid=true
            for (const id in state.inputs){
                if(!state.inputs[id]){
                    continue;
                }
                if(id===action.id){
                    isFromValid = isFromValid&&action.isValid;
                }else{
                    isFromValid = isFromValid && state.inputs[id].isValid;
                }
            }
            return{
                ...state,
                inputs:{
                    ...state.inputs,
                    [action.id]:{value:action.value,isValid:action.isValid}
                },
                isValid:isFromValid
            }
        case 'SWITCH':
            return{
                ...state,
                isLogin:!action.isLogin,
            }
        case 'SETDATA':
            return{
                inputs:action.inputs,
                isValid:action.isValid,
                isLogin:action.isLogin
            }
        default:
            return state;
    }   
    

}


function Auth(){
    const [ isLoading,setLoading] = useState(false)
    const [error,setError] = useState("")
    const auth = useContext(AuthContext)
    const [state,dispatch] = useReducer(reducer,{
        inputs:{
            email:{
                value:"",
                isValid:false
            },
            password:{
                value:"",
                isValid:false
            }
        },
        isValid:false,
        isLogin:true,
    })

    const inputHandler = useCallback((id,value,valid)=>{
        dispatch({type:"INPUTCHANGE",id:id,value:value,isValid:valid})
        // console.log(state.inputs)
    },[])

    const submitHandler=async(event)=>{
        event.preventDefault();
        setLoading(true);
        if(state.isLogin){
            try{
                const response = await fetch('http://localhost:5000/api/users/login',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    email:state.inputs.email.value,
                    password:state.inputs.password.value
                })
            })
                const responsedata = await response.json();
                if(!response.ok){
                    throw new Error(responsedata.message);
                }else{
                    setLoading(false)
                    auth.login(responsedata.user.id);
                }
                
                ;}catch(e){
                    setLoading(false)
                    console.log(e)
                    setError(e.message||'Something went wrong')
                }

        }else{
            
            try{
                const formData = new FormData();
                formData.append('email',state.inputs.email.value)
                formData.append('name',state.inputs.name.value)
                formData.append('password',state.inputs.password.value)
                formData.append('image',state.inputs.image .value)
            const response = await fetch('http://localhost:5000/api/users/signup',{
            method:'POST',
            body:formData,
            })
            const responsedata = await response.json();
            if(!response.ok){
                throw new Error(responsedata.message);
            }else{
                console.log(responsedata)
                setLoading(false)
                auth.login(responsedata.user.id);
            }
            
            ;}catch(e){
                setLoading(false)
                console.log(e)
                setError(e.message||'Something went wrong')
            }
        }
        

    }

    const switchMode=()=>{
        if(!state.isLogin){
            let data = {
                ...state.inputs,
                name:undefined,
                image:undefined
            }
            dispatch({type:'SETDATA',inputs:data,isValid:state.inputs.email.isValid && state.inputs.password.isValid,isLogin:state.isLogin})
        }else{
             let data={
                ...state.inputs,
                name: {
                    value: '',
                    isValid: false
                },
                image:{
                    value:null,
                    isValid:false
                }
             }
            dispatch({type:'SETDATA',inputs:data,isValid:state.inputs.email.isValid && state.inputs.password.isValid,isLogin:state.isLogin})
        }
        dispatch({type:"SWITCH",isLogin:state.isLogin})    
    }
    const errorhandler = ()=>{
        setError(null);
    }
    
    return(
        <>
        <ErrorModal error={error} onClear={errorhandler}></ErrorModal>
        <Card className="authentication" >
            <h2>{state.isLogin?'Login':'Sign Up'} Required</h2>
            <hr/>
            <form onSubmit={submitHandler}>
                {!state.isLogin && <Input element="input" id="name" type="text" label='Your Name' validators={[VALIDATOR_REQUIRE()]} inputHandler={inputHandler} errorText="Please Enter Name"></Input>}
                {!state.isLogin && <ImageUpload center id="image" onInput={inputHandler}></ImageUpload> }
                <Input id="email" element="input" type="email" label="Email" validators={[VALIDATOR_EMAIL()]} inputHandler={inputHandler} errorText="Please enter valid email-ID" ></Input>
                <Input id="password" element="input" type="password" label="Password" validators={[VALIDATOR_MINLENGTH(5)]} inputHandler={inputHandler} errorText="Please enter valid password" ></Input>
                <Button type="submit" disabled ={!state.isValid}>{state.isLogin?'LOGIN':'SIGN-UP'} </Button>
            </form>
            <Button inverse onClick={switchMode}>{state.isLogin?'SIGN-UP':'LOGIN'}</Button>
        </Card>
        </>
    )
}


export default Auth