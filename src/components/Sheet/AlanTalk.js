import React, {
  useCallback,
  useEffect,
  useState,
  useContext,
  useRef,
} from "react";
import alanBtn from "@alan-ai/alan-sdk-web";
import { GlobalContext } from "../../GlobalProvider";
import { useNavigate, useParams, Link } from "react-router-dom";
import { logoutUser } from "../actions/authActions";
import Filter from "./Filter";

const COMMANDS = {
  Hello: "Hello",
  PlotGraphs: "Plot",
  PlotGraph: "PlotGraph",
  selectRow: "selectRow",
  selectColumn: "selectColumn",
  groupBy: "groupBy",
  filter: "filter",
  condition: "condition",
  AddSheet: "AddSheet",
  AddDashboard: "AddDashboard",
  AddStory: "AddStory",
  navigates: "navigates",
  navigateDashboard: "navigateDashboard",
  navigatesheet: "navigatesheet",
  navigateStory: "navigateStory",
  initialDrop: "initalDrop",
  handleDropDashboard: "handleDropDashboard",
  handleAddContainer: "handleAddContainer",
  dropSheetContainer: "dropSheetContainer",
  dropDashboardContainer: "dropDashboardContainer",
  logout: "logout",
};
const AlanTalk = (props) => {
  const dragItem = useRef();
  const sheetParam = useParams().sheet;
  const dashboardParam = useParams().dashboard;
  const storyParam = useParams().story;

  const [alanInstance, setAlanInstance] = useState();
  let navigate = useNavigate();
  const {
    selectedWB,
    selectedWBSheet,
    setIsOpenFilter,
    loginUsername,
    sheets,
    setSheets,
    columns,
    selectedSheet,
    setDashboards,
    setStorys,
    storys,
    setFilterType,
    setSelectedStory,
    setSelectValue,
    dashboards,
    setIsOpen,
    selectedStory,
    selected,
    setSelected,
  } = useContext(GlobalContext);
  const Hello = useCallback(() => {
    alanInstance.playText(`Hi ${loginUsername} How can I help you?

    `);
    //grettings output all int his functionyr5u
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
    // const row = rowValue[0].toUpperCase() + rowValue.slice(1);
    const p = selectedWB[selectedWBSheet][0].map((c) => c.toLowerCase());
    const z = p.findIndex((element) => element === rowValue.toLowerCase());
    const row = columns[z];
    if (columns.includes(row)) {
      const plotValue = processCsv(selectedWB[selectedWBSheet]).map(
        (record) => record[row]
      );
      const tempSheets = sheets.map((s) =>
        s.name === sheetParam
          ? { ...s, ["row"]: { key: row, values: plotValue } }
          : s
      );
      setSheets(tempSheets);
    } else {
      alanInstance.playText(`${rowValue} does not exist`);
    }
  };
  const selectColumn = ({ detail: { columnValue } }) => {
    // const column = columnValue[0].toUpperCase() + columnValue.slice(1);
    const p = selectedWB[selectedWBSheet][0].map((c) => c.toLowerCase());
    const z = p.findIndex((element) => element === columnValue.toLowerCase());
    console.log(p, z, columnValue);
    const column = columns[z];
    console.log(column);
    if (columns.includes(column)) {
      alanInstance.playText(`Selecting column value as ${columnValue}`);
      const plotValue = processCsv(selectedWB[selectedWBSheet]).map(
        (record) => record[column]
      );
      const tempSheets = sheets.map((s) =>
        s.name === sheetParam
          ? { ...s, ["col"]: { key: column, values: plotValue } }
          : s
      );
      setSheets(tempSheets);
    } else {
      console.log(true);
      alanInstance.playText(`${columnValue} does not exist`);
    }
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
  const filter = (props) => {
    alanInstance.playText(`Apply Filter`);
    setIsOpenFilter(true);
    setFilterType("filter");
    let str = selectedSheet?.row?.values.map((d) => (
      <option className="filterOptions" value={d}>
        {d}
      </option>
    ));
    setSelectValue(str);
  };
  const condition = () => {
    setIsOpen(true);
  };
  const navigates = ({ detail: { navigateTo } }) => {
    alanInstance.playText(`${navigateTo}`);
    const options = navigateTo.toLowerCase(navigateTo);
    console.log(options);
    switch (options) {
      case "sheet":
        navigate("/sheet/sheet", { replace: "true" });
        break;
      case "data source":
        navigate("/dataSource", { replace: "true" });
        break;
      case "dashboard":
        navigate("/dashboard/dashboard", { replace: "true" });
        break;
      case "story":
        navigate("/story/story", { replace: "true" });
        break;
      case "analytics":
        navigate("/AnalyticsMain", { replace: "true" });
        break;
      default:
        console.log("break");
        break;
    }
  };
  const navigatesheet = ({ detail: { value } }) => {
    console.log(`sheet`.concat(value));
    alanInstance.playText(`sheet`.concat(value));
    navigate(`/dashboard/dashboard`.concat(value), { replace: true });
  };
  const navigateDashboard = ({ detail: { value } }) => {
    console.log(`sheet`.concat(value));
    alanInstance.playText(`Dashboard`.concat(value));
    navigate(`/dashboard/dashboard`.concat(value), { replace: true });
  };
  const navigateStory = ({ detail: { value } }) => {
    console.log(`sheet`.concat(value));
    alanInstance.playText(`Story`.concat(value));
    navigate(`/story/story`.concat(value), { replace: true });
  };
  const AddSheet = () => {
    alanInstance.playText(`Adding Sheet`);
    const newSheet = { name: `sheet${sheets.length}`, workbooks: [], rows: [] };
    setSheets((prev) => [...prev, newSheet]);
    {
      sheets.map((sheet, idx) => (
        <button key={idx}>
          <Link
            to={`/Sheet/${sheet.name}`}
            // onContextMenu={updateSheetname}
            contextmenu="mymenu"
          >
            {sheet.name}
          </Link>
        </button>
      ));
    }
  };
  const AddDashboard = () => {
    alanInstance.playText(`Adding Dashboard`);
    const newDashboard = {
      name: `dashboard${dashboards.length}`,
      graphs: [0, 1, 2, 3, 4, 5],
    };
    setDashboards((prev) => [...prev, newDashboard]);
    {
      dashboards.map(
        (dashboard, idx) => (
          console.log(dashboards),
          (
            <button key={idx}>
              <Link to={`/dashboard/${dashboard.name}`}>{dashboard.name}</Link>
            </button>
          )
        )
      );
    }
  };
  const AddStory = () => {
    alanInstance.playText(`Adding Story`);
    const newStory = {
      name: `story${storys.length}`,
      storysPlot: [],
      buttonContain: [],
    };
    setStorys((prev) => [...prev, newStory]);
    {
      dashboards.map(
        (dashboard, idx) => (
          console.log(dashboards),
          (
            <button key={idx}>
              <Link to={`/dashboard/${dashboard.name}`}>{dashboard.name}</Link>
            </button>
          )
        )
      );
    }
  };
  const initalDrop = ({ detail: { initalSheet, graphNumber } }) => {};
  const handleDropDashboard = ({ detail: { sheetName, graphNumber } }) => {
    const updatedDashboard = dashboards.find(
      (dashboard) => dashboard.name === dashboardParam
    );
    const sheet = "sheet".concat(sheetName);
    console.log(sheet);
    sheets.map((x) => {
      if (x.name === sheet) {
        alanInstance.playText("dropping sheet");
        dragItem.current = x;
        updatedDashboard.graphs[graphNumber] = x;
        const tempDashboards = dashboards.map((dashboard) =>
          dashboard.name === dashboardParam ? updatedDashboard : dashboard
        );
        setDashboards(tempDashboards);
      }
    });
  };
  const handleAddContainer = () => {
    const updatedStory = storys.find((story) => story.name === storyParam);
    console.log(updatedStory);
    updatedStory.buttonContain.push(updatedStory.buttonContain.length);
    const tempStorys = storys.map((story) =>
      story.name === storyParam ? updatedStory : story
    );
    setStorys(tempStorys);
  };

  const dropSheetContainer = ({ detail: { sheetName, containerNumber } }) => {
    const updatedStory = storys.find((story) => story.name === storyParam);
    console.log(updatedStory);
    const sheet = "sheet".concat(sheetName);
    sheets.map((x) => {
      if (x.name === sheet) {
        alanInstance.playText("dropping Sheet in story");
        dragItem.current = x;
        updatedStory.buttonContain[containerNumber] = x;
        const tempStorys = storys.map((story) =>
          story.name === storyParam ? updatedStory : story
        );
        setStorys(tempStorys);
        setSelectedStory(storys.find((s) => s.name === storyParam));
      }
    });
    setSelected(selectedStory?.buttonContain[containerNumber].name);
  };
  const dropDashboardContainer = ({
    detail: { sheetName, containerNumber },
  }) => {
    const updatedStory = storys.find((story) => story.name === storyParam);
    console.log(updatedStory);
    const sheet = "dashboard".concat(sheetName);
    dashboards.map((x) => {
      if (x.name === sheet) {
        console.log(x);
        alanInstance.playText("dropping dashboard in story");
        dragItem.current = x;
        updatedStory.buttonContain[containerNumber] = x;
        const tempStorys = storys.map((story) =>
          story.name === storyParam ? updatedStory : story
        );
        setStorys(tempStorys);
        setSelectedStory(storys.find((s) => s.name === storyParam));
      }
    });
    setSelected(selectedStory?.buttonContain[containerNumber].name);
  };
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
    window.addEventListener(COMMANDS.condition, condition);
    window.addEventListener(COMMANDS.AddSheet, AddSheet);
    window.addEventListener(COMMANDS.navigatesheet, navigatesheet);
    window.addEventListener(COMMANDS.AddDashboard, AddDashboard);
    window.addEventListener(COMMANDS.navigateDashboard, navigateDashboard);
    window.addEventListener(COMMANDS.handleDropDashboard, handleDropDashboard);
    window.addEventListener(COMMANDS.AddStory, AddStory);
    window.addEventListener(COMMANDS.navigates, navigates);
    window.addEventListener(COMMANDS.navigateStory, navigateStory);
    window.addEventListener(COMMANDS.handleAddContainer, handleAddContainer);
    window.addEventListener(COMMANDS.dropSheetContainer, dropSheetContainer);
    window.addEventListener(
      COMMANDS.dropDashboardContainer,
      dropDashboardContainer
    );

    window.addEventListener(COMMANDS.logout, logout);

    return () => {
      window.removeEventListener(COMMANDS.Hello, Hello);
      window.removeEventListener(COMMANDS.PlotGraphs, PlotGraphs);
      window.removeEventListener(COMMANDS.PlotGraph, PlotGraph);
      window.removeEventListener(COMMANDS.selectRow, selectRow);
      window.removeEventListener(COMMANDS.selectColumn, selectColumn);
      window.removeEventListener(COMMANDS.groupBy, groupBy);
      window.removeEventListener(COMMANDS.filter, filter);
      window.removeEventListener(COMMANDS.condition, condition);
      window.removeEventListener(COMMANDS.AddSheet, AddSheet);
      window.removeEventListener(COMMANDS.navigates, navigates);
      window.removeEventListener(COMMANDS.navigatesheet, navigatesheet);
      window.removeEventListener(COMMANDS.AddDashboard, AddDashboard);
      window.removeEventListener(COMMANDS.navigateDashboard, navigateDashboard);
      window.removeEventListener(
        COMMANDS.handleDropDashboard,
        handleDropDashboard
      );

      window.removeEventListener(COMMANDS.AddStory, AddStory);
      window.removeEventListener(COMMANDS.navigateStory, navigateStory);
      window.removeEventListener(
        COMMANDS.handleAddContainer,
        handleAddContainer
      );
      window.removeEventListener(
        COMMANDS.dropSheetContainer,
        dropSheetContainer
      );
      window.removeEventListener(
        COMMANDS.dropDashboardContainer,
        dropDashboardContainer
      );

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
