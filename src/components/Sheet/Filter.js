import React, { useContext } from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import { GlobalContext } from "../../GlobalProvider";
import "../../App.css";
import { useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

function Filter() {
  const {
    selectedSheet,
    setFilterValue,
    setFilterOperator,
    setFilterType,
    filterValue,
    filterOperator,
    filterType,
    modalIsOpenFilter,
    setIsOpenFilter,
    selectValue,
    setSelectValue,
  } = useContext(GlobalContext);
  let subtitle;
  const [x, setX] = useState();

  function openModal(e) {
    setIsOpenFilter(true);
    console.log(e.target.value);
    setFilterType(e.target.value);
    console.log("from chat");
    let str = selectedSheet?.row?.values.map((d) => (
      <option className="filterOptions" value={d}>
        {d}
      </option>
    ));
    console.log(str);
    setSelectValue(str);
  }
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "black";
    subtitle.style.fontSize = "15px";
  }

  function closeModal() {
    setIsOpenFilter(false);
  }
  function filterOperators(e) {
    console.log("operator filter");
    setFilterOperator(e.target.value);
    if (e.target.value === "select") {
      setFilterOperator(null);
      setFilterValue(null);
      setFilterType(null);
    }
  }
  const filterCheck = (e) => {
    console.log("here");
    setFilterValue(e.target.value);
  };
  console.log(filterType, filterOperator, filterValue, "filter");
  return (
    <div>
      <select onClick={openModal}>
        <option value="filter">Filters</option>
      </select>
      <Scrollbars>
        <Modal
          isOpen={modalIsOpenFilter}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
        >
          <h2 className="title">Filter Data</h2>
          <button onClick={closeModal}>X</button>
          <form>
            <label>Target:{selectedSheet?.row?.key}</label>
            <br></br>
            <label>Operator:</label>
            <select onClick={filterOperators} id="filter">
              <option value="">select</option>
              <option value="select">Null</option>
              <option value="=">=</option>
              <option value="<">{"<"}</option>
              <option value="<=">{"<="}</option>
              <option value=">">{">="}</option>
              <option value=">">{">"}</option>
            </select>
            <br></br>
            <label onClick={filterCheck}>
              Value:
              <input
                type="text"
                placeholder="enter value"
                onChange={filterCheck}
              />
              <select>{selectValue}ss</select>
            </label>
          </form>
        </Modal>
      </Scrollbars>
    </div>
  );
}
export default Filter;
