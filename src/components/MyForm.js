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
  const [document, setDocument] = useState([]);
  const [formData, setFormData] = useState({});
  const [oSchema, setSchema] = useState({});
  const [oUiSchema, setUiSchema] = useState({});

  const docTjSchema = (templateUrl, fSchema, pSchema, cWidget) => {
    PizZipUtils.getBinaryContent(templateUrl, function (error, content) {
      if (error) {
        throw error;
      }
      let zip = new PizZip(content);
      const InspectModule = require("docxtemplater/js/inspect-module");
      const iModule = InspectModule();
      const doc = new Docxtemplater(zip, { modules: [iModule] });
      const tags = iModule.getAllTags();
      const sortTags = SortTags(tags);
      setDocument(doc);
      fSchema(sortTags, pSchema, cWidget);
    });
  };

  const makeSchema = (wTags, jTags, fWidget) => {
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
            "ui:options": jTags.uischema[key]["uiOptions"],
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
    docTjSchema(props.url, makeSchema, props.jSchema, CustomFieldWidget);
  }, [props]);

  const schema: RJSFSchema = {
    title: "Введите данные (* обязательные поля)",
    type: "object",
    properties: oSchema,
  };

  const uiSchema: UiSchema = oUiSchema;

  return (
    <div>
      {JSON.stringify(props.jSchema) === "{}" ? (
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
