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
import { TextField, Autocomplete } from "@mui/material";

export default function MyForm(props) {
  const [formFields, setFormFields] = useState({});
  const [document, setDocument] = useState([]);
  const [formData, setFormData] = useState(null);
  const [names, setNames] = useState([]);

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

  const getHint = async (queryData, searchData) => {
    try {
      const response = await fetch(
        "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/fio",
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            Authorization: "Token e872e6c5ccffdb498f813d862955af8f1a4fa997",
          },
          body: JSON.stringify({
            query: queryData,
            parts: [searchData.toUpperCase()],
          }),
        }
      );
      const result = await response.json();
      const arr = await result.suggestions;
      const resultArr = await arr.map((obj) => obj.data.name);
      await setNames(resultArr);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    generateJSON(props.url);
  }, [props]);

  const schema: RJSFSchema = {
    title: "Введите данные",
    type: "object",
    properties: formFields,
  };

  const uiSchema: UiSchema = {
    "ui:submitButtonOptions": {
      submitText: "Скачать",
    },
    Имя: {
      "ui:widget": (props: WidgetProps) => {
        return (
          <Autocomplete
            freeSolo
            options={names}
            renderInput={(params) => (
              <TextField
                {...params}
                label={"имя"}
                onChange={(e) => {
                  setFormData((prevState) => ({
                    ...prevState,
                    Имя: e.target.value,
                  }));
                }}
              />
            )}
          />
        );
      },
    },
    Отчество: {
      "ui:widget": (props: WidgetProps) => {
        return (
          <Autocomplete
            freeSolo
            options={names}
            renderInput={(params) => (
              <TextField
                {...params}
                label={"отчество"}
                onChange={(e) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    Отчество: e.target.value,
                  }))
                }
              />
            )}
          />
        );
      },
    },
    Фамилия: {
      "ui:widget": (props: WidgetProps) => {
        return (
          <Autocomplete
            freeSolo
            options={names}
            renderInput={(params) => (
              <TextField
                {...params}
                label={"фамилия"}
                onChange={(e) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    Фамилия: e.target.value,
                  }))
                }
              />
            )}
          />
        );
      },
    },
  };
  console.log(names);

  return (
    <div>
      {JSON.stringify(formFields) === "{}" ? (
        <DownloadForms />
      ) : (
        <Form
          schema={schema}
          uiSchema={uiSchema}
          onChange={(e) => setFormData(e.formData)}
          onSubmit={() => GenerateDocx(document, formData)}
          validator={validator}
        />
      )}
    </div>
  );
}
