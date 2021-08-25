// import React from "react";
// import ReactDOM from "react-dom";
import ReactDOM from "./test-react/react-dom";
import "./index.css";

function FunctionComponent(props) {
  return (
    <div className="border">
      <p>{props.name}</p>
    </div>
  );
}

const jsx = (
  <div className="borders">
    <h1>1111</h1>
    <a href="https://www.baidu.com">跳转</a>
    <FunctionComponent name="函数组件" />
  </div>
);

// ReactDOM.render(jsx, document.getElementById("root"));
ReactDOM.createRoot(document.getElementById("root")).render(jsx);
