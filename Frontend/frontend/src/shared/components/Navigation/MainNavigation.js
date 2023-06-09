import React from 'react'
import {Link} from 'react-router-dom'
import MainHeader from './MainHeader'
import NavLinks from './NavLinks'
import SideDrawer from './SideDrawer'
import './MainNavigation.css'

function MainNavigation(props){
    return(
        <>
        {/* <SideDrawer>
            <nav className='main-navigation__header-nav'>
                <NavLinks></NavLinks>
            </nav>
        </SideDrawer> */}
        <MainHeader>
            <button className='main-navigation__menu-btn'>
                <span/> 
                <span/> 
                <span/> 
            </button>
            <h1 className="main-navigation__title"> <Link to="/">Your Places</Link> </h1>
            <nav className='main-navigation__header'>
                <NavLinks></NavLinks>
            </nav>
        </MainHeader>
        </>
    )
}

export default MainNavigation