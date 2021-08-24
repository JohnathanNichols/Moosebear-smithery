import React, { useState } from "react";

export default function Input(props){
  const [contentColorVal, contentColorUp] = useState("#B4A5A5");
  const [passImageVal, passImageUp] = useState(<img onClick={passShowClick} style={{width:"20px", position:"absolute", right:"5px", top:"25px"}} src="https://img.icons8.com/material-outlined/24/B4A5A5/closed-eye.png" alt="closed eye"/>);
  const [focusValue, focusUpdate] = useState((props.value || props.value===0) && props.value.toString().length>0);

  const divAttributes = {};
  const labelAttributes = {};
  const inputAttributes = {};

  let preType = props.type;
  let currentMargin = (!(!props.value && props.value.toString().length < 1) || focusValue)?"0":"25px";
  let currentZ = (!(!props.value && props.value.toString().length < 1) || focusValue)?"0":"-1";

  let showPass = false;
  let startEnd = "end";
  let dispSymbol = props.dispSymbol ? props.dispSymbol : "$";
  let leftPad="5px";
  let rightPad="5px";
  const padSize=preType==="password"?"25px":"15px";

  let number = false;
  let password = false;

  if(preType === "number"){
    if(props.endOrStart){
      rightPad=padSize;
    }else{
      startEnd="start";
      leftPad=padSize;
    }

    preType = "text";
    number = true;
  }

  if(preType === "password"){
    password = true;
    rightPad=padSize;
    dispSymbol = <img onClick={passShowClick} style={{width:"20px", position:"absolute", right:"5px", top:"25px"}} src="https://img.icons8.com/material-outlined/24/B4A5A5/closed-eye.png" alt="closed eye"/>;
  }

  const [typeVal, typeUp] = useState(preType);

  function handleChange(event) {
    const eventValue = event.target.value;

    if(number){
      if(!["0","1","2","3","4","5","6","7","8","9",".",null].includes(event.nativeEvent.data)){
        return;
      }

      //number of decimals
      if((eventValue.split(".").length-1) > 1){
        return;
      }

      //length after first decimal
      if(props.decimalPlaces){
        try{
          if(eventValue.includes(".") && eventValue.substr(eventValue.indexOf(".")+1).length > parseInt(props.decimalPlaces)){
            return;
          }
        }catch(err){}
      }
    }
    props.onChange && props.onChange(event);
  }

  function textAreaFocus(){
    focusUpdate(true);
    contentColorUp("#B4A5A5");
  }

  function textAreaBlur(){
    if(!props.value || props.value.toString().length<1){
      focusUpdate(false);
    }
  }

  function textAreaOMOver(){
    currentMargin === "25px" && contentColorUp("#301B3F");
  }

  function textAreaOMOut(){
    contentColorUp("#B4A5A5");
  }

  function passShowClick(){
    showPass = !showPass;
    passImageUp(showPass?<img onClick={passShowClick} style={{width:"20px", position:"absolute", right:"5px", top:"25px"}} src="https://img.icons8.com/material-outlined/24/B4A5A5/visible--v1.png" alt="eye"/> : <img onClick={passShowClick} style={{width:"20px", position:"absolute", right:"5px", top:"25px"}} src="https://img.icons8.com/material-outlined/24/B4A5A5/closed-eye.png" alt="closed eye"/>);
    typeUp(showPass?"text":"password");
  }

  const divStyle={
    width:"fit-content",
    margin:"auto",
    position:"relative",
  };
  divAttributes["style"] = divStyle;
  divAttributes["onMouseOver"]=textAreaOMOver
  divAttributes["onMouseOut"]=textAreaOMOut

  const labelStyle={
    position: "absolute",
    marginLeft: "10px",
    backgroundColor: "#3C415C",
    paddingLeft: "3px",
    paddingRight: "3px",
    borderRadius: "10px",
    marginTop:currentMargin,
    color:contentColorVal,
    zIndex:currentZ
  };
  labelAttributes["style"] = labelStyle;

  const inputStyle={
    overflowX:"hidden",
    backgroundColor:"transparent",
    borderRadius:"5px",
    scrollbarWidth:"none", /* for Firefox */
    overflowY:"scroll",
    padding:"15px",
    paddingLeft:leftPad,
    paddingRight:rightPad,
    marginTop:"10px",
    outline:"none",
    color:contentColorVal,
    width:"200px",
    // borderColor:contentColorVal,
    border:"1.4px solid "+contentColorVal,
    "&::webkitScrollbar":{
      display:"none"
    },
  }
  inputAttributes["style"] = inputStyle;
  if(typeVal)inputAttributes["type"]=typeVal
  if(props.id)inputAttributes["id"]=props.id
  if(props.name)inputAttributes["name"]=props.name
  inputAttributes["width"]=props.width?props.width:"200px"
  inputAttributes["value"]=props.value
  inputAttributes["onChange"]=handleChange
  inputAttributes["onFocus"]=textAreaFocus
  inputAttributes["onBlur"]=textAreaBlur
  inputAttributes["placeholder"]=" "

  const innerDivStyle = {
    position:"absolute",
    marginTop:"25px",
    paddingLeft:"5px",
    paddingRight:"5px",
    width:"224px",
    textAlign:startEnd,
    zIndex:"-1"
  }

//comment out the returns and see if that fixes it ...look inbto number
  return (
    <div {...divAttributes}>
      {props.label && <label {...labelAttributes}>{props.label}</label>}
      {number && currentMargin === "0" && <div style={innerDivStyle}>{dispSymbol}</div>}
      {password && currentMargin === "0" && passImageVal}
      <input {...inputAttributes}></input>
    </div>
  );
}


/*import React, { useState } from "react";

export default function Input(props){
  const [value, update] = useState(props.value? props.value : "");
  const [contentColorVal, contentColorUp] = useState("#B4A5A5");
  const [passImageVal, passImageUp] = useState(<img onClick={passShowClick} style={{width:"20px", position:"absolute", right:"5px", top:"25px"}} src="https://img.icons8.com/material-outlined/24/ffffff/closed-eye.png" alt="closed eye"/>);

  const divAttributes = {};
  const labelAttributes = {};
  const inputAttributes = {};

  let preType = props.type;
  let currentMargin = "25px";
  let currentZ = "-1";

  let showPass = false;
  let startEnd = "end";
  let dispSymbol = props.dispSymbol ? props.dispSymbol : "$";
  let leftPad="5px";
  let rightPad="5px";
  const padSize=preType==="password"?"25px":"15px";

  let number = false;
  let password = false;

  if(preType === "number"){
    if(props.endOrStart){
      rightPad=padSize;
    }else{
      startEnd="start";
      leftPad=padSize;
    }

    preType = "text";
    number = true;
  }

  if(preType === "password"){
    password = true;
    rightPad=padSize;
    dispSymbol = <img onClick={passShowClick} style={{width:"20px", position:"absolute", right:"5px", top:"25px"}} src="https://img.icons8.com/material-outlined/24/ffffff/closed-eye.png" alt="closed eye"/>;
  }

  if(props.value && props.value.toString().length > 0){
    currentMargin = "0";
    currentZ="0";
  }

  const [zIndVal, zIndUp] = useState(currentZ);
  const [contentMarginVal, contentMarginUp] = useState(currentMargin);
  const [typeVal, typeUp] = useState(preType);

  function handleChange(event) {
    const eventValue = event.target.value;

    if(number){
      if(!["0","1","2","3","4","5","6","7","8","9",".",null].includes(event.nativeEvent.data)){
        return;
      }

      //number of decimals
      if((eventValue.split(".").length-1) > 1){
        return;
      }

      //length after first decimal
      if(props.decimalPlaces){
        try{
          if(eventValue.includes(".") && eventValue.substr(eventValue.indexOf(".")+1).length > parseInt(props.decimalPlaces)){
            return;
          }
        }catch(err){}
      }
    }

    // contentMarginVal === "25px" && eventValue.length > 0 && contentMarginUp("0");
    // contentMarginVal === "0" && eventValue.length < 1 && contentMarginUp("25px");
    update(eventValue);
    props.onChange && props.onChange(event);
  }

  function textAreaFocus(){
    contentMarginUp("0");
    contentColorUp("#B4A5A5");
    zIndUp(0);
  }

  function textAreaBlur(){
    if(contentMarginVal === "0" && value.length < 1){
      contentMarginUp("25px");
      zIndUp(-1);
    }
  }

  function textAreaOMOver(){
    contentMarginVal === "25px" && contentColorUp("#301B3F");
  }

  function textAreaOMOut(){
    contentColorUp("#B4A5A5");
  }

  function passShowClick(){
    showPass = !showPass;
    passImageUp(showPass?<img onClick={passShowClick} style={{width:"20px", position:"absolute", right:"5px", top:"25px"}} src="https://img.icons8.com/material-outlined/24/ffffff/visible--v1.png" alt="eye"/> : <img onClick={passShowClick} style={{width:"20px", position:"absolute", right:"5px", top:"25px"}} src="https://img.icons8.com/material-outlined/24/ffffff/closed-eye.png" alt="closed eye"/>);
    typeUp(showPass?"text":"password");
  }

  const divStyle={
    width:"fit-content",
    margin:"auto",
    position:"relative",
  };
  divAttributes["style"] = divStyle;
  divAttributes["onMouseOver"]=textAreaOMOver
  divAttributes["onMouseOut"]=textAreaOMOut

  const labelStyle={
    position: "absolute",
    marginLeft: "10px",
    backgroundColor: "#3C415C",
    paddingLeft: "3px",
    paddingRight: "3px",
    borderRadius: "10px",
    marginTop:contentMarginVal,
    color:contentColorVal,
    zIndex:zIndVal
  };
  labelAttributes["style"] = labelStyle;

  const inputStyle={
    overflowX:"hidden",
    backgroundColor:"transparent",
    borderRadius:"5px",
    scrollbarWidth:"none",
    overflowY:"scroll",
    padding:"15px",
    paddingLeft:leftPad,
    paddingRight:rightPad,
    marginTop:"10px",
    outline:"none",
    color:contentColorVal,
    width:"200px",
    // borderColor:contentColorVal,
    border:"1.4px solid "+contentColorVal,
    "&::webkitScrollbar":{
      display:"none"
    },
  }
  inputAttributes["style"] = inputStyle;
  if(typeVal)inputAttributes["type"]=typeVal
  if(props.id)inputAttributes["id"]=props.id
  if(props.name)inputAttributes["name"]=props.name
  inputAttributes["width"]=props.width?props.width:"200px"
  inputAttributes["value"]=value
  inputAttributes["onChange"]=handleChange
  inputAttributes["onFocus"]=textAreaFocus
  inputAttributes["onBlur"]=textAreaBlur
  inputAttributes["placeholder"]=" "

  const innerDivStyle = {
    position:"absolute",
    marginTop:"25px",
    paddingLeft:"5px",
    paddingRight:"5px",
    width:"224px",
    textAlign:startEnd,
    zIndex:"-1"
  }

//comment out the returns and see if that fixes it ...look inbto number
  return (
    <div {...divAttributes}>
      {props.label && <label {...labelAttributes}>{props.label}</label>}
      {number && contentMarginVal === "0" && <div style={innerDivStyle}>{dispSymbol}</div>}
      {password && contentMarginVal === "0" && passImageVal}
      <input {...inputAttributes}></input>
    </div>
  );
}
*/
