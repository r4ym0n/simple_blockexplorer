import logo from './logo.svg';
import './App.css';

import W3 from './w3';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <br />
        <div style={{ 'textAlign': 'left' }}>
          <W3></W3>
        </div>
      </header>
    </div>
  );
}

export default App;
