import React, { useEffect, useContext, useRef, useState } from "react";
import { FaCompress, FaAngleRight, FaForward, FaAdjust } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { GlobalContext } from "../../GlobalProvider";
import Menu from "../../Menu";
import AlanTalk from "./AlanTalk";
import "../../App.css";
const Footer = () => {
  // const { x, y, showMenu } = useRightClickMenu();
  const {
    sheets,
    setSheets,
    dashboards,
    setDashboards,
    storys,
    setStorys,
    showMenu,
    setShowMenu,
    matchedUser,
    disableComponenet,
    setDisableComponent,
  } = useContext(GlobalContext);
  const handleAddSheet = () => {
    console.log("handleAddSheet");
    const newSheet = { name: `sheet${sheets.length}`, workbooks: [], rows: [] };
    setSheets((prev) => [...prev, newSheet]);
  };

  const handleAddDashboard = () => {
    const newDashboard = {
      name: `dashboard${dashboards.length}`,
      graphs: [0, 1, 2, 3, 4, 5],
    };
    setDashboards((prev) => [...prev, newDashboard]);
  };
  const handleAddStory = (index) => {
    const newStory = {
      name: `story${storys.length}`,
      storysPlot: [],
      buttonContain: [],
    };
    setStorys((prev) => [...prev, newStory]);
  };

  const updateSheetname = (e) => {
    e.preventDefault();
    setShowMenu(true);
  };
  const handleContextMenu = (e) => {
    e.preventDefault();
    setShowMenu(true);
  };
  const handleClick = () => {
    showMenu && setShowMenu(false);
  };
  useEffect(() => {
    if (matchedUser === "Basic") {
      setDisableComponent(true);
      document.getElementById("disableFooterStory").style.pointerEvents =
        "none";
      document.getElementById("disableFooterAnalytics").style.pointerEvents =
        "none";
      document.getElementById("disableFooterStory").style.opacity = 0.1;
      document.getElementById("disableFooterAnalytics").style.opacity = 0.1;
    }
    if (matchedUser === "Standard") {
      document.getElementById("disableFooterAnalytics").style.pointerEvents =
        "none";
      document.getElementById("disableFooterAnalytics").style.opacity = 0.1;
    }
  }); //

  return (
    <>
      <hr></hr>
      <AlanTalk />
      {/* <AlanTalk
        handleAddSheet={handleAddSheet}
        handleAddDashboard={handleAddDashboard}
        handleAddStory={handleAddStory}
      /> */}
      <div className="footer">
        <button>
          <Link to="/Datasource">Data Source</Link>
        </button>

        {sheets.map((sheet, idx) => (
          <button key={idx}>
            <Link
              to={`/Sheet/${sheet.name}`}
              onContextMenu={updateSheetname}
              contextmenu="mymenu"
            >
              {sheet.name}
            </Link>
          </button>
        ))}
        <button onClick={handleAddSheet}>
          <FaAngleRight />
        </button>
        {dashboards.map(
          (dashboard, idx) => (
            console.log(dashboards),
            (
              <button key={idx}>
                <Link to={`/dashboard/${dashboard.name}`}>
                  {dashboard.name}
                </Link>
              </button>
            )
          )
        )}
        <button onClick={handleAddDashboard} disabled={disableComponenet}>
          <FaCompress id="disableFooterStory" />
        </button>
        {storys.map((story, idx) => (
          <button key={idx} disabled={disableComponenet}>
            <Link to={`/story/${story.name}`} id="disableFooterStory">
              {story.name}
            </Link>
          </button>
        ))}
        <button onClick={handleAddStory} disabled={disableComponenet}>
          <FaForward id="disableFooterStory" />
        </button>
        <button disabled={disableComponenet}>
          <Link to={"/AnalyticsMain"} id="disableFooterAnalytics">
            Analytics
          </Link>
        </button>
      </div>

      <hr></hr>
    </>
  );
};

export default Footer;
