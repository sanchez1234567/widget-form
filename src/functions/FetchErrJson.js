export default function FetchErrJson(strErr, fMsg, fIsErr, fColor, fName) {
  if (String(strErr).includes("404 JSON")) {
    fMsg("JSON файл не найден");
    fColor("error");
    fIsErr(true);
    fName("ошибка");
  }
  if (String(strErr).includes("Failed to fetch")) {
    fMsg("нет соединения");
    fColor("error");
    fIsErr(true);
    fName("ошибка");
  }
}
