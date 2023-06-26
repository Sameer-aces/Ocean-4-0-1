import { useContext } from "react";
import { createChatBotMessage } from "react-chatbot-kit";

const config = {
  initialMessages: [createChatBotMessage(`Welcome to Ocean`)],
  botName: "Ocean Bot",
  customStyles: {
    botMessageBox: {
      backgroundColor: "#376B7E",
      width: "300px",
    },
    chatButton: {
      backgroundColor: "#5ccc9d",
    },
  },
};

export default config;
