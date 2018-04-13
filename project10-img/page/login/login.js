import { render } from 'react-dom';
import React from 'react';
import { Form } from '../../src/components/Form';
import style from './index.css';
import styles from '../common.css';

render(
  <div className="Login Main">
      <h4>这是登录页面</h4>
      <Form name="NenaWan"/>
  </div>,
  document.getElementById('app')
);