import React, {useState} from "react";
import Input from "../customInputs/Input";
import {useHistory} from "react-router-dom";
import axios from 'axios';

//we need userDataValue, userDataUpdate
function Login(props){
  const [buttonColorState, buttonColorUpdate] = useState("#B4A5A5");
  const [buttonTextState, buttonTextUpdate] = useState("Login");
  const [userInfo, updateInfo] = useState({email:"",username:"",password:""});
  const [logRegValue, logRegUpdate] = useState(true);
  const [loggedInValue, loggedInUpdate] = useState(0);
  const [emailErrorValue, emailErrorUpdate] = useState(false);
  const history = useHistory();

  //Validated 8/22
  function register() {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(re.test(userInfo.email)){
      emailErrorUpdate(false);
    }else{
      emailErrorUpdate(true);
      return;
    }

    if(!userInfo.username || !userInfo.password){
      // console.log("email = "+userInfo.email+" username = "+userInfo.username+" password = "+userInfo.password);
      buttonTextUpdate("Register");
      return;
    }
    async function regUser(){
      try{
        const response = await axios.post("/api/register", userInfo);
        // console.log("reg response");
        // console.log(response);
        if(response.status===200){
          props.userDataUpdate(response.data);
          props.VerifyAdmin(response.data);
          history.push("/home");
          loggedInUpdate(1);
          buttonTextUpdate("Register");
        }else{
          loggedInUpdate(2);
          buttonTextUpdate("Register");
        }
      }catch(error){
        console.log("error", error);
      }
    }//********************************************IF Reg successful then log the user in and send them to the user page*************************************
    regUser();
  }

  //Validated 8/22
  function loginToWebsite(){//********************************************IF Reg successful then log the user in and send them to the user page*************************************
    if(!userInfo.email || !userInfo.username || !userInfo.password){
      // console.log("email = "+userInfo.email+" username = "+userInfo.username+" password = "+userInfo.password);
      buttonTextUpdate("Login");
      return;
    }
    async function logUser(){
      try{
        const response = await axios.post("/api/login", userInfo);
        if(response.status===200){
          props.userDataUpdate(response.data);
          props.VerifyAdmin(response.data);
          history.push("/home");
          loggedInUpdate(1);
          buttonTextUpdate("Login");
        }else{
          loggedInUpdate(2);
          buttonTextUpdate("Login");
        }
      }catch(error){
        loggedInUpdate(2);
        buttonTextUpdate("Login");
      }
    }
    logUser()
  }

  function handleInputChange(event){
    const {name, value} = event.target;

    updateInfo((input) => ({...input, [name]: value}));
  }

  function handleMouseOut() {
    buttonColorUpdate("#B4A5A5");
  }

  function handleMouseOver() {
    buttonColorUpdate("#301B3F");
  }

  function handleButtonClick() {
    if(logRegValue){
      buttonTextUpdate("Logging In");
      loginToWebsite();
    }else{
      buttonTextUpdate("Registering");
      register();
    }
  }

  function switchLoginReg(){
    loggedInUpdate(0);
    updateInfo({email:"",username:"",password:""});
    if(logRegValue){
      buttonTextUpdate("Register");
    }else{
      buttonTextUpdate("Login");
    }
    logRegUpdate(!logRegValue);
  }

  function logout(){
    props.userDataUpdate("");
  }

  function handleKeyPress(event){
    if(event.key === "Enter"){
      if(props.userDataValue){
        logout();
      }else{
        handleButtonClick();
      }
    }
  }

  function getContent(){
    if(props.userDataValue){
      return(
        <div className="login-form" onKeyPress={handleKeyPress}>
          <h1>Logged in as <span style={{textTransform:"capitalize"}}>{props.userDataValue.username}</span>.</h1>
          <button
            onClick={logout}
            style={{ background: buttonColorState }}
            onMouseOut={handleMouseOut}
            onMouseOver={handleMouseOver}
          >
            Logout
          </button>
        </div>
      );
    }else{
      return(<div className="login-form" onKeyPress={handleKeyPress}>
        <h1>{logRegValue? "Login" : "Register"}</h1>
        {loggedInValue>0 && <p style={{color:loggedInValue===1?"green":"red"}}>{loggedInValue===1?("Successfully "+(logRegValue?"logged in!":"registered!")):(logRegValue?"Account not found!":"Username or Email is already in use!")}</p>}
        {emailErrorValue && <p style={{color:"red"}}>Invalid Email</p>}
        <Input
          name="email"
          id="email"
          label="Email"
          value={userInfo.email}
          onChange={handleInputChange}
          type="email"
        />
        <br/>
        <Input
          name="username"
          id="username"
          label="Username"
          value={userInfo.username}
          onChange={handleInputChange}
        />
        <br/>
        <Input
          name="password"
          id="password"
          label="Password"
          value={userInfo.password}
          onChange={handleInputChange}
          type="password"
        />
        <br/>
        <button
          onClick={handleButtonClick}
          style={{ background: buttonColorState }}
          onMouseOut={handleMouseOut}
          onMouseOver={handleMouseOver}
        >
          {buttonTextState}
        </button>
        {logRegValue && <p onClick={switchLoginReg}>Don't have an account?<br/>Register here.</p>}
        {!logRegValue && <p onClick={switchLoginReg}>Already have an account?<br/>Login here.</p>}
      </div>);
    }
  }

  return(getContent());
}

export default Login;
