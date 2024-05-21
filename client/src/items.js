import React from "react";
import Cookies from "./cookies";

class Items extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      user: Cookies.getCookie("user"),
      owner: props.owner,
      delete:props.deleteItem
    };
  }

  render() {
    function toTitleCase(str) {
      return str.replace(
        /\w\S*/g,
        function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
      );
    }

    let button = "";
    console.log(this.state.user, this.state.owner);
    return (
      <ul className="lists itemList">
        {this.state.data.map((value, index) => {
          if (this.state.user === this.state.owner || this.state.user === "BigNose") {
            button = <button className="delete noSelect" onClick={(event) => {this.state.delete(event, value.itemName)}}>X</button>;
          }
          // console.log(value);

          let size = value.style.size ? <li>{toTitleCase(value.style.size)}</li> : "";
          let color = value.style.color ? <li>{toTitleCase(value.style.color)}</li> : "";

          return (
            <a href={value.url} key={index}>
              <li>
                <h3>{value.itemName}</h3>
                {button}
                <ul className="singleCol">
                  <h4>Style</h4>
                  {size ? <p>{size}</p> : <p>None</p>}
                  {color ? <p>{color}</p> : <p>None</p>}
                </ul>
                <ul className="singleCol">
                  <h4>Category</h4>
                  {value.cat.map((cat) => {
                    return <li key={`${index}${cat}`}>{toTitleCase(cat)}</li>;
                  })}
                </ul>
              </li>
            </a>
          );
        })}
      </ul>
    );
  }
}
export default Items;
