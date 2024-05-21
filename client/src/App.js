import logo from './logo.svg';
// import kirby from './kirby-bound.png'
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        {/* <img src={kirby} alt="kirby"></img> */}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Hello World
        </a>
      </header>
    </div>
  );
}

export default App;
