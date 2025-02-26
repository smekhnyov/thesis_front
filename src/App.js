import './App.css';
import { useState } from 'react';
import { NavBar } from './Components';
import MenuHandler from './Components/MenuHandler';

function App() {
  const [activeTab, setActiveTab] = useState('tab1');

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="App">
      <div className="tab-content">
        <MenuHandler activeTab={activeTab} />
      </div>
      <NavBar activeTab={activeTab} onChange={handleChange} />
    </div>
  );
}

export default App;