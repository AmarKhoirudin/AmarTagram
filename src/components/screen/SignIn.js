import React,{ useState, useContext } from 'react';
import { UserContext } from "../../App";
import { USER } from "../../context/type";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

 const SignIn = () => {
    const {state, dispatch} = useContext(UserContext);
    const history = useHistory();
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");

    const postData = (e) => {
        e.preventDefault()
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
           M.toast({html: "invalid email", classes: "#c62828 red darken-3"});
           return;
        }
        fetch("/signin",{
            method: "post",
            headers: {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                email,
                password,
            })
        }).then(res=> res.json()).then(data=> {
            if(data.error){
                M.toast({html: data.error, classes: "#c62828 red darken-3"})
            } else {
                localStorage.setItem("jwt", data.token);
                localStorage.setItem("user", JSON.stringify({"user": data.user}));
                dispatch({type: USER, payload: data.user })
                M.toast({html: "Success Login", classes: "#43a047 green darken-1"});
                history.push("/")
            }
        }).catch(err=> console.log(err));
    }
    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <form>
                    <input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button className="btn waves-effect waves-light #64bf56 blue darken-1" type="submit" onClick={postData} >
                        Login
                    </button>
                </form>
                <h5>
                    <Link to="/signup">Do have an account ?</Link>
                </h5>
                <h5>
                    <Link to="/reset">Reset Password ?</Link>
                </h5>
            </div>
        </div>
    )
}

export default SignIn;