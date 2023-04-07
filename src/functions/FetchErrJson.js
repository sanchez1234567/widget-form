export default function FetchErrJson(fErr, fMsg, fIsErr, fColor, fName) {
  if (fErr.includes("Failed to fetch")) {
    fMsg("Нет соединения с сервером");
    fColor("error");
    fIsErr(true);
    fName("ошибка");
  } else {
    fMsg("Ошибка: " + fErr);
    fColor("error");
    fIsErr(true);
    fName("ошибка");
  }
}
