import React, { useState } from "react";
import axios from 'axios';
import DeveloperCard from "../../cards/DeveloperCard";
import DevAdd from "./DevAdd";
import DevEdit from "./DevEdit";

//props userDataValue && articles
function Dev(props){
  //if 0 then view all and buttons || if 1 then add || if 2 then edit
  const [dispVal, dispUpdate] = useState(0);
  const [articles, setArticles] = useState([]);
  const [editArticle, setEditArticle] = useState();
  let dispContent = null;

  function SetHome(){
    dispUpdate(0);
  }

  function SetAdd(){
    dispUpdate(1);
  }

  function OnEdit(id){
    articles.forEach(element =>{
        if(element._id === id){
          setEditArticle(element);
          dispUpdate(2);
        }
    });
  }

  //load 0 home articles
  function GetArticles(){
    async function load() {
      try {
        const response = await axios.get(`api/articles`);
        // console.log(response);
        const data = response.data;
        // console.log(data);
        setArticles(data);
      } catch(error) {
        console.log('error', error);
      }
    }
    load();
  }
  //End 0 home articles

  //Switch statement to decide what to display
  switch(dispVal){
    case 1:
      // 1 add form
      dispContent = (
        <div>
          <h1 onClick={SetHome}>Click Here To Go To The Developer Home Page</h1><br/><hr/><br/>
          <h1>Add Form</h1>
          <DevAdd
            sendHome={SetHome}
          />
        </div>
      );
      break;
    case 2:
      // 2 edit form
      dispContent = (
        <div>
          <h1><span onClick={SetHome}>Click Here To Go To The Developer Home Page</span> || <span onClick={SetAdd}>Click Here To Add Form</span></h1><br/><hr/><br/>
          <h1>Edit Form</h1>
          <DevEdit
            key={editArticle._id}
            article={editArticle}
            sendHome={SetHome}
          />
        </div>
      );
      break;
    default:
      // 0 disp home
      GetArticles();
      dispContent = (
        <div className="developer">
          <h1 onClick={SetAdd}>Click Here To Add Form</h1><br/><hr/><br/>
          <h1>View All :: Select one to edit or click trash to delete</h1>
          {articles && <div className="developer" style={{textAlign:"left"}}>
            {articles && articles.map( (article) => {
              return(
                <DeveloperCard
                  key={article._id}
                  article={article}
                  onEdit={OnEdit}
                />
              );
            })}
          </div>}
        </div>
      );
      break;
  }
  //End switch statement to decide what to display

  return(
    <div className="developer shell">
      {dispContent}
    </div>
  );
}

export default Dev;
