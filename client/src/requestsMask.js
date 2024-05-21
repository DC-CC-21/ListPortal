import axios from "axios";
import React from "react";
import Cookies from "./cookies";

class RequestsMask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: props.url,
      requests: props.requests,
      show: Object.keys(props.requests).length > 0,
    };
  }

  blockRequest = (event, list, code) => {
    console.log(`Block ${list[0]} from ${list[1]}. code: ${code}`);

    axios.put(`${this.state.url}requestList?user=${Cookies.getCookie('user')}&type=block`, {
        list:list,
        code:code
    }).then((jsObj) => {
        console.log('Block', jsObj)
        this.setState({
            requests:jsObj.data.requests,
            show:Object.keys(jsObj.data.requests).length > 0
        })
    })
  };
  acceptRequest = (event, list, code) => {
    console.log(`Give ${list[0]} access to ${list[1]}. code: ${code}`);

    axios.put(`${this.state.url}requestList?user=${Cookies.getCookie('user')}&type=accept`, {
        list:list,
        code:code
    }).then((jsObj) => {
        console.log('Accept', jsObj)
        this.setState({
            requests:jsObj.data.requests,
            show:Object.keys(jsObj.data.requests).length > 0
        })
    })
  };

  render() {
    if (!this.state.show) {
      return;
    }
    return (
      <div className="hiddenPanel">
        <div className="mask"></div>
        <ul className="hiddenContainer requestPanel" key={Object.keys(this.state.requests).length}>
          {Object.keys(this.state.requests).map((ipt, idx) => {
            return (
              <li key={`${ipt}${idx}`}>
                <p>
                  <span>{this.state.requests[ipt][0]}</span> would like to view{" "}
                  {this.state.requests[ipt][1]}.
                </p>
                <div className="requestBtns">
                  <button
                    className="no"
                    onClick={(event) => {
                      this.blockRequest(event, this.state.requests[ipt], ipt);
                    }}
                  >
                    Block
                  </button>
                  <button
                    className="yes"
                    onClick={(event) => {
                      this.acceptRequest(event, this.state.requests[ipt], ipt);
                    }}
                  >
                    Allow
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default RequestsMask;
