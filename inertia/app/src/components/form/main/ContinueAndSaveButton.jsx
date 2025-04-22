import React from "react";
import Button from "./Button";

const ContinueAndSaveButton = ({
  buttonText,
  disabled = false,
  onClick = () => {},
}) => {
  return <Button 
    buttonText={buttonText ? buttonText : "Save and Continue"} 
    disabled={disabled} 
    onClick={onClick} />;
};

export default ContinueAndSaveButton;
