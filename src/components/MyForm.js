import { useState, useEffect } from "react";
import { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/mui";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import GenerateDocx from "../functions/GenerateDocx.js";
import SortTags from "../functions/SortTags.js";
import DownloadForms from "./DownloadForms.js";

export default function MyForm(props) {
  const [formFields, setFormFields] = useState({});
  const [document, setDocument] = useState([]);
  const [formData, setFormData] = useState(null);

  const generateJSON = (templateUrl) => {
    PizZipUtils.getBinaryContent(templateUrl, function (error, content) {
      if (error) {
        throw error;
      }
      let zip = new PizZip(content);
      const InspectModule = require("docxtemplater/js/inspect-module");
      const iModule = InspectModule();
      const doc = new Docxtemplater(zip, { modules: [iModule] });
      const tags = iModule.getAllTags();
      for (let key in tags) {
        tags[key] = { type: "string", title: key.slice(4) };
      }
      setFormFields(SortTags(tags));
      setDocument(doc);
    });
  };

  useEffect(() => {
    generateJSON(props.url);
  }, [props]);

  const schema: RJSFSchema = {
    title: "Введите данные",
    type: "object",
    properties: formFields,
  };

  return (
    <div>
      {JSON.stringify(formFields) === "{}" ? (
        <DownloadForms />
      ) : (
        <Form
          schema={schema}
          formData={formData}
          onChange={(e) => setFormData(e.formData)}
          onSubmit={() => GenerateDocx(document, formData)}
          validator={validator}
        />
      )}
    </div>
  );
}
