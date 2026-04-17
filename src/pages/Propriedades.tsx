import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { usePropriedades } from "@/hooks/useData";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Maximize2, Euro, Home, TreePine, Building2, ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { toast } from "sonner";
import type { Propriedade, PropriedadeTipo, PropriedadeStatus } from "@/types";

const Propriedades = () => {
  const { items: propriedades, add, remove } = usePropriedades();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getIcon = (tipo: PropriedadeTipo) => {
    switch (tipo) {
      case "terreno": return TreePine;
      case "apartamento": return Building2;
      case "moradia": return Home;
      case "comercial": return ShoppingBag;
      default: return MapPin;
    }
  };

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newProp: Propriedade = {
      id: uuid(),
      nome: formData.get("nome") as string,
      tipo: formData.get("tipo") as PropriedadeTipo,
      status: formData.get("status") as PropriedadeStatus,
      endereco: formData.get("endereco") as string,
      cidade: formData.get("cidade") as string,
      area: Number(formData.get("area")),
      preco: Number(formData.get("preco")),
      descricao: formData.get("descricao") as string,
    };

    add(newProp);
    toast.success("Propriedade cadastrada com sucesso!");
    setIsDialogOpen(false);
  };

  return (
    <AppLayout
      title="Mapeamento de Imóveis"
      subtitle="Costa del Sol Portfolio"
      actions={
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Nova Propriedade
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleAdd}>
              <DialogHeader>
                <DialogTitle>Cadastrar Nova Propriedade</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome do Empreendimento/Lote</Label>
                  <Input id="nome" name="nome" placeholder="Ex: Villa Marbella" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tipo">Tipo</Label>
                    <Select name="tipo" defaultValue="terreno">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="terreno">Terreno</SelectItem>
                        <SelectItem value="moradia">Moradia</SelectItem>
                        <SelectItem value="apartamento">Apartamento</SelectItem>
                        <SelectItem value="comercial">Comercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue="disponivel">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="disponivel">Disponível</SelectItem>
                        <SelectItem value="analise">Em Análise</SelectItem>
                        <SelectItem value="adquirido">Adquirido</SelectItem>
                        <SelectItem value="em_obra">Em Obra</SelectItem>
                        <SelectItem value="vendido">Vendido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="area">Área (m²)</Label>
                    <Input id="area" name="area" type="number" placeholder="0" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="preco">Preço Estimado (€)</Label>
                    <Input id="preco" name="preco" type="number" placeholder="0" required />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cidade">Cidade (Costa del Sol)</Label>
                  <Select name="cidade" defaultValue="Marbella">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Marbella">Marbella</SelectItem>
                      <SelectItem value="Estepona">Estepona</SelectItem>
                      <SelectItem value="Fuengirola">Fuengirola</SelectItem>
                      <SelectItem value="Málaga">Málaga</SelectItem>
                      <SelectItem value="Benalmádena">Benalmádena</SelectItem>
                      <SelectItem value="Torremolinos">Torremolinos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endereco">Endereço Completo</Label>
                  <Input id="endereco" name="endereco" placeholder="Rua, número..." required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Salvar Propriedade</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {propriedades.length === 0 && (
          <div className="col-span-full text-center py-12 border-2 border-dashed rounded-xl border-muted">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">Nenhuma propriedade mapeada</h3>
            <p className="text-muted-foreground">Comece cadastrando terrenos ou imóveis na Costa del Sol.</p>
          </div>
        )}
        {propriedades.map((p) => {
          const Icon = getIcon(p.tipo);
          return (
            <Card key={p.id} className="overflow-hidden border-border/60 hover:border-primary/50 transition-all group">
              <div className="h-32 bg-muted/50 relative flex items-center justify-center">
                <Icon className="h-12 w-12 text-muted group-hover:text-primary/20 transition-colors" />
                <div className="absolute top-3 right-3">
                  <StatusBadge status={p.status as any} />
                </div>
                <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold">
                  {p.tipo}
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg leading-tight">{p.nome}</h3>
                  <div className="text-primary font-mono font-bold">{formatCurrency(p.preco).replace('R$', '€')}</div>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                  <MapPin className="h-3.5 w-3.5" />
                  {p.cidade}, Costa del Sol
                </div>
                <div className="grid grid-cols-2 gap-4 py-3 border-y border-border/40 mb-4">
                  <div className="flex items-center gap-2">
                    <Maximize2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{p.area} m²</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Euro className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{Math.round(p.preco / p.area)} €/m²</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 text-xs h-8">Ver no Mapa</Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => remove(p.id)}>
                    <Plus className="h-4 w-4 rotate-45" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </AppLayout>
  );
};

export default Propriedades;
