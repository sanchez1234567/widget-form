import { useState, useEffect } from "react";
import { RJSFSchema, UiSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/mui";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import GenerateDocx from "../functions/GenerateDocx.js";
import SortTags from "../functions/SortTags.js";
import DownloadForms from "./DownloadForms.js";
import GetHints from "../functions/GetHints.js";
import HintForm from "./HintForm.js";
import { Button, Box } from "@mui/material";

export default function MyForm(props) {
  const [formFields, setFormFields] = useState({});
  const [document, setDocument] = useState([]);
  const [formData, setFormData] = useState({});
  const [schemeF, setSchemeF] = useState({});

  let searchLabels = {
    имя: "name",
    фамилия: "surname",
    отчество: "patronymic",
  };

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

  const generateScheme = async (tagList) => {
    const response = await fetch("http://localhost/formList.json?time=1");
    const result = await response.json();
    for (let tag in tagList) {
      if (result.schema[tag]) {
        setSchemeF((prev) => ({
          ...prev,
          [tag]: result.schema[tag],
        }));
      }
      if (!result.schema[tag]) {
        setSchemeF((prev) => ({
          ...prev,
          [tag]: { type: "string", title: [tag] },
        }));
      }
    }
  };

  useEffect(() => {
    getTags(props.url);
  }, [props]);

  useEffect(() => {
    generateScheme(formFields);
  }, [formFields]);

  const CustomFieldWidget = ({ label }) => {
    const [oHint, setHint] = useState({});

    const hints = (queryData, searchData) => {
      GetHints(queryData, searchData).then((aRes) =>
        setHint((prevState) => ({
          ...prevState,
          [label]: aRes,
        }))
      );
    };

    return HintForm(
      oHint[label] || [],
      label,
      setFormData,
      hints,
      searchLabels[label]
    );
  };

  const schema: RJSFSchema = {
    title: "Введите данные",
    type: "object",
    properties: schemeF,
  };

  const uiSchema: UiSchema = {
    имя: {
      "ui:widget": CustomFieldWidget,
      "ui:options": "имя",
    },
    фамилия: {
      "ui:widget": CustomFieldWidget,
      "ui:options": "фамилия",
    },
    отчество: {
      "ui:widget": CustomFieldWidget,
      "ui:options": "отчество",
    },
  };

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
