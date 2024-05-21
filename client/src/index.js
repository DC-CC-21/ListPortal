import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
// import App from './App';
// import Kirby from "./Kirby";
// import Header from "./Header";
import HomePage from "./HomePage";
import ItemList from "./itemList";
import AccountPage from "./AccountPage";
// import reportWebVitals from './reportWebVitals';

// displays app
// const header = ReactDOM.createRoot(document.getElementById("header"));
// header.render(
//   <React.StrictMode>
//     <Header />
//     {/* <App /> */}
//   </React.StrictMode>
// );
console.clear();

let url = "/";
if (window.location.host === "localhost:3000") {
  url = "http://localhost:5000/";
}
if (window.location.host === "192.168.0.123:3000") {
  url = "http://localhost:5000/";
}

console.log("url:", url);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage key="home" url={url} />} />
        <Route path="/index.html" element={<HomePage key="home" url={url} />} />
        <Route path="/accountPage" element={<AccountPage url={url} />} />
        <Route path="/itemListPage" element={<ItemList url={url} />} />
      </Routes>
    </BrowserRouter>
    {/* <App /> */}
    {/* <Kirby /> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
