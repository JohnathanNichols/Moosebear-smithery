import React from "react";

function Prints(props) {
  return (<div className="websiteContent">
    <h1>Viewing the 3D Printing collection</h1>
    <br/><br/><br/>
    {props.articles}
  </div>);
}

export default Prints;
