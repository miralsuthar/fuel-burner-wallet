import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "fuels";
import { createContext, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";

export const FuelContext = createContext<{ provider?: Provider }>({});

export default function App({ Component, pageProps }: AppProps) {
  const [provider, setProvider] = useState<Provider>();

  useEffect(() => {
    (async () => {
      const provider = await Provider.create(
        "https://beta-4.fuel.network/graphql"
      );

      setProvider(provider);
    })();
  }, []);

  return (
    <FuelContext.Provider value={{ provider }}>
      <Toaster />
      <Component {...pageProps} />
    </FuelContext.Provider>
  );
}
