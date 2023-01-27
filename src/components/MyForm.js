import { useState, useEffect } from "react";
import { RJSFSchema, UiSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/mui";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";

// const schema: RJSFSchema = {
//   title: "Test form",
//   type: "object",
//   properties: {
//     name: {
//       type: "string",
//     },
//     surname: {
//       type: "string",
//     },
//     age: {
//       type: "number",
//     },
//   },
// };

const uiSchema: UiSchema = {
  name: {
    "ui:classNames": "custom-css-class",
  },
  age: {
    "ui:classNames": "custom-css-class",
  },
};

export default function MyForm() {
  const [forms, setForms] = useState({});
  const [document, setDocument] = useState([]);
  const [formData, setFormData] = useState(null);

  const generateJSON = () => {
    PizZipUtils.getBinaryContent(
      "http://localhost/simple.docx",
      function (error, content) {
        if (error) {
          throw error;
        }
        let zip = new PizZip(content);
        const InspectModule = require("docxtemplater/js/inspect-module");
        const iModule = InspectModule();
        const doc = new Docxtemplater(zip, { modules: [iModule] });
        const tags = iModule.getAllTags();
        for (let key in tags) {
          tags[key] = { type: "string" };
        }
        setForms(tags);
        setDocument(doc);
      }
    );
  };

  useEffect(() => {
    setTimeout(() => {
      generateJSON();
    }, 4000);
  }, []);

  const schema: RJSFSchema = {
    title: "Введите данные",
    type: "object",
    properties: forms,
  };

  return (
    <div>
      {JSON.stringify(forms) === "{}" ? (
        <Typography variant="h5">
          Загрузка формы... <LinearProgress />
        </Typography>
      ) : (
        <Form
          schema={schema}
          formData={formData}
          onChange={(e) => setFormData(e.formData)}
          uiSchema={uiSchema}
          validator={validator}
        />
      )}
    </div>
  );
}
