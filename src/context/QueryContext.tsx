import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface IQueriedElementProps {
  children: React.ReactNode;
}

const QueriedElement: React.FC<IQueriedElementProps> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueriedElement;
