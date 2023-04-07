import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";

export default function LoadingForms() {
  return (
    <Typography variant="h5">
      Загрузка формы... <LinearProgress />
    </Typography>
  );
}
