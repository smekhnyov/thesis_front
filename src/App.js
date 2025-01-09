import './App.css';
import { useState } from 'react';
import { NavBar, ButtonList } from './Components';
import { backButton } from '@telegram-apps/sdk-react';

function App() {
  const [activeTab, setActiveTab] = useState('tab1');
  const [menuStack, setMenuStack] = useState(['main']);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
    setMenuStack(['main']);
    backButton.hide();
  };

  const handleMenuNavigation = (newMenu) => {
    setMenuStack((prevStack) => [...prevStack, newMenu]);
    backButton.show();
  };

  const handleBackClick = () => {
    setMenuStack((prevStack) => {
      if (prevStack.length > 1) {
        const newStack = prevStack.slice(0, -1);
        if (newStack.length === 1) backButton.hide();
        return newStack;
      }
      return prevStack;
    });
  };


  backButton.onClick(handleBackClick);

  const menus = {
    main: [
      { label: 'SELECT', onClick: () => handleMenuNavigation('selectOptions') },
      { label: 'INSERT' },
      { label: 'UPDATE' },
      { label: 'DELETE' },
    ],
    selectOptions: [
      { label: 'Option 1' },
      { label: 'Option 2', onClick: () => handleMenuNavigation('option2Submenu') },
      { label: 'Option 3' },
    ],
    option2Submenu: [
      { label: 'Sub-option 1' },
      { label: 'Sub-option 2' },
    ],
  };

  return (
    <div className="App">
      <div className="tab-content">
        {activeTab === 'tab1' && <ButtonList buttons={menus[menuStack[menuStack.length - 1]]} />}
        {activeTab === 'tab2' && (
          <ButtonList buttons={[
            { label: '1' },
            { label: '2' },
            { label: '3' },
            { label: '4' },
          ]} />
        )}
      </div>
      <NavBar activeTab={activeTab} onChange={handleChange} />
    </div>
  );
}

export default App;
