import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { hashHistory, Router } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import configStore from './common/configStore';
import routeConfig from './common/routeConfig';

const store = configStore();
const history = syncHistoryWithStore(hashHistory, store);

const root = document.createElement('div');
document.body.appendChild(root);

bridge.ipcRenderer.on('CMD_FINISHED', (evt, cmdId, code, error) => {
  console.log('cmd finished: ', cmdId, code);
  if (store.getState().home.appVersion) {
    store.dispatch({
      type: 'CMD_FINISHED',
      data: {
        cmdId,
        code,
        error,
      },
    });
  }
});

bridge.ipcRenderer.on('CMD_OUTPUT', (evt, cmdId, outputs) => {
  if (store.getState().home.appVersion) {
    store.dispatch({
      type: 'CMD_OUTPUT',
      data: {
        cmdId,
        outputs,
      },
    });
  }
});

// bridge.ipcRenderer.on('CMDS_UPDATED', (evt, cmds) => {
//   store.dispatch({
//     type: 'CMDS_UPDATED',
//     data: { cmds },
//   });
// });

render(
  <Provider store={store}>
    <Router history={history} routes={routeConfig} />
  </Provider>,
  root
);

// // import { Button, Icon } from 'antd';
// // import routeConfig from './common/routeConfig';
// import TestComponent from './TestComponent';
// // import { Button, Col, Form, Icon, Input, Modal, Popover, Row } from 'antd';
// // import 'antd/dist/antd.css';
// const root = document.createElement('div');
// document.body.appendChild(root);

// render(
//   <div>
//     <TestComponent />
//   </div>, root);