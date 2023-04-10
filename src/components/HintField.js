import { TextField, Autocomplete } from "@mui/material";

export default function HintField(props) {
  return (
    <Autocomplete
      freeSolo
      clearIcon={null}
      options={props.arr}
      onInputChange={(event, newInputValue) => {
        props.setFunc((prevState) => ({
          ...prevState,
          [props.label]: newInputValue,
        }));
      }}
      renderInput={(params) => (
        <TextField
          required
          {...params}
          label={props.label}
          onKeyUp={(e) => {
            props.hints(e.target.value);
          }}
        />
      )}
    />
  );
}
