import { RouterProvider } from "react-router-dom";
import type { ReactElement } from "react";
import { LocaleProvider } from "@/context/LocaleContext";
import { router } from "@/routes/index";

export const App = (): ReactElement => (
  <LocaleProvider>
    <RouterProvider router={router} />
  </LocaleProvider>
);
