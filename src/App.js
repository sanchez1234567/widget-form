import WidgetButton from "./components/WidgetButton.js";

function App(props) {
  return (
    <div>
      {
        <WidgetButton
          url={props.url}
          button={props.button}
          jsonschema={props.jsonschema}
          docname={props.docname}
        />
      }
    </div>
  );
}

export default App;
