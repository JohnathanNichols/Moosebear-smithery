import React from 'react';
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

function Home(props) {
  const articles = GetArticles(props, "home");

  return (<div className="shell">
    <div className="home">
      <h1>Welcome to MooseBear's Smithery.<br />The home of all of my outrageous works.</h1>
      <br/>
      <img src={process.env.PUBLIC_URL + '/MooseBear.png'} alt="" />
      <h1>I hope that you enjoy your stay here. If not, then don't let the door hit you on the way out.</h1>

      <br/><hr/><br/>

      <h1>About Me</h1>
      <p>I am half man, half bear, half moose. I am a manbearmoose. I enjoy printing masks on my 3D printer and making rings with my smithing set.</p>

      <br/><br/><hr/><br/>

      <h1>Contact Me</h1>
      <p>On second thought, please don't.</p><br/>
      <div className="homeIcons">
        <a href="https://www.facebook.com/robert.parr.524"><img src="https://img.icons8.com/ios-filled/120/B4A5A5/facebook--v1.png" alt="facebook"/></a>
        <a href="https://www.instagram.com/fudginnroblems/"><img src="https://img.icons8.com/ios-glyphs/120/B4A5A5/instagram-circle.png" alt="instagram"/></a>
        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"><img src="https://img.icons8.com/ios-glyphs/120/B4A5A5/youtube-play.png" alt="youtube"/></a>
      </div>

      <br/><br/><hr/><br/><br/>

      <h1 style={{width:'75%', margin:'auto'}}>In my website, you will see many of my works and a short description of them.<br/>Here are my favorite pieces.</h1>

      <br/><br/>
    </div>
    <div className="websiteContent">
      {articles}
    </div>
  </div>);
}

export default Home;
