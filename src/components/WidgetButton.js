import { Button, Dialog, DialogContent } from "@mui/material";
import React, { useState } from "react";
import MyForm from "./MyForm.js";

export default function WidgetButton(props) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        sx={{ margin: "10px" }}
      >
        {props.button}
      </Button>
      <Dialog open={open} onClose={handleClickClose}>
        <DialogContent>
          <MyForm url={props.url} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
