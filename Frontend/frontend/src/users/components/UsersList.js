import UserItem from './UserItem'
import './UserList.css'
function UsersList({items}){
    if(items.length===0){
        return(
            <div className='center'> 
                <h2>No. User Found</h2>
            </div>
        )
    }
    const r=[]
    const render = items.map(function(user){
        if(user.places.length!==0){
            r.push(<UserItem key={user.id} id = {user.id} image={user.image} name = {user.name} placeCount={user.places.length}></UserItem>)  
        }
    })
    return(
        // <ul className="users-list">
        //     {items.map(user=>(
        //         <UserItem key={user.id} id = {user.id} image={user.image} name = {user.name} placeCount={user.places.length}></UserItem>
        //     ))}
            
        // </ul>
        <ul className='users-list'>
            {r}
        </ul>
    )
    console.log(items)
}

export default UsersList