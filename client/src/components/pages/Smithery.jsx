import React from "react";

function Smithery(props) {
  return (<div className="websiteContent">
    <h1>Viewing the smithery collection</h1>
    <br/><br/><br/>
    {props.articles}
  </div>);
}

export default Smithery;
