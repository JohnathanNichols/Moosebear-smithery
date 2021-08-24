import React from "react";

function All(props){
  return (<div className="websiteContent">
    <h1>Viewing the entire collection</h1>
    <br/><br/><br/>
    {props.articles}
  </div>);
}

export default All;
