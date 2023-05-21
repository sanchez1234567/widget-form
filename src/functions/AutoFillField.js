export default function autoFillField(schemaObj, formObj) {
  let line = "___________________________";
  for (let key in schemaObj) {
    if (!formObj[key]) {
      formObj[key] = line;
    }
  }

  return formObj;
}
