import React, { useCallback, useEffect, useState, useContext } from "react";
import alanBtn from "@alan-ai/alan-sdk-web";
import { GlobalContext } from "../../GlobalProvider";
import { useNavigate, useParams } from "react-router-dom";
import { logoutUser } from "../actions/authActions";

const COMMANDS = {
  Hello: "Hello",
  PlotGraphs: "Plot",
  PlotGraph: "PlotGraph",
  selectRow: "selectRow",
  selectColumn: "selectColumn",
  groupBy: "groupBy",
  filter: "filter",
  AddSheet: "AddSheet",
  AddDashboard: "AddDashboard",
  logout: "logout",
};
const AlanTalk = (props) => {
  const sheetParam = useParams().sheet;
  const [alanInstance, setAlanInstance] = useState();
  let navigate = useNavigate();
  const {
    selectedWB,
    selectedWBSheet,
    setIsOpenFilter,
    loginUsername,
    sheets,
    setSheets,
    selectedSheet,
  } = useContext(GlobalContext);
  const Hello = useCallback(() => {
    alanInstance.playText(`Hi ${loginUsername} How can I help you?

    `);
    //grettings output all int his function
  }, [alanInstance]);
  const PlotGraphs = useCallback(() => {
    alanInstance.playText("What plot do you need?");
    //this is to add multiple output when users says plot
  }, [alanInstance]);
  const PlotGraph = ({ detail: { name, quantity } }) => {
    alanInstance.playText(`Selecting plot type as  ${name}`);
    alanInstance.playText(`Apply Row and Column Values`);
    const tempSheets = sheets.map((s) =>
      s.name === sheetParam
        ? {
            ...s,
            graph: name,
          }
        : s
    );
    setSheets(tempSheets);
  };
  //   const PlotGraph = useCallback(({ detail: { name, quantity } }) => {
  //     alanInstance.playText(`Selecting plot type as  ${name}`);
  //     alanInstance.playText(`Apply Row and Column Values`);
  //     const tempSheets = sheets.map((s) =>
  //       s.name === sheetParam
  //         ? {
  //             ...s,
  //             graph: name,
  //           }
  //         : s
  //     );
  //     setSheets(tempSheets);
  //   });
  const processCsv = (jsonData) => {
    const head = jsonData[0];
    const lowercaseWords = head.map((word) => word.toLowerCase());
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
  const selectRow = ({ detail: { rowValue } }) => {
    const row = rowValue[0].toUpperCase() + rowValue.slice(1);
    const plotValue = processCsv(selectedWB[selectedWBSheet]).map(
      (record) => record[row]
    );
    const tempSheets = sheets.map((s) =>
      s.name === sheetParam
        ? { ...s, ["row"]: { key: row, values: plotValue } }
        : s
    );
    setSheets(tempSheets);
  };
  console.log(sheets);
  const selectColumn = ({ detail: { columnValue } }) => {
    const column = columnValue[0].toUpperCase() + columnValue.slice(1);
    const plotValue = processCsv(selectedWB[selectedWBSheet]).map(
      (record) => record[column]
    );
    const tempSheets = sheets.map((s) =>
      s.name === sheetParam
        ? { ...s, ["col"]: { key: column, values: plotValue } }
        : s
    );
    setSheets(tempSheets);
  };
  const groupBy = ({ detail: { groupBy } }) => {
    const group = groupBy[0].toUpperCase() + groupBy.slice(1);
    const plotValue = processCsv(selectedWB[selectedWBSheet]).map(
      (record) => record[group]
    );
    const tempSheets = sheets.map((s) =>
      s.name === sheetParam
        ? { ...s, ["groupby"]: { key: group, values: plotValue } }
        : s
    );
    setSheets(tempSheets);
  };
  const filter = useCallback(() => {
    alanInstance.playText(`Apply Filter`);
    setIsOpenFilter(true);
  }, [alanInstance]);
  const AddSheet = useCallback(() => {
    alanInstance.playText(`Adding Sheet`);
    props.handleAddSheet();
  }, [alanInstance]);
  const AddDashboard = useCallback(() => {
    alanInstance.playText(`Adding Dashboard`);
    props.handleAddDashboard();
  }, [alanInstance]);
  const AddStory = useCallback(() => {
    alanInstance.playText(`Adding Dashboard`);
    props.handleAddStory();
  }, [alanInstance]);
  const logout = useCallback(() => {
    alanInstance.playText(`Thank you`);
    logoutUser();
    navigate("/", { replace: true });
  }, [alanInstance]);

  //   ----------------------------------------------
  useEffect(() => {
    window.addEventListener(COMMANDS.Hello, Hello);
    window.addEventListener(COMMANDS.PlotGraphs, PlotGraphs);
    window.addEventListener(COMMANDS.PlotGraph, PlotGraph);
    window.addEventListener(COMMANDS.selectRow, selectRow);
    window.addEventListener(COMMANDS.selectColumn, selectColumn);
    window.addEventListener(COMMANDS.groupBy, groupBy);
    window.addEventListener(COMMANDS.filter, filter);
    window.addEventListener(COMMANDS.AddSheet, AddSheet);
    window.addEventListener(COMMANDS.AddDashboard, AddDashboard);
    window.addEventListener(COMMANDS.logout, logout);

    return () => {
      window.removeEventListener(COMMANDS.Hello, Hello);
      window.removeEventListener(COMMANDS.PlotGraphs, PlotGraphs);
      window.removeEventListener(COMMANDS.PlotGraph, PlotGraph);
      window.removeEventListener(COMMANDS.selectRow, selectRow);
      window.removeEventListener(COMMANDS.selectColumn, selectColumn);
      window.removeEventListener(COMMANDS.groupBy, groupBy);
      window.removeEventListener(COMMANDS.filter, filter);
      window.removeEventListener(COMMANDS.AddSheet, AddSheet);
      window.removeEventListener(COMMANDS.AddDashboard, AddDashboard);
      window.removeEventListener(COMMANDS.logout, logout);
    };
  }, [
    alanInstance,
    Hello,
    PlotGraphs,
    PlotGraph,
    selectRow,
    selectColumn,
    filter,
    logout,
  ]);
  useEffect(() => {
    if (alanInstance != null) return;
    setAlanInstance(
      alanBtn({
        key:
          "f470b36ffcf85fef8c0354ef0351e3392e956eca572e1d8b807a3e2338fdd0dc/stage",
        onCommand: ({ command, payload }) => {
          window.dispatchEvent(new CustomEvent(command, { detail: payload }));
        },
      })
    );
  }, []);
  return <></>;
};
export default AlanTalk;
