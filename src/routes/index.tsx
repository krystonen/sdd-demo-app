import { createBrowserRouter } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { AgeGateGuard } from "@/routes/AgeGateGuard";
import { AboutPage } from "@/pages/AboutPage";
import { BookDetailPage } from "@/pages/BookDetailPage";
import { BooksOverviewPage } from "@/pages/BooksOverviewPage";
import { ContactPage } from "@/pages/ContactPage";
import { LandingPage } from "@/pages/LandingPage";
import { LegalPage } from "@/pages/LegalPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import type { RouteHandle } from "@/routes/types";

const bilingual: RouteHandle = { bilingual: true };
const ageGated: RouteHandle = { ageGated: true };

export const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    children: [
      { index: true, element: <LandingPage />, handle: bilingual },
      { path: "about", element: <AboutPage />, handle: bilingual },
      { path: "contact", element: <ContactPage />, handle: bilingual },
      { path: "legal/:policy", element: <LegalPage />, handle: bilingual },
      {
        path: "books",
        element: (
          <AgeGateGuard>
            <BooksOverviewPage />
          </AgeGateGuard>
        ),
        handle: ageGated,
      },
      {
        path: "books/:handle",
        element: (
          <AgeGateGuard>
            <BookDetailPage />
          </AgeGateGuard>
        ),
        handle: ageGated,
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
