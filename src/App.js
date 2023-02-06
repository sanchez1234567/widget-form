import WidgetButton from "./components/WidgetButton.js";

function App(props) {
  return <div>{<WidgetButton url={props.url} />}</div>;
}

export default App;
