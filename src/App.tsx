
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { initSmoothScroll, initAnimations } from "./utils/smoothScroll";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    console.log("App mounted, initializing smooth scroll and animations");
    
    // Initialize smooth scrolling
    const lenis = initSmoothScroll();
    
    // Initialize GSAP animations after the component has mounted
    // Allow a brief moment for the DOM to be fully ready
    setTimeout(() => {
      console.log("Calling initAnimations");
      initAnimations();
    }, 100);

    return () => {
      // Clean up lenis instance
      console.log("App unmounted, cleaning up");
      lenis.destroy();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
