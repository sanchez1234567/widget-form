import { saveAs } from "file-saver";

export default function GenerateDocx(docTemplate, jsonObj) {
  docTemplate.setData(jsonObj);
  docTemplate.render();
  let out = docTemplate.getZip().generate({
    type: "blob",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  saveAs(out, "output.docx");
}
