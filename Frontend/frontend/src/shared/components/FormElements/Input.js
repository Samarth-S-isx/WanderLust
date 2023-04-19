import React,{useReducer,useEffect} from "react";
import {validate} from '../../Util/Validator'
import './Input.css'

//  expected props => id, element,label,validator,type,errorText,inputhandler
const reducer=(state,action)=>{
    switch(action.type){
        case 'CHANGE':
            return{
                ...state,
                value:action.val,
                isValid:validate(action.val,action.validators)
            };
        case 'BLUR':
            return{
                ...state,
                isTouched:true,
            }
        default:
            return state
    }
}


function Input(props){

    const [state,dispatch]  =  useReducer(reducer,{value:props.value||"",isValid:props.valid||false,isTouched:false})
    
    const changeHandler =(event)=>{
        dispatch({type:'CHANGE',val:event.target.value,validators:props.validators});
    }
    const handleBlur=(event)=>{
        dispatch({type:'BLUR'}) 
    }

    const {id,inputHandler} = props;
    const {value,isValid} = state
    useEffect(() => {
        inputHandler(id,value,isValid)
    }, [id,value,isValid,inputHandler])
    

    const element = props.element ==='input' ?  (<input id={props.id} type={props.type} onBlur={handleBlur} onChange={changeHandler} placeholder={props.placeholder} value={state.value}></input>) :
    (<textarea id={props.id} rows={props.rows||3} onBlur={handleBlur} onChange={changeHandler} value={state.value}></textarea>)


    return <div className={`form-control ${!state.isValid && state.isTouched  &&  'form-control--invalid'}`}>
        <label htmlFor={props.id}>{props.label}</label>
        {element}
        <h1></h1>
        {!state.isValid && state.isTouched && <p>{props.errorText}</p>}
    </div>
}

export default Input