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
import HintOptions from "./HintOptions.js";
import { Button, Box } from "@mui/material";

export default function MyForm(props) {
  const [formFields, setFormFields] = useState({});
  const [document, setDocument] = useState([]);
  const [formData, setFormData] = useState("");

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
        tags[key] = {
          type: "string",
          title: key,
        };
      }
      setFormFields(SortTags(tags));
      setDocument(doc);
    });
  };

  useEffect(() => {
    generateJSON(props.url);
  }, [props]);

  const CustomNameWidget = (props: WidgetProps) => {
    const [names, setNames] = useState([]);

    const hints = (queryData, searchData) => {
      GetHints(queryData, searchData).then((res) => setNames(res));
    };

    return HintOptions(names, "имя", setFormData, hints, "name");
  };

  const CustomPatronymicWidget = (props: WidgetProps) => {
    const [patrons, setPatrons] = useState([]);

    const hints = (queryData, searchData) => {
      GetHints(queryData, searchData).then((res) => setPatrons(res));
    };

    return HintOptions(patrons, "отчество", setFormData, hints, "patronymic");
  };

  const CustomSurnameWidget = (props: WidgetProps) => {
    const [surnames, setSurnames] = useState([]);

    const hints = (queryData, searchData) => {
      GetHints(queryData, searchData).then((res) => setSurnames(res));
    };

    return HintOptions(surnames, "фамилия", setFormData, hints, "surname");
  };
  console.log(formData);

  const schema: RJSFSchema = {
    title: "Введите данные",
    type: "object",
    properties: formFields,
  };

  const uiSchema: UiSchema = {
    имя: {
      "ui:widget": CustomNameWidget,
    },
    отчество: {
      "ui:widget": CustomPatronymicWidget,
    },
    фамилия: {
      "ui:widget": CustomSurnameWidget,
    },
  };

  return (
    <div>
      {JSON.stringify(formFields) === "{}" ? (
        <DownloadForms />
      ) : (
        <Form
          schema={schema}
          uiSchema={uiSchema}
          onSubmit={() => GenerateDocx(document, formData)}
          validator={validator}
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
