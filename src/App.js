import {  useEffect, useState ,  useContext } from 'react';
import './App.css';
import { db } from "./firebaseConfig"
import { Route , Routes } from 'react-router-dom';
import Header from './componenets/Header';
import AccessForm from './componenets/AccessForm';
import HomePage from './componenets/HomePage';
import Room from './componenets/room/Room';
import { roomContext } from './componenets/ContextAPI';


function App() {
  let [data ,  setData] = useState([])


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
    <div className="App  container mx-auto min-h-screen  " >
      <roomContext.Provider value={{ data , setData , db }} >
      <Header />
      <Routes>
        <Route path='/' element={ <HomePage /> }></Route>
        <Route path = '/:action' element={ <AccessForm /> }></Route>
        <Route path='/accessRoom/:id' element={ <Room /> }></Route>
      </Routes>
      </roomContext.Provider>


    </div>
  );
}

export default App;
