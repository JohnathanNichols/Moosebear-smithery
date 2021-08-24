import React, { useState } from "react";
import DropZone from "../../customInputs/dropzone/DropZone";
import Textarea from "../../customInputs/Textarea";
import Input from "../../customInputs/Input";
import { post } from 'axios';

function DevAdd(props) {
  const initialState = { title: '', content: '', price: "", imageResult: "", imageName: "", home: "off", all: "off", print: "off", jewelry: "off" }
  const [article, setArticle] = useState(initialState);
  const [postedValue, postedUpdate] = useState("");
  const [buttonTextValue, buttonTextUpdate] = useState("Submit");

  //textarea max characters = 38 ...if

  function handleChange(event) {
    setArticle({...article, [event.target.name]: event.target.value});
  }

  function handleSubmit() {
    buttonTextUpdate("Submitting");
    // console.log(article);
    // console.log("!article.title" + !article.title + " !article.content" + !article.content + " !article.price" + !article.price + " !article.imageResult" + !article.imageResult + " !article.imageName" + !article.imageName + " !article.home" + !article.home + " !article.all" + !article.all + " !article.print" + !article.print + " !article.jewelry" + !article.jewelry );
    if(!article.title || !article.content || !article.imageResult || !article.imageName || !article.home || !article.all || !article.print || !article.jewelry ){
      // console.log("cancel");
      buttonTextUpdate("Submit");
      return;
    }
    async function postArticle() {
      try {
        const newArticle = {
          ...article,
          "price": article.price===""?0:article.price,
          "home": article.home==="on",
          "all": article.all==="on",
          "print": article.print==="on",
          "jewelry": article.jewelry==="on"
        };
        const response = await post('/api/articles', newArticle);
        // props.history.push(`/articles/${response.data._id}`);
        const succFail = response.status===200;
        postedUpdate(succFail?"successful":"failure");
        if(succFail){
          props.sendHome();
        }
      } catch(error) {
        postedUpdate("failure");
        console.log('error', error);
        buttonTextUpdate("Submit");
      }
    }
    postArticle();
  }

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
  			<input type="checkbox" id="home" name="home" onChange={handleChange}/>
        <br/>
  			<label>Display in all</label>
  			<input type="checkbox" id="all" name="all" onChange={handleChange}/>
        <br/>
  			<label>Display in print</label>
  			<input type="checkbox" id="print" name="print" onChange={handleChange}/>
        <br/>
  			<label>Display in jewelry</label>
  			<input type="checkbox" id="jewelry" name="jewelry" onChange={handleChange}/>
        <br/>
  		</div>
      <button type="button" onClick={handleSubmit} value="Submit" className="btn btn-primary">{buttonTextValue}</button>
      <h1>{postedValue}</h1>
    </div>
  );
}

export default DevAdd;
