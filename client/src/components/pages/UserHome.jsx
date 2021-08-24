import React from "react";
import {useHistory} from "react-router-dom";
import Card from "../cards/Card";

function GetArticles(props){
  if(props===undefined){
    return null;
  }

  if(props.articles===undefined){
    return null;
  }

  if(props.articles.length<1){
    return null;
  }

  return (<div>{props.articles.map((article)=>{
    if(props.userDataValue.likedArticles.includes(article._id)){
      return(
        <Card
          key={article._id}
          article={article}
          onLikeUpdate={props.SendLikeUpdate}
          likedValue={true}
          loggedIn={props.userDataValue}
          emailArticleUpdate={props.emailArticleUpdate}
        />
      );
    }else{
      return null;
    }
  })}</div>);
}

//requires userDataValue and articles liked by user
function UserHome(props){
  const history = useHistory();
  const articles = GetArticles(props);

  if(props===undefined){
    history.push("/login");
    return null;
  }

  if(props.userDataValue===undefined){
    history.push("/login");
    return null;
  }

  //year, month, day
  let date = new Date()
  try{
    date = props.userDataValue.updated.split("T")[0].split("-");
  }catch(error){
    console.log('error', error);
  }

  return(
    <div className="userHome shell">
      <h1 style={{textTransform:"capitalize"}}>{props.userDataValue.username}</h1>
      <p>Joined on {date[1]}/{date[2]}/{date[0]}</p>
      <hr/>
      <h3>Liked Articles</h3>
      <div style={{textAlign:"left"}}>
        {articles}
      </div>
    </div>
  );
}

export default UserHome;
