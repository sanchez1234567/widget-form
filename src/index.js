import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const widgetForm = document.querySelectorAll(".widget-form");

widgetForm.forEach((div) => {
  const root = ReactDOM.createRoot(div);
  root.render(
    <App
      url={div.dataset.url}
      button={div.dataset.button}
      jsonSchema={div.dataset.jsonSchema}
    />
  );
});
