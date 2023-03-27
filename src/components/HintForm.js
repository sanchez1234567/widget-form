import { TextField, Autocomplete } from "@mui/material";

export default function HintForm(options, label, setFunc, hintFunc, search) {
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
          {...params}
          label={label}
          onKeyUp={(e) => {
            hintFunc(e.target.value, search);
          }}
        />
      )}
    />
  );
}
