import './App.css';
import { useState } from 'react';
import axios from 'axios';
import { NavBar, ButtonList } from './Components';
import { backButton } from '@telegram-apps/sdk-react';

function App() {
  const [activeTab, setActiveTab] = useState('tab1');
  const [menuStack, setMenuStack] = useState(['main']);
  const [items, setItems] = useState([]);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
    setMenuStack(['main']);
    setItems([]); // Очистить список элементов при смене вкладки
    backButton.hide();
  };

  const handleSelect = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/items');
      setItems(response.data); // Здесь response.data — это просто массив строк
      setMenuStack((prevStack) => [...prevStack, 'selectItems']);
      backButton.show();
      console.log('Items fetched:', response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleItemClick = async (item) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/items/${item}`);
      setItems(response.data); // Заменяем меню на элементы второго уровня
      setMenuStack((prevStack) => [...prevStack, `item-${item}`]);
      backButton.show();
      console.log('Sub-items fetched for item', item, ':', response.data);
    } catch (error) {
      console.error('Error fetching sub-items:', error);
    }
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
    setItems([]); // Очистить список элементов при возврате назад
  };

  backButton.onClick(handleBackClick);

  const mainMenu = [
    { label: 'SELECT', onClick: handleSelect },
    { label: 'INSERT' },
    { label: 'UPDATE' },
    { label: 'DELETE' },
  ];

  return (
    <div className="App">
      <div className="tab-content">
        {activeTab === 'tab1' && (
          items.length > 0 ?
            <ButtonList buttons={items.map(item => ({ label: item, onClick: () => handleItemClick(item) }))} />
            :
            <ButtonList buttons={mainMenu} />
        )}
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
