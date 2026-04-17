import { ReactNode, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, Search, Sun, Moon, Download, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function AppLayout({ children, title, subtitle, actions }: AppLayoutProps) {
  const { theme, setTheme } = useTheme();
  const [search, setSearch] = useState("");

  const handleExport = () => {
    const data: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("construo:")) {
        data[key] = localStorage.getItem(key);
      }
    }
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `obra-facil-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success("Backup exportado com sucesso!");
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        try {
          const data = JSON.parse(event.target.result);
          Object.entries(data).forEach(([key, value]) => {
            localStorage.setItem(key, value as string);
          });
          toast.success("Dados importados! Recarregando...");
          setTimeout(() => window.location.reload(), 1500);
        } catch (err) {
          toast.error("Erro ao importar arquivo.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background text-foreground transition-colors duration-300">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center gap-4 border-b border-border px-6 sticky top-0 z-30 bg-background/80 backdrop-blur-xl">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            
            <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar na Costa del Sol..."
                  className="pl-9 h-10 bg-muted/40 border-border/40 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
                />
              </div>
            </div>

            <div className="flex-1 md:hidden" />

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-muted/50 rounded-lg p-1 border border-border/40">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-md" 
                  onClick={handleExport}
                  title="Exportar Backup"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-md" 
                  onClick={handleImport}
                  title="Importar Backup"
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-xl hover:bg-muted"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-700" />}
              </Button>

              <button className="h-10 w-10 grid place-items-center rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-primary rounded-full border-2 border-background"></span>
              </button>

              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 grid place-items-center text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20">
                PP
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 md:p-10 overflow-x-hidden max-w-[1600px] mx-auto w-full">
            {(title || actions) && (
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div>
                  {subtitle && (
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary mb-3">{subtitle}</p>
                  )}
                  {title && <h1 className="text-4xl md:text-5xl font-black tracking-tight">{title}</h1>}
                </div>
                {actions && <div className="flex gap-3">{actions}</div>}
              </div>
            )}
            <div className="animate-in fade-in zoom-in-95 duration-500">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
