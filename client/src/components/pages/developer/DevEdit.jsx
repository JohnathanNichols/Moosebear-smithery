import React, { useState } from "react";
import DropZone from "../../customInputs/dropzone/DropZone";
import Textarea from "../../customInputs/Textarea";
import Input from "../../customInputs/Input";
import { patch } from 'axios';

function Uint8ToString(u8a){
  const newBufferObject = new Buffer(u8a);
  var CHUNK_SZ = 0x8000;
  var c = [];
  for (var i=0; i < newBufferObject.length; i+=CHUNK_SZ) {
    c.push(String.fromCharCode.apply(null, newBufferObject.subarray(i, i+CHUNK_SZ)));
  }
  // console.log(c.join(""));
  return c.join("");
}

function DevEdit(props){
  const editArticle = props.article;
  // console.log("editArticle");
  // console.log(editArticle);
  const initialState = {
    title: editArticle.title,
    content: editArticle.content,
    price: editArticle.price,
    currency: editArticle.currency,
    imageResult: Uint8ToString(editArticle.imageResult),
    imageName: editArticle.imageName,
    home: editArticle.home?"on":"off",
    all: editArticle.all?"on":"off",
    print: editArticle.print?"on":"off",
    jewelry: editArticle.jewelry?"on":"off"
  }
  const [article, setArticle] = useState(initialState);
  const [postedValue, postedUpdate] = useState("");

  function handleChange(event) {
    setArticle({...article, [event.target.name]: event.target.value});
  }

  function handleSubmit() {
    // console.log(!article.title + " " + !article.content + " " + " " + !article.imageResult + " " + !article.imageName + " " + !article.home + " " + !article.all + " " + !article.print + " " + !article.jewelry );
    if(!article.title || !article.content || !article.imageResult || !article.imageName) return
    const articleToSend = {...article, "home": article.home==="on", "all": article.all==="on", "print": article.print==="on", "jewelry": article.jewelry==="on"};
    async function patchArticle() {
      try {
        const response = await patch('/api/articles/'+editArticle._id, articleToSend);
        // props.history.push(`/articles/${response.data._id}`);
        const succFail = response.status===200;
        postedUpdate(succFail?"successful":"failure");
        if(succFail){
          props.sendHome();
        }
      } catch(error) {
        console.log('error', error);
        postedUpdate("failure");
      }
    }
    patchArticle();
  }
//checkbox problem
  function changeImage(event){
    setArticle({...article, "imageResult": event.result, "imageName": event.name});
  }

  function handleKeyPress(event){
    if(event.key === "Enter"){
      handleSubmit();
    }
  }

  return (
    <div style={{textAlign:"center"}}  onKeyPress={handleKeyPress}>
      <hr/>
      <Input
        type="text"
        label="Title"
        id="title"
        name="title"
        value={article.title}
        onChange={handleChange}
      />
      <br/>
      <Textarea
        label="Content"
        id="content"
        name="content"
        value={article.content}
        onChange={handleChange}
      />
      <br/>
      <Input
        decimalPlaces="2"
        type="number"
        label="Price"
        id="price"
        name="price"
        value={article.price}
        onChange={handleChange}
        dispSymbol="$"
      />
      <br/>
			<div style={{margin:"10px", color:"#B4A5A5"}}>
        <div>
          <DropZone imageChange={changeImage} imageValue={{"name":article.imageName, "result":article.imageResult}}/>
        </div>
        {article.imageName && <p>{article.imageName}</p>}
        { article.imageResult && <><br/><img style={{maxWidth:"200px", maxHeight:"200px"}} src={article.imageResult} alt={article.imageName}/>
          <br/></>
        }
        <br/>
  			<label>Display in home</label>
  			<input type="checkbox" id="home" name="home" onChange={handleChange} defaultChecked={article.home==="on"?article.home:""}/>
        <br/>
  			<label>Display in all</label>
  			<input type="checkbox" id="all" name="all" onChange={handleChange} defaultChecked={article.all==="on"?article.all:""}/>
        <br/>
  			<label>Display in print</label>
  			<input type="checkbox" id="print" name="print" onChange={handleChange} defaultChecked={article.print==="on"?article.print:""}/>
        <br/>
  			<label>Display in jewelry</label>
  			<input type="checkbox" id="jewelry" name="jewelry" onChange={handleChange} defaultChecked={article.jewelry==="on"?article.jewelry:""}/>
        <br/>
  		</div>
      <button type="button" onClick={handleSubmit} value="Submit" className="btn btn-primary">submit</button>
      <h1>{postedValue}</h1>
    </div>
  );
}

export default DevEdit;
