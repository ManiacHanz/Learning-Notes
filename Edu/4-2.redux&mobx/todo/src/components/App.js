import React, { Component } from 'react';
import Info from './info';
import List from './list';

class App extends Component {
  render() {
    return <section className="container">
      <header className='title' onClick={() => alert(1)}>苹果篮子</header>
      <Info />
      <List />
    </section>
  }
}

export default App;
