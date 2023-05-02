import { DialogTitle, IconButton, Typography, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function DialogHeader(props) {
  return (
    <DialogTitle>
      <Typography component="div">
        <Box
          sx={{
            fontWeight: "bold",
            textTransform: "uppercase",
            fontSize: 20,
          }}
        >
          {props.docname}
        </Box>
      </Typography>
      <IconButton
        onClick={props.closeDialog}
        sx={{ position: "absolute", right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
  );
}
