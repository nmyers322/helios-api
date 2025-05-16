import styled from "styled-components";

const RadioSelectorWrapper = styled.input`
    width: 1.2rem;
    height: 1.2rem;
    min-width: 1.2rem;
    min-height: 1.2rem;
    margin-right: 0rem;
    vertical-align: middle;
    margin: 1rem;
`;

const RadioSelector = ({ checked, name, onChange }) => {
  const handleChange = (event) => {
    onChange && onChange(event.target.value);
  };

  return (
    <RadioSelectorWrapper
      type="radio"
      name={name}
      checked={checked}
      onChange={handleChange}
      />
  );
}

export default RadioSelector;