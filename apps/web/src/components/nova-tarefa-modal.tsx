"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, CalendarDays, User, MapPin, DollarSign, Users, X } from "lucide-react";

interface Passeio {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  duracao: string;
  categoria: string;
}

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
}

interface Guia {
  id: string;
  nome: string;
  email: string;
  especialidades: string[];
}

interface NovaTarefaData {
  passeioId: string | null;
  clienteId: string | null;
  guiaId?: string | null;
  data: string;
  numeroPessoas: number;
  observacoes?: string;
  comissaoPercentual: number;
}

interface NovaTarefaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NovaTarefaData) => void;
  passeios: Passeio[];
  clientes: Cliente[];
  guias: Guia[];
  editingTarefa?: any;
}

const NovaTarefaModal: React.FC<NovaTarefaModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  passeios,
  clientes,
  guias,
  editingTarefa
}) => {
  const [formData, setFormData] = useState<NovaTarefaData>({
    passeioId: null,
    clienteId: null,
    guiaId: null,
    data: "",
    numeroPessoas: 1,
    observacoes: "",
    comissaoPercentual: 30
  });

  // Preencher formulário quando estiver editando
  React.useEffect(() => {
    if (editingTarefa) {
      setFormData({
        passeioId: editingTarefa.passeio_id,
        clienteId: editingTarefa.cliente_id || null,
        guiaId: editingTarefa.guia_id || null,
        data: editingTarefa.data_passeio ? editingTarefa.data_passeio.replace('T', ' ').slice(0, 16) : "",
        numeroPessoas: editingTarefa.numero_pessoas,
        observacoes: editingTarefa.observacoes || "",
        comissaoPercentual: editingTarefa.percentual_comissao || 30
      });
    } else {
      setFormData({
        passeioId: null,
        clienteId: null,
        guiaId: null,
        data: "",
        numeroPessoas: 1,
        observacoes: "",
        comissaoPercentual: 30
      });
    }
  }, [editingTarefa]);

  const selectedPasseio = passeios.find(p => p.id === formData.passeioId);
  const valorTotal = selectedPasseio ? selectedPasseio.preco * formData.numeroPessoas : 0;
  const comissaoValor = valorTotal * (formData.comissaoPercentual / 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.passeioId && formData.data) {
      // Converter "none" para null
      const submitData = {
        ...formData,
        clienteId: formData.clienteId === "none" ? null : formData.clienteId,
        guiaId: formData.guiaId === "none" ? null : formData.guiaId
      };
      onSubmit(submitData);
      onClose();
      // Reset form
      setFormData({
        passeioId: null,
        clienteId: null,
        guiaId: null,
        data: "",
        numeroPessoas: 1,
        observacoes: "",
        comissaoPercentual: 30
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">
            {editingTarefa ? 'Editar Tarefa de Agendamento' : 'Criar Nova Tarefa de Agendamento'}
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coluna Esquerda */}
            <div className="space-y-4">
              {/* Passeio */}
              <div className="space-y-2">
                <Label htmlFor="passeio" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Passeio *
                </Label>
                <Select
                  value={formData.passeioId || ""}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, passeioId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o passeio" />
                  </SelectTrigger>
                  <SelectContent>
                    {passeios.map((passeio) => (
                      <SelectItem key={passeio.id} value={passeio.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{passeio.nome}</span>
                          <span className="text-sm text-gray-500">
                            R$ {passeio.preco.toFixed(2)} • {passeio.duracao}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Guia */}
              <div className="space-y-2">
                <Label htmlFor="guia" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Guia (Opcional)
                </Label>
                <Select
                  value={formData.guiaId || "none"}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, guiaId: value === "none" ? null : value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um guia (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      <span className="text-gray-500">Nenhum guia selecionado</span>
                    </SelectItem>
                    {guias.map((guia) => (
                      <SelectItem key={guia.id} value={guia.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{guia.nome}</span>
                          <span className="text-sm text-gray-500">
                            {Array.isArray(guia.especialidades) ? guia.especialidades.join(", ") : guia.especialidades || "N/A"}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Número de Pessoas */}
              <div className="space-y-2">
                <Label htmlFor="pessoas" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Pessoas
                </Label>
                <Input
                  type="number"
                  id="pessoas"
                  min="1"
                  value={formData.numeroPessoas}
                  onChange={(e) => setFormData(prev => ({ ...prev, numeroPessoas: parseInt(e.target.value) || 1 }))}
                />
              </div>

              {/* Observações */}
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Observações especiais..."
                  value={formData.observacoes}
                  onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>

            {/* Coluna Direita */}
            <div className="space-y-4">
              {/* Cliente */}
              <div className="space-y-2">
                <Label htmlFor="cliente" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Cliente (Opcional)
                </Label>
                <Select
                  value={formData.clienteId || "none"}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, clienteId: value === "none" ? null : value })))
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      <span className="text-gray-500">Nenhum cliente selecionado</span>
                    </SelectItem>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{cliente.nome}</span>
                          <span className="text-sm text-gray-500">{cliente.email}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Data e Hora */}
              <div className="space-y-2">
                <Label htmlFor="data" className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Data e Hora *
                </Label>
                <Input
                  type="datetime-local"
                  id="data"
                  value={formData.data}
                  onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
                  required
                />
              </div>

              {/* Comissão */}
              <div className="space-y-2">
                <Label htmlFor="comissao" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  % Comissão do Guia
                </Label>
                <Input
                  type="number"
                  id="comissao"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.comissaoPercentual}
                  onChange={(e) => setFormData(prev => ({ ...prev, comissaoPercentual: parseFloat(e.target.value) || 0 }))}
                />
                <p className="text-sm text-gray-600">R$ {comissaoValor.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Resumo Financeiro */}
          {selectedPasseio && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total: R$ {valorTotal.toFixed(2)}</span>
                <span className="font-medium text-blue-600">Comissão: R$ {comissaoValor.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!formData.passeioId || !formData.data}
            >
              {editingTarefa ? 'Salvar Alterações' : 'Criar Tarefa'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NovaTarefaModal;