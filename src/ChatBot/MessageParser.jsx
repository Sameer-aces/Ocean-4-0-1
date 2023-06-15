import React, { useContext } from "react";
import { GlobalContext } from "../GlobalProvider";

const MessageParser = ({ children, actions }) => {
  const { selectedWB, selectedSheet } = useContext(GlobalContext);
  const parse = (message) => {
    const lowercase = message.toLowerCase();
    if (lowercase.includes("hello")) {
      actions.handleHello();
    }
    if (lowercase.includes("plot" || "graph" || "gra")) {
      if (selectedSheet.workbooks.length != 0) {
        actions.handlePlot();
      } else {
        actions.errors();
      }
    }
    if (lowercase.includes("row")) {
      actions.handleRowValue();
    }
    if (lowercase.includes("column")) {
      actions.handleColValue();
    }
    if (lowercase.includes("exit")) {
      actions.closeBot();
    }
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
          actions: {},
        });
      })}
    </div>
  );
};

export default MessageParser;
