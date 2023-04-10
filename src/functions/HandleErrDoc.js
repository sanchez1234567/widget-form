export default function HandleErrDoc(fErr, fMsg, fIsErr, fIsLoad) {
  if (String(fErr).includes("responseText")) {
    fMsg("Нет соединения");
    fIsErr(true);
    fIsLoad(false);
  } else if (String(fErr).includes("Not Found")) {
    fMsg("Файл word не найден");
    fIsErr(true);
    fIsLoad(false);
  } else if (String(fErr).includes("TemplateError")) {
    fMsg("Ошибка шаблона word");
    fIsErr(true);
    fIsLoad(false);
  } else {
    fMsg("Что-то пошло не так :(");
    fIsErr(true);
    fIsLoad(false);
  }
}
