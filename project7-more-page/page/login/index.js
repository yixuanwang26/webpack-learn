import { render } from 'react-dom';
import React from 'react';
import { Form } from '../../src/components/form/Form';
import './index.css';

render(
  <div className="Login Main">
      <h4>这是登录页面</h4>
      <Form name="NenaWan"/>
  </div>,
  document.getElementById('app')
);