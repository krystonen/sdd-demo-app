import { Link } from "react-router-dom";
import type { ReactElement } from "react";

export const NotFoundPage = (): ReactElement => (
  <div>
    <h1>404</h1>
    <p>
      <Link to="/">Home</Link>
    </p>
  </div>
);
