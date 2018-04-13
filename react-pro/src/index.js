import { render } from 'react-dom';
import React from 'react';
import { Card } from './components/Card';
import styles from './components/Card.scss';

render(
  <Card name="NenaWan"/>,
  document.getElementById('app')
);