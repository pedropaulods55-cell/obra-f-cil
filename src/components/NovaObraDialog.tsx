import { useState } from "react";
import { v4 as uuid } from "uuid";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useObras } from "@/hooks/useData";
import { toast } from "sonner";
import type { Obra, ObraStatus } from "@/types";

export function NovaObraDialog({ trigger }: { trigger?: React.ReactNode }) {
  const { add } = useObras();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    cliente: "",
    endereco: "",
    descricao: "",
    status: "planejamento" as ObraStatus,
    dataInicio: "",
    dataFimPrevista: "",
    orcamento: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.cliente) {
      toast.error("Informe ao menos nome e cliente.");
      return;
    }
    const novo: Obra = {
      id: uuid(),
      nome: form.nome,
      cliente: form.cliente,
      endereco: form.endereco,
      descricao: form.descricao,
      status: form.status,
      dataInicio: form.dataInicio || new Date().toISOString().slice(0, 10),
      dataFimPrevista: form.dataFimPrevista || new Date().toISOString().slice(0, 10),
      orcamento: Number(form.orcamento) || 0,
      progresso: 0,
      createdAt: new Date().toISOString(),
    };
    add(novo);
    toast.success("Obra criada com sucesso");
    setOpen(false);
    setForm({ nome: "", cliente: "", endereco: "", descricao: "", status: "planejamento", dataInicio: "", dataFimPrevista: "", orcamento: "" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nova obra
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nova obra</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="nome">Nome da obra</Label>
            <Input id="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex.: Residencial Vista Verde" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="cliente">Cliente</Label>
              <Input id="cliente" value={form.cliente} onChange={(e) => setForm({ ...form, cliente: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={form.status} onValueChange={(v: ObraStatus) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="planejamento">Planejamento</SelectItem>
                  <SelectItem value="em_andamento">Em andamento</SelectItem>
                  <SelectItem value="pausada">Pausada</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input id="endereco" value={form.endereco} onChange={(e) => setForm({ ...form, endereco: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="dataInicio">Início</Label>
              <Input id="dataInicio" type="date" value={form.dataInicio} onChange={(e) => setForm({ ...form, dataInicio: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dataFim">Fim previsto</Label>
              <Input id="dataFim" type="date" value={form.dataFimPrevista} onChange={(e) => setForm({ ...form, dataFimPrevista: e.target.value })} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="orcamento">Orçamento (R$)</Label>
            <Input id="orcamento" type="number" value={form.orcamento} onChange={(e) => setForm({ ...form, orcamento: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea id="descricao" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={3} />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit">Criar obra</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
