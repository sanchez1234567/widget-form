import { Button, Dialog, DialogContent } from "@mui/material";
import React, { useState, useEffect } from "react";
import MyForm from "./MyForm.js";
import ErrorSnackbar from "./ErrorSnackbar.js";
import HandleErrJson from "../functions/HandleErrJson.js";
import DialogHeader from "./DialogHeader.js";

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

  const getJsonSchema = async (jUrl, bName) => {
    try {
      const response = await fetch(jUrl);
      if (response.ok) {
        const result = await response.json();
        await setButName(bName);
        await setSchema(result);
      } else {
        throw new Error(response.status);
      }
    } catch (err) {
      HandleErrJson(err.message, setMsgErr, setIsErr, setButColor, setButName);
    }
  };

  useEffect(() => {
    getJsonSchema(props.jsonschema, props.button);
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
      <ErrorSnackbar
        openS={openErr}
        messageS={msgErr}
        handleClose={handleCloseErr}
      />
      <Dialog open={open} onClose={handleCloseForm} fullScreen={true}>
        <DialogHeader docname={props.docname} closeDialog={handleCloseForm} />
        <DialogContent>
          <MyForm
            url={props.url}
            jSchema={jSchema}
            docname={props.docname}
            closeForm={setOpen}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
