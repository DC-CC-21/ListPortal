import React from "react";
import Lists from "./Lists";
import axios from "axios";
import Cookies from "./cookies";
import Header from "./Header";
import ImportList from "./importList";
import RequestsMask from "./requestsMask";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: {},
      DataIsLoaded: false,
      url: props.url,
      imports: {},
      addingImage: false,
      updated: 0,
      requests:{}
    };
  }

  componentDidMount() {
    if (Cookies.getCookie("user")) {
      axios
        .get(`${this.state.url}homePage?user=${Cookies.getCookie("user")}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((jsObj) => {
          this.setState({
            lists: jsObj.data.usersLists,
            DataIsLoaded: true,
            imports: jsObj.data.imports,
            requests:jsObj.data.requests,
            updated: this.state.updated + 1,
          });
          localStorage.setItem("Lists", JSON.stringify(jsObj.data));
          console.log("HomePage fetched data from", this.state.url);
        });
    } else {
      this.setState({
        lists: {},
        DataIsLoaded: true,
        imports: {},
        updated: this.state.updated + 1,
      });
    }
  }

  addList = (event) => {
    let values = {
      image: document.getElementById("imageData").value,
      listName: document.getElementById("nList").value,
    };
    if (values.listName === "") {
      return;
    }
    event.preventDefault();

    axios
      .post(
        `${this.state.url}homePage?user=${Cookies.getCookie("user")}`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log("addList", res.data);
        this.setState({
          lists: res.data.usersLists,
          addingImage: false,
          updated: this.state.updated + 1,

        });
        localStorage.setItem("Lists", JSON.stringify(res.data));

        document.getElementById("listImg").value = "";
        document.getElementById("offsetX").value = 0.5;
        document.getElementById("offsetY").value = 0.5;
        document.getElementById("scale").value = 1;
        document.getElementById("nList").value = "";
        console.log("HomePage posted list to:", this.state.url);
      });
  };

  updateCanvas = (event) => {
    if (!event.target.files[0]) {
      return;
    }
    this.setState({ addingImage: true });

    let canvas = document.getElementById("canvas");
    this.canvas = canvas;
    let ctx = canvas.getContext("2d");
    this.ctx = ctx;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 500, 500);
    let image = new Image();
    image.src = URL.createObjectURL(event.target.files[0]);
    image.onload = () => {
      // let aspect = image.width / image.height;
      // let x = Number(document.getElementById("offsetX").value);
      // let y = Number(document.getElementById("offsetY").value);

      // if (image.width > image.height) {
      //   let h = canvas.height / aspect;
      //   ctx.drawImage(image, 0, (canvas.width - h) / y, canvas.height, h);
      // } else {
      //   let w = aspect * canvas.width;
      //   ctx.drawImage(image, (canvas.width - w) / x, 0, w, canvas.height);
      // }
      // let imageData = canvas.toDataURL("image/jpeg", 0.2);
      // console.log(imageData);
      this.image = image;
      this.setImage();
    };
  };

  setImage = () => {
    function s(e){
      e.addEventListener('input', () => e.style.setProperty('--value', e.value));
    }

    s(document.getElementById('offsetX'))
    s(document.getElementById('offsetY'))
    s(document.getElementById('scale'))

    const image = this.image;
    if (!image) {
      return;
    }
    const canvas = this.canvas;
    const ctx = this.ctx;
    const aspect = image.width / image.height;

    let x = Number(document.getElementById("offsetX").value) * canvas.width;
    let y = Number(document.getElementById("offsetY").value) * canvas.height;
    let scale = Number(document.getElementById("scale").value);

    // draw _white background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    // draw image
    if (image.width > image.height) {
      let h = canvas.height / aspect;
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.drawImage(image, -canvas.width / 2, -h / 2, canvas.width, h);
    } else {
      let w = aspect * canvas.width;
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.drawImage(image, -w / 2, -canvas.height / 2, w, canvas.height);
    }
    ctx.restore();
    let imageData = canvas.toDataURL("image/jpeg", 0.1);
    // console.log(imageData);
    document.getElementById("imageData").value = imageData;
  };

  render() {
    const { lists, DataIsLoaded } = this.state;
    console.log(DataIsLoaded);
    let canvasSize = 100;


    return (
      <>
        <Header />
        <main className="home">
          <ImportList
            url={this.state.url}
            imports={this.state.imports}
            key={this.state.updated}
          />
          <RequestsMask 
            url={this.state.url}
            requests={this.state.requests}
            key={this.state.updated+1}
          />
          {Cookies.getCookie("user") && (
            <form className="addList">
              <input name="imageData" id="imageData" type="hidden"></input>
              <label>
                Image:{" "}
                <input
                  type="file"
                  name="listImg"
                  id="listImg"
                  onChange={this.updateCanvas}
                  accept="image/jpg, image/jpeg, image/png"
                />
              </label>

              <div
                id="listImageSettings"
                className={this.state.addingImage ? "" : "hide"}
              >
                <label>
                  Offset X:
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    defaultValue="0.5"
                    onChange={this.setImage}
                    id="offsetX"
                    className='styled-slider slider-progress'
                  />
                </label>
                <label>
                  Offset Y:
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    defaultValue="0.5"
                    onChange={this.setImage}
                    id="offsetY"
                    className='styled-slider slider-progress'
                  />
                </label>
                <label>
                  Scale:
                  <input
                    type="range"
                    min="0.1"
                    max="2"
                    step="0.1"
                    defaultValue="1"
                    onChange={this.setImage}
                    id="scale"
                    className='styled-slider slider-progress'
                  />
                </label>
                <canvas
                  width={canvasSize}
                  height={canvasSize}
                  id="canvas"
                ></canvas>
              </div>

              <label className="wrap">
                List Name:{" "}
                <input
                  type="text"
                  name="nList"
                  id="nList"
                  required
                  maxLength={14}
                />
              </label>
              {
                document.querySelectorAll('input[type="range"].slider-progress').forEach(e => {
                  e.style.setProperty('--value', e.value);
                  e.style.setProperty('--min', e.min === '' ? '0' : e.min);
                  e.style.setProperty('--max', e.max === '' ? '100' : e.max);
                })
              }
              <button
                className="createItem"
                type="submit"
                onClick={this.addList}
              >
                Add List
              </button>
            </form>
          )}
          <Lists
            lists={lists}
            DataIsLoaded={DataIsLoaded}
            key={this.state.updated+2}
            url={this.state.url}
          />
        </main>
      </>
    );
  }
}

export default HomePage;
