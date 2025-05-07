const RadioSelector = ({ checked, name, onChange }) => {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <div>
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={handleChange}
        />
    </div>
  );
}

export default RadioSelector;