import React from "react";
import {NavLink} from 'react-router-dom'
import {AuthContext} from "../../components/context/auth-context"
import { useContext } from "react";
import Button from "../FormElements/Button";
import './NavLinks.css'

function NavLinks( props){
    const auth = useContext(AuthContext)
    return(
        <ul className="nav-links">
            <li>
                <NavLink to="/" exact>ALL USERS</NavLink>
            </li>
            {auth.isLoggedIn && <li>
                <NavLink to={`/${auth.userID}/places`} exact>MY PLACES</NavLink>
            </li>}
            {auth.isLoggedIn && <li>
                <NavLink to="/places/new" exact>ADD PLACES</NavLink>
            </li>}
            {!auth.isLoggedIn && <li>
                <NavLink to="/auth" exact>AUTHENTICATE</NavLink>
            </li>}
            {auth.isLoggedIn && <li>
                <Button onClick={auth.logout}>LOG OUT</Button>
            </li>}
        </ul>
    )
}
export default NavLinks