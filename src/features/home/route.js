import {
  StatusPage,
  CmdEditPage,
  AboutPage,
  SettingsPage,
} from './index';

export default {
  path: '',
  name: 'home',
  childRoutes: [
    { component: StatusPage, isIndex: true },
    { path: 'cmd/add', component: CmdEditPage },
    { path: 'cmd/edit/:cmdId', component: CmdEditPage },
    { path: 'about', component: AboutPage },
    { path: 'settings', component: SettingsPage },
  ],
};
