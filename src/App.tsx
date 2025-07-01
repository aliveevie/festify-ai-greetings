import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Create from "./pages/Create";
import NotFound from "./pages/NotFound";
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

const hyperionTestnet = {
  id: 133717,
  name: 'Hyperion Testnet',
  network: 'hyperion-testnet',
  nativeCurrency: {
    name: 'Test Metis',
    symbol: 'tMETIS',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://hyperion-testnet.metisdevops.link'] },
    public: { http: ['https://hyperion-testnet.metisdevops.link'] },
  },
  blockExplorers: {
    default: { name: 'Hyperion Testnet Explorer', url: 'https://hyperion-testnet-explorer.metisdevops.link' },
  },
  testnet: true,
};

const config = getDefaultConfig({
  appName: 'Festify',
  projectId: import.meta.env.VITE_WC_PROJECT_ID,
  chains: [hyperionTestnet],
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WagmiProvider config={config}>
      <RainbowKitProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/create" element={<Create />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </RainbowKitProvider>
    </WagmiProvider>
  </QueryClientProvider>
);

export default App;
