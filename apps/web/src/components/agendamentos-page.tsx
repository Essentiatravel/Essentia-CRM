"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Home,
  Calendar,
  CalendarDays,
  Users,
  Heart,
  DollarSign,
  LogOut,
  Plus,
  User,
  MapPin as Location,
  Clock,
  Edit,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import NovaTarefaModal from "./nova-tarefa-modal";
import { toast } from "sonner";

interface Tarefa {
  id: string;
  passeio_id: string;
  cliente_id: string;
  guia_id?: string | null;
  data_passeio: string;
  numero_pessoas: number;
  valor_total: number;
  valor_comissao: number;
  status: "em_progresso" | "pendente_cliente" | "confirmadas" | "concluidas" | "canceladas" | "pendente" | "concluido";
  observacoes?: string | null;
  passeio_nome?: string;
  cliente_nome?: string;
  guia_nome?: string;
}

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

// Dados do tRPC serão carregados via hooks

const columns = [
  { id: "em_progresso", title: "Em Progresso", count: 0 },
  { id: "pendente", title: "Pendente", count: 0 },
  { id: "pendente_cliente", title: "Pendente Cliente", count: 0 },
  { id: "confirmadas", title: "Confirmadas", count: 0 },
  { id: "concluidas", title: "Concluídas", count: 0 },
  { id: "concluido", title: "Concluído", count: 0 },
  { id: "canceladas", title: "Canceladas", count: 0 }
];

const getStatusColor = (status: string) => {
  const colors = {
    "em_progresso": "text-purple-600 bg-purple-50",
    "pendente_cliente": "text-yellow-600 bg-yellow-50",
    "confirmadas": "text-green-600 bg-green-50",
    "concluidas": "text-blue-600 bg-blue-50",
    "canceladas": "text-red-600 bg-red-50"
  };
  return colors[status as keyof typeof colors] || colors.em_progresso;
};

const Sidebar: React.FC = () => (
  <div className="hidden lg:block w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0">
    <div className="p-6">
      <div className="flex items-center gap-2 mb-8">
        <div className="p-2 bg-blue-600 rounded-lg">
          <MapPin className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-gray-900">TourGuide CRM</h1>
          <p className="text-sm text-gray-600">Administrador</p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          NAVEGAÇÃO
        </h3>
        <nav className="space-y-2">
          {[
            { icon: Home, label: "Dashboard", href: "/admin" },
            { icon: Calendar, label: "Agendamentos", href: "/admin/agendamentos", active: true },
            { icon: CalendarDays, label: "Calendário Global", href: "/admin/calendario" },
            { icon: Users, label: "Guias", href: "/admin/guias" },
            { icon: Heart, label: "Clientes", href: "/admin/clientes" },
            { icon: MapPin, label: "Passeios", href: "/admin/passeios" },
            { icon: DollarSign, label: "Financeiro", href: "/admin/financeiro" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                item.active
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">E</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">ELISSON UZUAL</p>
            <p className="text-xs text-gray-600">uzualelisson@gmail.com</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="w-full">
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
    </div>
  </div>
);

const TaskCard: React.FC<{ 
  tarefa: Tarefa; 
  index: number; 
  onEdit: (tarefa: Tarefa) => void;
  onAprovar: (id: string) => void;
  onRemover: (id: string) => void;
}> = ({ tarefa, index, onEdit, onAprovar, onRemover }) => (
  <Draggable draggableId={tarefa.id} index={index}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={`bg-white rounded-lg border p-4 mb-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
          snapshot.isDragging ? 'shadow-lg' : ''
        }`}
        style={{
          width: '400px',
          minHeight: '200px',
          ...provided.draggableProps.style,
        }}
        onClick={() => onEdit(tarefa)}
      >
        <div className="flex items-start justify-between mb-2">
          <Badge className={`${getStatusColor(tarefa.status)} border-0 text-xs`}>
            {tarefa.status.replace('_', ' ')}
          </Badge>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(tarefa);
              }}
            >
              <Edit className="h-3 w-3" />
            </Button>
            {tarefa.status !== 'confirmadas' && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onAprovar(tarefa.id);
                }}
                title="Aprovar e enviar para calendário"
              >
                <Calendar className="h-3 w-3" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
                onRemover(tarefa.id);
              }}
              title="Remover agendamento"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <h3 className="font-medium text-gray-900 mb-2">{tarefa.passeio_nome || 'Passeio não encontrado'}</h3>

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-3 w-3" />
            <span>{tarefa.cliente_nome || 'Sem cliente definido'}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Location className="h-3 w-3" />
            <span>{tarefa.guia_nome || 'Sem guia definido'}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-3 w-3" />
            <span>{tarefa.data_passeio ? new Date(tarefa.data_passeio).toLocaleDateString('pt-BR') : 'Data não definida'}</span>
          </div>
          
          <div className="text-sm font-medium text-gray-900">
            R$ {(tarefa.valor_total || 0).toFixed(2)}
          </div>
        </div>

        {tarefa.observacoes && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
            {tarefa.observacoes}
          </p>
        )}

        <div className="flex justify-between text-xs text-gray-500">
          <span>{tarefa.numero_pessoas || 1} pessoa(s)</span>
          <span className="text-green-600 font-medium">
            Comissão: R$ {(tarefa.valor_comissao || 0).toFixed(2)}
          </span>
        </div>
      </div>
    )}
  </Draggable>
);

const AgendamentosPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTarefa, setEditingTarefa] = useState<Tarefa | null>(null);
  const [agendamentos, setAgendamentos] = useState<Tarefa[]>([]);
  const [passeios, setPasseios] = useState<Passeio[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [guias, setGuias] = useState<Guia[]>([]);
  const [loadingAgendamentos, setLoadingAgendamentos] = useState(true);
  const [loadingPasseios, setLoadingPasseios] = useState(true);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [loadingGuias, setLoadingGuias] = useState(true);

  // Carregar dados das APIs
  useEffect(() => {
    const fetchData = async () => {
      // Carregar agendamentos - temporariamente desabilitado (API não existe)
      try {
        // TODO: Implementar API de agendamentos
        setAgendamentos([]);
      } catch (error) {
        console.error('Erro ao carregar agendamentos:', error);
      } finally {
        setLoadingAgendamentos(false);
      }

      // Carregar passeios
      try {
        const passeiosResponse = await fetch('/api/passeios');
        if (passeiosResponse.ok) {
          const passeiosData = await passeiosResponse.json();
          setPasseios(passeiosData);
        }
      } catch (error) {
        console.error('Erro ao carregar passeios:', error);
      } finally {
        setLoadingPasseios(false);
      }

      // Carregar clientes - temporariamente desabilitado (API não existe)
      try {
        // TODO: Implementar API de clientes
        setClientes([]);
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
      } finally {
        setLoadingClientes(false);
      }

      // Carregar guias - temporariamente desabilitado (API não existe)
      try {
        // TODO: Implementar API de guias
        setGuias([]);
      } catch (error) {
        console.error('Erro ao carregar guias:', error);
      } finally {
        setLoadingGuias(false);
      }
    };

    fetchData();
  }, []);

  const refetchAgendamentos = async () => {
    // Temporariamente desabilitado - API não existe
    console.log('refetchAgendamentos chamado - API não implementada');
    return;
  };

  const onDragEnd = async (result: DropResult) => {
    // Temporariamente desabilitado - API não existe
    toast.info("Funcionalidade de arrastar e soltar será implementada quando a API de agendamentos estiver pronta");
    return;
  };

  const getTarefasByStatus = (status: string) => {
    return agendamentos.filter(agendamento => agendamento.status === status);
  };

  const handleNovaTarefa = async (data: any) => {
    // Temporariamente desabilitado - API não existe
    toast.info("Funcionalidade de criar agendamentos será implementada quando a API estiver pronta");
    setIsModalOpen(false);
    setEditingTarefa(null);
  };

  const handleEditarTarefa = async (data: any) => {
    // Temporariamente desabilitado - API não existe
    toast.info("Funcionalidade de editar agendamentos será implementada quando a API estiver pronta");
    setIsModalOpen(false);
    setEditingTarefa(null);
  };

  const handleEditClick = (tarefa: Tarefa) => {
    setEditingTarefa(tarefa);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTarefa(null);
  };

  const handleAprovarAgendamento = async (agendamentoId: string) => {
    // Temporariamente desabilitado - API não existe
    toast.info("Funcionalidade de aprovar agendamentos será implementada quando a API estiver pronta");
  };

  const handleRemoverAgendamento = async (agendamentoId: string) => {
    // Temporariamente desabilitado - API não existe
    toast.info("Funcionalidade de remover agendamentos será implementada quando a API estiver pronta");
  };

  if (loadingAgendamentos || loadingPasseios || loadingClientes || loadingGuias) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-64 ml-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Carregando agendamentos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 lg:ml-64 ml-0">
        <div className="p-4 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Agendamentos
              </h1>
              <p className="text-gray-600 mt-1">
                Sistema Kanban para gerenciar o fluxo de trabalho.
              </p>
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                setEditingTarefa(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Tarefa
            </Button>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {columns.map((column) => (
                <div key={column.id} className="flex-shrink-0">
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="font-semibold text-gray-900">{column.title}</h2>
                    <Badge variant="secondary" className="text-xs">
                      {getTarefasByStatus(column.id).length}
                    </Badge>
                  </div>

                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-screen w-96 p-2 rounded-lg transition-colors ${
                          snapshot.isDraggingOver ? 'bg-gray-100' : 'bg-transparent'
                        }`}
                      >
                        {getTarefasByStatus(column.id).map((tarefa, index) => (
                          <TaskCard 
                            key={tarefa.id} 
                            tarefa={tarefa} 
                            index={index} 
                            onEdit={handleEditClick}
                            onAprovar={handleAprovarAgendamento}
                            onRemover={handleRemoverAgendamento}
                          />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>

                <NovaTarefaModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={editingTarefa ? handleEditarTarefa : handleNovaTarefa}
            passeios={passeios}
            clientes={clientes}
            guias={guias}
            editingTarefa={editingTarefa}
          />
    </div>
  );
};

export default AgendamentosPage;