import React from 'react';
import { Router, Route, Switch, Link, NavLink } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

import SMPage from '../components/SFPage';
import IRPage from '../components/IRPage';
import NotFoundPage from '../components/NotFoundPage';

// createHistory
export const history = createHistory();


const AppRouter = () => (
  <Router history={history}>
    <div>
    <Switch>
      <Route exact path="/" component={IRPage}/>
      <Route path="/SFpage" component={SMPage} />
      <Route component={NotFoundPage} />
    </Switch>
    </div>
  </Router>
);


export default AppRouter;