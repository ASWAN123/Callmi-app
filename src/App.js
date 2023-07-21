import {  useEffect, useState ,  useContext } from 'react';
import './App.css';
import { db } from "./firebaseConfig"
import { Route , Routes } from 'react-router-dom';
import Header from './componenets/Header';
import AccessForm from './componenets/AccessForm';
import HomePage from './componenets/HomePage';
import Room from "./componenets/Room/Room"
import { roomContext } from './componenets/ContextAPI';


function App() {
  let [data ,  setData] = useState([])


  useEffect(() => {
    const unsubscribe =  db.collection('callmi').onSnapshot((snapshot) => {
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


  useEffect(()=>{
    console.log('updated')
  } ,  [data])



  return (
   
      <roomContext.Provider value={{ data , setData , db }} >
         <div className="App  container mx-auto min-h-screen  " >
          <Header />
          <Routes>
            <Route exact  path='/' element={ <HomePage /> }></Route>
            <Route exact  path='/accessRoom/:id' element={ <Room /> }></Route>
            <Route exact  path = '/:action' element={ <AccessForm /> }></Route>
            
          </Routes>
        </div>
      </roomContext.Provider>


    
  );
}

export default App;
