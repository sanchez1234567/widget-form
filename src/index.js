import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(<App />);

const widgetForm = document.querySelectorAll(".widget-form");

widgetForm.forEach((div) => {
  const root = ReactDOM.createRoot(div);
  root.render(<App />);
});
