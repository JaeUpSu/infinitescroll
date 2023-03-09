import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import App from "./App";

import { worker } from "./mocks/handlers";
if (process.env.NODE_ENV === "development") {
  worker.start();
}

const client = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <QueryClientProvider client={client}>
    <App />
  </QueryClientProvider>
);
