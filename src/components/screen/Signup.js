import React, {useState} from 'react';
import {Link, useHistory} from "react-router-dom";
import M from "materialize-css";

 const SignUp = () => {
     const history = useHistory();
     const [name,setName] = useState("");
     const [password,setPassword] = useState("");
     const [email,setEmail] = useState("");
     const [photo,setPhoto] = useState("");

     const postData = (e) => {
         const data = new FormData();
         if(photo) {
             data.append("image", photo);
         }
         data.append("name", name);
         data.append("email", email);
         data.append("password", password);
         e.preventDefault();
         if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "invalid email", classes: "#c62828 red darken-3"});
            return;
         }
         fetch("/signup",{
             method: "post",
             body : data
         }).then(res=> res.json()).then(data=> {
             if(data.error){
                 M.toast({html: data.error, classes: "#c62828 red darken-3"})
             } else {
                M.toast({html: data.message, classes: "#43a047 green darken-1"});
                history.push("/signin")
             }
         })
     }
    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <form onSubmit={postData}>
                    <input type="text" placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
                    <input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <div className="file-field input-field">
                        <div className="btn #64bf56 blue darken-1">
                            <span>Upload Image</span>
                            <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" />
                        </div>
                    </div>
                    <button className="btn waves-effect waves-light blue darken-1" type="submit">
                        SignUp
                    </button>
                </form>
                <h5>
                    <Link to="/signin">Already have an account ?</Link>
                </h5>
                <h5>
                    <Link to="/reset">Reset Password ?</Link>
                </h5>
            </div>
        </div>
    )
}

export default SignUp;