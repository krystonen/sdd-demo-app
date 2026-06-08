import { RouterProvider } from "react-router-dom";
import type { ReactElement } from "react";
import { LocaleProvider } from "@/context/LocaleContext";
import { AgeGateGuard } from "@/routes/AgeGateGuard";
import { router } from "@/routes/index";

export const App = (): ReactElement => (
  <LocaleProvider>
    <AgeGateGuard>
      <RouterProvider router={router} />
    </AgeGateGuard>
  </LocaleProvider>
);
