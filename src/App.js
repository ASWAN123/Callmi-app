import {  useEffect, useState } from 'react';
import './App.css';
import { db } from "./firebaseConfig"
import { Route , Routes } from 'react-router-dom';
import CreateRoom from './componenets/CreateRoom';
import HomePage from './componenets/HomePage';

function App() {


  return (
    <div className="App  container mx-auto min-h-screen  " >
      <Routes>
        <Route path='/' element={ <HomePage /> }></Route>
        <Route path='/room' element={ <CreateRoom /> }></Route>
      </Routes>


    </div>
  );
}

export default App;
