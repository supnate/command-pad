import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';

import TestComponent from './TestComponent';
const root = document.createElement('div');
document.body.appendChild(root);

render(
  <div>
    <TestComponent />
  </div>, root);