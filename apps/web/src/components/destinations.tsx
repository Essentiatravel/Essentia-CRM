"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { MapPin, Star } from "lucide-react";

interface Destination {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  highlights: string[];
}

export default function Destinations() {
  const [destinations, setDestinations] = useState<Destination[]>([
    {
      id: "1",
      name: "Roma",
      description: "A cidade eterna com seus monumentos históricos e arquitetura imperial",
      image: "🏛️",
      rating: 4.9,
      highlights: ["Coliseu", "Vaticano", "Fontana di Trevi"]
    },
    {
      id: "2", 
      name: "Veneza",
      description: "A cidade dos canais, com suas gôndolas e palácios únicos",
      image: "🚤",
      rating: 4.8,
      highlights: ["Praça São Marcos", "Ponte dos Suspiros", "Murano"]
    },
    {
      id: "3",
      name: "Florença",
      description: "Berço do Renascimento, com arte e arquitetura incomparáveis",
      image: "🎨",
      rating: 4.9,
      highlights: ["Duomo", "Uffizi", "Ponte Vecchio"]
    },
    {
      id: "4",
      name: "Milão",
      description: "Capital da moda e centro financeiro da Itália",
      image: "👗",
      rating: 4.6,
      highlights: ["Duomo", "La Scala", "Quadrilátero da Moda"]
    },
    {
      id: "5",
      name: "Pisa",
      description: "Famosa pela sua torre inclinada e rica história medieval",
      image: "🗼",
      rating: 4.5,
      highlights: ["Torre de Pisa", "Catedral", "Piazza dei Miracoli"]
    },
    {
      id: "6",
      name: "Costa Amalfitana",
      description: "Litoral deslumbrante com cidades pitorescas e vistas espetaculares",
      image: "🌊",
      rating: 4.8,
      highlights: ["Positano", "Amalfi", "Ravello"]
    }
  ]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(destinations);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setDestinations(items);
  };

  return (
    <section id="destinos" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Os destinos mais incríveis da Itália
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Arraste os cards para reordenar seus destinos favoritos
          </p>
          <Badge variant="outline" className="text-sm">
            💡 Dica: Arraste e solte para organizar
          </Badge>
        </motion.div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="destinations">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {destinations.map((destination, index) => (
                  <Draggable 
                    key={destination.id} 
                    draggableId={destination.id} 
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          className={`transform transition-all duration-200 ${
                            snapshot.isDragging ? 'rotate-2 shadow-2xl z-50' : 'hover:shadow-lg'
                          }`}
                        >
                        <Card className="h-full cursor-grab active:cursor-grabbing">
                          <CardContent className="p-6">
                            <div className="text-center mb-4">
                              <div className="text-4xl mb-3">{destination.image}</div>
                              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {destination.name}
                              </h3>
                              <div className="flex items-center justify-center gap-1 mb-3">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{destination.rating}</span>
                              </div>
                            </div>
                            
                            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                              {destination.description}
                            </p>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                <span>Principais atrações:</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {destination.highlights.map((highlight, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {highlight}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        </motion.div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </section>
  );
}