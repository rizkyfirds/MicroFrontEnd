import React from "react";
import ReactDOM from "react-dom";
import Peta from "./Components/Peta";

import "./index.scss";

function App() {
  return (
    <div className="w-full h-full">
      <Peta />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
