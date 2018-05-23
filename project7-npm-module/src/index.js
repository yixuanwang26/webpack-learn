import { render } from 'react-dom';
import React, { Component }  from 'react';
import { Card } from './components/Card';
import './index.css';

export default class HelloNena extends Component {
  render() {
    return (
      <div className="hello-component">
        <h1>Hello~~~</h1>
        <Card name="NenaWan"/>
      </div>
    )
  }
}