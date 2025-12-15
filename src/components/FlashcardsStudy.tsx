import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  Brain,
  Sparkles,
  RotateCcw,
  Check,
  X,
  ChevronRight,
  BookOpen,
  Layers,
  TrendingUp,
  Clock,
  Star,
  Shuffle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  difficulty: "facile" | "medio" | "difficile";
  lastReviewed?: Date;
  confidence: number; // 0-5 for spaced repetition
}

interface FlashcardsStudyProps {
  subjectTitle: string;
  subjectColor: string;
}

export function FlashcardsStudy({ subjectTitle, subjectColor }: FlashcardsStudyProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [sessionStats, setSessionStats] = useState({
    studied: 0,
    confident: 0,
    needsReview: 0
  });
  const [studyMode, setStudyMode] = useState<"sequential" | "random" | "spaced">("sequential");

  // Mock flashcards - in produzione con spaced repetition algorithm
  const flashcards: Flashcard[] = [
    {
      id: "fc1",
      front: "Cosa significa 'Affordance' nel design?",
      back: "L'affordance è la proprietà percepita di un oggetto che suggerisce come può essere utilizzato. Ad esempio, un pulsante sollevato suggerisce che può essere premuto.",
      category: "Design Principles",
      difficulty: "facile",
      confidence: 0
    },
    {
      id: "fc2",
      front: "Qual è la Legge di Fitts?",
      back: "La Legge di Fitts afferma che il tempo necessario per raggiungere un target è funzione della distanza dal target e della sua dimensione. Target più grandi e più vicini sono più facili da selezionare.",
      category: "Leggi di UX",
      difficulty: "medio",
      confidence: 0
    },
    {
      id: "fc3",
      front: "Cosa sono le euristiche di Nielsen?",
      back: "Le 10 euristiche di usabilità di Jakob Nielsen sono principi generali per il design di interfacce utente, tra cui: visibilità dello stato del sistema, corrispondenza tra sistema e mondo reale, controllo e libertà dell'utente, consistenza, prevenzione degli errori, riconoscimento vs richiamo, flessibilità, design estetico, aiuto nella gestione degli errori, help e documentazione.",
      category: "Usabilità",
      difficulty: "medio",
      confidence: 0
    },
    {
      id: "fc4",
      front: "Cos'è il Cognitive Load?",
      back: "Il carico cognitivo è la quantità totale di risorse mentali richieste per elaborare informazioni. Si divide in: intrinseco (complessità intrinseca del materiale), estraneo (causato da cattivo design) e pertinente (elaborazione necessaria per l'apprendimento).",
      category: "Psicologia Cognitiva",
      difficulty: "difficile",
      confidence: 0
    },
    {
      id: "fc5",
      front: "Cosa significa 'User-Centered Design'?",
      back: "Il design centrato sull'utente (UCD) è un approccio iterativo che coinvolge gli utenti durante tutto il processo di design, con focus su bisogni, caratteristiche e contesti d'uso. Include ricerca utenti, prototipazione, testing e iterazione.",
      category: "Metodologie",
      difficulty: "facile",
      confidence: 0
    },
    {
      id: "fc6",
      front: "Qual è la Legge di Miller?",
      back: "La Legge di Miller (7±2) afferma che la memoria di lavoro umana può gestire circa 7 (più o meno 2) elementi contemporaneamente. Nel design, suggerisce di limitare opzioni e raggruppare informazioni in chunk significativi.",
      category: "Psicologia Cognitiva",
      difficulty: "medio",
      confidence: 0
    },
    {
      id: "fc7",
      front: "Cosa sono i Mental Models?",
      back: "I modelli mentali sono rappresentazioni interne di come funziona qualcosa, basate su esperienza e apprendimento. Un buon design dovrebbe allinearsi ai modelli mentali esistenti degli utenti per ridurre il carico cognitivo.",
      category: "Psicologia Cognitiva",
      difficulty: "difficile",
      confidence: 0
    },
    {
      id: "fc8",
      front: "Cos'è il principio di Gestalt?",
      back: "I principi di Gestalt descrivono come percepiamo pattern visivi: prossimità (elementi vicini sono percepiti come gruppo), similarità (elementi simili sono raggruppati), continuità, chiusura, figura-sfondo. Fondamentali per layout e visual hierarchy.",
      category: "Design Principles",
      difficulty: "medio",
      confidence: 0
    }
  ];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleConfidence = (confident: boolean) => {
    setSessionStats(prev => ({
      studied: prev.studied + 1,
      confident: prev.confident + (confident ? 1 : 0),
      needsReview: prev.needsReview + (confident ? 0 : 1)
    }));

    toast.success(confident ? "Ottimo! 🎉" : "Segnerò per ripassare 📝");

    // Move to next card
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(prev => prev + 1);
      setIsFlipped(false);
    } else {
      toast.success("Sessione completata!", {
        description: `${sessionStats.confident + (confident ? 1 : 0)} carte padronegiate su ${flashcards.length}`
      });
    }
  };

  const restartSession = () => {
    setCurrentCard(0);
    setIsFlipped(false);
    setSessionStats({ studied: 0, confident: 0, needsReview: 0 });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case "facile": return "bg-green-100 text-green-700";
      case "medio": return "bg-yellow-100 text-yellow-700";
      case "difficile": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const progressPercentage = ((currentCard + 1) / flashcards.length) * 100;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Layers className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-medium">Flashcards Totali</p>
                <p className="font-bold text-gray-900">{flashcards.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-medium">Padroneggiate</p>
                <p className="font-bold text-gray-900">{sessionStats.confident}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-medium">Da Ripassare</p>
                <p className="font-bold text-gray-900">{sessionStats.needsReview}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-medium">Progressi</p>
                <p className="font-bold text-gray-900">
                  {sessionStats.studied}/{flashcards.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Study Mode Selection */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Modalità di Studio:</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant={studyMode === "sequential" ? "default" : "outline"}
                size="sm"
                onClick={() => setStudyMode("sequential")}
              >
                <Layers className="w-4 h-4 mr-2" />
                Sequenziale
              </Button>
              <Button
                variant={studyMode === "random" ? "default" : "outline"}
                size="sm"
                onClick={() => setStudyMode("random")}
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Casuale
              </Button>
              <Button
                variant={studyMode === "spaced" ? "default" : "outline"}
                size="sm"
                onClick={() => setStudyMode("spaced")}
                className="relative"
              >
                <Star className="w-4 h-4 mr-2" />
                Spaced Repetition
                <Badge className="absolute -top-2 -right-2 text-xs bg-purple-500">AI</Badge>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Flashcard */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-600" />
                Flashcards Interactive
              </CardTitle>
              <CardDescription className="mt-2">
                Clicca sulla carta per rivelare la risposta • Sistema spaced repetition integrato
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={restartSession}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Ricomincia
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Carta {currentCard + 1} di {flashcards.length}
              </span>
              <Badge className={getDifficultyColor(flashcards[currentCard].difficulty)}>
                {flashcards[currentCard].difficulty}
              </Badge>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Flashcard */}
          <div className="flex justify-center mb-6">
            <motion.div
              className="w-full max-w-2xl cursor-pointer"
              style={{ perspective: "1000px" }}
              onClick={handleFlip}
            >
              <motion.div
                className="relative w-full"
                style={{
                  transformStyle: "preserve-3d",
                  transition: "transform 0.6s"
                }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
              >
                {/* Front */}
                <motion.div
                  className="w-full min-h-[300px] rounded-2xl p-8 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden"
                  }}
                >
                  <div className="text-center">
                    <Badge className="bg-white/20 text-white border-white/30 mb-4">
                      {flashcards[currentCard].category}
                    </Badge>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {flashcards[currentCard].front}
                    </h3>
                    <p className="text-blue-100 text-sm">
                      Clicca per rivelare la risposta
                    </p>
                  </div>
                </motion.div>

                {/* Back */}
                <motion.div
                  className="absolute top-0 left-0 w-full min-h-[300px] rounded-2xl p-8 flex items-center justify-center bg-gradient-to-br from-green-500 to-teal-600 shadow-2xl"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)"
                  }}
                >
                  <div className="text-center">
                    <Badge className="bg-white/20 text-white border-white/30 mb-4">
                      {flashcards[currentCard].category}
                    </Badge>
                    <p className="text-white text-lg leading-relaxed">
                      {flashcards[currentCard].back}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <AnimatePresence>
            {isFlipped && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex gap-4 justify-center"
              >
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleConfidence(false)}
                  className="border-2 border-orange-300 hover:bg-orange-50 text-orange-700"
                >
                  <X className="w-5 h-5 mr-2" />
                  Da Ripassare
                </Button>
                <Button
                  size="lg"
                  onClick={() => handleConfidence(true)}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Lo So Bene!
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Helper Text */}
          {!isFlipped && (
            <div className="text-center text-sm text-gray-500 mt-4">
              💡 Prova a rispondere mentalmente prima di rivelare la risposta
            </div>
          )}
        </CardContent>
      </Card>

      {/* Spaced Repetition Info */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                Sistema di Ripetizione Spaziata
                <Badge className="bg-purple-500 text-white">AI-Powered</Badge>
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                L'algoritmo di spaced repetition ottimizza i tuoi ripassi mostrando le carte al momento ideale per massimizzare la ritenzione a lungo termine. 
                Le carte che trovi difficili riappariranno più frequentemente.
              </p>
              <div className="flex gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  Padroneggiate: ripetizione dopo 7 giorni
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  In corso: ripetizione dopo 3 giorni
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  Da rivedere: ripetizione domani
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generate More Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                Genera Flashcards Personalizzate
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                L'AI può creare flashcards automaticamente dai tuoi appunti, slide e materiali del corso. 
                Personalizza argomenti e difficoltà per uno studio mirato.
              </p>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                <Sparkles className="w-4 h-4 mr-2" />
                Genera da Materiale
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
