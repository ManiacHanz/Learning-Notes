import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import todo from './stores/TodoStore';
import { Provider } from 'mobx-react';
import './index.css';

// ReactDOM.render(
//   <Provider todo={todo}><App /></Provider>,
//   document.getElementById('root')
// );

class Home extends React.Component {
  state = {
    count: 0
  }
  handleClick(){
    this.setState({count:1})
    this.setState({count:2})
    this.setState({count:3})
    this.setState({count:4})
  }
  render(){
    return (
      <div>
        {this.state.count}
        <button onClick={() => this.handleClick()}> + </button>
      </div>
    )
  }
}

ReactDOM.render(
  <Home />,
  document.getElementById('root')
);
