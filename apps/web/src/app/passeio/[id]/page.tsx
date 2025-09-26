"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Clock, 
  Euro, 
  Users, 
  Star, 
  MapPin, 
  Calendar as CalendarIcon,
  User,
  Heart,
  Share2,
  Check,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import Image from "next/image";

interface Passeio {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  duracao: string;
  categoria: string;
  imagens?: string;
  inclusoes?: string;
  idiomas?: string;
  capacidadeMaxima?: number;
  ativo: number;
}

export default function PasseioDetalhes() {
  const params = useParams();
  const router = useRouter();
  const [passeio, setPasseio] = useState<Passeio | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedPeople, setSelectedPeople] = useState(1);
  const [isGroup, setIsGroup] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    nome: "",
    email: "",
    telefone: "",
    observacoes: ""
  });

  useEffect(() => {
    const carregarPasseio = async () => {
      try {
        const response = await fetch(`/api/passeios/${params.id}`);
        if (response.ok) {
          const passeioData = await response.json();
          setPasseio(passeioData);
        } else {
          console.error('Passeio não encontrado');
          setPasseio(null);
        }
      } catch (error) {
        console.error('Erro ao carregar passeio:', error);
        setPasseio(null);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      carregarPasseio();
    }
  }, [params.id]);

  const handleBooking = () => {
    if (!selectedDate || !customerInfo.nome || !customerInfo.email) {
      alert("Por favor, preencha todos os campos obrigatórios e selecione uma data.");
      return;
    }

    // Calcular valor final considerando descontos
    const valorBase = (passeio?.preco || 0) * selectedPeople;
    const desconto = isGroup && selectedPeople >= 5 ? 0.1 : 0;
    const valorFinal = valorBase * (1 - desconto);

    const bookingData = {
      passeioId: passeio?.id,
      passeioNome: passeio?.nome,
      data: selectedDate,
      pessoas: selectedPeople,
      tipoReserva: isGroup ? "grupo" : "individual",
      valorOriginal: valorBase,
      valorTotal: valorFinal,
      desconto: desconto,
      cliente: customerInfo
    };

    // Salvar dados da reserva no localStorage para o checkout
    localStorage.setItem('bookingData', JSON.stringify(bookingData));
    
    // Redirecionar para o checkout
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando detalhes do passeio...</p>
        </div>
      </div>
    );
  }

  if (!passeio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Passeio não encontrado</h1>
          <p className="text-gray-600 mb-4">O passeio que você procura não existe ou não está disponível.</p>
          <Link href="/">
            <Button className="bg-orange-500 hover:bg-orange-600">
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const inclusoes = Array.isArray(passeio.inclusoes) ? passeio.inclusoes : (passeio.inclusoes ? JSON.parse(passeio.inclusoes) : []);
  const idiomas = Array.isArray(passeio.idiomas) ? passeio.idiomas : (passeio.idiomas ? JSON.parse(passeio.idiomas) : []);
  const valorTotal = passeio.preco * selectedPeople;
  const desconto = isGroup && selectedPeople >= 5 ? 0.1 : 0;
  const valorFinal = valorTotal * (1 - desconto);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Coluna principal - Informações do passeio */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero do passeio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg overflow-hidden shadow-sm"
            >
              {/* Imagem do passeio */}
              <div className="h-80 relative overflow-hidden">
                <div className="absolute top-4 left-4 flex gap-2 z-10">
                  <Badge className="bg-blue-600 text-white">{passeio.categoria}</Badge>
                  <Badge className="bg-green-600 text-white">Disponível</Badge>
                </div>
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-orange-500 text-white">
                    {isGroup && selectedPeople >= 5 ? "10% OFF Grupo" : "Melhor Preço"}
                  </Badge>
                </div>
                {(() => {
                  // Parse imagens do passeio - parsing robusto  
                  let imagensArray: string[] = [];
                  
                  if (passeio.imagens) {
                    try {
                      // Se já é array, usa diretamente
                      if (Array.isArray(passeio.imagens)) {
                        imagensArray = passeio.imagens;
                      } 
                      // Se é string, tenta fazer parse
                      else if (typeof passeio.imagens === 'string') {
                        imagensArray = JSON.parse(passeio.imagens);
                      }
                    } catch (error) {
                      console.warn('Erro ao fazer parse das imagens:', passeio.imagens, error);
                      // Fallback: se é string simples, coloca em array
                      if (typeof passeio.imagens === 'string' && passeio.imagens.startsWith('/')) {
                        imagensArray = [passeio.imagens];
                      }
                    }
                  }

                  const primeiraImagem = imagensArray && imagensArray.length > 0 ? imagensArray[0] : null;

                  if (primeiraImagem) {
                    return (
                      <Image
                        src={primeiraImagem}
                        alt={passeio.nome}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 60vw"
                        className="object-cover"
                        priority
                        onError={(e) => {
                          console.error('Erro ao carregar imagem:', primeiraImagem);
                        }}
                      />
                    );
                  } else {
                    // Fallback para emoji se não houver imagem
                    return (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-orange-400 flex items-center justify-center">
                        <span className="text-8xl">🏛️</span>
                      </div>
                    );
                  }
                })()}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{passeio.nome}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{passeio.duracao}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>Máx: {passeio.capacidadeMaxima} pessoas</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{passeio.categoria}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">4.8</span>
                      <span className="text-sm text-gray-500">(127 avaliações)</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      R$ {passeio.preco.toFixed(2)}
                      <span className="text-sm text-gray-500 font-normal">/pessoa</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Sobre este passeio</h3>
                  <p className="text-gray-600 leading-relaxed">{passeio.descricao}</p>
                </div>
              </div>
            </motion.div>

            {/* Inclusos */}
            {inclusoes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-600" />
                      O que está incluído
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-3">
                      {inclusoes.map((item: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Idiomas */}
            {idiomas.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Idiomas disponíveis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {idiomas.map((idioma: string, index: number) => (
                        <Badge key={index} variant="outline">{idioma}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Formulário de reserva */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-xl">Reserve seu passeio</CardTitle>
                <div className="text-2xl font-bold text-green-600">
                  R$ {valorFinal.toFixed(2)}
                  {desconto > 0 && (
                    <div className="text-sm text-gray-500 line-through">
                      R$ {valorTotal.toFixed(2)}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Seleção de data */}
                <div>
                  <Label htmlFor="date">Data do passeio *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                          format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Tipo de reserva */}
                <div>
                  <Label>Tipo de reserva</Label>
                  <div className="flex gap-2 mt-1">
                    <Button
                      type="button"
                      variant={!isGroup ? "default" : "outline"}
                      size="sm"
                      onClick={() => {setIsGroup(false); setSelectedPeople(1);}}
                      className="flex-1"
                    >
                      <User className="h-4 w-4 mr-1" />
                      Individual
                    </Button>
                    <Button
                      type="button"
                      variant={isGroup ? "default" : "outline"}
                      size="sm"
                      onClick={() => {setIsGroup(true); setSelectedPeople(5);}}
                      className="flex-1"
                    >
                      <Users className="h-4 w-4 mr-1" />
                      Grupo
                    </Button>
                  </div>
                </div>

                {/* Número de pessoas */}
                <div>
                  <Label htmlFor="people">Número de pessoas</Label>
                  <Select
                    value={selectedPeople.toString()}
                    onValueChange={(value) => setSelectedPeople(Number(value))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: passeio.capacidadeMaxima || 20 }, (_, i) => i + 1).map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'pessoa' : 'pessoas'}
                          {num >= 5 && ' (Desconto 10%)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Informações do cliente */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Suas informações</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="nome">Nome completo *</Label>
                      <Input
                        id="nome"
                        placeholder="Seu nome"
                        value={customerInfo.nome}
                        onChange={(e) => setCustomerInfo({...customerInfo, nome: e.target.value})}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        placeholder="(11) 99999-9999"
                        value={customerInfo.telefone}
                        onChange={(e) => setCustomerInfo({...customerInfo, telefone: e.target.value})}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="observacoes">Observações</Label>
                      <Textarea
                        id="observacoes"
                        placeholder="Alguma solicitação especial?"
                        value={customerInfo.observacoes}
                        onChange={(e) => setCustomerInfo({...customerInfo, observacoes: e.target.value})}
                        className="mt-1 resize-none"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* Resumo do valor */}
                <div className="border-t pt-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>R$ {passeio.preco.toFixed(2)} × {selectedPeople}</span>
                      <span>R$ {valorTotal.toFixed(2)}</span>
                    </div>
                    {desconto > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Desconto grupo (10%)</span>
                        <span>-R$ {(valorTotal * desconto).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total</span>
                      <span>R$ {valorFinal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleBooking}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3"
                  size="lg"
                >
                  Continuar para pagamento
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Você não será cobrado ainda. Confirme os detalhes na próxima etapa.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}