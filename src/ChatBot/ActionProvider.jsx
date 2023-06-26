import React, { useContext, useState } from "react";
import { createChatBotMessage } from "react-chatbot-kit";
import { GlobalContext } from "../GlobalProvider";
import { useNavigate } from "react-router-dom";
import { handleSorting } from "../components/Sheet/Sheet";
import { logoutUser, setCurrentUser } from "../components/actions/authActions";

const ActionProvider = ({
  createChatBotMessage,
  setState,
  children,
  props,
}) => {
  let navigate = useNavigate();

  const {
    loginUsername,
    setIsOpenFilter,
    setFilterValue,
    selectedSheet,
    setSelectValue,
    setIsOpen,
    sheets,
    setSheets,
    selectedWB,
    selectedWBSheet,
    columns,
    setFilterOperator,
  } = useContext(GlobalContext);
  const [x, setx] = useState();
  //   const sheetParam = useParams();
  const handleHello = () => {
    const botMessage = createChatBotMessage(
      `Hi,${loginUsername} how can I help you?`
    );

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const options = [
    {
      text: "bar",
      id: 1,
    },
    {
      text: "line",
      id: 2,
    },
    { text: "pie", id: 3 },
    { text: "donut", id: 4 },
    { text: "funnel", id: 5 },
  ];
  const selectGraph = (e) => {
    const tempSheets = sheets.map((s) =>
      s.name === "sheet"
        ? {
            ...s,
            graph: e.target.value,
          }
        : s
    );
    setSheets(tempSheets);
  };

  const handlePlot = () => {
    const botMessage = createChatBotMessage("Select type of plot");
    const botMessages = createChatBotMessage(
      options.map((x) => (
        <button
          key={options.id}
          value={x.text}
          onClick={selectGraph}
          style={{ cursor: "pointer" }}
        >
          {x.text}
        </button>
      ))
    );
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage, botMessages],
    }));
  };
  const processCsv = (jsonData) => {
    const head = jsonData[0];
    const rows = jsonData.slice(1);
    const newArray = rows.map((row) => {
      const values = row;
      const eachObject = head.reduce((obj, header, i) => {
        obj[header] = values[i];

        return obj;
      }, {});

      return eachObject;
    });
    return newArray;
  };
  const handleColValue = (event) => {
    const botMessage = createChatBotMessage("Select Col Values");

    const botMessages = createChatBotMessage(
      columns.map((x) => (
        <button
          value={x}
          onClick={giveColValue}
          style={{
            cursor: "pointer",
            border: "1px solid black",
            borderRadius: "2px",
            fontSize: "13px",
            padding: "3px",
            margin: "3px",
          }}
          id="col"
        >
          {x}
        </button>
      ))
    );

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage, botMessages],
    }));
  };
  const handleRowValue = (event) => {
    const botMessage = createChatBotMessage("Select Row Values");

    const botMessages = createChatBotMessage(
      columns.map((x) => (
        <button
          value={x}
          onClick={giveRowValue}
          style={{
            cursor: "pointer",
            border: "1px solid black",
            borderRadius: "2px",
            fontSize: "13px",
            padding: "3px",
            margin: "3px",
          }}
          id="col"
        >
          {x}
        </button>
      ))
    );

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage, botMessages],
    }));
  };
  const giveColValue = (e) => {
    const dragValue = e.target.value;
    // const field = event.currentTarget.id;
    const plotValue = processCsv(selectedWB[selectedWBSheet]).map(
      (record) => record[dragValue]
    );
    const tempSheets = sheets.map((s) =>
      s.name === "sheet"
        ? { ...s, ["col"]: { key: dragValue, values: plotValue } }
        : s
    );
    setSheets(tempSheets);
  };
  const giveRowValue = (e) => {
    const dragValue = e.target.value;
    // const field = event.currentTarget.id;
    const plotValue = processCsv(selectedWB[selectedWBSheet]).map(
      (record) => record[dragValue]
    );
    const tempSheets = sheets.map((s) =>
      s.name === "sheet"
        ? { ...s, ["row"]: { key: dragValue, values: plotValue } }
        : s
    );
    setSheets(tempSheets);
  };

  const errors = () => {
    const botMessage = createChatBotMessage("Please Upload the File");
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };
  const filter = (e) => {
    const botMessage = createChatBotMessage("Select Filter Value");
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
    setIsOpenFilter(true);
    setFilterOperator(">");
    setFilterValue(2000000);
    console.log("from chat");
    let str = selectedSheet?.row?.values.map((d) => (
      <option className="filterOptions" value={d}>
        {d}
      </option>
    ));
    setSelectValue(str);
  };
  const Conditions = () => {
    const botMessage = createChatBotMessage("Apply your conditions");
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
    setIsOpen(true);
  };
  const handleSort = () => {
    const botMessage = createChatBotMessage("Select Ascending or Descending");
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
    logoutUser();
    navigate("/", { replace: true });
  };
  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleHello,
            handlePlot,
            handleRowValue,
            handleColValue,
            filter,
            Conditions,
            handleSort,
            errors,
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;
