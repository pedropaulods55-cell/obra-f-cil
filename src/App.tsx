import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Obras from "./pages/Obras.tsx";
import ObraDetalhe from "./pages/ObraDetalhe.tsx";
import Cronograma from "./pages/Cronograma.tsx";
import Equipe from "./pages/Equipe.tsx";
import Materiais from "./pages/Materiais.tsx";
import Financeiro from "./pages/Financeiro.tsx";
import Propriedades from "./pages/Propriedades.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="obra-facil-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/obras" element={<Obras />} />
          <Route path="/obras/:id" element={<ObraDetalhe />} />
          <Route path="/cronograma" element={<Cronograma />} />
          <Route path="/equipe" element={<Equipe />} />
          <Route path="/materiais" element={<Materiais />} />
          <Route path="/financeiro" element={<Financeiro />} />
          <Route path="/propriedades" element={<Propriedades />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
