import axios from "axios";
import React from "react";
import Cookies from "./cookies";

class ImportList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      url: props.url,
      lists: props.imports,
    };
  }

  importList = (e, list) => {
    axios
      .post(`${this.state.url}importList?user=${Cookies.getCookie("user")}`, {
        listId: list[0],
        owner: list[1].owner,
        listName:list[1].name
      })
      .then((res) => {
        this.setState({show:false})
      });
  };

  render() {
    const _default = (
      <div className="top" key="top">
        <h2>Home</h2>
        {Cookies.getCookie("user") && (
          <button
            className="importBtn"
            onClick={() => {
              console.log("import clicked");
              this.setState({ show: true });
            }}
          >
            Import List
          </button>
        )}
      </div>
    );
    if (!this.state.show) {
      return _default;
    }
    return (
      <>
        {_default}
        <div className="hiddenPanel">
          <div
            className="mask"
            onClick={() => {
              this.setState({ show: false });
            }}
          ></div>
          <div className="hiddenContainer">
            <h2>Choose List to Import</h2>
            <ul className="importHolder">
              {this.state.lists.map((list, index) => {
                return (
                  <li key={`${list[1].name}${index}`}>
                    <button
                      className="listBtn"
                      onClick={(e) => {
                        this.importList(e, list);
                      }}
                    >
                      {list[1].name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </>
    );
  }
}

export default ImportList;
