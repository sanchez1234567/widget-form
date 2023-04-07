import React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

export default function ErrorMessage(props) {
  return (
    <Alert severity="error" variant="outlined">
      <AlertTitle>
        <strong>Ошибка</strong>
      </AlertTitle>
      {props.msgErr}
    </Alert>
  );
}
