import { Button, Dialog, DialogContent } from "@mui/material";
import React, { useState, useEffect } from "react";
import MyForm from "./MyForm.js";
import { Snackbar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FetchErrJson from "../functions/FetchErrJson.js";

export default function WidgetButton(props) {
  const [jSchema, setSchema] = useState({});
  const [open, setOpen] = useState(false);
  const [openErr, setOpenErr] = useState(false);
  const [isErr, setIsErr] = useState(false);
  const [msgErr, setMsgErr] = useState("");
  const [butColor, setButColor] = useState("primary");
  const [butName, setButName] = useState("загрузка");

  const handleOpenErr = () => {
    setOpenErr(true);
  };

  const handleCloseErr = () => {
    setOpenErr(false);
  };

  const handleOpenForm = () => {
    setOpen(true);
  };

  const handleCloseForm = () => {
    setOpen(false);
  };

  const getJsonSchema = async (bName) => {
    try {
      const response = await fetch("http://localhost/formList.json");
      const result = await response.json();
      if (response.status === 200) {
        await setButName(bName);
        await setSchema(result);
      }
      if (response.status === 404) {
        throw new Error("404");
      }
    } catch (err) {
      FetchErrJson(err, setMsgErr, setIsErr, setButColor, setButName);
    }
  };

  useEffect(() => {
    getJsonSchema(props.button);
  }, [props]);

  return (
    <div>
      <Button
        variant="contained"
        color={butColor}
        onClick={isErr ? handleOpenErr : handleOpenForm}
        sx={{ margin: "10px" }}
      >
        {butName}
      </Button>
      <Snackbar
        open={openErr}
        message={msgErr}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseErr}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      ></Snackbar>
      <Dialog open={open} onClose={handleCloseForm} fullWidth={true}>
        <DialogContent>
          <MyForm url={props.url} jSchema={jSchema} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
