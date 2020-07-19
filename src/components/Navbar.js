import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useHistory }from "react-router-dom";
import { UserContext } from "../App";
import M from "materialize-css/dist/js/materialize.min.js"
import MA from "materialize-css"

export default function Navbar() {
  const searchModal = useRef(null);
  const [search , setSearch] = useState("");
  const [searchFetch , setSearchFecth] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
      let sidenav = document.querySelector("#slide-out");
      M.Sidenav.init(sidenav, {});
      MA.Modal.init(searchModal.current);
  },[]);

  const fetchUser = (query) => {
    setSearch(query);
    fetch("/search-user",{
      method: "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({query})
    }).then(res => res.json())
      .then(result => setSearchFecth(result.user))
      .catch(err => console.log(err));
  }

  const renderList = () => {
    if(state) {
      return (
        <>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/myfollowingpost">My Following Post</Link></li>
          <li><Link to="/create">Create Post</Link></li>
          <li>
            <button className="btn #c62828 red darken-3"
            onClick={() => {
              localStorage.clear();
              dispatch({type: "CLEAR"});
              history.push("/signin");
            }} >
                Logout
            </button>
          </li>
        </>
      )
    } else {
      return (
        <>
          <li><Link to="/signin">Signin</Link></li>
          <li><Link to="/signup">SignUp</Link></li>
        </>
      )
    }
  }
  return (
    <div>
      <nav>
        <div className="nav-wrapper white">
          <Link to={state ? "/" : "/signin"} className="brand-logo left">
            Instagram
          </Link>
          <a href="#" data-target="slide-out" className="sidenav-trigger right"><i className="material-icons" >menu</i></a>
          <ul id="nav-mobile" className="hide-on-med-and-down right" id="mobile-demo">
            {renderList()}
          </ul>
          <i data-target="modal1" className="large material-icons right modal-trigger" style={{color: "black"}} >search</i>
        </div>
      </nav>

      {/* Modal */}
      <div id="modal1" className="modal" ref={searchModal}>
        <div className="modal-content">
        <input type="text" placeholder="Search User" value={search} onChange={(e) => fetchUser(e.target.value)}/>
        <ul className="collection">
          {
            searchFetch.map(item => {
              return <Link to={item._id !== state._id? `/profile/${item._id}`: `/profile`} key={item._id}>
                <li className="collection-item" onClick={() => {
                  MA.Modal.getInstance(searchModal.current).close();
                  setSearch("");
                  setSearchFecth([]);
                }}>
                  <img src={item.picture} alt={item.name} width="50px" style={{borderRadius: "25px"}}/> {item.name}
                </li></Link>
            })
          }
        </ul>
        </div>
        {/* modal */}
        <div className="modal-footer">
          <button className="modal-close waves-effect waves-green btn-flat" onClick={() => {
            setSearch("");
            setSearchFecth([]);
          }}>Close</button>
        </div>
      </div>
      {/* sideNav target */}
      <div>
        <ul id="slide-out" className="sidenav right">
          <div style={{top: "5%"}} onClick={() => {
             let sidenav = document.querySelector("#slide-out");
             M.Sidenav.getInstance(sidenav).close(); 
          }}>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/myfollowingpost">My Following Post</Link></li>
            <li><Link to="/create">Create Post</Link></li>
            <li style={{marginLeft: "10%"}}>
              <button className="btn #c62828 red darken-3"
              onClick={() => {
                localStorage.clear();
                dispatch({type: "CLEAR"});
                history.push("/signin");
              }} >
                  Logout
              </button>
            </li>
          </div>
        </ul>
        
      </div>

      
    </div>
  );
}
