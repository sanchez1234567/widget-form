import { saveAs } from "file-saver";
import AutoFillField from "./AutoFillField.js";

export default function GenerateDocx(
  docTemplate,
  formDataObj,
  oSchemaObj,
  outputName
) {
  docTemplate.setData(AutoFillField(oSchemaObj, formDataObj));
  docTemplate.render();
  let out = docTemplate.getZip().generate({
    type: "blob",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  saveAs(out, `${outputName}.docx`);
}
