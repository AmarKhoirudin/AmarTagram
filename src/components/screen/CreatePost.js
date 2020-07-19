import React, {useState} from "react";
import M from "materialize-css";
import { useHistory } from "react-router-dom";

const CreatePost = () => {
    const history = useHistory()
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [photo, setPhoto] = useState([]); 

    const newPost = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("jwt");
        const data = new FormData();
        for (let i = 0; i < photo.length; i++) {
            const newPhoto = photo[i];
            data.append("image", newPhoto);
        } 
        data.append("title", title);
        data.append("body", body);

        fetch("/createpost", {
            method: "POST",
            headers: {
                "Authorization" : `Bearer ${token}` ,
            },
            body: data
        }).then(res=> res.json())
            .then(data=> {
                if(data.error){
                    M.toast({html: data.error, classes: "#c62828 red darken-3"})
                } else {
                M.toast({html: "Success Create New Post", classes: "#43a047 green darken-1"});
                history.push("/")
                }
            }).catch(err=> console.log(err));
    }
    return (
        <div className="card input-field"
            style={{ 
                margin: "10px auto",
                maxWidth: "500px",
                padding: "20px",
                textAlign: "center"
            }}
        >   <form>
                <input type="text" placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <input type="text" placeholder="body" value={body} onChange={(e) => setBody(e.target.value)} />
                <div className="file-field input-field">
                    <div className="btn #64bf56 blue darken-1">
                        <span>Upload Image</span>
                        <input type="file" onChange={(e) => setPhoto(e.target.files)} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button className="btn waves-effect waves-light #64bf56 blue darken-1" onClick={newPost} >
                    Submit Post
                </button>
            </form>
        </div>
    )
}

export default CreatePost;