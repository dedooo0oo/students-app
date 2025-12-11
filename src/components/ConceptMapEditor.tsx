import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ConceptMap, ConceptMapNode } from "../data/mockData";
import {
  Plus,
  Trash2,
  Save,
  X,
  Sparkles,
  Paperclip,
  RefreshCw,
} from "lucide-react";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface ConceptMapEditorProps {
  conceptMap: ConceptMap;
  title: string;
  onSave: (updatedMap: ConceptMap) => void;
}

export function ConceptMapEditor({
  conceptMap,
  title,
  onSave,
}: ConceptMapEditorProps) {
  const [editedMap, setEditedMap] =
    useState<ConceptMap>(conceptMap);
  const [selectedNode, setSelectedNode] =
    useState<ConceptMapNode | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [draggingNodeId, setDraggingNodeId] = useState<
    string | null
  >(null);
  const [dragOffset, setDragOffset] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<
    string | null
  >(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const arrangedRef = useRef(false);

  const NODE_RADIUS = 70; // Raggio minimo tra centri dei nodi

  useEffect(() => {
    setEditedMap(conceptMap);
    arrangedRef.current = false;
  }, [conceptMap]);

  // Drag handlers
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (
        !draggingNodeId ||
        !containerRef.current ||
        !dragOffset
      )
        return;
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const minX = 60;
      const minY = 40;
      const maxX = rect.width - 60;
      const maxY = rect.height - 40;

      let newX = Math.max(
        minX,
        Math.min(maxX, mouseX - dragOffset.x),
      );
      let newY = Math.max(
        minY,
        Math.min(maxY, mouseY - dragOffset.y),
      );

      // Collision detection - evita sovrapposizioni
      const currentNode = editedMap.nodes.find(
        (n) => n.id === draggingNodeId,
      );
      if (currentNode) {
        for (const otherNode of editedMap.nodes) {
          if (otherNode.id === draggingNodeId) continue;

          const dx = newX - otherNode.x;
          const dy = newY - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < NODE_RADIUS) {
            // Sposta il nodo per mantenere la distanza minima
            const angle = Math.atan2(dy, dx);
            newX = otherNode.x + Math.cos(angle) * NODE_RADIUS;
            newY = otherNode.y + Math.sin(angle) * NODE_RADIUS;
          }
        }
      }

      setEditedMap((prev) => ({
        ...prev,
        nodes: prev.nodes.map((n) =>
          n.id === draggingNodeId
            ? { ...n, x: newX, y: newY }
            : n,
        ),
      }));
    };

    const onMouseUp = () => {
      if (draggingNodeId) {
        setDraggingNodeId(null);
        setDragOffset(null);
        // Auto-save dopo drag
        onSave({
          ...editedMap,
          lastModified: new Date().toISOString(),
        });
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [draggingNodeId, dragOffset, editedMap, onSave]);

  // Arrange nodes radially con collision detection
  const arrangeRadial = (force = false) => {
    const nodes = editedMap.nodes;
    if (!containerRef.current || nodes.length === 0) return;
    if (arrangedRef.current && !force) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    let centerNode = nodes.reduce(
      (best, n) =>
        !best || n.connections.length > best.connections.length
          ? n
          : best,
      nodes[0],
    );

    const titleMatch = nodes.find((n) =>
      (n.title || n.label)
        .toLowerCase()
        .includes((title || "").toLowerCase().split(" ")[0]),
    );
    if (titleMatch) centerNode = titleMatch;

    const others = nodes.filter((n) => n.id !== centerNode.id);
    const radius = Math.max(
      120,
      Math.min(rect.width, rect.height) / 2 - 80,
    );
    const angleStep =
      others.length > 0 ? (Math.PI * 2) / others.length : 0;
    const startAngle = -Math.PI / 2;

    const positioned = [
      { ...centerNode, x: centerX, y: centerY },
      ...others.map((n, i) => {
        const angle = startAngle + i * angleStep;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        return { ...n, x, y };
      }),
    ];

    setEditedMap((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => {
        const p = positioned.find((pos) => pos.id === n.id);
        return p ? { ...n, x: p.x, y: p.y } : n;
      }),
    }));
    arrangedRef.current = true;
  };

  // Ricalcola disposizione quando cambia il numero di nodi o la finestra cambia dimensione
  useLayoutEffect(() => {
    arrangeRadial();
  }, [editedMap.nodes.length]);

  useEffect(() => {
    const onResize = () => arrangeRadial(true);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [editedMap.nodes.length]);

  const startDragging = (
    e: React.MouseEvent,
    node: ConceptMapNode,
  ) => {
    const target = e.target as HTMLElement;
    if (target.closest("button")) return;

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    setDraggingNodeId(node.id);
    setDragOffset({ x: mouseX - node.x, y: mouseY - node.y });
    e.stopPropagation();
  };

  const handleNodeClick = (node: ConceptMapNode) => {
    setSelectedNode(node);
    setModalOpen(true);
  };

  const updateSelectedNode = (
    updates: Partial<ConceptMapNode>,
  ) => {
    if (!selectedNode) return;

    const updated = { ...selectedNode, ...updates };
    setSelectedNode(updated);

    setEditedMap((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) =>
        n.id === updated.id ? updated : n,
      ),
      isAIGenerated: false,
    }));
  };

  const handleSaveNode = () => {
    onSave({
      ...editedMap,
      lastModified: new Date().toISOString(),
    });
    setModalOpen(false);
  };

  const handleDeleteNode = (nodeId: string) => {
    setEditedMap((prev) => ({
      ...prev,
      nodes: prev.nodes
        .filter((n) => n.id !== nodeId)
        .map((n) => ({
          ...n,
          connections: n.connections.filter(
            (c) => c !== nodeId,
          ),
        })),
    }));
    setModalOpen(false);
    onSave({
      ...editedMap,
      nodes: editedMap.nodes
        .filter((n) => n.id !== nodeId)
        .map((n) => ({
          ...n,
          connections: n.connections.filter(
            (c) => c !== nodeId,
          ),
        })),
      lastModified: new Date().toISOString(),
    });
  };

  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0 || !selectedNode) return;
    const added = Array.from(files).map((f) => ({
      id: `${Date.now()}-${f.name}`,
      name: f.name,
      url: URL.createObjectURL(f),
    }));
    updateSelectedNode({
      attachments: [
        ...(selectedNode.attachments || []),
        ...added,
      ],
    });
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    if (!selectedNode) return;
    updateSelectedNode({
      attachments: (selectedNode.attachments || []).filter(
        (a) => a.id !== attachmentId,
      ),
    });
  };

  // On mount: force an initial arrange after layout/paint
  useEffect(() => {
    // doppio rAF per assicurarsi che il container sia misurabile e che il CSS sia applicato
    const raf1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => arrangeRadial(true));
    });
    return () => cancelAnimationFrame(raf1);
  }, []);

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle>{title}</CardTitle>
              {conceptMap.isAIGenerated && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  Generato con AI
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => arrangeRadial(true)}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Riordina
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          <div
            ref={containerRef}
            className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200 overflow-hidden p-4"
            style={{
              minHeight: 680,
              height: "70vh",
              // Griglia di sfondo: 40px step, colore leggero
              backgroundImage: `linear-gradient(#e6edf3 1px, transparent 1px), linear-gradient(90deg, #e6edf3 1px, transparent 1px)`,
              backgroundSize: "40px 40px, 40px 40px",
            }}
            onClick={() => {
              setSelectedNode(null);
              setModalOpen(false);
            }}
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {editedMap.nodes.map((node) =>
                node.connections.map((connId) => {
                  const targetNode = editedMap.nodes.find(
                    (n) => n.id === connId,
                  );
                  if (!targetNode) return null;
                  return (
                    <line
                      key={`${node.id}-${connId}`}
                      x1={node.x}
                      y1={node.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke="#94a3b8"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                  );
                }),
              )}
            </svg>

            {editedMap.nodes.map((node, index) => {
              const isHovered = hoveredNodeId === node.id;
              const isDragging = draggingNodeId === node.id;

              return (
                <div
                  key={node.id}
                  className={`absolute bg-white border-2 rounded-xl p-3 shadow-lg transition-all cursor-grab active:cursor-grabbing select-none ${
                    isHovered || isDragging
                      ? "border-blue-500 shadow-xl"
                      : "border-gray-300"
                  }`}
                  style={{
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    transform: `translate(-50%, -50%) ${isHovered ? "scale(1.05)" : "scale(1)"}`,
                    minWidth: 120,
                    maxWidth: 180,
                    zIndex: isDragging
                      ? 1000
                      : isHovered
                        ? 100
                        : index,
                    transition: isDragging
                      ? "none"
                      : "all 0.2s ease-out",
                  }}
                  onMouseDown={(e) => startDragging(e, node)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onClick={(e) => {
                    // single click: seleziona il nodo (non apre il modal)
                    e.stopPropagation();
                    setSelectedNode(node);
                  }}
                  onDoubleClick={(e) => {
                    // apertura modal solo con doppio click => "premuto in maniera decisa"
                    e.stopPropagation();
                    handleNodeClick(node);
                  }}
                >
                  <div className="relative">
                    {/* Contenuto nodo */}
                    <div className="flex flex-col items-center text-center gap-1">
                      <div className="text-sm font-semibold line-clamp-2">
                        {node.title || node.label}
                      </div>
                      {node.description && (
                        <div className="text-xs text-gray-500 line-clamp-2">
                          {node.description}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 text-xs text-gray-500">
            Ultima modifica:{" "}
            {new Date(
              editedMap.lastModified,
            ).toLocaleDateString("it-IT")}
          </div>
          <div className="mt-1 text-xs text-gray-400">
            Single click: seleziona • Double click: apri modal •
            Trascina per spostare
          </div>
        </CardContent>
      </Card>

      {/* Modal per editing nodo */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifica Concetto</DialogTitle>
          </DialogHeader>

          {selectedNode && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Titolo
                </label>
                <Input
                  value={
                    selectedNode.title ?? selectedNode.label
                  }
                  onChange={(e) =>
                    updateSelectedNode({
                      title: e.target.value,
                    })
                  }
                  placeholder="Inserisci il titolo..."
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Descrizione
                </label>
                <textarea
                  value={selectedNode.description ?? ""}
                  onChange={(e) =>
                    updateSelectedNode({
                      description: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-md text-sm min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Aggiungi una descrizione..."
                  rows={4}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Documenti allegati
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) =>
                    handleFileChange(e.target.files)
                  }
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />

                {selectedNode.attachments &&
                  selectedNode.attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {selectedNode.attachments.map((a) => (
                        <div
                          key={a.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                        >
                          <a
                            href={a.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-blue-600 hover:underline flex items-center gap-2"
                          >
                            <Paperclip className="w-4 h-4" />
                            {a.name}
                          </a>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleRemoveAttachment(a.id)
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button
                  variant="destructive"
                  onClick={() =>
                    handleDeleteNode(selectedNode.id)
                  }
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Elimina Nodo
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setModalOpen(false)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Annulla
                  </Button>
                  <Button onClick={handleSaveNode}>
                    <Save className="w-4 h-4 mr-2" />
                    Salva
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}