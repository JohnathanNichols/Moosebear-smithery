import {useHistory} from "react-router-dom";

function Forward(props){
  const history = useHistory();

  if(props===undefined){
    history.push("/");
  }

  if(props.loc===undefined){    
    history.push("/");
  }

  try{
    history.push(props.loc);
  }catch(err){
    history.push("/");
  }
  return null;
}

export default Forward;
