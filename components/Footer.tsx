import * as React from 'react';
import { Link } from "@reach/router";

export default function Footer () {
  return (
    <div>
      <Link to="/">Send another password</Link>
      <Link to="/about">About</Link>
      <a href="https://github.com/tkooda/temporalpw" target="blank">Source</a>
    </div>
  );
}
