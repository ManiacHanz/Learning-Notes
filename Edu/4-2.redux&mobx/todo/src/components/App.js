import React, { Component } from 'react';
import Info from './info';
import List from './list';

class App extends Component {
  state = {val: 0}
  componentDidMount(){
    this.setState({val: this.state.val + 1})
    console.log(this.state.val)

    this.setState({val: this.state.val + 1})
    console.log(this.state.val)

    setTimeout(() => {
      this.setState({val: this.state.val + 1})
    console.log(this.state.val)

    this.setState({val: this.state.val + 1})
    console.log(this.state.val)
    }, 0)
  }
  render() {
    return <section className="container">
      <header className='title' onClick={() => alert(1)}>苹果篮子</header>
      <Info />
      <List />
      <div>{this.state.val}</div>
    </section>
  }
}

export default App;
