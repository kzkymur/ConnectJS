import React from 'react';
import Header from '@/component/Header';
import MainBoard from '@/component/MainBoard';
import Keybind from'@/component/Keybind';

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

