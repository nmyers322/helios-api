import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { FormInputContainerHorizontal } from "../../../styles/Form";
import ErrorText from "./ErrorText";
import theme from "../../../modules/theme";

const StyledLabel = styled.label`
  background-color: rgba(255, 255, 255, 0);
  color: ${(props) => props.theme.colors.label.text};
  font-size: 1.2rem;
  user-select: none;
  font-family: inherit;
  font-weight: 800;
  line-height: 2rem;
  width: auto;
  text-align: left;
  cursor: pointer;
`;

const StyledCheckbox = styled.input`
  background-color: ${(props) => props.theme.colors.input.background};
  color: ${(props) => props.theme.colors.input.text};
  flex: 0;
  font-family: ${(props) => props.theme.fonts.base};
  font-size: 1.25rem;
  font-weight: 800;
  margin-right: 0.5rem;
  border: solid 1px ${(props) => props.theme.colors.input.border};
  width: 2rem;
  height: 2rem;
  line-height: 2rem;
  padding: 0.25rem;
  box-sizing: border-box;
  cursor: pointer;

  &:checked {
    background-color: ${(props) => props.theme.colors.primary};
  }

  &.invalid {
    border: 2px solid ${(props) => props.theme.colors.input.invalid} !important;
    outline: none;
  }

  &.invalid + ${StyledLabel} {
    color: ${(props) => props.theme.colors.input.invalid};
  }
`;

const LabeledCheckbox = ({
  isDisabled,
  name,
  onChange,
  text,
  validationResponse,
  checked,
}) => {
  const currentTheme = useSelector((state) => state.meta.currentTheme);
  let inputClassNames = "";
  let labelStyles = {};

  if (validationResponse && !validationResponse.isValid) {
    inputClassNames += " invalid";
  }

  if (!!isDisabled) {
    labelStyles = {
      color: theme[currentTheme].colors.label.disabled,
    };
  }

  const handleClick = () => {
    if (!isDisabled) {
      onChange({ target: { name, checked: !checked } });
    }
  };

  return (
    <FormInputContainerHorizontal onClick={handleClick} style={{cursor: "pointer"}}>
      <StyledCheckbox
        type="checkbox"
        className={inputClassNames}
        title={name}
        name={name}
        onChange={onChange}
        checked={checked}
        disabled={isDisabled}
      />
      <StyledLabel style={labelStyles}>
        {text}
      </StyledLabel>
      {validationResponse && !validationResponse.isValid && (
        <ErrorText text={`Invalid ${text}: ${validationResponse.errorMsg}`} />
      )}
    </FormInputContainerHorizontal>
  );
};

export default LabeledCheckbox;