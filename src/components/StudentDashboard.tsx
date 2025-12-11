import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  Calendar,
  GraduationCap,
  TrendingUp,
  BookOpen,
  Bell,
  Search,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import {
  mockStudentData,
  mockSubjects,
  Subject,
  WorkScheduleEntry,
} from "../data/mockData";
import { SubjectsList } from "./SubjectsList";
import { SubjectDetail } from "./SubjectDetail";
import { StudyCalendar } from "./StudyCalendar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function StudentDashboard() {
  const [selectedSubject, setSelectedSubject] =
    useState<Subject | null>(null);
  const [workSchedule, setWorkSchedule] = useState<
    WorkScheduleEntry[]
  >(mockStudentData.workSchedule || []);
  const {
    studentName,
    studentId,
    semester,
    upcomingClasses,
    overallAttendance,
  } = mockStudentData;

  // If a subject is selected, show its detail page
  if (selectedSubject) {
    return (
      <SubjectDetail
        subject={selectedSubject}
        onBack={() => setSelectedSubject(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
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
                        {studentName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {studentId}
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
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Bentornato, {studentName}! 👋
            </h2>
            <p className="text-gray-600 mt-1">
              {semester} • Il tuo percorso accademico
            </p>
          </div>
          <Badge
            variant="outline"
            className="flex items-center gap-2 px-4 py-2"
          >
            <GraduationCap className="w-4 h-4" />
            {mockSubjects.length} Materie Attive
          </Badge>
        </div>

        {/* Quick Stats - More Modern */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Prossima Lezione
                    </p>
                  </div>
                  <p className="font-bold text-lg text-gray-900">
                    {upcomingClasses[0]?.subject || "Nessuna"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {upcomingClasses[0]?.time ||
                      "Goditi la giornata! 🎉"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Frequenza
                    </p>
                  </div>
                  <p className="font-bold text-lg text-gray-900">
                    {overallAttendance}%
                  </p>
                  <Progress
                    value={overallAttendance}
                    className="h-2 mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-purple-600" />
                    </div>
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Materie
                    </p>
                  </div>
                  <p className="font-bold text-lg text-gray-900">
                    {mockSubjects.length}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Questo semestre
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-orange-600" />
                    </div>
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Moduli
                    </p>
                  </div>
                  <p className="font-bold text-lg text-gray-900">
                    {mockSubjects.reduce(
                      (acc, subject) =>
                        acc + subject.modules.length,
                      0,
                    )}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Totali disponibili
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="subjects" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="subjects" className="text-base">
              📚 Le Mie Materie
            </TabsTrigger>
            <TabsTrigger value="calendar" className="text-base">
              📅 Calendario Studio
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subjects" className="mt-6">
            <SubjectsList
              subjects={mockSubjects}
              onSubjectClick={setSelectedSubject}
            />
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <StudyCalendar
              subjects={mockSubjects}
              workSchedule={workSchedule}
              onWorkScheduleUpdate={setWorkSchedule}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}