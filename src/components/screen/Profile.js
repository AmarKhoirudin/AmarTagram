import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from "../../App";
import M from "materialize-css";

 const Profile = () => {
     const { state, dispatch } = useContext(UserContext);
     const [myPost, setMyPost] = useState([]);
     
     useEffect(() => {
         const token = localStorage.getItem("jwt")
         fetch("/mypost", {
             headers: {
                 "Authorization" : `Bearer ${token}`
             }
         })
         .then(res => res.json())
         .then(result => {
            setMyPost(result.myPost);
         }).catch(err => console.log(err));
     },[])

     const updatePicture = (file) => {
        const token = localStorage.getItem("jwt");
        const data = new FormData();
        data.append("image", file);

        fetch("/update-picture", {
            method: "PUT",
            headers : {
                "Authorization" : `Bearer ${token}`
            },
            body: data
        }).then(res=> res.json())
        .then(result => {
            console.log(result)
            localStorage.setItem("user", JSON.stringify({...state, picture: result.user.picture}));
            dispatch({type: "UPDATEPICTURE", payload: result.user.picture});
            M.toast({html: result.message, classes: "#43a047 green darken-1"});
            // window.location.reload();
            
        })
        .catch(err => M.toast({html: data.error, classes: "#c62828 red darken-3"}));
     }
    return (
        <div style={{maxWidth: "750px", margin: "0 auto"}}>
            <div style={{
                    margin: "18px 0",
                    borderBottom: "1px solid grey"
                }} >
                <div style={{
                    display: "flex",
                    justifyContent: "space-around",
                }}>
                    <div>
                        <img src={state? `${state.picture}` : "loading"} alt="ImageProfile" style={{width: "160px", height: "160px", borderRadius: "80px"}} />
                    </div>
                    <div>
                        <h4>{state ? state.name : "loading"}</h4>
                        <h5>{state ? state.email : "loading"}</h5>
                        <div style={{display: "flex", justifyContent: "space-between", width: "108%"}}>
                            <h6>{myPost.length} post</h6>
                            <h6>{state ? state.followers.length : 0} followers</h6>
                            <h6>{state ? state.following.length : 0} following</h6>
                        </div>
                    </div>
                </div>
                <div className="file-field input-field" style={{margin: "10px"}}>
                        <div className="btn #64bf56 blue darken-1">
                            <span>Update Picture</span>
                            <input type="file" onChange={(e) => updatePicture(e.target.files[0])} />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" />
                        </div>
                    </div>
                </div>
            <div className="galery">
                {
                    myPost.map(item => {
                        return <img className="item" key={item._id} src={item.photo} alt={item.title}/>
                    })
                }
            </div>
        </div>
    )
}

export default Profile;