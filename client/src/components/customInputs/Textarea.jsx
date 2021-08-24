import React, { useState } from "react";

/**
track changes by adding the onChange props - event is sent through onChange

track value is controlled with the value props
*/
export default function Textarea(props){
  const [value, update] = useState(props.value? props.value : "");
  const [textAreaWidth, textAreaWidthUpdate] = useState(30);
  const [textAreaHeight, textAreaHeightUpdate] = useState(1);
  const [contentColorVal, contentColorUp] = useState("#B4A5A5");

  const divAttributes = {};
  const labelAttributes = {};
  const textareaAttributes = {};

  let currentMargin = "25px";
  let currentZ = "-1";

  if(props.value && props.value.toString().length > 0){
    currentMargin = "0";
    currentZ="0";
  }

  const [contentMarginVal, contentMarginUp] = useState(currentMargin);
  const [zIndVal, zIndUp] = useState(currentZ);

  function handleChange(event) {
    if(event.target.name === "content"){
      let h = 0;
      event.target.value.split("\n").forEach((element) =>{
        h++;
        if(element.length>38){
          h += Math.floor(element.length/38);
        }
        if(element.length>textAreaWidth){
          textAreaWidthUpdate(Math.floor(element.length));
        }
      });
      textAreaHeightUpdate(h>5?5:h);
      contentMarginVal === "25px" && event.target.value.length > 0 && contentMarginUp("0")
      contentMarginVal === "0" && event.target.value.length < 1 && contentMarginUp("25px")
    }
    update(event.target.value);
    props.onChange(event);
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

  const divStyle={
    width:"fit-content",
    margin:"auto",
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

  const textareaStyle={
    overflowX:"hidden",
    maxWidth:"300px",
    backgroundColor:"transparent",
    borderRadius:"5px",
    scrollbarWidth:"none", /* for Firefox */
    overflowY:"scroll",
    padding:"15px",
    borderWidth:"1.4px",
    marginTop:"10px",
    outline:"none",
    color:contentColorVal,
    borderColor:contentColorVal,
    "&::webkitScrollbar":{
      display:"none"
    }
  }
  textareaAttributes["style"] = textareaStyle;
  if(props.id)textareaAttributes["id"]=props.id
  if(props.name)textareaAttributes["name"]=props.name
  textareaAttributes["value"]=value
  textareaAttributes["onChange"]=handleChange
  textareaAttributes["cols"]=props.cols?props.cols:textAreaWidth
  textareaAttributes["rows"]=props.rows?props.rows:textAreaHeight
  textareaAttributes["onFocus"]=textAreaFocus
  textareaAttributes["onBlur"]=textAreaBlur
  textareaAttributes["placeholder"]=" "

  return (
    <div {...divAttributes}>
      {props.label && <label {...labelAttributes}>{props.label}</label>}
      <textarea {...textareaAttributes}></textarea>
    </div>
  );
}
