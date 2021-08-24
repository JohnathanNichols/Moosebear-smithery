import React, { useState } from "react";
import axios from 'axios';

function DeveloperCard(props){
  const [showCardValue, showCardUpdate] = useState(true);
  const article = props.article;

  function Uint8ToString(u8a){
    const newBufferObject = new Buffer(u8a);
    var CHUNK_SZ = 0x8000;
    var c = [];
    for (var i=0; i < newBufferObject.length; i+=CHUNK_SZ) {
      c.push(String.fromCharCode.apply(null, newBufferObject.subarray(i, i+CHUNK_SZ)));
    }
    return c.join("");
  }

  function SendDelete(){
    showCardUpdate(false);
    async function getUser() {
      try {
        await axios.delete(`api/articles/${article._id}`);
      } catch(error) {
        console.log('error', error);
      }
    }
    getUser();
  }

  function SendEdit(){
    props.onEdit(article._id);
  }

  function getCard(){
    if(showCardValue){
      return(<div className="card">
        <div style={{maxWidth:"300px"}}>
          <div style={{height:"100%", width:"100%"}}>
            <img src={Uint8ToString(article.imageResult)} alt={article.imageName}/>
          </div>
          <div className="card-text">
            <h2>{article.title}</h2>
            {article.price && <span>{article.currency}{article.price}</span>}
            <p>{article.content}</p>
            <img style={{position:"inherit"}} onClick={SendDelete} src="https://img.icons8.com/ios-filled/50/000000/delete--v1.png" alt="delete"/>
            <img style={{position:"inherit"}} onClick={SendEdit} src="https://img.icons8.com/material-outlined/24/000000/edit--v1.png" alt="edit"/>
          </div>
        </div>
      </div>);
    }else{
      return null;
    }
  }

  return getCard();
}

export default DeveloperCard;
