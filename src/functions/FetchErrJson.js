export default function FetchErrJson(fErr, fMsg, fIsErr, fColor, fName) {
  if (fErr.includes("Failed to fetch")) {
    fMsg("Нет соединения с сервером");
    fColor("error");
    fIsErr(true);
    fName("ошибка");
  }
  if (fErr.includes("404")) {
    fMsg("Файл JSON не найден");
    fColor("error");
    fIsErr(true);
    fName("ошибка");
  } else {
    fMsg("Что-то пошло не так :(");
    fColor("error");
    fIsErr(true);
    fName("ошибка");
  }
}
