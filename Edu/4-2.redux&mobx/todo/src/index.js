import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import todo from './stores/TodoStore';
import { Provider } from 'mobx-react';
import './index.css';

ReactDOM.render(
  <Provider todo={todo}><App /></Provider>,
  document.getElementById('root')
);
