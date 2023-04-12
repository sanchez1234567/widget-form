import WidgetButton from "./components/WidgetButton.js";

function App(props) {
  return (
    <div>
      {
        <WidgetButton
          url={props.url}
          button={props.button}
          jsonSchema={props.jsonSchema}
        />
      }
    </div>
  );
}

export default App;
