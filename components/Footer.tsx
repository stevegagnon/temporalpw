import * as React from 'react';
import { Link } from "react-router-dom";

export default function Footer () {
  return (
    <div>
      <Link to="/new">Send another password</Link>
      <Link to="/about">About</Link>
      <a href="https://github.com/tkooda/temporalpw" target="blank">Source</a>
    </div>
  );
}
