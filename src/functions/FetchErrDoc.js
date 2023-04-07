export default function FetchErrDoc(fErr, fMsg, fIsErr, fIsLoad) {
  if (String(fErr).includes("responseText")) {
    fMsg("Нет соединения");
    fIsErr(true);
    fIsLoad(false);
  }
  if (String(fErr).includes("Not Found")) {
    fMsg("Файл word не найден");
    fIsErr(true);
    fIsLoad(false);
  }
}
