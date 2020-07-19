import React, { useEffect, createContext, useReducer, useContext } from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Switch, useHistory } from "react-router-dom";
import "./App.css";
import Home from "./components/screen/Home";
import Signin from "./components/screen/SignIn";
import Signup from "./components/screen/Signup";
import Profile from "./components/screen/Profile";
import UserProfile from "./components/screen/UserProfile";
import CreatePost from "./components/screen/CreatePost";
import SubscribeUserPost from './components/screen/SubscribeUserPost';
import Reset from './components/screen/Reset';
import NewPassword from './components/screen/NewPassword';
import { reducer, initialState } from "./context/reducer";
import { USER } from "./context/type";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const {state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if(user) {
      // history.push("/");
      dispatch({type: USER, payload: user.user });
    } else {
      if(!history.location.pathname.startsWith("/reset"))
        history.push("/signin");
    }
  }, [])
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/myfollowingpost" component={SubscribeUserPost} />
      <Route path="/signin" component={Signin} />
      <Route path="/signup" component={Signup} />
      <Route exact path="/profile" component={Profile} />
      <Route path="/profile/:userid" component={UserProfile} />
      <Route path="/create" component={CreatePost} />
      <Route exact path="/reset" component={Reset} />
      <Route path="/reset/:token" component={NewPassword} />
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{state, dispatch}}>
      <Router>
        <Navbar />
        <Routing />
      </Router>
    </UserContext.Provider>
  );
}

export default App;
