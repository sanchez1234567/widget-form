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
import { TextField, Autocomplete, Button, Box } from "@mui/material";

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

    const hints = async (queryData, searchData) => {
      const response = await GetHints(queryData, searchData);
      const data = await response.json();
      const arr = await data.suggestions;
      const resultArr = await arr.map((obj) => obj.data.name);
      await setNames(resultArr);
    };

    return (
      <Autocomplete
        freeSolo
        clearIcon={null}
        options={names}
        onInputChange={(event, newInputValue) => {
          setFormData((prevState) => ({
            ...prevState,
            Имя: newInputValue,
          }));
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={"имя"}
            onChange={(e) => {
              setFormData((prevState) => ({
                ...prevState,
                Имя: e.target.value,
              }));
              hints(e.target.value, "name");
            }}
          />
        )}
      />
    );
  };

  const CustomPatronymicWidget = (props: WidgetProps) => {
    const [patrons, setPatrons] = useState([]);

    const hints = async (queryData, searchData) => {
      const response = await GetHints(queryData, searchData);
      const data = await response.json();
      const arr = await data.suggestions;
      const resultArr = await arr.map((obj) => obj.data.patronymic);
      await setPatrons(resultArr);
    };

    return (
      <Autocomplete
        freeSolo
        clearIcon={null}
        options={patrons}
        onInputChange={(event, newInputValue) => {
          setFormData((prevState) => ({
            ...prevState,
            Отчество: newInputValue,
          }));
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={"отчество"}
            onChange={(e) => {
              setFormData((prevState) => ({
                ...prevState,
                Отчество: e.target.value,
              }));
              hints(e.target.value, "patronymic");
            }}
          />
        )}
      />
    );
  };

  const CustomSurnameWidget = (props: WidgetProps) => {
    const [surnames, setSurnames] = useState([]);

    const hints = async (queryData, searchData) => {
      const response = await GetHints(queryData, searchData);
      const data = await response.json();
      const arr = await data.suggestions;
      const resultArr = await arr.map((obj) => obj.data.surname);
      await setSurnames(resultArr);
    };

    return (
      <Autocomplete
        freeSolo
        clearIcon={null}
        options={surnames}
        onInputChange={(event, newInputValue) => {
          setFormData((prevState) => ({
            ...prevState,
            Фамилия: newInputValue,
          }));
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={"фамилия"}
            onChange={(e) => {
              setFormData((prevState) => ({
                ...prevState,
                Фамилия: e.target.value,
              }));
              hints(e.target.value, "surname");
            }}
          />
        )}
      />
    );
  };

  const schema: RJSFSchema = {
    title: "Введите данные",
    type: "object",
    properties: formFields,
  };

  const uiSchema: UiSchema = {
    Имя: {
      "ui:widget": CustomNameWidget,
    },
    Отчество: {
      "ui:widget": CustomPatronymicWidget,
    },
    Фамилия: {
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
