import React, { useState } from "react";
import {useHistory} from "react-router-dom";

//For sendEmail we now want to change history from here
function Card(props){
  const history = useHistory();
  const article = props.article;
  const [likedValue, likedUpdate] = useState(props.likedValue);
  const [lastLikedValue, lastLikedUpdate] = useState(props.likedValue);

  const [newDateNeededValue, newDateNeededUpdate] = useState(true);
  const [dateValue, dateUpdate] = useState();
  const [timeoutValue, timeoutUpdate] = useState();

  function Uint8ToString(u8a){
    const newBufferObject = new Buffer(u8a);
    var CHUNK_SZ = 0x8000;
    var c = [];
    for (var i=0; i < newBufferObject.length; i+=CHUNK_SZ) {
      c.push(String.fromCharCode.apply(null, newBufferObject.subarray(i, i+CHUNK_SZ)));
    }
    return c.join("");
  }

  function LikeClicked(){
    let oldDate = new Date().getTime();

    if(newDateNeededValue){
      newDateNeededUpdate(false);
      dateUpdate(oldDate);
    }else{
      oldDate = dateValue;
    }

    //clear old timeout
    clearTimeout(timeoutValue);

    //check if value has changed -- value has not changed, do not set timeout
    if(lastLikedValue === !likedValue){
      // console.log("same value do not set new timout");
      likedUpdate(!likedValue);
      return;
    }

    //set timeout
    timeoutUpdate(setTimeout(()=>{
      // console.log("timed out");
      lastLikedUpdate(!likedValue);
      newDateNeededUpdate(true);
      props.onLikeUpdate({newVal:!likedValue, _id:article._id});
      clearTimeout(timeoutValue);
    }, (5000-(new Date().getTime() - oldDate))));

    likedUpdate(!likedValue);
  }

  function GetLikeImage(){
    if(props.loggedIn){
      return likedValue?<img src="https://img.icons8.com/material-rounded/24/301B3F/filled-like.png" alt="Liked" onClick={LikeClicked}/>:<img src="https://img.icons8.com/material-outlined/24/301B3F/like--v1.png" alt="notLiked" onClick={LikeClicked}/>;
    }
  }

  function GetEmailLink(){
    if(props.loggedIn){
      return <p onClick={sendEmail}>Click here to message Moosebear about this product.</p>;
    }
  }


  function sendEmail(){
    //return data from article
    console.log("Card Sending Email.");
    props.emailArticleUpdate(article);
    history.push("/email");
  }

  return <div className="card">
    <div style={{maxWidth:"300px"}}>
      <div style={{height:"100%", width:"100%"}}>
        <img src={Uint8ToString(article.imageResult)} alt={article.imageName}/>
      </div>
      <div className="card-text">
        {GetLikeImage()}
        <h2>{article.title}</h2>
        {article.price!==0 && <p style={{padding:0,margin:0}}>{article.currency}{article.price}</p>}
        <p>{article.content}</p>
        {GetEmailLink()}
      </div>
    </div>
  </div>
}

export default Card;


//notLiked = <img src="https://img.icons8.com/material-outlined/24/301B3F/like--v1.png" alt="notLiked"/>
//liked = <img src="https://img.icons8.com/material-rounded/24/301B3F/filled-like.png" alt="Liked"/>
