/*
* popup.js
* interact with the extension's popup page
*
* this will use react component
*/
import React from 'react';
import ReactDOM from 'react-dom';

class Hello extends React.Component {
  render() {
    return <h1>Hello</h1>
  }
}

ReactDOM.render(<Hello/>, document.getElementById('main'));
