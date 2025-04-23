import React, { useState } from "react";
import styled from "styled-components";
import Select from "react-select";
import theme from "../../../modules/theme";
import { useSelector } from "react-redux";
import ErrorText from "./ErrorText";
import { FormInputContainer } from "../../../styles/Form";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import HelpText from "./HelpText";
import { heliosLogger } from "../../../modules/logging";

const StyledLabel = styled.label`
  background-color: rgba(255, 255, 255, 0);
  margin-top: 1rem;
  position: absolute;
  top: 0;
  padding-top: 0.2rem;
  left: 0.5rem;
  color: ${(props) => props.theme.colors.label.text};
  transition: all 0.2s;
  font-size: 0.8rem;
  user-select: none;
  pointer-events: none;
  font-family: inherit;
  font-weight: 800;
  width: 100%;
  text-align: left;
`;

const StyledInput = styled.input`
  background-color: ${(props) => props.theme.colors.input.background};
  color: ${(props) => props.theme.colors.input.text};
  flex: 1;
  font-family: ${(props) => props.theme.fonts.base};
  font-size: 16px;
  font-weight: 800;
  width: 100%;
  text-align: left;
  border: solid 1px ${(props) => props.theme.colors.input.border};
  padding: 0.7rem 1.75rem 0.1rem 0.75rem;
  line-height: 31px;
  box-sizing: border-box;

  &:focus + ${StyledLabel} {
    top: -1rem;
    font-size: 0.8rem;
    color: ${(props) => props.theme.colors.primary};
  }

  &.label-up + ${StyledLabel} {
    top: -1rem;
    font-size: 0.8rem;
  }

  &.invalid,
  &:focus.invalid,
  &.invalid:focus,
  &:focus-visible.invalid,
  &.invalid:focus-visible {
    border: 2px solid ${(props) => props.theme.colors.input.invalid} !important;
    outline: none;
  }

  &.invalid + ${StyledLabel} {
    color: ${(props) => props.theme.colors.input.invalid};
  }
`;

const recordColor = (color = 'transparent') => ({
  alignItems: 'center',
  display: 'flex',

  ':before': {
    backgroundColor: 'transparent',
    border: '.5rem solid ' + color,
    borderRadius: '50%',
    content: '" "',
    display: 'block',
    marginRight: 8,
    height: '.3rem',
    width: '.3rem',
    boxShadow: '1px 1px 1px 1px rgba(0, 0, 0, 0.2)',
  },
});

const selectStyles = (currentTheme, showRecordColor) => ({
  control: (baseStyles, state) => ({
    ...baseStyles,
    border: `1px solid ${theme[currentTheme].colors.input.border}`,
    borderRadius: 0,
    backgroundColor: theme[currentTheme].colors.input.background,
    color: state.isDisabled ? theme[currentTheme].colors.input.disabledText : theme[currentTheme].colors.input.text,
    flex: "1",
    fontFamily: theme[currentTheme].fonts.base,
    fontSize: "16px",
    fontWeight: "800",
    width: "100%",
    textAlign: "left",
    padding: "0.4rem 0.4rem 0rem 0rem",
    minHeight: "0.7rem"
  }),
  option: (baseStyles, state) => ({
    ...baseStyles,
    fontFamily: theme[currentTheme].fonts.base,
    fontSize: "16px",
    fontWeight: "800",
    width: "100%",
    textAlign: "left",
    color: state.data.disabled 
      ? theme[currentTheme].colors.input.disabledText
      : theme[currentTheme].colors.input.text,
    cursor: state.data.disabled ? "not-allowed" : "pointer",
    backgroundColor: state.isFocused
      ? theme[currentTheme].colors.input.highlightedOption
      : theme[currentTheme].colors.input.background,
    ":active": {
      ...baseStyles[":active"],
      backgroundColor:
        !state.isSelected &&
        (state.isFocused
          ? theme[currentTheme].colors.input.highlightedOption
          : theme[currentTheme].colors.input.background),
    },
    ...(showRecordColor ? recordColor(state.data.color) : {}),
  }),
  container: (baseStyles) => ({
    ...baseStyles,
    flex: "1",
    width: "100%",
    boxSizing: "border-box"
  }),
  menu: (baseStyles) => ({
    ...baseStyles,
    backgroundColor: theme[currentTheme].colors.input.background,
  }),
  menuList: (baseStyles) => ({
    ...baseStyles,
    backgroundColor: theme[currentTheme].colors.input.background,
  }),
  placeholder: (baseStyles) => ({
    ...baseStyles,
    color: theme[currentTheme].colors.input.disabledText,
    ...(showRecordColor ? recordColor() : {}),
  }),
  singleValue: (baseStyles, state) => ({
    ...baseStyles,
    color: state.isDisabled ? theme[currentTheme].colors.input.disabledText : theme[currentTheme].colors.input.text,
    ...(showRecordColor ? recordColor(state.data.color) : {}),
  }),
});

const LabeledInput = ({
  helpText,
  id,
  isDisabled,
  isSearchable,
  min, 
  max,
  name,
  onChange,
  options,
  step = 1,
  styles = {},
  text,
  type,
  showRecordColor = false,
  validationResponse,
  value,
}) => {
  let [beenBlurred, setBeenBlurred] = useState(false);
  let [inputValue, setInputValue] = useState(value);
  const currentTheme = useSelector((state) => state.meta.currentTheme);
  const isEmpty = !value || value.length === 0;
  let inputClassNames = "";
  let labelStyles = {};
  let inputStyles = {};
  if (type === "Select" || type === "GooglePlacesAutocomplete" || !isEmpty) {
    inputClassNames += " label-up";
  }
  if (!isEmpty && validationResponse && !validationResponse.isValid) {
    inputClassNames += " invalid";
  }
  if (!!isDisabled) {
    labelStyles = {
      color: theme[currentTheme].colors.label.disabled,
    };
  }
  if (type === "Select" || type === "GooglePlacesAutocomplete") {
    labelStyles = {
      ...labelStyles,
      top: "-1rem",
    };
  } else if (!!isDisabled) {
    inputStyles.color = theme[currentTheme].colors.input.disabledText;
  }
  inputStyles = {
    ...inputStyles,
    ...styles,
  };
  return (
    <FormInputContainer>
      {(type === "text" || type === "password" || (type === "number" && !!isDisabled)) && (
        <StyledInput
          autoComplete="off"
          className={inputClassNames}
          disabled={!!isDisabled}
          id={id}
          name={name}
          onBlur={() => setBeenBlurred(true)}
          onChange={onChange}
          readOnly={!!isDisabled}
          style={inputStyles}
          title={name}
          type={type === "password" ? "password" : "text"}
          value={value}
        />
      )}
      {(type === "number" && !isDisabled) && (
        <StyledInput
          autoComplete="off"
          className={inputClassNames}
          id={id}
          min={min}
          max={max}
          name={name}
          onBlur={() => setBeenBlurred(true)}
          onChange={onChange}
          step={step}
          style={inputStyles}
          title={name}
          type={type}
          value={value}
        />
      )}
      {type === "Select" && (
        <Select
          className={inputClassNames}
          id={id}
          isDisabled={!!isDisabled}
          isSearchable={!!isSearchable}
          title={name}
          name={name}
          onChange={onChange}
          onBlur={() => setBeenBlurred(true)}
          options={options}
          styles={selectStyles(currentTheme, showRecordColor)}
          value={value}
        />
      )}
      {type === "GooglePlacesAutocomplete" && (
        <GooglePlacesAutocomplete
          apiKey={import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_KEY}
          selectProps={{
            className: inputClassNames,
            isDisabled: !!isDisabled,
            name: name,
            onBlur: () => {
              setBeenBlurred(true);
            },
            onChange: onChange,
            onInputChange: (newValue, actionMeta) => {
              heliosLogger("GooglePlacesAutocomplete", newValue, actionMeta);
              if (actionMeta.action === "input-change") {
                setInputValue(newValue);
              }
              if (actionMeta.action === "set-value") {
                setInputValue("");
              }
              if ((actionMeta.action === "input-blur" || actionMeta.action === "menu-close") && inputValue !== "") {
                onChange(inputValue);
              }
            },
            styles: selectStyles(currentTheme),
            value: { label: value, value: value },
          }}
        />
      )}
      
      <StyledLabel style={labelStyles}>
        {text}
      </StyledLabel>
      {helpText && (
        <HelpText text={helpText} />
      )}
      { (!isEmpty || beenBlurred) && validationResponse && !validationResponse.isValid && (
        <ErrorText text={`Invalid ${text}: ${validationResponse.errorMsg}`} />
      )}
    </FormInputContainer>
  );
};

export default LabeledInput;

export {
  selectStyles,
  StyledInput,
};