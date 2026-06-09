import { NavLink } from "react-router-dom";
import type { ReactElement, ReactNode } from "react";
import styles from "./Link.module.css";

export type LinkProps = {
  to: string;
  end?: boolean;
  className?: string;
  children: ReactNode;
};

export const Link = ({
  to,
  end = false,
  className,
  children,
}: LinkProps): ReactElement => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [styles.link, isActive ? styles.active : "", className]
          .filter(Boolean)
          .join(" ")
      }
    >
      {children}
    </NavLink>
  );
};
