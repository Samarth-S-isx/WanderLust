import React, {useEffect,useState}from "react"
import UsersList from "../components/UsersList"
import ErrorModal from "../../shared/components/UIelements/ErrorModal";


function User(){

    const[user,setUser] = useState();
    const [error,setError] = useState("");
    useEffect(() => {
        const func = async()=>{
            try{
                const response = await fetch('http://localhost:5000/api/users/')
                const responseData = await response.json();
                setUser(responseData.users)
                console.log(responseData.users)
                if(!response.ok){
                    throw new Error(responseData.message);
                }
            }catch (e){ 
                setError(e)
            }
        }
        func();
      
    }, [])
    const errorhandler = ()=>{
        setError(null);
    }
    
    return(
        <>
        <ErrorModal error={error} onClear={errorhandler}></ErrorModal>
        {user&&<UsersList items={user}/>}
        </>
    )
}

export default User