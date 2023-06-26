import { CSSProperties, useContext } from "react";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import { GlobalContext } from "../../GlobalProvider";
import MessageParser from "../../ChatBot/MessageParser";
import ActionProvider from "../../ChatBot/ActionProvider";
import config from "../../ChatBot/config";

const ChatBot = () => {
  const { loading } = useContext(GlobalContext);
  const styleLoader: CSSProperties = {
    display: "block",
    margin: "30px auto",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "black #5d6d7e",
    borderRadius: "100%",
    border: "10px solid black",
    color: "black",
  };
  return (
    <>
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
        placeholderText="Enter here"
        cssOverride={styleLoader}
      />
    </>
  );
};

export default ChatBot;
