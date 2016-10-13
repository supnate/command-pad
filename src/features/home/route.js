import {
  StatusPage,
} from './index';

export default {
  path: '',
  name: 'home',
  childRoutes: [
    { path: 'status-page', component: StatusPage },
  ],
};
