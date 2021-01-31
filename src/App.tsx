import React from 'react';
import Header from './components/Header';
import MainBoard from './components/MainBoard';
import Keybind from'./components/Keybind';

function App() {
  return (
    <React.Fragment>
      <div className="App">
        <Header/>
        <MainBoard/>
      </div>
      <Keybind/>
    </React.Fragment>
  );
}

export default App;

