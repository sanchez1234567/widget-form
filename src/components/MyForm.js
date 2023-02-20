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

    const hints = (queryData, searchData) => {
      GetHints(queryData, searchData).then((res) => setNames(res));
    };

    return (
      <Autocomplete
        freeSolo
        clearIcon={null}
        options={names}
        onInputChange={(event, newInputValue) => {
          setFormData((prevState) => ({
            ...prevState,
            имя: newInputValue,
          }));
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={"имя"}
            onChange={(e) => {
              setFormData((prevState) => ({
                ...prevState,
                имя: e.target.value,
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

    const hints = (queryData, searchData) => {
      GetHints(queryData, searchData).then((res) => setPatrons(res));
    };

    return (
      <Autocomplete
        freeSolo
        clearIcon={null}
        options={patrons}
        onInputChange={(event, newInputValue) => {
          setFormData((prevState) => ({
            ...prevState,
            отчество: newInputValue,
          }));
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={"отчество"}
            onChange={(e) => {
              setFormData((prevState) => ({
                ...prevState,
                отчество: e.target.value,
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

    const hints = (queryData, searchData) => {
      GetHints(queryData, searchData).then((res) => setSurnames(res));
    };

    return (
      <Autocomplete
        freeSolo
        clearIcon={null}
        options={surnames}
        onInputChange={(event, newInputValue) => {
          setFormData((prevState) => ({
            ...prevState,
            фамилия: newInputValue,
          }));
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={"фамилия"}
            onChange={(e) => {
              setFormData((prevState) => ({
                ...prevState,
                фамилия: e.target.value,
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
