import React from "react";
import Items from "./items";
import axios from "axios";
import imageFail from "./ImageFailSmall.png";
import Header from "./Header";
import AddItemMask from "./addItemMask";
import Cookies from "./cookies";
import categoryJson from "./category.json";
import structuredClone from '@ungap/structured-clone'

class ItemList extends React.Component {
  constructor(props) {
    super(props);
    let lists = localStorage.getItem("Lists");
    console.log(props);
    if (lists) {
      lists = JSON.parse(lists);
      this.state = {
        searchParams: new URLSearchParams(window.location.search),
        DataIsLoaded: true,
        url: props.url,
        updates: 0,
        options: categoryJson.options,
      };
      let usersListKeys = lists.usersLists.map((list) => list[0]);
      if (usersListKeys.includes(this.state.searchParams.get("list"))) {
        let currentList = lists.usersLists.filter(
          (value) => value[0] === this.state.searchParams.get("list")
        )[0][1];
        this.state.lists = currentList;
        this.state.backupLists = currentList;
      } else {
        this.state.unAuth = true;
      }
    } else {
      this.state = {
        searchParams: new URLSearchParams(window.location.search),
        DataIsLoaded: false,
        lists: {},
        backupLists: {},
        url: props.url,
        show: false,
        updates: 0,
        options: categoryJson.options,
      };
    }
  }

  componentDidMount(event) {
    if (!this.state.DataIsLoaded) {
      console.log("fetch");
      axios
        .get(
          `${this.state.url}itemList?list=${this.state.searchParams.get(
            "list"
          )}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((jsObj) => {
          console.log(jsObj.data);
          this.setState({
            lists: jsObj.data,
            backupLists: jsObj.data,
            DataIsLoaded: true,
          });
          // console.log(jsObj)
        });
    }
  }

  addItem = (show) => {
    this.setState({
      show: show,
    });
  };

  postItem = (event, form) => {
    event.preventDefault();
    let values = {
      style: {
        color: undefined,
        size: undefined,
      },
      cat: [],
    };
    form.forEach((value) => {
      console.log(value.name);
      if (value.type === "checkbox") {
        if (value.checked) {
          values.cat.push(value.name);
        }
      } else if (value.name === "color") {
        values.style.color = value.value;
      } else if (value.name === "size") {
        values.style.size = value.value;
      } else {
        values[value.name] = value.value;
      }
    });
    axios
      .post(
        `${this.state.url}addItem?user=${Cookies.getCookie(
          "user"
        )}&list=${this.state.searchParams.get("list")}`,
        values
      )
      .then((jsObj) => {
        this.setState({
          lists: jsObj.data,
          backupLists: jsObj.data,
          DataIsLoaded: true,
          show: false,
          updates: this.state.updates + 1,
        });
        this.updateCookie(jsObj.data);
      });
  };

  updateCookie = (newData) => {
    let allData = JSON.parse(localStorage.getItem("Lists"));
    let currentDataIndex = allData.usersLists.indexOf(
      allData.usersLists.find(
        (data) => data[0] === this.state.searchParams.get("list")
      )
    );
    allData.usersLists[currentDataIndex][1].data = newData.data;
    localStorage.setItem("Lists", JSON.stringify(allData));
  };

  deleteItem = (event, itemName) => {
    event.preventDefault();
    console.log("deleteItem");
    itemName = encodeURIComponent(itemName)
    axios
      .delete(
        `${this.state.url}addItem?user=${Cookies.getCookie(
          "user"
        )}&list=${this.state.searchParams.get("list")}&item=${itemName}`
      )
      .then((jsObj) => {
        console.log(jsObj);
        this.setState({
          lists: jsObj.data,
          backupLists: jsObj.data,
          DataIsLoaded: true,
          show: false,
          updates: this.state.updates + 1,
        });
        this.updateCookie(jsObj.data);
      });
  };

  redrawItems = () => {
    function removeDuplicates(set) {
      set = Array.from(new Set(set.map((s) => JSON.stringify(s))));
      set = set.map((s) => JSON.parse(s));
      return set;
    }

    this.setState({
      lists:structuredClone(this.state.lists),
      backupLists:structuredClone(this.state.backupLists)
    })

    let option = document.querySelector("#search select");
    let search = document.querySelector("#search input");
    let searchVal = search.value

    // remove all regex args
    searchVal = searchVal.replaceAll('*', '\\*')
    searchVal = searchVal.replaceAll('\\', '\\\\')
    searchVal = searchVal.replaceAll('[', '\\[')
    searchVal = searchVal.replaceAll('(', '\\(')
    searchVal = searchVal.replaceAll(')', '\\)')
    searchVal = searchVal.replaceAll('+', '\\+')
    searchVal = searchVal.replaceAll('?', '\\?')

    if (search.value !== "") {
      let filteredItems = [];

      if (option.value === "All" || option.value === "Name"){
        this.state.backupLists.data.forEach((item) => {
          let regex = new RegExp(searchVal, "gmi");
          if (item.itemName.match(regex)) {
            filteredItems.push(item);
          }
        });
      }
      if (option.value === "All" || option.value === "Category"){
        this.state.backupLists.data.forEach((item) => {
          for(let i = 0; i < item.cat.length; i ++){
            let regex = new RegExp(searchVal, "gmi");
            if (item.cat[i].match(regex)) {
              filteredItems.push(item);
              break
            }
          }
        });
      }
      if (option.value === "All" || option.value === "Color"){
        this.state.backupLists.data.forEach((item) => {
            let regex = new RegExp(searchVal, "gmi");
            if (item.style.color.match(regex)) {
              filteredItems.push(item);
          }
        });
      }
      if (option.value === "All" || option.value === "Size"){
        this.state.backupLists.data.forEach((item) => {
            let regex = new RegExp(searchVal, "gmi");
            if (item.style.size.match(regex)) {
              filteredItems.push(item);
          }
        });
      }

      let lists = this.state.lists
      lists.data = removeDuplicates(filteredItems);
      this.setState({
        lists:lists,
        updates: this.state.updates + 1,
      });
    } else {
      console.log("noSearch");
      this.setState({
        lists: this.state.backupLists,
        updates: this.state.updates + 1,
      });
    }
  };
  render() {
    if (!this.state.DataIsLoaded) {
      return (
        <>
          <Header />
          <p>Data is Loading...</p>
        </>
      );
    }
    if (this.state.unAuth) {
      return <p>You do not have access to this resource.</p>;
    }
    const image = this.state.lists.image ? this.state.lists.image : imageFail;
    return (
      <>
        <Header />
        <main className="items">
          <div className="listTop">
            <div className="imgDiv noSelect">
              <img src={image} alt="listImg" width="45" height="45" />
            </div>
            <h2>{this.state.lists.name} </h2>
            <div className="imgDiv noSelect">
              <img src={image} alt="listImg" width="45" height="45" />
            </div>
          </div>
          <div id="search">
            <select onChange={this.redrawItems}>
              <option>All</option>
              <option>Name</option>
              <option>Category</option>
              <option>Color</option>
              <option>Size</option>
            </select>
            <input
              type="text"
              placeholder="search"
              onChange={this.redrawItems}
            />
          </div>
          <Items
            deleteItem={this.deleteItem}
            data={this.state.lists.data}
            owner={this.state.lists.owner}
            key={this.state.updates}
          />
          <AddItemMask
            parentCallback={this.addItem}
            show={this.state.show}
            postItem={this.postItem}
            key={this.state.show}
            isOwner={this.state.lists.owner === Cookies.getCookie("user")}
            options={this.state.options}
          />
        </main>
      </>
    );
  }
}

export default ItemList;
