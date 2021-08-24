import React from "react";
import {useHistory} from "react-router-dom";
import MenuIcon from '@material-ui/icons/Menu';

//we need userDataValue and verify admin
function Header(props){
  const history = useHistory();

  //if there is an error with SwitchPage then use onClick={()=>SitchPage("/");}
  function getLogin(){
    if(props.userDataValue){
      return(<div>
        <p onClick={()=>history.push("/home")} style={{
          float:"right",
          margin:0,
          padding:0,
          textTransform: "capitalize"
        }}>{props.userDataValue.username}</p><br/>
        <p onClick={()=>history.push("/login")} style={{
          float:"right",
          margin:0,
          padding:0,
          fontSize:"x-small"
        }}>logout</p>
      </div>);
    }else{
      return (<p onClick={()=>history.push("/login")}>Login</p>);
    }
  }

  return (<header>
    <h1 onClick={()=>history.push("/")}>MooseBear's Smithery</h1><br/>
    <div className="large-screen">
      <div style={{float:"right"}}>{getLogin()}</div>
      <div>
        <p onClick={()=>history.push("/")}>Home</p>
        <p onClick={()=>history.push("/all")}>View All</p>
        <p onClick={()=>history.push("/prints")}>3D Prints</p>
        <p onClick={()=>history.push("/smithery")}>Metallurgy</p>
        {props.VerifyAdmin && <p onClick={()=>history.push("/dev")}>Developer</p>}
      </div>
    </div>
    <div className="small-screen">
      <div className="dropdown">
        <div className="dropbtn"><MenuIcon /></div>
        <div className="dropdown-content">
          {getLogin()}
          <p onClick={()=>history.push("/")}>Home</p>
          <p onClick={()=>history.push("/all")}>View All</p>
          <p onClick={()=>history.push("/prints")}>3D Prints</p>
          <p onClick={()=>history.push("/smithery")}>Metallurgy</p>
          {props.VerifyAdmin && <p onClick={()=>history.push("/dev")}>Developer</p>}
        </div>
      </div>
    </div>
  </header>);
}

export default Header;
