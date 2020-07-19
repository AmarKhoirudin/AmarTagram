import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from "../../App";
import { useParams } from 'react-router-dom'
import amar from "../../assets/amar.jpg";

 const Profile = () => {
     const { state, dispatch } = useContext(UserContext);
     const [userProfile, setProfile] = useState(null);
     const {userid} = useParams();
     const [showFollow, setShowFollow] = useState(state? !state.following.includes(userid):true);
     useEffect(() => {
         const token = localStorage.getItem("jwt")
         fetch(`/user/${userid}`, {
             headers: {
                 "Authorization" : `Bearer ${token}`
             }
         })
         .then(res => res.json())
         .then((result) => {
            console.log(result)
            setProfile(result)
         }).catch(err => console.log(err));
     },[])

     const followUser = () => {
         fetch("/follow", {
             method: "PUT",
             headers : {
                 "Content-Type" : "application/json",
                 "Authorization" : "Bearer " + localStorage.getItem("jwt")
             }, body : JSON.stringify({followId : userid})
         }).then(res => res.json())
         .then(data => {
            dispatch({type: "UPDATE", payload: {following: data.following, followers : data.followers}})
            localStorage.setItem("user", JSON.stringify(data));
            setProfile((prevState) => {
                return {
                    ...prevState,
                    user : {
                        ...prevState.user,
                        followers : [...prevState.user.followers, data._id]
                    }
                }
            })
            setShowFollow(false);
        })
         .catch(err => console.log(err));
     }

     const unfollowUser = () => {
         fetch("/unfollow", {
             method: "PUT",
             headers : {
                 "Content-Type" : "application/json",
                 "Authorization" : "Bearer " + localStorage.getItem("jwt")
             }, body : JSON.stringify({unfollowId : userid})
         }).then(res => res.json())
         .then(data => {
            dispatch({type: "UPDATE", payload: {following: data.following, followers : data.followers}})
            localStorage.setItem("user", JSON.stringify(data));
            // setProfile((prevState) => {
            //     const newState = prevState.user.followers.filter(item => item !== data._id)
            //     return {
            //         ...prevState,
            //         user : {
            //             ...prevState.user,
            //             followers : newState
            //         }
            //     }
            // })
            const token = localStorage.getItem("jwt")
            fetch(`/user/${userid}`, {
                headers: {
                    "Authorization" : `Bearer ${token}`
                }
            })
            .then(res => res.json())
            .then((result) => {
               console.log(result)
               setProfile(result)
            }).catch(err => console.log(err));
            setShowFollow(true);
        })
         .catch(err => console.log(err));
     }

    return (
        <>
            {
                userProfile ? (
                    <div style={{maxWidth: "750px", margin: "0 auto"}}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-around",
                            margin: "18px 0",
                            borderBottom: "1px solid grey"
                        }}>
                            <div>
                                <img src={`/${userProfile.user.picture}`} alt="ImageProfile" style={{width: "160px", height: "160px", borderRadius: "80px"}} />
                            </div>
                            <div>
                                <h4>{userProfile.user.name}</h4>
                                <h5>{userProfile.user.email}</h5>
                                <div style={{display: "flex", justifyContent: "space-between", width: "108%"}}>
                                    <h6>{userProfile.posts.length} post</h6>
                                    <h6>{userProfile.user.followers.length} followers</h6>
                                    <h6>{userProfile.user.following.length} following</h6>
                                </div>
                                { showFollow? 
                                    <button style={{margin : '10px'}} className="btn waves-effect waves-light #64bf56 blue darken-1" type="submit" onClick={followUser} >
                                        Follow
                                    </button>
                                :   <button style={{margin : '10px'}} className="btn waves-effect waves-light #64bf56 blue darken-1" type="submit" onClick={unfollowUser} >
                                        UnFollow
                                    </button>
                                }
                            </div>
                        </div>
                        <div className="galery">
                            {
                                userProfile.posts.map(item => {
                                    return <img className="item" key={item._id} src={`/${item.photo}`} alt={item.title}/>
                                })
                            }
                        </div>
                    </div>
                
                ) : <h2>Loading...!</h2>
            }
        </>
    )
}

export default Profile;