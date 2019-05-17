import * as React from 'react';
import { HashRouter, Route } from "react-router-dom";
import About from './About';
import CreateUrl from './CreateUrl';
import ViewUrl from './ViewUrl';
import ViewPassword from './ViewPassword';

export default function App() {
  return (
    <HashRouter>
      <Route path="/new" component={CreateUrl} />
      <Route path="/about" component={About} />
      <Route path="/url" component={ViewUrl} />
      <Route path="/p" component={ViewPassword} />
    </HashRouter>
  );
}
