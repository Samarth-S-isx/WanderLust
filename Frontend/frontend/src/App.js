import { BrowserRouter as Router,Route,Redirect,Switch} from 'react-router-dom'
import User from './users/pages/User';
import NewPlace from './places/pages/NewPlace'
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './users/pages/Auth';
import {AuthContext} from './shared/components/context/auth-context'
import { useCallback, useState } from 'react';

function App() {
  const [isLoggedIn,setIsLoggedIn] = useState(false);
  const [userID,setuserID] = useState(false);
  const login = useCallback((uid)=>{
    setIsLoggedIn(true)
    setuserID(uid)
  },[])
  const logout = useCallback(()=>{
    setIsLoggedIn(false)
    setuserID(null)
  },[])
  let routes;
  if(isLoggedIn){
    routes=(
    
      <Switch>
      <Route path="/" exact><User/></Route>
      <Route path="/:id/places" exact><UserPlaces/> </Route>
      <Route path="/places/new" exact> <NewPlace/></Route>
      <Route path="/places/:placeID" exact> <UpdatePlace/></Route>
      <Redirect to="/"><NewPlace/></Redirect>
      </Switch>
    );
  }else{
    routes=(
      <Switch>
      <Route path="/" exact><User/></Route>
      <Route path="/:id/places" exact><UserPlaces/> </Route>
      <Route path="/auth" exact> <Auth/></Route>
      <Redirect to="/auth"><NewPlace/></Redirect>
      </Switch>
    )
  }
  return (
    <AuthContext.Provider value = {{isLoggedIn:isLoggedIn,login:login,logout:logout,userID:userID}}>
      <Router>
        <MainNavigation></MainNavigation>
        <main>
        <Switch>
          {routes}
        </Switch>
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
