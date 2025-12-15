import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import {
  Bot,
  Send,
  Sparkles,
  User,
  Lightbulb,
  BookOpen,
  HelpCircle,
  Zap,
  MessageCircle,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // Ho corretto anche l'import di motion

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AITutorProps {
  subjectTitle: string;
  subjectColor: string;
}

export function AITutor({
  subjectTitle,
  subjectColor,
}: AITutorProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Ciao! 👋 Sono il tuo tutor AI per ${subjectTitle}. Posso aiutarti con:
      
• Spiegazioni di concetti complessi
• Consigli su come studiare meglio
• Chiarimenti su esercizi e teoria
• Suggerimenti su risorse aggiuntive
• Preparazione agli esami

Cosa vuoi sapere oggi?`,
      timestamp: new Date(),
      suggestions: [
        "Spiegami le euristiche di Nielsen",
        "Come posso migliorare in questo corso?",
        "Quali sono gli argomenti chiave per l'esame?",
        "Ho dubbi sull'affordance",
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  // **ATTENZIONE:** Utilizzeremo questo ref sul DIV CONTENUTO nello ScrollArea.
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scorri fino alla fine del contenitore dei messaggi
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages]);

  const simulateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (
      lowerMessage.includes("nielsen") ||
      lowerMessage.includes("euristiche")
    ) {
      return `Le 10 euristiche di usabilità di Jakob Nielsen sono principi fondamentali per valutare le interfacce:

1. **Visibilità dello stato del sistema** - Feedback continuo all'utente
2. **Corrispondenza tra sistema e mondo reale** - Linguaggio familiare
3. **Controllo e libertà dell'utente** - Undo/Redo facili
4. **Consistenza e standard** - Elementi uniformi
5. **Prevenzione degli errori** - Design che previene problemi
6. **Riconoscimento anziché richiamo** - Minimizza carico memoria
7. **Flessibilità ed efficienza** - Scorciatoie per utenti esperti
8. **Design estetico e minimalista** - Solo info essenziali
9. **Aiuto nel riconoscere e gestire errori** - Messaggi chiari
10. **Help e documentazione** - Informazioni facilmente accessibili

Vuoi che approfondisca qualche euristica in particolare?`;
    }

    if (lowerMessage.includes("affordance")) {
      return `L'**affordance** è un concetto fondamentale nel design!

**Definizione**: Le proprietà percepite di un oggetto che suggeriscono come può essere utilizzato.

**Esempi pratici**:
• 🔘 Un pulsante sollevato → "premimi"
• 🔗 Testo sottolineato blu → "cliccami"
• 📱 Una maniglia → "tirami/spingimi"
• ↕️ Una barra di scorrimento → "trascinami"

**Tipi di affordance**:
1. **Percettiva**: Visivamente suggerita
2. **Fisica**: Basata su proprietà fisiche
3. **Culturale**: Appresa per convenzione

**Nel design digitale**: Dobbiamo creare affordances chiare attraverso forma, colore, ombreggiatura e animazioni.

Ti serve un esempio più specifico?`;
    }

    if (
      lowerMessage.includes("esame") ||
      lowerMessage.includes("preparazione")
    ) {
      return `Per prepararti al meglio all'esame di ${subjectTitle}:

**📚 Strategia di Studio:**
1. Rivedi le mappe concettuali di ogni modulo
2. Completa gli esercizi practice (target: 80% successo)
3. Studia le flashcards con spaced repetition
4. Guarda i video consigliati per approfondimenti

**🎯 Argomenti Chiave:**
• Principi di usabilità (euristiche Nielsen)
• Leggi di UX (Fitts, Hick, Miller)
• Metodologie di testing
• Design centrato sull'utente
• Affordance e feedback

**⏰ Timeline suggerita:**
• 2 settimane prima: ripassi generali
• 1 settimana prima: esercizi intensivi
• 3 giorni prima: flashcards e mappe
• 1 giorno prima: ripasso veloce

**💡 Consiglio**: Usa il practice mode per simulare l'esame!

Vuoi che ti crei un piano di studio personalizzato?`;
    }

    if (
      lowerMessage.includes("come") &&
      (lowerMessage.includes("studiare") ||
        lowerMessage.includes("migliorare"))
    ) {
      return `Ecco le migliori strategie per questo corso:

**🧠 Tecniche di Apprendimento Efficaci:**

1. **Spaced Repetition** Usa le flashcards con intervalli crescenti (1 giorno → 3 giorni → 1 settimana)

2. **Active Recall**
   Cerca di ricordare attivamente prima di controllare le risposte

3. **Interleaving**
   Alterna diversi argomenti invece di blocchi monotematici

4. **Elaborazione**
   Spiega i concetti con parole tue, crea esempi pratici

5. **Practice Testing**
   Fai molti esercizi, il testing migliora la ritenzione del 50%!

**📊 Il tuo percorso ideale:**
1. Guarda le lezioni / leggi materiali
2. Crea mappe concettuali (AI-assisted)
3. Pratica con esercizi
4. Ripassi con flashcards
5. Discuti nel forum con altri studenti

Quale di queste tecniche vuoi approfondire?`;
    }

    if (lowerMessage.includes("gestalt")) {
      return `I **Principi di Gestalt** spiegano come percepiamo pattern visivi:

**Principi fondamentali:**

1. **Prossimità** 👥
   Elementi vicini sono percepiti come gruppo

2. **Similarità** 🔵🔵🔵
   Elementi simili sono raggruppati visivamente

3. **Continuità** ➡️
   L'occhio segue linee e percorsi continui

4. **Chiusura** ⭕
   Completiamo mentalmente forme incomplete

5. **Figura-Sfondo** 🎭
   Distinguiamo oggetto principale da sfondo

6. **Simmetria** ⚖️
   Preferiamo forme bilanciate e simmetriche

**Applicazioni nel Web Design:**
• Raggruppamento di contenuti correlati
• Creazione di visual hierarchy
• Layout bilanciati e armonios• Navigazione intuitiva

Vuoi vedere esempi pratici di applicazione?`;
    }

    // Default response
    return `Interessante domanda! Basandomi sul programma di ${subjectTitle}, posso aiutarti a:

• Approfondire concetti teorici
• Fornire esempi pratici
• Suggerire risorse aggiuntive
• Creare esercizi su misura

Puoi essere più specifico sulla tua richiesta? Ad esempio:
- "Spiegami il concetto di X"
- "Come si applica Y nel design?"
- "Fammi un esempio di Z"

Oppure scegli uno dei suggerimenti qui sotto! 👇`;
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: simulateAIResponse(userMessage.content), // Usa userMessage.content per la risposta
        timestamp: new Date(),
        suggestions: [
          "Spiegami meglio",
          "Fammi un esempio pratico",
          "Altri suggerimenti?",
          "Come applico questo?",
        ],
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-medium">
                  Conversazioni
                </p>
                <p className="font-bold text-gray-900">24</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-medium">
                  Concetti Spiegati
                </p>
                <p className="font-bold text-gray-900">47</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-medium">
                  Risposta Media
                </p>
                <p className="font-bold text-gray-900">1.2s</p>
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
                <p className="text-xs text-gray-600 uppercase font-medium">
                  Disponibile
                </p>
                <p className="font-bold text-gray-900">24/7</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  AI Tutor
                  <Badge className="bg-green-500 text-white">
                    <div className="w-2 h-2 rounded-full bg-white mr-1"></div>
                    Online
                  </Badge>
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Sempre disponibile per aiutarti
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <BookOpen className="w-4 h-4 mr-2" />
                Cronologia
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Messages Area */}
        {/* ScrollArea è l'elemento che gestisce lo scroll e deve essere flex-1 */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-blue-500 to-purple-500"
                          : "bg-gradient-to-br from-purple-500 to-pink-500"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div>
                      <div
                        className={`rounded-2xl p-4 ${
                          message.role === "user"
                            ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-line">
                          {message.content}
                        </p>
                      </div>

                      {/* Suggestions */}
                      {message.suggestions && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.suggestions.map(
                            (suggestion, idx) => (
                              <Button
                                key={idx}
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleSuggestionClick(
                                    suggestion,
                                  )
                                }
                                className="text-xs"
                              >
                                {suggestion}
                              </Button>
                            ),
                          )}
                        </div>
                      )}

                      <p className="text-xs text-gray-500 mt-2">
                        {message.timestamp.toLocaleTimeString(
                          "it-IT",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl p-4">
                    <div className="flex gap-1">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-gray-400"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.6,
                          delay: 0,
                        }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full bg-gray-400"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.6,
                          delay: 0.2,
                        }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full bg-gray-400"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.6,
                          delay: 0.4,
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* **ELEMENTO DI SCORRIMENTO** Questo div vuoto assicura che lo scroll vada alla fine */}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Fai una domanda al tutor AI..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && handleSend()
              }
              className="flex-1"
              disabled={isTyping} // Disabilita l'input mentre l'AI risponde
            />
            <Button
              onClick={handleSend}
              className={subjectColor}
              disabled={!inputValue.trim() || isTyping}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 Premi Invio per inviare • Il tutor usa AI per
            risposte personalizzate
          </p>
        </div>
      </Card>

      {/* AI Info Card */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                Come funziona il Tutor AI?
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Il nostro AI Tutor è alimentato da modelli
                linguistici avanzati e addestrato specificamente
                sul programma di {subjectTitle}. Può:
              </p>
              <ul className="text-sm text-gray-700 space-y-1 mb-4">
                <li>
                  ✓ Spiegare concetti complessi con esempi
                  pratici
                </li>
                <li>
                  ✓ Adattare le risposte al tuo livello di
                  comprensione
                </li>
                <li>✓ Suggerire risorse personalizzate</li>
                <li>✓ Creare esercizi su misura</li>
                <li>✓ Rispondere 24/7 senza limiti</li>
              </ul>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <HelpCircle className="w-4 h-4" />
                <span>
                  Le risposte sono generate da AI e potrebbero
                  richiedere verifica
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}