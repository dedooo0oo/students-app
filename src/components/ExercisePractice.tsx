import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Brain, 
  Target, 
  Trophy, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  Sparkles,
  Clock,
  TrendingUp,
  Award,
  RotateCcw,
  ChevronRight,
  Lightbulb,
  Timer
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

interface Exercise {
  id: string;
  question: string;
  type: "multiple-choice" | "true-false" | "open";
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  difficulty: "facile" | "medio" | "difficile";
  topic: string;
  aiGenerated: boolean;
}

interface ExercisePracticeProps {
  subjectTitle: string;
  subjectColor: string;
}

export function ExercisePractice({ subjectTitle, subjectColor }: ExercisePracticeProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("tutti");
  const [currentExercise, setCurrentExercise] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [sessionActive, setSessionActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Mock exercises - in produzione verrebbero da API/AI
  const exercises: Exercise[] = [
    {
      id: "ex1",
      question: "Quale principio di usabilità sottolinea l'importanza di fornire feedback immediato all'utente?",
      type: "multiple-choice",
      options: [
        "Consistenza",
        "Visibilità dello stato del sistema",
        "Prevenzione degli errori",
        "Flessibilità ed efficienza d'uso"
      ],
      correctAnswer: 1,
      explanation: "La 'Visibilità dello stato del sistema' è la prima euristica di Nielsen e sottolinea che il sistema deve sempre informare l'utente su cosa sta accadendo attraverso feedback appropriato in tempo ragionevole.",
      difficulty: "facile",
      topic: "Principi di Usabilità",
      aiGenerated: true
    },
    {
      id: "ex2",
      question: "L'affordance è la proprietà di un oggetto che suggerisce come può essere utilizzato.",
      type: "true-false",
      options: ["Vero", "Falso"],
      correctAnswer: 0,
      explanation: "Corretto! L'affordance è un concetto introdotto da James Gibson e successivamente applicato al design da Don Norman. Si riferisce alle proprietà percepite di un oggetto che suggeriscono come interagire con esso.",
      difficulty: "facile",
      topic: "Design",
      aiGenerated: false
    },
    {
      id: "ex3",
      question: "In un test di usabilità, quanti partecipanti sono generalmente sufficienti per identificare l'80% dei problemi di usabilità?",
      type: "multiple-choice",
      options: ["3 utenti", "5 utenti", "10 utenti", "20 utenti"],
      correctAnswer: 1,
      explanation: "Secondo gli studi di Jakob Nielsen, 5 utenti sono sufficienti per identificare circa l'80-85% dei problemi di usabilità. Questo è noto come il principio del 'testing con 5 utenti'.",
      difficulty: "medio",
      topic: "Testing",
      aiGenerated: true
    },
    {
      id: "ex4",
      question: "Quale legge di UX afferma che 'il tempo necessario per prendere una decisione aumenta con il numero e la complessità delle scelte'?",
      type: "multiple-choice",
      options: [
        "Legge di Fitts",
        "Legge di Hick",
        "Legge di Miller",
        "Legge di Jakob"
      ],
      correctAnswer: 1,
      explanation: "La Legge di Hick-Hyman descrive il tempo necessario per prendere una decisione in funzione del numero di scelte disponibili. È fondamentale per progettare menu e interfacce semplificate.",
      difficulty: "medio",
      topic: "Leggi di UX",
      aiGenerated: true
    },
    {
      id: "ex5",
      question: "Cosa si intende per 'cognitive load' nel design di interfacce?",
      type: "multiple-choice",
      options: [
        "Il peso fisico del dispositivo",
        "La quantità di risorse mentali richieste per utilizzare un'interfaccia",
        "Il tempo di caricamento della pagina",
        "Il numero di click necessari"
      ],
      correctAnswer: 1,
      explanation: "Il cognitive load (carico cognitivo) si riferisce alla quantità totale di risorse mentali richieste per elaborare informazioni e completare compiti. Un buon design minimizza il carico cognitivo estraneo.",
      difficulty: "difficile",
      topic: "Psicologia Cognitiva",
      aiGenerated: true
    }
  ];

  const filteredExercises = selectedDifficulty === "tutti" 
    ? exercises 
    : exercises.filter(ex => ex.difficulty === selectedDifficulty);

  const startSession = () => {
    setSessionActive(true);
    setCurrentExercise(0);
    setScore({ correct: 0, total: 0 });
    setUserAnswer(null);
    setShowExplanation(false);
    setTimeElapsed(0);
  };

  const handleAnswer = (answer: string | number) => {
    if (showExplanation) return;
    
    setUserAnswer(String(answer));
    setShowExplanation(true);
    
    const isCorrect = answer === filteredExercises[currentExercise].correctAnswer;
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    if (isCorrect) {
      toast.success("Risposta corretta! 🎉", {
        description: "Ottimo lavoro!"
      });
    } else {
      toast.error("Risposta errata", {
        description: "Leggi la spiegazione per capire meglio"
      });
    }
  };

  const nextExercise = () => {
    if (currentExercise < filteredExercises.length - 1) {
      setCurrentExercise(prev => prev + 1);
      setUserAnswer(null);
      setShowExplanation(false);
    } else {
      // Session complete
      toast.success("Sessione completata!", {
        description: `Hai risposto correttamente a ${score.correct + (userAnswer === String(filteredExercises[currentExercise].correctAnswer) ? 1 : 0)} su ${filteredExercises.length} domande`
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case "facile": return "bg-green-100 text-green-700 border-green-200";
      case "medio": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "difficile": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-medium">Esercizi Totali</p>
                <p className="font-bold text-gray-900">{exercises.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-medium">Tasso Successo</p>
                <p className="font-bold text-gray-900">
                  {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-medium">AI-Generated</p>
                <p className="font-bold text-gray-900">
                  {exercises.filter(ex => ex.aiGenerated).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-medium">Punteggio</p>
                <p className="font-bold text-gray-900">
                  {score.correct}/{score.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Exercise Area */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-600" />
                Esercizi e Practice Mode
              </CardTitle>
              <CardDescription className="mt-2">
                Allenati con esercizi AI-generated e materiale fornito dal docente
              </CardDescription>
            </div>
            <Button onClick={startSession} className={subjectColor}>
              <Zap className="w-4 h-4 mr-2" />
              {sessionActive ? "Ricomincia" : "Inizia Sessione"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Difficulty Filter */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className="text-sm font-medium text-gray-700">Difficoltà:</span>
            {["tutti", "facile", "medio", "difficile"].map(diff => (
              <Button
                key={diff}
                variant={selectedDifficulty === diff ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedDifficulty(diff);
                  setCurrentExercise(0);
                  setUserAnswer(null);
                  setShowExplanation(false);
                }}
                className="capitalize"
              >
                {diff}
              </Button>
            ))}
          </div>

          {!sessionActive ? (
            /* Welcome State */
            <div className="text-center py-16">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-6"
              >
                <Brain className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Pronto a testare le tue conoscenze?
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Inizia una sessione di pratica per consolidare quanto appreso. 
                Gli esercizi sono generati con AI e calibrati sul programma del corso.
              </p>
              <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
                <div className="p-4 rounded-lg bg-green-50 border border-green-100">
                  <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Feedback Immediato</p>
                  <p className="text-xs text-gray-600 mt-1">Ricevi spiegazioni dettagliate</p>
                </div>
                <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
                  <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">AI-Powered</p>
                  <p className="text-xs text-gray-600 mt-1">Esercizi generati automaticamente</p>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                  <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Progressi Tracciati</p>
                  <p className="text-xs text-gray-600 mt-1">Monitora il tuo miglioramento</p>
                </div>
              </div>
            </div>
          ) : (
            /* Active Exercise */
            <AnimatePresence mode="wait">
              <motion.div
                key={currentExercise}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Domanda {currentExercise + 1} di {filteredExercises.length}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={getDifficultyColor(filteredExercises[currentExercise].difficulty) + " border"}
                      >
                        {filteredExercises[currentExercise].difficulty}
                      </Badge>
                      {filteredExercises[currentExercise].aiGenerated && (
                        <Badge className="bg-purple-100 text-purple-700 border border-purple-200">
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Progress 
                    value={((currentExercise + 1) / filteredExercises.length) * 100} 
                    className="h-2"
                  />
                </div>

                {/* Question */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 mb-6 border border-blue-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-purple-600 uppercase mb-2">
                        {filteredExercises[currentExercise].topic}
                      </p>
                      <p className="text-gray-900 font-medium leading-relaxed">
                        {filteredExercises[currentExercise].question}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-3 mb-6">
                  {filteredExercises[currentExercise].options?.map((option, index) => {
                    const isSelected = userAnswer === String(index);
                    const isCorrect = index === filteredExercises[currentExercise].correctAnswer;
                    const showResult = showExplanation;

                    return (
                      <motion.button
                        key={index}
                        whileHover={{ scale: showExplanation ? 1 : 1.02 }}
                        whileTap={{ scale: showExplanation ? 1 : 0.98 }}
                        onClick={() => handleAnswer(index)}
                        disabled={showExplanation}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          showResult && isCorrect
                            ? "border-green-500 bg-green-50"
                            : showResult && isSelected && !isCorrect
                            ? "border-red-500 bg-red-50"
                            : isSelected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
                        } ${showExplanation ? "cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
                            showResult && isCorrect
                              ? "bg-green-500 text-white"
                              : showResult && isSelected && !isCorrect
                              ? "bg-red-500 text-white"
                              : isSelected
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}>
                            {showResult && isCorrect ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : showResult && isSelected && !isCorrect ? (
                              <XCircle className="w-5 h-5" />
                            ) : (
                              String.fromCharCode(65 + index)
                            )}
                          </div>
                          <span className={`flex-1 ${
                            showResult && (isCorrect || (isSelected && !isCorrect))
                              ? "font-medium"
                              : ""
                          }`}>
                            {option}
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6"
                    >
                      <div className={`rounded-lg p-5 border-l-4 ${
                        userAnswer === String(filteredExercises[currentExercise].correctAnswer)
                          ? "bg-green-50 border-l-green-500"
                          : "bg-orange-50 border-l-orange-500"
                      }`}>
                        <div className="flex items-start gap-3">
                          <Lightbulb className={`w-5 h-5 mt-0.5 ${
                            userAnswer === String(filteredExercises[currentExercise].correctAnswer)
                              ? "text-green-600"
                              : "text-orange-600"
                          }`} />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Spiegazione</h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {filteredExercises[currentExercise].explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCurrentExercise(0);
                      setUserAnswer(null);
                      setShowExplanation(false);
                    }}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Ricomincia
                  </Button>

                  {showExplanation && (
                    <Button
                      onClick={nextExercise}
                      className={subjectColor}
                    >
                      {currentExercise < filteredExercises.length - 1 ? (
                        <>
                          Prossima Domanda
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </>
                      ) : (
                        <>
                          <Award className="w-4 h-4 mr-2" />
                          Completa Sessione
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </CardContent>
      </Card>

      {/* AI Generator Card */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                Genera Esercizi Personalizzati con AI
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                L'intelligenza artificiale può creare esercizi su misura basati sui tuoi progressi, 
                argomenti studiati e aree di miglioramento identificate.
              </p>
              <div className="flex gap-3">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Brain className="w-4 h-4 mr-2" />
                  Genera 5 Esercizi
                </Button>
                <Button variant="outline">
                  Personalizza
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
