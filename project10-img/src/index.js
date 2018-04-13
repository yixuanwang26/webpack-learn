import { render } from 'react-dom';
import React from 'react';
import { Card } from './components/Card';
import layer from './assets/layer.png';

render(
  <div>
    <Card name="NenaWan"/>
    <img src={layer}/>
  </div>,
  document.getElementById('app')
);