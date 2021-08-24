import React from "react";
import Card from "../cards/Card";

function GetArticles(props, page){
  if(props===undefined || page===undefined){
    return null;
  }

  if(props.articles===undefined){
    return null;
  }

  if(props.articles.length<1){
    return null;
  }

  return(<div>
    {props.articles.map((article)=>{
      if(article[page]){
        const likedValue = props.userDataValue && props.userDataValue.likedArticles.includes(article._id);
        return(
          <Card
            key={article._id}
            article={article}
            onLikeUpdate={props.SendLikeUpdate}
            likedValue={likedValue}
            loggedIn={props.userDataValue}
            emailArticleUpdate={props.emailArticleUpdate}
          />
        );
      }

      return null;
    })}
  </div>);
}

function Prints(props) {
  const articles = GetArticles(props, "print")

  return (<div className="websiteContent" style={{marginTop:"200px"}}>
    <h1>Viewing the 3D Printing collection</h1>
    <br/><br/><br/>
    {articles}
  </div>);
}

export default Prints;
