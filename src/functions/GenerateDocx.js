import { saveAs } from "file-saver";
import AutoFillField from "./AutoFillField.js";

export default function GenerateDocx(
  docTemplate,
  formDataObj,
  oSchemaObj,
  outputName,
  closeForm
) {
  docTemplate.setData(AutoFillField(oSchemaObj, formDataObj));
  docTemplate.render();
  let out = docTemplate.getZip().generate({
    type: "blob",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  closeForm(false);
  saveAs(out, `${outputName}.docx`);
}
