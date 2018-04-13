import { render } from 'react-dom';
import React from 'react';
import { Card } from '../../src/components/Card';
import style from './index.css';
import styles from '../common.css';

render(
  <div className="Index Main">
      <h4>这是首页</h4>
      <Card name="NenaWan"/>
  </div>,
  document.getElementById('app')
);