import { useState, useEffect } from "react";
import { RJSFSchema, UiSchema, WidgetProps } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/mui";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import GenerateDocx from "../functions/GenerateDocx.js";
import SortTags from "../functions/SortTags.js";
import DownloadForms from "./DownloadForms.js";
import GetHints from "../functions/GetHints.js";
import HintField from "./HintField.js";
import { Button, Box } from "@mui/material";

export default function MyForm(props) {
  const [formFields, setFormFields] = useState({});
  const [document, setDocument] = useState([]);
  const [formData, setFormData] = useState({});
  const [oSchema, setSchema] = useState({});
  const [oUiSchema, setUiSchema] = useState({});

  const getTags = (templateUrl) => {
    PizZipUtils.getBinaryContent(templateUrl, function (error, content) {
      if (error) {
        throw error;
      }
      let zip = new PizZip(content);
      const InspectModule = require("docxtemplater/js/inspect-module");
      const iModule = InspectModule();
      const doc = new Docxtemplater(zip, { modules: [iModule] });
      const tags = iModule.getAllTags();
      setFormFields(SortTags(tags));
      setDocument(doc);
    });
  };

  const getScheme = async (tagList, makeFunc, widgetFunc) => {
    const response = await fetch("http://localhost/formList.json?time=1");
    const result = await response.json();
    makeFunc(tagList, result, widgetFunc);
  };

  const makeJsonSchema = (wTags, jTags, fWidget) => {
    for (let key in wTags) {
      if (jTags.schema[key]) {
        setSchema((prev) => ({
          ...prev,
          [key]: jTags.schema[key],
        }));
        setUiSchema((prev) => ({
          ...prev,
          [key]: {
            "ui:widget": fWidget,
            "ui:options": {
              label: key,
              fHint:
                'const response = fetch(\n      "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/fio",\n      {\n        method: "POST",\n        mode: "cors",\n        headers: {\n          "Content-type": "application/json",\n          Accept: "application/json",\n          Authorization: "Token e872e6c5ccffdb498f813d862955af8f1a4fa997",\n        },\n        body: JSON.stringify({ query: queryData, parts: ["NAME"] }),\n      }\n    );\n    const data = response.json();\n    const arr = data.suggestions;\n    const resultArr = arr.map((obj) => obj.data[\'name\'])',
            },
          },
        }));
      }
      if (!jTags.schema[key]) {
        setSchema((prev) => ({
          ...prev,
          [key]: { type: "string", title: key },
        }));
        setUiSchema((prev) => ({
          ...prev,
          [key]: {
            "ui:widget": fWidget,
            "ui:options": { label: key },
          },
        }));
      }
    }
  };

  const CustomFieldWidget = (props: WidgetProps) => {
    const { options } = props;
    const { label, fHint } = options;
    const [oHint, setHint] = useState({});

    const hints = (queryData) => {
      GetHints(queryData, fHint).then((aRes) =>
        setHint((prevState) => ({
          ...prevState,
          [label]: aRes,
        }))
      );
    };

    return HintField(oHint[label] || [], label, setFormData, hints);
  };

  useEffect(() => {
    getTags(props.url);
  }, [props]);

  useEffect(() => {
    getScheme(formFields, makeJsonSchema, CustomFieldWidget);
  }, [formFields]);

  const schema: RJSFSchema = {
    title: "Введите данные",
    type: "object",
    properties: oSchema,
  };

  const uiSchema: UiSchema = oUiSchema;

  return (
    <div>
      {JSON.stringify(formFields) === "{}" ? (
        <DownloadForms />
      ) : (
        <Form
          schema={schema}
          onSubmit={() => GenerateDocx(document, formData)}
          uiSchema={uiSchema}
          validator={validator}
          onChange={(e) => setFormData(e.formData)}
        >
          <Box sx={{ textAlign: "right" }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ mt: "15px" }}
            >
              Скачать
            </Button>
          </Box>
        </Form>
      )}
    </div>
  );
}
