import React from "react";
import {useHistory} from "react-router-dom";

//requires userDataValue and articles liked by user
function UserHome(props){
  const history = useHistory();

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
        {props.articles}
      </div>
    </div>
  );
}

export default UserHome;
