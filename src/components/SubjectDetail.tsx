import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Users,
  FileText,
  Headphones,
  Play,
  Clock,
  TrendingUp,
  Award,
  Presentation,
  StickyNote,
  CalendarDays,
  MapPin,
  Brain,
  MessageSquare,
  Sparkles,
  Download,
  ExternalLink,
  Target,
  Lightbulb,
  BookMarked,
  Search,
  Bell,
  Drop,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { ConceptMap } from "../data/mockData";
import { ConceptMapEditor } from "./ConceptMapEditor";
import { DiscussionForum } from "./DiscussionForum";
import {
  mockStudentData,
  mockSubjects,
  Subject,
  WorkScheduleEntry,
} from "../data/mockData";
import { SubjectsList } from "./SubjectsList";
import { StudyCalendar } from "./StudyCalendar";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenu,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";

interface SubjectDetailProps {
  subject: Subject;
  onBack: () => void;
}

export function SubjectDetail({
  subject,
  onBack,
}: SubjectDetailProps) {
  const [subjectData, setSubjectData] =
    useState<Subject>(subject);
  const attendancePercentage = Math.round(
    (subjectData.attendance / subjectData.totalClasses) * 100,
  );
  const completedModules = Math.floor(
    subjectData.modules.length * 0.6,
  );
  const totalTopics = subjectData.modules.reduce(
    (acc, module) => acc + module.topics.length,
    0,
  );

  const handleSaveConceptMap = (updatedMap: ConceptMap) => {
    setSubjectData({
      ...subjectData,
      courseConceptMap: updatedMap,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header with same style as dashboard */}
      {/* Modern Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Logo + Course Name */}
            <div className="flex items-center gap-4">
              <img
                src="https://cdn.brandfetch.io/id0vp94LKa/w/400/h/400/id5v6C0h_X.png?c=1bxid64Mup7aczewSAYMX&t=1727693103414"
                alt="Università di Trento"
                className="w-17 h-17 rounded-xl object-cover"
                onClick={onBack}
              />
              <div>
                <h1 className="font-bold text-gray-900 text-lg">
                  Università degli Studi di Trento
                </h1>
                <p className="text-sm text-gray-600">
                  Interfacce e Tecnologie della Comunicazione
                </p>
              </div>
            </div>

            {/* Center: Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Cerca materie, moduli, materiali..."
                  className="pl-10 bg-gray-50 border-gray-200"
                />
              </div>
            </div>

            {/* Right: Notifications + Profile */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900">
                        Matteo De Donno
                      </p>
                      <p className="text-xs text-gray-500">
                        MAT234567
                      </p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56"
                >
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Profilo
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Impostazioni
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-medium">
                    Prossima Lezione
                  </p>
                  <p className="font-bold text-gray-900">
                    {subjectData.nextClass}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600 uppercase font-medium">
                    Frequenza
                  </p>
                  <p className="font-bold text-gray-900">
                    {attendancePercentage}%
                  </p>
                  <Progress
                    value={attendancePercentage}
                    className="h-1 mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-medium">
                    Progressi
                  </p>
                  <p className="font-bold text-gray-900">
                    {completedModules}/
                    {subjectData.modules.length} moduli
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-medium">
                    Argomenti
                  </p>
                  <p className="font-bold text-gray-900">
                    {totalTopics} totali
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Overview Card - Beautiful presentation */}
        <Card className="overflow-hidden">
          <div className={`h-2 ${subjectData.color}`}></div>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                  Panoramica del Corso
                </CardTitle>
                <CardDescription className="mt-2">
                  Informazioni generali, obiettivi formativi e
                  date importanti
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Instructor Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Docente
                  </h3>
                </div>
                <div className="pl-10">
                  <p className="font-medium text-gray-900">
                    {subjectData.instructor}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Disponibile durante gli orari di ricevimento
                    per consulenze e chiarimenti
                  </p>
                </div>
              </div>

              {/* Schedule Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Orario Lezioni
                  </h3>
                </div>
                <div className="pl-10">
                  <p className="font-medium text-gray-900">
                    {subjectData.nextClass}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {subjectData.attendance} su{" "}
                    {subjectData.totalClasses} lezioni
                    frequentate
                  </p>
                </div>
              </div>
            </div>

            {/* Course Description */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-5 border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                  <BookMarked className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Descrizione del Corso
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Questo corso fornisce una comprensione
                    approfondita dei principi fondamentali della{" "}
                    {subjectData.title.toLowerCase()}. Gli
                    studenti esploreranno concetti teorici e
                    applicazioni pratiche attraverso{" "}
                    {subjectData.modules.length} moduli
                    strutturati, con {totalTopics} argomenti
                    chiave e materiali didattici completi.
                  </p>
                </div>
              </div>
            </div>

            {/* Learning Objectives */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-orange-50 border border-orange-100">
                <Target className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    Obiettivi Formativi
                  </h4>
                  <p className="text-sm text-gray-700">
                    Acquisire competenze teoriche e pratiche
                    nella disciplina
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 border border-green-100">
                <Lightbulb className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    Competenze Acquisite
                  </h4>
                  <p className="text-sm text-gray-700">
                    Capacità di analisi critica e problem
                    solving applicato
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Main Content */}
        <Tabs defaultValue="modules" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="modules">📚 Moduli</TabsTrigger>
            <TabsTrigger value="exams">📅 Esami</TabsTrigger>
            <TabsTrigger value="concept-map">
              🧠 Mappa
            </TabsTrigger>
            <TabsTrigger value="discussion">
              💬 Forum
            </TabsTrigger>
          </TabsList>

          {/* Modules Tab */}
          <TabsContent
            value="modules"
            className="mt-6 space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle>
                  Moduli e Materiali del Corso
                </CardTitle>
                <CardDescription>
                  Accedi a slide, appunti e podcast per ogni
                  argomento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion
                  type="single"
                  collapsible
                  className="w-full"
                >
                  {subjectData.modules.map((module, index) => (
                    <AccordionItem
                      key={module.id}
                      value={module.id}
                    >
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-4 text-left w-full">
                          <div
                            className={`w-12 h-12 rounded-xl ${subjectData.color} flex items-center justify-center flex-shrink-0`}
                          >
                            <span className="text-white font-bold text-lg">
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {module.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {module.topics.length} argomenti •{" "}
                              {module.topics.length * 3}{" "}
                              materiali
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ModuleContent
                          module={module}
                          subject={subjectData}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exams Tab */}
          <TabsContent value="exams" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5" />
                  Date di Esame e Appelli
                </CardTitle>
                <CardDescription>
                  Calendario completo degli appelli d&apos;esame
                  con orari e sedi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {subjectData.examSessions.map(
                    (session, index) => (
                      <Card
                        key={index}
                        className="overflow-hidden border-l-4 border-l-blue-500"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-3">
                                <Badge
                                  className={`${
                                    session.type === "scritto"
                                      ? "bg-blue-100 text-blue-700 border-blue-200"
                                      : session.type === "orale"
                                        ? "bg-green-100 text-green-700 border-green-200"
                                        : "bg-purple-100 text-purple-700 border-purple-200"
                                  } border`}
                                >
                                  {session.type === "scritto"
                                    ? "📝 Esame Scritto"
                                    : session.type === "orale"
                                      ? "🗣️ Esame Orale"
                                      : "💻 Esame Pratico"}
                                </Badge>
                                <Badge variant="outline">
                                  Appello #{index + 1}
                                </Badge>
                              </div>

                              <div className="grid md:grid-cols-3 gap-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <Calendar className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-600">
                                      Data
                                    </p>
                                    <p className="font-medium text-sm">
                                      {new Date(
                                        session.date,
                                      ).toLocaleDateString(
                                        "it-IT",
                                        {
                                          day: "2-digit",
                                          month: "short",
                                          year: "numeric",
                                        },
                                      )}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-green-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-600">
                                      Orario
                                    </p>
                                    <p className="font-medium text-sm">
                                      {session.time}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                                    <MapPin className="w-4 h-4 text-purple-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-600">
                                      Sede
                                    </p>
                                    <p className="font-medium text-sm">
                                      {session.location}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <Button variant="outline" size="sm">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Dettagli
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Concept Map Tab */}
          <TabsContent value="concept-map" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  Mappa Concettuale del Corso
                </CardTitle>
                <CardDescription>
                  Visualizza e personalizza la mappa concettuale
                  generata dall&apos;AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                {subjectData.courseConceptMap && (
                  <ConceptMapEditor
                    conceptMap={subjectData.courseConceptMap}
                    onSave={handleSaveConceptMap}
                    title="Mappa Concettuale Completa"
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Discussion Tab */}
          <TabsContent value="discussion" className="mt-6">
            <DiscussionForum subject={subjectData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ModuleContent({
  module,
  subject,
}: {
  module: any;
  subject: Subject;
}) {
  const [moduleData, setModuleData] = useState(module);

  const handleSaveTopicConceptMap = (
    topicId: string,
    updatedMap: ConceptMap,
  ) => {
    const updatedTopics = moduleData.topics.map((topic: any) =>
      topic.id === topicId
        ? { ...topic, conceptMap: updatedMap }
        : topic,
    );
    setModuleData({ ...moduleData, topics: updatedTopics });
  };

  return (
    <div className="pl-16 pr-4 space-y-6">
      {/* Topics List */}
      <div className="space-y-4">
        {moduleData.topics.map((topic: any, index: number) => (
          <Card key={topic.id} className="overflow-hidden">
            <CardContent className="p-5">
              {/* Topic Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-bold">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {topic.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="outline"
                        className="text-xs"
                      >
                        {topic.lessonDate}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-xs"
                      >
                        ~{topic.estimatedStudyTime}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Materials Grid */}
              <div className="grid md:grid-cols-3 gap-3 mb-4">
                {topic.resources && (
                  <>
                    <Button
                      variant="outline"
                      className="h-auto p-4 justify-start hover:bg-blue-50 hover:border-blue-300"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100">
                          <Presentation className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="font-medium text-sm">
                            Slide Lezione
                          </p>
                          <p className="text-xs text-gray-500">
                            {topic.resources.lectureSlide}
                          </p>
                        </div>
                        <Download className="w-4 h-4 text-gray-400" />
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-auto p-4 justify-start hover:bg-blue-50 hover:border-blue-300"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-100">
                          <StickyNote className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="font-medium text-sm">
                            Appunti
                          </p>
                          <p className="text-xs text-gray-500">
                            {topic.resources.studentNotes}
                          </p>
                        </div>
                        <Download className="w-4 h-4 text-gray-400" />
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-auto p-4 justify-start hover:bg-blue-50 hover:border-blue-300"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-100">
                          <Headphones className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="font-medium text-sm">
                            Podcast
                          </p>
                          <p className="text-xs text-gray-500">
                            {topic.resources.audio_lezione}
                          </p>
                        </div>
                        <Download className="w-4 h-4 text-gray-400" />
                      </div>
                    </Button>
                  </>
                )}
              </div>

              {/* Concept Map for Topic */}
              {topic.conceptMap && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Mappa Concettuale
                    </span>
                  </div>
                  <ConceptMapEditor
                    conceptMap={topic.conceptMap}
                    onSave={(updatedMap) =>
                      handleSaveTopicConceptMap(
                        topic.id,
                        updatedMap,
                      )
                    }
                    title={`Mappa: ${topic.title}`}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}