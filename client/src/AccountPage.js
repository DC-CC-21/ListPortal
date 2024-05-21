import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "./cookies";
import Header from "./Header";

class AccountPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchParams: new URLSearchParams(window.location.search),
      invalid: false,
      url:props.url
    };
    this.navigate = props.navigate;
  }

  post = (event, navigate) => {
    event.preventDefault();
    console.log("post");
    const values = {
      username: document.getElementById("username").value,
      pword: document.getElementById("pword").value,
    };

    if (this.state.searchParams.get("type") === "create") {
      this.create(values, navigate);
    } else {
      this.login(values, navigate);
    }
  }

  create = (values, navigate) => {
    let url = `${this.state.url}accounts?type=create`;
    console.log(values);
    axios
      .post(url, values, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data.invalid) {
          console.log("Failed to Create Account");
          this.setState({
            invalid: true,
          });
        } else {
          Cookies.setCookie('user', values.username)
          navigate("/");
        }
      });
  }

  login = (values, navigate) => {
    let url = `${this.state.url}accounts?type=login`;
    console.log(values);
    axios
      .post(url, values, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data.invalid) {
          console.log("Failed to login");
          this.setState({
            invalid: true,
          });
        } else {
          Cookies.setCookie('user', values.username)
          navigate("/");
        }
      });
  }

  render() {
    let login = this.state.searchParams.get("type") === "login";
    let navigate = this.navigate;

    let warning;
    if(this.state.invalid && login){
      warning = <p>Invalid username or password</p>
    } else if(this.state.invalid){
      warning = <p>Username already exists</p>
    }

    return (
      <>
      <Header/>
      <main>
        <h2> {!login ? "Create Account" : "Login"}</h2>
        {warning}
        <form className="wideForm" method="post">
          <label className="wrap">
            Username:{" "}
            <input className={this.state.invalid?'failed':''} type="text" name="username" id="username" required />
          </label>
          <label className="wrap">
            Password: <input className={this.state.invalid?'failed':''} type="password" name="pword" id="pword" required />
          </label>
          <button
            className="submit"
            onClick={(event) => {
              this.post(event, navigate);
            }}
          >
            {!login ? "Create" : "Login"}
          </button>
        </form>
        <a
          href={`accountPage?type=${login ? "create" : "login"}`}
          className="accountBtn"
        >
          {login ? "Create Account" : "Login"}
        </a>
      </main>
      </>
    );
  }
}

function withHook(Component) {
  return function WrappedComponent(props) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}

export default withHook(AccountPage);
