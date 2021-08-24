import React, { useState, useEffect } from "react";
import Textarea from "../customInputs/Textarea";
import {useHistory} from "react-router-dom";
import { post } from 'axios';

function Uint8ToString(u8a){
  const newBufferObject = new Buffer(u8a);
  var CHUNK_SZ = 0x8000;
  var c = [];
  for (var i=0; i < newBufferObject.length; i+=CHUNK_SZ) {
    c.push(String.fromCharCode.apply(null, newBufferObject.subarray(i, i+CHUNK_SZ)));
  }
  return c.join("");
}

//requires history, article and userDataValue
function Email(props){
  const history = useHistory();
  const [textAreaValue, textAreaUpdate] = useState("");
  const [buttonColorState, buttonColorUpdate] = useState("#B4A5A5");
  const [errorNotificationValue, errorNotificationUpdate] = useState("");
  const [buttonTextValue, buttonTextUpdate] = useState("Send Message");

  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  if(props===undefined){
    history.push("/");
    return null;
  }

  if(props.article===undefined || props.userDataValue===undefined){
    history.push("/");
    return null;
  }

  //apply after verification
  const article = props.article;

  function sendMessage(){
    buttonTextUpdate("Sending Message");
    const date = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(Date.now());

    let generatedMessage = "On " + date.toString();

    //generated message has user data
    if(props.userDataValue){
      //we want the username, email
      generatedMessage += ", the user {username:"+props.userDataValue.username+" email:"+props.userDataValue.email+"} sent the message :: " + textAreaValue;
    }else{
      errorNotificationUpdate("Please login to send a message about this product.");
      buttonTextUpdate("Send Message");
    }

    if(textAreaValue.length < 15 || textAreaValue.length > 500){
      errorNotificationUpdate("Please enter a message of at least 15 characters and at most 500 characters.");
      buttonTextUpdate("Send Message");
      return;
    }

    generatedMessage += " about the product :: " + article.title + " " + article.currency +""+article.price+" "+article.content;

    generatedMessage = generatedMessage.replace(/\r?\n|\r/g, " ").replace(/ +(?= )/g,'');

    async function postMessage(){
      try{
        const response = await post("/api/sendEmail", {message:generatedMessage});
        const succFail = response.status===200;
        if(succFail){
          //change history
          history.push("/home");
        }else{
          errorNotificationUpdate("Unexpected error, please try again.");
          buttonTextUpdate("Send Message");
        }
      }catch(error){
        errorNotificationUpdate("Unexpected error, please try again.");
        buttonTextUpdate("Send Message");
        console.log("error", error);
      }
    }
    postMessage();
  }

  function handleMouseOut() {
    buttonColorUpdate("#B4A5A5");
  }

  function handleMouseOver() {
    buttonColorUpdate("#301B3F");
  }

  function handleChange(event){
    textAreaUpdate(event.target.value);
  }

  return (
    <div className="shell">
      <div className="SendEmailCard">
        <div style={{maxWidth:"300px"}}>
          <div style={{height:"100%", width:"100%"}}>
            <img src={Uint8ToString(article.imageResult.data)} alt={article.imageName}/>
          </div>
          <div className="card-text">
            <h2>{article.title}</h2>
            {article.price && <p style={{padding:0,margin:0}}>{article.currency}{article.price}</p>}
            <p>{article.content}</p>
          </div>
        </div>
      </div>

      <div className="SendEmailContent">
        <p>If you are interested in this item then use this form to send a message to Moosebear. Moosebear will reply to your registered email as soon as possible.</p>
        <Textarea
          label="Message"
          id="message"
          name="message"
          cols={200}
          rows={10}
          value={textAreaValue}
          onChange={handleChange}
        />
        <p style={{color:"red"}}>{errorNotificationValue}</p>
      </div>
      <button
        className="SendEmailButton"
        onClick={sendMessage}
        style={{ background: buttonColorState }}
        onMouseOut={handleMouseOut}
        onMouseOver={handleMouseOver}
      >{buttonTextValue}</button>
    </div>
  );
}

export default Email;
