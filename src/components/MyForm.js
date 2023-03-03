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
  const [formData, setFormData] = useState("");
  const [schemeF, setSchemeF] = useState({});

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
      // for (let key in tags) {
      //   tags[key] = {
      //     type: "string",
      //     title: key,
      //   };
      // }
      setFormFields(SortTags(tags));
      setDocument(doc);
    });
  };

  const generateScheme = async (tagList) => {
    const response = await fetch("http://localhost/formList.json");
    const result = await response.json();
    for (let tag in tagList) {
      if (Object.keys(result).includes(String(tag))) {
        setSchemeF((prev) => ({
          ...prev,
          [tag]: result[tag],
        }));
      } else {
        setSchemeF((prev) => ({
          ...prev,
          [tag]: {
            type: "string",
            title: `${tag}`,
          },
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

  const CustomNameWidget = () => {
    const [names, setNames] = useState([]);

    const hints = (queryData, searchData) => {
      GetHints(queryData, searchData).then((res) => setNames(res));
    };

    return HintForm(names, "имя", setFormData, hints, "name");
  };

  const CustomPatronymicWidget = () => {
    const [patrons, setPatrons] = useState([]);

    const hints = (queryData, searchData) => {
      GetHints(queryData, searchData).then((res) => setPatrons(res));
    };

    return HintForm(patrons, "отчество", setFormData, hints, "patronymic");
  };

  const CustomSurnameWidget = () => {
    const [surnames, setSurnames] = useState([]);

    const hints = (queryData, searchData) => {
      GetHints(queryData, searchData).then((res) => setSurnames(res));
    };

    return HintForm(surnames, "фамилия", setFormData, hints, "surname");
  };

  const schema: RJSFSchema = {
    title: "Введите данные",
    type: "object",
    properties: schemeF,
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
