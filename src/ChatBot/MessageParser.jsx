import React, { useContext } from "react";
import { GlobalContext } from "../GlobalProvider";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const MessageParser = ({ children, actions }) => {
  const { selectedWB, selectedSheet } = useContext(GlobalContext);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const parse = (message) => {
    console.log(transcript, message);

    const lowercase = message.toLowerCase();
    if (lowercase.includes("hello")) {
      console.log(lowercase, "test");
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
    if (lowercase.includes("filter")) {
      actions.filter();
    }
    if (lowercase.includes("condition")) {
      actions.Conditions();
    }
    if (lowercase.includes("sort")) {
      actions.handleSort();
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
