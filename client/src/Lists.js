import axios from "axios";
import React from "react";
import failImage from "./ImageFailSmall.png";
import Cookies from "./cookies";

class Lists extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lists: props.lists,
      DataIsLoaded: props.DataIsLoaded,
      url:props.url
    };
  }

  deleteList(event, itemId, owner) {
    event.preventDefault();
    axios
      .delete(
        `${this.state.url}homePage?list=${itemId}&user=${Cookies.getCookie(
          "user"
        )}&owner=${owner}`
      )
      .then((res) => {
        console.log(res);
        this.setState({
          lists: res.data.usersLists,
        });
        localStorage.setItem("Lists", JSON.stringify(res.data));
      });
  }

  render() {
    const DataIsLoaded = this.state.DataIsLoaded;
    const lists = this.state.lists;
    if (!DataIsLoaded)
      return (
        <div>
          <p>Data is Loading...</p>
        </div>
      );
    else if (DataIsLoaded && Object.keys(lists).length === 0) {
      return (
        <>
          <p>You have no lists.</p>
          {!Cookies.getCookie('user') && <p>Create an account to add your own lists</p>}
        </>
      );
    }
    return (
      <ul className="lists">
        {lists.map((list, index) => {
          const nameId = `${list[1].name}${index}`;
          return (
            <a href={`./itemListPage?list=${list[0]}`} key={list[0]}>
              <li>
                <div className="imgDiv">
                  <img
                    src={list[1].image ? list[1].image : failImage}
                    alt={`${list[1].name} Icon`}
                    width="50"
                    height="50"
                  />
                </div>
                <h3>
                  <span id={nameId}>{list[1].name} </span>
                  <span> ({list[1].data.length})</span>
                </h3>
                <button
                  className="delete"
                  onClick={(event) => {
                    this.deleteList(event, list[0], list[1].owner);
                  }}
                >
                  X
                </button>
              </li>
            </a>
          );
        })}
      </ul>
    );
  }
}

// function Lists(){
//     const [data, setData] = useState([])
//     console.log(__dirname)
//     fetch('http://localhost:5000/lists').then(res => res.json()).then(jsObj => {
//         console.log(jsObj)
//     })
//     return (
//         <p>Hello World</p>
//     );
// }

export default Lists;
