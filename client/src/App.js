import React, { useState } from "react";
import axios from 'axios';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Header from "./components/Header";
import Card from "./components/cards/Card";
import Transfer from "./components/pages/Transfer";//done
import Home from "./components/pages/Home";//done
import All from "./components/pages/All";//done
import Prints from "./components/pages/Prints";//done
import Smithery from "./components/pages/Smithery";//done
import Email from "./components/pages/Email";//done
import UserHome from "./components/pages/UserHome";//done -> Test Articles
import Login from "./components/pages/Login";//done - Verified 8/22
import Dev from "./components/pages/developer/Dev";

function App() {
  //stores user data
  const [userDataValue, userDataUpdate] = useState();

  //stores boolean value to determine if we should add GetArticles interval
  const [getArtcleIntervalSetValue, getArtcleIntervalSetUpdate] = useState(true);

  //stores article data
  const [articles, setArticles] = useState([]);

  //we need emailArticle so we can safely store the information grabbed from the card
  const [emailArticleValue, emailArticleUpdate] = useState();

  //tracks the validity of the admin code - should refresh once every 5 minutes.
  const [verifiedAdminValue, verifiedAdminUpdate] = useState();

  //asks server if logged in user is admin at /api/verifyAdmin
  function VerifyAdmin(props){
    if(props===undefined){
      verifiedAdminUpdate(false);
      return;
    }

    if(props.adminCode === null){
      verifiedAdminUpdate(false);
      return;
    }

    async function Verify(){
      try{
        const response = await axios.get(`/api/verifyAdmin?adminCode=${props.adminCode}`);
          verifiedAdminUpdate(response.data);
      }catch(error){
        console.log('error', error);
        verifiedAdminUpdate(false);
      }
    }
    Verify();
  }

  //sends a like update to the database when it is pressed on the card: the card tracks if the update should be sent due to overclicking
  function SendLikeUpdate(props){
    const userLikesArticle = userDataValue.likedArticles.includes(props._id);

    //we want to patch the user
    async function sendData(valueToSend){
      try{
        await axios.patch(`/api/users/${userDataValue._id}`, valueToSend);
      }catch(error){
        console.log('error', error);
      }
    }

    //if the user data and the new value are contradictory, update user
    if(props.newVal !== userLikesArticle){
      let likedArticles = userDataValue.likedArticles;

      console.log("likedArticles");
      console.log(likedArticles);

      //if the new value is to add the article, then send the updated article
      if(props.newVal){
        likedArticles.push(props._id);
      }else{
        //else, send the liked articles without the disliked article ...it should remove the article in question

        const index = likedArticles.indexOf(props._id);
        if(index > -1){
          likedArticles.splice(index, 1);
        }else{
          //oddly enough, we didn't find the article in the array
          return;
        }
      }

      userDataUpdate({...userDataValue, "likedArticles":likedArticles});
      sendData({likedArticles:likedArticles});
    }
  }

  //displays copyright at bottom of page with fixed position.
  function Footer() {
    const currentYear = new Date().getFullYear();

    return (
      <footer>
        <p>Copyright © {currentYear}</p>
      </footer>
    );
  }

  //gets the articles based on the route
  function GetArticles(route){
    if(articles === undefined){
      return null;
    }

    if(articles.length < 1){
      return null;
    }

    function GetArticlesByDisplayPage(props){
      return(<div>
        {articles.map((article)=>{
          if(article[props]){
            const likedValue = userDataValue && userDataValue.likedArticles.includes(article._id);
            return(
              <Card
                key={article._id}
                article={article}
                onLikeUpdate={SendLikeUpdate}
                likedValue={likedValue}
                loggedIn={userDataValue}
                emailArticleUpdate={emailArticleUpdate}
              />
            );
          }

          return null;
        })}
      </div>);
    }

    switch (route){
      //Homepage :: all :: print :: jewelry
      case "home":
      case "all":
      case "print":
      case "jewelry":
        return GetArticlesByDisplayPage(route);
      case "user":
        //verify user data first
        if(userDataValue===undefined){
          return;
        }

        if(userDataValue.likedArticles===undefined){
          return;
        }

        if(userDataValue.likedArticles.length<1){
          return;
        }

        return (<div>{articles.map((article)=>{
          if(userDataValue.likedArticles.includes(article._id)){
            return(
              <Card
                key={article._id}
                article={article}
                onLikeUpdate={SendLikeUpdate}
                likedValue={true}
                loggedIn={userDataValue}
                emailArticleUpdate={emailArticleUpdate}
              />
            );
          }else{
            return null;
          }
        })}</div>);
      default:
        return;
    }
  }

  //Sets an interval to grab articles once every 5 minutes
  if(getArtcleIntervalSetValue){
    //turns off state so no more intervals are set for the rest of the time this page is open.
    getArtcleIntervalSetUpdate(false);

    //grab articles
    async function loadArticles() {
      try {
        const response = await axios.get(`/api/articles`);
        const data = response.data;
        setArticles(data);
      } catch(error) {
        console.log('error', error);
      }
    }
    loadArticles();

    //set Interval for 5 minutes
    setInterval(()=>loadArticles(), 300000);
  }

  return (
    <div style={{display: "flow-root"}}>
      <Router>
        <Header
          userDataValue={userDataValue}
          VerifyAdmin={verifiedAdminValue}
        />
        <Route exact path="/">
          <Home
            articles={GetArticles("home")}
          />
        </Route>
        <Route exact path="/all">
          <All
            articles={GetArticles("all")}
          />
        </Route>
        <Route exact path="/prints">
          <Prints
            articles={GetArticles("print")}
          />
        </Route>
        <Route exact path="/smithery">
          <Smithery
            articles={GetArticles("jewelry")}
          />
        </Route>
        <Route exact path="/email">
          <Email
            userDataValue={userDataValue}
            article={emailArticleValue}
          />
        </Route>
        <Route exact path="/home">
          <UserHome
            userDataValue={userDataValue}
            articles={GetArticles("user")}
          />
        </Route>
        <Route exact path="/login">
          <Login
            VerifyAdmin={VerifyAdmin}
            userDataUpdate={userDataUpdate}
            userDataValue={userDataValue}
          />
        </Route>
        <Route exact path="/dev">
          {verifiedAdminValue && <Dev
            verifyAdmin={verifiedAdminValue}
            articles={GetArticles()}
            userDataValue={userDataValue}
          />}
          {!verifiedAdminValue && <Transfer loc={"/"} />}
        </Route>
        <Route exact path="*">
          <Transfer loc={"/"} />
        </Route>
        <Footer />
      </Router>
    </div>
  );
}

export default App;

//Discarded code

/* GetDev function removed to be ran exclusively in Dev.jsx
  //if the user is logged in and a developer then they can access dev pages
  function GetDev(props){
    console.log("add change history to Dev pages on invalid codes");
    if(userDataValue===undefined || props===undefined){
      // ChangeHistory("/");
      return;
    }

    if(userDataValue.adminCode===undefined){
      // ChangeHistory("/");
      return;
    }

    if(verifyAdmin()){
      switch (props){
        //developer home
        case "home":
          return (<Dev articles={GetArticles()}/>);
        //card edit
        case "edit":
          return (<DevEdit article={devEditArticleValue}/>);
        //card add
        case "add":
          return (<DevAdd />);
        //unexpected props
        default:
          // ChangeHistory("/");
          break;
      }

    }else{
      // ChangeHistory("/");
    }
  }*/

/* Header function removed so header can be created as a seperate component.
  //displays header with links ...changes with screen width
  function Header() {
    function getLogin(){
      if(userDataValue){
        return(<div>
          <NavLink exact className="header-username" activeClassName="active" to="/home">{userDataValue.username}</NavLink><br/>
          <NavLink exact className="header-logout" activeClassName="active" to="/login">Logout</NavLink>
        </div>);
      }else{
        return <NavLink exact className="header-link" activeClassName="active" to="/login">Login</NavLink>;
      }
    }

    function getLinks() {
      if(verifyAdmin()){
        return <div>
          <NavLink exact className="header-link" activeClassName="active" to="/">Home</NavLink>
          <NavLink exact className="header-link" activeClassName="active" to="/all">View All</NavLink>
          <NavLink exact className="header-link" activeClassName="active" to="/prints">3D Prints</NavLink>
          <NavLink exact className="header-link" activeClassName="active" to="/smithery">Smithery</NavLink>
          <NavLink exact className="header-link" activeClassName="active" to="/dev">Developer Panel</NavLink>
        </div>;
      } else {
        return <div>
          <NavLink exact className="header-link" activeClassName="active" to="/">Home</NavLink>
          <NavLink exact className="header-link" activeClassName="active" to="/all">View All</NavLink>
          <NavLink exact className="header-link" activeClassName="active" to="/prints">3D Prints</NavLink>
          <NavLink exact className="header-link" activeClassName="active" to="/smithery">Smithery</NavLink>
        </div>;
      }
    }

    return (<header>
      <NavLink exact  className="header-main" activeClassName="active" to="/">MooseBear's Smithery</NavLink><br/>
      <div className="header-large-screen">
        <div style={{float:"right"}}>{getLogin()}</div>
        {getLinks()}
      </div>
      <div className="small-screen">
        <div className="dropdown">
          <div className="dropbtn"><MenuIcon /></div>
          <div className="dropdown-content">
            {getLogin()}
            {getLinks()}
          </div>
        </div>
      </div>
    </header>);
  }*/

//Removed Switch from 'react-router-dom'

//related to piece below...found a better way.
/* return (
//   <div style={{display: "flow-root"}}>
//     <Router>
//       <Header />
//       <Main />
//       <Footer />
//     </Router>
//   </div>
);*/

//Found a better way to switch pages
  //on load of developer route, verify admin again before displaying information ...if not then return to home "/"
  /*function Main() {
    return(
      <Switch>
        <Route exact path="/" render={
          <Home
            articles={GetArticles("home")}
          />
        } />
        <Route exact path="/all" render={
          <All
            articles={GetArticles("all")}
          />
        } />
        <Route exact path="/prints" render={
          <Prints
            articles={GetArticles("print")}
          />
        } />
        <Route exact path="/smithery" render={
          <Smithery
            articles={GetArticles("jewelry")}
          />
        } />
        <Route exact path="/email" render={
          <Email
            history={history}
            userDataValue={userDataValue}
            article={emailArticleValue}
          />
        } />
        <Route exact path="/home" render={
          <UserHome
            userDataValue={userDataValue}
            articles={GetArticles("user")}
          />
        } />
        <Route exact path="/login" render={
          <Login
            userDataValue={userDataValue}
          />
        } />
        <Route exact path="/dev" render={
          GetDev("home")
        } />
        <Route exact path="/dev/edit" render={
          GetDev("edit")
        } />
        <Route exact path="/dev/add" render={
          GetDev("add")
        } />
      </Switch>
    );
  }*/
