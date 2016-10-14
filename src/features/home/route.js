import {
  StatusPage,
  CmdEditPage,
} from './index';

export default {
  path: '',
  name: 'home',
  childRoutes: [
    { component: StatusPage, isIndex: true },
    { path: 'cmd/add', component: CmdEditPage },
    { path: 'cmd/edit/:cmdId', component: CmdEditPage },
  ],
};
