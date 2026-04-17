import { AppLayout } from "@/components/AppLayout";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useObras, useEtapas, useTarefas, useMembros, useMateriais, useLancamentos } from "@/hooks/useData";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Trash2, Plus, CheckCircle2, Circle } from "lucide-react";
import { formatCurrency, formatDate, funcaoLabel, categoriaLabel } from "@/lib/format";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import type { Etapa, Membro, Material, Lancamento, Tarefa } from "@/types";

const ObraDetalhe = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { items: obras, update: updateObra, remove: removeObra } = useObras();
  const { items: etapas, add: addEtapa, update: updateEtapa, remove: removeEtapa } = useEtapas();
  const { items: tarefas, add: addTarefa, update: updateTarefa, remove: removeTarefa } = useTarefas();
  const { items: membros, add: addMembro, remove: removeMembro } = useMembros();
  const { items: materiais, add: addMaterial, remove: removeMaterial } = useMateriais();
  const { items: lancamentos, add: addLancamento, remove: removeLancamento } = useLancamentos();

  const obra = obras.find((o) => o.id === id);

  if (!obra) {
    return (
      <AppLayout title="Obra não encontrada">
        <Link to="/obras"><Button variant="ghost" className="gap-2"><ArrowLeft className="h-4 w-4" /> Voltar</Button></Link>
      </AppLayout>
    );
  }

  const obraEtapas = etapas.filter((e) => e.obraId === id).sort((a, b) => a.ordem - b.ordem);
  const obraTarefas = tarefas.filter((t) => t.obraId === id);
  const obraMembros = membros.filter((m) => m.obraId === id);
  const obraMateriais = materiais.filter((m) => m.obraId === id);
  const obraLanc = lancamentos.filter((l) => l.obraId === id);
  const receitas = obraLanc.filter((l) => l.tipo === "receita").reduce((s, l) => s + l.valor, 0);
  const despesas = obraLanc.filter((l) => l.tipo === "despesa").reduce((s, l) => s + l.valor, 0);
  const custoMaterial = obraMateriais.reduce((s, m) => s + m.precoUnit * m.quantidade, 0);

  const handleDelete = () => {
    if (confirm("Excluir esta obra e todos os dados relacionados?")) {
      removeObra(id);
      toast.success("Obra excluída");
      navigate("/obras");
    }
  };

  return (
    <AppLayout
      subtitle={obra.cliente}
      title={obra.nome}
      actions={
        <div className="flex gap-2">
          <Link to="/obras"><Button variant="ghost" className="gap-2"><ArrowLeft className="h-4 w-4" /> Voltar</Button></Link>
          <Button variant="outline" className="gap-2 text-destructive hover:text-destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" /> Excluir
          </Button>
        </div>
      }
    >
      {/* Header summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-5 surface border-border/60 md:col-span-2">
          <div className="flex items-start justify-between mb-3">
            <StatusBadge status={obra.status} />
            <Select value={obra.status} onValueChange={(v: any) => updateObra(id, { status: v })}>
              <SelectTrigger className="w-40 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="planejamento">Planejamento</SelectItem>
                <SelectItem value="em_andamento">Em andamento</SelectItem>
                <SelectItem value="pausada">Pausada</SelectItem>
                <SelectItem value="concluida">Concluída</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {obra.endereco || "—"}</div>
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {formatDate(obra.dataInicio)} → {formatDate(obra.dataFimPrevista)}</div>
          </div>
          {obra.descricao && <p className="text-sm text-foreground/80">{obra.descricao}</p>}
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-muted-foreground uppercase tracking-widest">Progresso</span>
              <span className="font-mono font-bold text-base">{obra.progresso}%</span>
            </div>
            <Progress value={obra.progresso} className="h-2 mb-3" />
            <Slider
              value={[obra.progresso]}
              max={100}
              step={1}
              onValueChange={([v]) => updateObra(id, { progresso: v })}
            />
          </div>
        </Card>

        <Card className="p-5 surface border-border/60">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Orçamento</div>
          <div className="font-mono text-2xl font-bold mb-4">{formatCurrency(obra.orcamento)}</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Receitas</span><span className="font-mono text-success">{formatCurrency(receitas)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Despesas</span><span className="font-mono text-destructive">{formatCurrency(despesas)}</span></div>
            <div className="flex justify-between pt-2 border-t border-border/60"><span>Saldo</span><span className="font-mono font-bold">{formatCurrency(receitas - despesas)}</span></div>
          </div>
        </Card>

        <Card className="p-5 surface border-border/60">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Resumo</div>
          <div className="space-y-3">
            <div className="flex justify-between items-baseline"><span className="text-sm text-muted-foreground">Etapas</span><span className="font-mono text-xl font-bold">{obraEtapas.length}</span></div>
            <div className="flex justify-between items-baseline"><span className="text-sm text-muted-foreground">Equipe</span><span className="font-mono text-xl font-bold">{obraMembros.length}</span></div>
            <div className="flex justify-between items-baseline"><span className="text-sm text-muted-foreground">Materiais</span><span className="font-mono text-xl font-bold">{obraMateriais.length}</span></div>
            <div className="flex justify-between items-baseline"><span className="text-sm text-muted-foreground">Tarefas</span><span className="font-mono text-xl font-bold">{obraTarefas.filter(t => !t.concluida).length}</span></div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="cronograma">
        <TabsList className="bg-muted/40">
          <TabsTrigger value="cronograma">Cronograma</TabsTrigger>
          <TabsTrigger value="tarefas">Tarefas</TabsTrigger>
          <TabsTrigger value="equipe">Equipe</TabsTrigger>
          <TabsTrigger value="materiais">Materiais</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
        </TabsList>

        {/* CRONOGRAMA */}
        <TabsContent value="cronograma" className="mt-6">
          <Card className="p-6 surface border-border/60">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-lg">Etapas da obra</h3>
                <p className="text-sm text-muted-foreground">Defina o cronograma macro da execução.</p>
              </div>
              <NovaEtapaDialog obraId={id} ordem={obraEtapas.length + 1} onAdd={addEtapa} />
            </div>
            <div className="space-y-3">
              {obraEtapas.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma etapa cadastrada.</p>}
              {obraEtapas.map((e, idx) => (
                <div key={e.id} className="flex items-center gap-4 p-4 rounded-md bg-muted/30 border border-border/50">
                  <div className="font-mono text-xs text-muted-foreground w-6">{String(idx + 1).padStart(2, "0")}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{e.nome}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(e.inicio)} → {formatDate(e.fim)}</div>
                  </div>
                  <Select value={e.status} onValueChange={(v: any) => updateEtapa(e.id, { status: v })}>
                    <SelectTrigger className="w-40 h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="em_andamento">Em andamento</SelectItem>
                      <SelectItem value="concluida">Concluída</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" onClick={() => removeEtapa(e.id)}><Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" /></Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* TAREFAS */}
        <TabsContent value="tarefas" className="mt-6">
          <Card className="p-6 surface border-border/60">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-lg">Tarefas</h3>
                <p className="text-sm text-muted-foreground">Atividades operacionais do dia a dia.</p>
              </div>
              <NovaTarefaDialog obraId={id} onAdd={addTarefa} />
            </div>
            <div className="space-y-2">
              {obraTarefas.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma tarefa.</p>}
              {obraTarefas.map((t) => (
                <div key={t.id} className="flex items-center gap-3 p-3 rounded-md bg-muted/30 border border-border/50 group">
                  <button onClick={() => updateTarefa(t.id, { concluida: !t.concluida })}>
                    {t.concluida ? <CheckCircle2 className="h-5 w-5 text-success" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm ${t.concluida ? "line-through text-muted-foreground" : ""}`}>{t.titulo}</div>
                    <div className="text-xs text-muted-foreground">{t.responsavel || "—"} {t.prazo && `• ${formatDate(t.prazo)}`}</div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeTarefa(t.id)}><Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" /></Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* EQUIPE */}
        <TabsContent value="equipe" className="mt-6">
          <Card className="p-6 surface border-border/60">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-lg">Equipe</h3>
                <p className="text-sm text-muted-foreground">Profissionais alocados na obra.</p>
              </div>
              <NovoMembroDialog obraId={id} onAdd={addMembro} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {obraMembros.length === 0 && <p className="text-sm text-muted-foreground">Nenhum membro.</p>}
              {obraMembros.map((m) => (
                <div key={m.id} className="flex items-center gap-3 p-4 rounded-md bg-muted/30 border border-border/50">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/40 grid place-items-center text-sm font-bold text-primary-foreground">
                    {m.nome.split(" ").map(n => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{m.nome}</div>
                    <div className="text-xs text-muted-foreground">{funcaoLabel[m.funcao]} {m.telefone && `• ${m.telefone}`}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm font-semibold">{formatCurrency(m.diaria)}</div>
                    <div className="text-[10px] text-muted-foreground uppercase">/ diária</div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeMembro(m.id)}><Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" /></Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* MATERIAIS */}
        <TabsContent value="materiais" className="mt-6">
          <Card className="p-6 surface border-border/60">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-lg">Materiais</h3>
                <p className="text-sm text-muted-foreground">Custo total: <span className="font-mono font-semibold text-foreground">{formatCurrency(custoMaterial)}</span></p>
              </div>
              <NovoMaterialDialog obraId={id} onAdd={addMaterial} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-widest text-muted-foreground border-b border-border/60">
                    <th className="text-left py-2 font-medium">Material</th>
                    <th className="text-left font-medium">Qtd</th>
                    <th className="text-right font-medium">Unit.</th>
                    <th className="text-right font-medium">Total</th>
                    <th className="text-left pl-4 font-medium">Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {obraMateriais.length === 0 && (
                    <tr><td colSpan={6} className="py-6 text-center text-muted-foreground">Nenhum material.</td></tr>
                  )}
                  {obraMateriais.map((m) => (
                    <tr key={m.id} className="border-b border-border/40 hover:bg-muted/20">
                      <td className="py-3">
                        <div className="font-medium">{m.nome}</div>
                        <div className="text-xs text-muted-foreground">{m.fornecedor || "—"}</div>
                      </td>
                      <td className="font-mono">{m.quantidade} {m.unidade}</td>
                      <td className="text-right font-mono">{formatCurrency(m.precoUnit)}</td>
                      <td className="text-right font-mono font-semibold">{formatCurrency(m.precoUnit * m.quantidade)}</td>
                      <td className="pl-4"><StatusBadge status={m.status} /></td>
                      <td><Button variant="ghost" size="icon" onClick={() => removeMaterial(m.id)}><Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" /></Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* FINANCEIRO */}
        <TabsContent value="financeiro" className="mt-6">
          <Card className="p-6 surface border-border/60">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-lg">Lançamentos financeiros</h3>
                <p className="text-sm text-muted-foreground">Receitas e despesas da obra.</p>
              </div>
              <NovoLancamentoDialog obraId={id} onAdd={addLancamento} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-widest text-muted-foreground border-b border-border/60">
                    <th className="text-left py-2 font-medium">Data</th>
                    <th className="text-left font-medium">Descrição</th>
                    <th className="text-left font-medium">Categoria</th>
                    <th className="text-right font-medium">Valor</th>
                    <th className="text-center font-medium">Pago</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {obraLanc.length === 0 && (
                    <tr><td colSpan={6} className="py-6 text-center text-muted-foreground">Nenhum lançamento.</td></tr>
                  )}
                  {obraLanc.map((l) => (
                    <tr key={l.id} className="border-b border-border/40 hover:bg-muted/20">
                      <td className="py-3 font-mono text-xs">{formatDate(l.data)}</td>
                      <td>{l.descricao}</td>
                      <td className="text-muted-foreground">{categoriaLabel[l.categoria]}</td>
                      <td className={`text-right font-mono font-semibold ${l.tipo === "receita" ? "text-success" : "text-destructive"}`}>
                        {l.tipo === "receita" ? "+" : "−"} {formatCurrency(l.valor)}
                      </td>
                      <td className="text-center">
                        {l.pago ? <CheckCircle2 className="h-4 w-4 text-success inline" /> : <Circle className="h-4 w-4 text-muted-foreground inline" />}
                      </td>
                      <td><Button variant="ghost" size="icon" onClick={() => removeLancamento(l.id)}><Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" /></Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

/* ============ Sub-dialogs ============ */

function FormDialog({ trigger, title, children, onSubmit }: { trigger: React.ReactNode; title: string; children: React.ReactNode; onSubmit: () => boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); if (onSubmit()) setOpen(false); }} className="space-y-4">
          {children}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function NovaEtapaDialog({ obraId, ordem, onAdd }: { obraId: string; ordem: number; onAdd: (e: Etapa) => void }) {
  const [f, setF] = useState({ nome: "", inicio: "", fim: "" });
  return (
    <FormDialog
      trigger={<Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Etapa</Button>}
      title="Nova etapa"
      onSubmit={() => {
        if (!f.nome) { toast.error("Informe o nome da etapa"); return false; }
        onAdd({ id: uuid(), obraId, nome: f.nome, inicio: f.inicio, fim: f.fim, status: "pendente", ordem });
        setF({ nome: "", inicio: "", fim: "" });
        return true;
      }}
    >
      <div className="grid gap-2"><Label>Nome</Label><Input value={f.nome} onChange={(e) => setF({ ...f, nome: e.target.value })} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-2"><Label>Início</Label><Input type="date" value={f.inicio} onChange={(e) => setF({ ...f, inicio: e.target.value })} /></div>
        <div className="grid gap-2"><Label>Fim</Label><Input type="date" value={f.fim} onChange={(e) => setF({ ...f, fim: e.target.value })} /></div>
      </div>
    </FormDialog>
  );
}

function NovaTarefaDialog({ obraId, onAdd }: { obraId: string; onAdd: (t: Tarefa) => void }) {
  const [f, setF] = useState({ titulo: "", responsavel: "", prazo: "" });
  return (
    <FormDialog
      trigger={<Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Tarefa</Button>}
      title="Nova tarefa"
      onSubmit={() => {
        if (!f.titulo) { toast.error("Informe o título"); return false; }
        onAdd({ id: uuid(), obraId, titulo: f.titulo, responsavel: f.responsavel, prazo: f.prazo, concluida: false });
        setF({ titulo: "", responsavel: "", prazo: "" });
        return true;
      }}
    >
      <div className="grid gap-2"><Label>Título</Label><Input value={f.titulo} onChange={(e) => setF({ ...f, titulo: e.target.value })} /></div>
      <div className="grid gap-2"><Label>Responsável</Label><Input value={f.responsavel} onChange={(e) => setF({ ...f, responsavel: e.target.value })} /></div>
      <div className="grid gap-2"><Label>Prazo</Label><Input type="date" value={f.prazo} onChange={(e) => setF({ ...f, prazo: e.target.value })} /></div>
    </FormDialog>
  );
}

function NovoMembroDialog({ obraId, onAdd }: { obraId: string; onAdd: (m: Membro) => void }) {
  const [f, setF] = useState({ nome: "", funcao: "pedreiro" as Membro["funcao"], telefone: "", diaria: "" });
  return (
    <FormDialog
      trigger={<Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Membro</Button>}
      title="Novo membro"
      onSubmit={() => {
        if (!f.nome) { toast.error("Informe o nome"); return false; }
        onAdd({ id: uuid(), obraId, nome: f.nome, funcao: f.funcao, telefone: f.telefone, diaria: Number(f.diaria) || 0 });
        setF({ nome: "", funcao: "pedreiro", telefone: "", diaria: "" });
        return true;
      }}
    >
      <div className="grid gap-2"><Label>Nome</Label><Input value={f.nome} onChange={(e) => setF({ ...f, nome: e.target.value })} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-2">
          <Label>Função</Label>
          <Select value={f.funcao} onValueChange={(v: any) => setF({ ...f, funcao: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(funcaoLabel).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2"><Label>Diária (R$)</Label><Input type="number" value={f.diaria} onChange={(e) => setF({ ...f, diaria: e.target.value })} /></div>
      </div>
      <div className="grid gap-2"><Label>Telefone</Label><Input value={f.telefone} onChange={(e) => setF({ ...f, telefone: e.target.value })} /></div>
    </FormDialog>
  );
}

function NovoMaterialDialog({ obraId, onAdd }: { obraId: string; onAdd: (m: Material) => void }) {
  const [f, setF] = useState({ nome: "", unidade: "un", quantidade: "", precoUnit: "", fornecedor: "", status: "solicitado" as Material["status"] });
  return (
    <FormDialog
      trigger={<Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Material</Button>}
      title="Novo material"
      onSubmit={() => {
        if (!f.nome) { toast.error("Informe o nome"); return false; }
        onAdd({
          id: uuid(), obraId, nome: f.nome, unidade: f.unidade,
          quantidade: Number(f.quantidade) || 0, precoUnit: Number(f.precoUnit) || 0,
          fornecedor: f.fornecedor, status: f.status, data: new Date().toISOString().slice(0, 10),
        });
        setF({ nome: "", unidade: "un", quantidade: "", precoUnit: "", fornecedor: "", status: "solicitado" });
        return true;
      }}
    >
      <div className="grid gap-2"><Label>Nome</Label><Input value={f.nome} onChange={(e) => setF({ ...f, nome: e.target.value })} /></div>
      <div className="grid grid-cols-3 gap-3">
        <div className="grid gap-2"><Label>Qtd</Label><Input type="number" value={f.quantidade} onChange={(e) => setF({ ...f, quantidade: e.target.value })} /></div>
        <div className="grid gap-2"><Label>Unidade</Label><Input value={f.unidade} onChange={(e) => setF({ ...f, unidade: e.target.value })} /></div>
        <div className="grid gap-2"><Label>Preço unit.</Label><Input type="number" value={f.precoUnit} onChange={(e) => setF({ ...f, precoUnit: e.target.value })} /></div>
      </div>
      <div className="grid gap-2"><Label>Fornecedor</Label><Input value={f.fornecedor} onChange={(e) => setF({ ...f, fornecedor: e.target.value })} /></div>
      <div className="grid gap-2">
        <Label>Status</Label>
        <Select value={f.status} onValueChange={(v: any) => setF({ ...f, status: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="solicitado">Solicitado</SelectItem>
            <SelectItem value="comprado">Comprado</SelectItem>
            <SelectItem value="entregue">Entregue</SelectItem>
            <SelectItem value="usado">Usado</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </FormDialog>
  );
}

function NovoLancamentoDialog({ obraId, onAdd }: { obraId: string; onAdd: (l: Lancamento) => void }) {
  const [f, setF] = useState({
    tipo: "despesa" as Lancamento["tipo"],
    categoria: "material" as Lancamento["categoria"],
    descricao: "", valor: "", data: new Date().toISOString().slice(0, 10), pago: true,
  });
  return (
    <FormDialog
      trigger={<Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Lançamento</Button>}
      title="Novo lançamento"
      onSubmit={() => {
        if (!f.descricao || !f.valor) { toast.error("Informe descrição e valor"); return false; }
        onAdd({
          id: uuid(), obraId, tipo: f.tipo, categoria: f.categoria,
          descricao: f.descricao, valor: Number(f.valor), data: f.data, pago: f.pago,
        });
        setF({ tipo: "despesa", categoria: "material", descricao: "", valor: "", data: new Date().toISOString().slice(0, 10), pago: true });
        return true;
      }}
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-2">
          <Label>Tipo</Label>
          <Select value={f.tipo} onValueChange={(v: any) => setF({ ...f, tipo: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="receita">Receita</SelectItem>
              <SelectItem value="despesa">Despesa</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Categoria</Label>
          <Select value={f.categoria} onValueChange={(v: any) => setF({ ...f, categoria: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(categoriaLabel).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-2"><Label>Descrição</Label><Input value={f.descricao} onChange={(e) => setF({ ...f, descricao: e.target.value })} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-2"><Label>Valor (R$)</Label><Input type="number" value={f.valor} onChange={(e) => setF({ ...f, valor: e.target.value })} /></div>
        <div className="grid gap-2"><Label>Data</Label><Input type="date" value={f.data} onChange={(e) => setF({ ...f, data: e.target.value })} /></div>
      </div>
    </FormDialog>
  );
}

export default ObraDetalhe;
