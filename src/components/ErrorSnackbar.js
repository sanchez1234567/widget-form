import { Snackbar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ErrorSnackbar(props) {
  return (
    <Snackbar
      open={props.openS}
      message={props.messageS}
      action={
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={props.handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    ></Snackbar>
  );
}
