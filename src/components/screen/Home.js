import React, { useState,useEffect, useContext } from 'react';
import { UserContext } from "../../App"
import { Link } from "react-router-dom";

 const Home = () => {
     const {state, dispatch } = useContext(UserContext);
     const [data, setData] = useState([]);
     const [text, setText] = useState("");
     useEffect(() => {
         const token = localStorage.getItem("jwt");
        fetch("/allpost", {
            headers: {
                "Authorization" : `Bearer ${token}`
            }
        }).then(res => res.json())
            .then(result => {
                setData(result)
            })
            .catch(err=> {
                console.log(err);
            })
     }, [])
     
     const actionLike = async(url,id) => {
         const token = localStorage.getItem("jwt");
         let linkUrl;
         if(url === "like"){
             linkUrl = url
         } else {
             linkUrl = url;
         }

         await fetch(`/${linkUrl}`, {
             method: "PUT",
             headers: {
                 "Authorization" : `Bearer ${token}`,
                 "Content-Type" : "application/json"
             },
             body : JSON.stringify({
                 postId : id
             })
         }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if(item._id === result._id){
                        return result;
                    } else {
                        return item;
                    }
                })
                setData(newData);
            })
            .catch(err=> console.log(err));
     }

     const makeComment = (postId) => {
         fetch("/comment",{
             method: "PUT",
             headers: {
                 "Content-Type" : "application/json",
                 "Authorization" : "Bearer " + localStorage.getItem("jwt")
             },
             body: JSON.stringify({
                 text,
                 postId
             })
         }).then(res=> res.json())
            .then(result => {
                console.log(result);
                const newData = data.map(item => {
                    if(item._id === result._id){
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData);
                setText("");
            }).catch(err => console.log(err))
     }

    const deletePost = (postId) => {
        const token = localStorage.getItem("jwt");
        fetch(`/deletepost/${postId}`,{
            method: "DELETE",
            headers: {
                "Authorization" : `Bearer ${token}`
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.filter(item => {
                    return item._id !== result._id
                })
                setData(newData);
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="home">
            {
                data.map(item => {
                    return (
                        <div className="card home-card" key={item._id}>
                            <h5 style={{ padding : "6px"}} ><Link to={item.postedBy._id !== state._id? `/profile/${item.postedBy._id}` : "/profile"} >{item.postedBy.name}</Link> {item.postedBy._id === state._id && 
                                <i 
                                className="material-icons right"  
                                onClick={() => deletePost(item._id)}>delete</i>
                            }</h5>
                            <div className="card-image">
                                <img className="item" src={`${item.photo}`} alt={item.title}/>
                            </div>
                            <div className="card-content">
                                <i className="material-icons" style={{color: item.likes.includes(state._id)? "red" : null}}>favorite</i>
                                {
                                    item.likes.includes(state._id)
                                    ? 
                                        <i className="material-icons" onClick={() => actionLike("unlike", item._id)}>thumb_down</i>
                                    : 
                                    <i className="material-icons"  onClick={() => actionLike("like", item._id)}>thumb_up</i>
                                }
                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    makeComment(item._id);
                                }}>
                                    <input type="text" placeholder="Add a comment" value={text} onChange={(e) => setText(e.target.value)} />
                                    {
                                    item.comments.map(record => {
                                        return <h6 key={record._id}><span style={{fontWeight: 500}}>{record.postedBy.name}</span> {record.text}</h6>
                                    })
                                }
                                </form>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Home;