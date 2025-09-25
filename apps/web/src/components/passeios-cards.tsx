"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Clock, Euro, Users, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Passeio {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  duracao: string;
  categoria: string;
  imagens?: string;
  capacidadeMaxima?: number;
  ativo: number;
}

interface PasseiosCardsProps {
  destaque?: boolean;
  limite?: number;
}

// Imagens de exemplo para os passeios
const imagensPasseios: { [key: string]: string } = {
  "História": "/api/placeholder/400/300",
  "Histórico": "/api/placeholder/400/300", 
  "Religioso": "/api/placeholder/400/300",
  "Natureza": "/api/placeholder/400/300",
  "Gastronomia": "/api/placeholder/400/300",
  "Romântico": "/api/placeholder/400/300",
  "Cultural": "/api/placeholder/400/300",
  "Aventura": "/api/placeholder/400/300"
};

export default function PasseiosCards({ destaque = false, limite }: PasseiosCardsProps) {
  const [passeios, setPasseios] = useState<Passeio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarPasseios = async () => {
      try {
        const response = await fetch('/api/passeios');
        if (response.ok) {
          let data = await response.json();
          
          // Filtrar apenas passeios ativos
          data = data.filter((passeio: Passeio) => passeio.ativo === 1);
          
          // Limitar quantidade se especificado
          if (limite) {
            data = data.slice(0, limite);
          }
          
          setPasseios(data);
        } else {
          console.error('Erro ao carregar passeios');
        }
      } catch (error) {
        console.error('Erro ao carregar passeios:', error);
        // Dados de fallback se a API falhar
        setPasseios([
          {
            id: "1",
            nome: "Tour Roma Histórica",
            descricao: "Explore os pontos turísticos mais famosos de Roma",
            preco: 120,
            duracao: "4h",
            categoria: "História",
            capacidadeMaxima: 15,
            ativo: 1
          },
          {
            id: "2", 
            nome: "Vaticano Completo",
            descricao: "Visita guiada ao Vaticano e Capela Sistina",
            preco: 150,
            duracao: "3h", 
            categoria: "Religioso",
            capacidadeMaxima: 12,
            ativo: 1
          },
          {
            id: "3",
            nome: "Toscana Day Trip", 
            descricao: "Dia completo pela bela região da Toscana",
            preco: 280,
            duracao: "8h",
            categoria: "Natureza", 
            capacidadeMaxima: 20,
            ativo: 1
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    carregarPasseios();
  }, [limite]);

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <Card className="h-full">
              <CardContent className="p-0">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    );
  }

  if (passeios.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Nenhum passeio disponível no momento.</p>
        <p className="text-gray-400 text-sm mt-2">Volte em breve para ver nossas ofertas!</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${
      destaque ? 'md:grid-cols-1 lg:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'
    }`}>
      {passeios.map((passeio, index) => (
        <motion.div
          key={passeio.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="transform transition-all duration-200"
        >
          <Card className="h-full hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <CardContent className="p-0 h-full flex flex-col">
              {/* Imagem do passeio */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  <Badge className="bg-blue-600 text-white">
                    {passeio.categoria}
                  </Badge>
                  <Badge variant="secondary" className="bg-green-600 text-white">
                    Disponível
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 z-10">
                  <Badge variant="secondary" className="bg-orange-500 text-white">
                    Até 15% OFF
                  </Badge>
                </div>
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-orange-400 flex items-center justify-center">
                  <span className="text-6xl">🏛️</span>
                </div>
              </div>

              {/* Conteúdo do card */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {passeio.nome}
                    </h3>
                    <div className="flex items-center gap-1 ml-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {passeio.descricao}
                  </p>

                  {/* Informações do passeio */}
                  <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Duração: {passeio.duracao}</span>
                    </div>
                    {passeio.capacidadeMaxima && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>Máx: {passeio.capacidadeMaxima}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preço e botão de ação */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Euro className="w-4 h-4 text-green-600" />
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 line-through">
                        R$ {(passeio.preco * 1.15).toFixed(2)}
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        R$ {passeio.preco.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <Link href={`/passeio/${passeio.id}`}>
                    <Button 
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                      size="sm"
                    >
                      Ver Detalhes
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}