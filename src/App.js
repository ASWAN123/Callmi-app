import {  useEffect, useState } from 'react';
import './App.css';
import Create from './componenets/Create';
import { db } from "./firebaseConfig"
import { roomContext } from './componenets/ContextRoom';
import { Route , Routes } from 'react-router-dom';
import Home from './componenets/Home';

function App() {
  let [data , setData] = useState([])
  let [userName , setUserName] = useState('')


  useEffect(() => {
    const unsubscribe = db.collection('callmi').onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setData(data);
    });

    return () => {
      unsubscribe();
    };
  }, []);



  return (
    <div className="App min-h-screen bg-gradient-to-b from-gray-100 to-gray-100   text-white ">
      <roomContext.Provider value={{data , db , userName , setUserName }}>
      <Routes>
        <Route path=''           element={<Create />}></Route>
        <Route path='/room/:id/:PeerID'  element={<Home />}></Route>
      </Routes>
      </roomContext.Provider>
    </div>
  );
}

export default App;
