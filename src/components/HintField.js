import { TextField, Autocomplete } from "@mui/material";

export default function HintField(options, label, setFunc, hintFunc) {
  return (
    <Autocomplete
      freeSolo
      clearIcon={null}
      options={options}
      onInputChange={(event, newInputValue) => {
        setFunc((prevState) => ({
          ...prevState,
          [label]: newInputValue,
        }));
      }}
      renderInput={(params) => (
        <TextField
          required
          {...params}
          label={label}
          onKeyUp={(e) => {
            hintFunc(e.target.value);
          }}
        />
      )}
    />
  );
}
