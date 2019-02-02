import React, { Component } from 'react';
import './App.css';
import Navbar from '../src/components/layout/Navbar'
import Footer from '../src/components/layout/Footer'
import Landing from './components/layout/Landing';

class App extends Component {
  render() {
    return (
      <div className="App">
      <Navbar/>
        <Landing/>
      <Footer/>
      </div>
    );
  }
}

export default App;
