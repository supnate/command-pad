import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory, Router } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import 'antd/dist/antd.css';

import configStore from './common/configStore';
import routeConfig from './common/routeConfig';

const store = configStore();
const history = syncHistoryWithStore(browserHistory, store);

const root = document.createElement('div');
document.body.appendChild(root);

bridge.ipcRenderer.on('CMD_FINISHED', (evt, cmdId, code) => {
  console.log('cmd finished: ', cmdId, code);
  store.dispatch({
    type: 'CMD_FINISHED',
    data: {
      cmdId,
      code,
    },
  });
});

render(
  <Provider store={store}>
    <Router history={history} routes={routeConfig} />
  </Provider>,
  root
);
