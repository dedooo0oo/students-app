import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import {
  BookOpen,
  Calendar,
  Users,
  ChevronRight,
  Clock,
  Target,
  FileText,
} from "lucide-react";
import { Subject } from "../data/mockData";

interface SubjectsListProps {
  subjects: Subject[];
  onSubjectClick: (subject: Subject) => void;
}

export function SubjectsList({
  subjects,
  onSubjectClick,
}: SubjectsListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Le Tue Materie 📚
        </h2>
        <Badge variant="outline" className="text-sm">
          {subjects.length} materie questo semestre
        </Badge>
      </div>

      <p className="text-gray-600 text-sm mb-6">
        Accedi ai materiali del corso, monitora la frequenza e
        rimani aggiornato sui compiti per tutte le tue materie.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {subjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            onClick={() => onSubjectClick(subject)}
          />
        ))}
      </div>
    </div>
  );
}

function SubjectCard({
  subject,
  onClick,
}: {
  subject: Subject;
  onClick: () => void;
}) {
  const attendancePercentage = Math.round(
    (subject.attendance / subject.totalClasses) * 100,
  );
  const totalTopics = subject.modules.reduce(
    (acc, module) => acc + module.topics.length,
    0,
  );
  const totalClassMaterials = totalTopics * 3; // 3 materials per topic (slide, notes, audio-lezione)
  const totalAdditionalResources =
    subject.additionalResources.assignments.length +
    subject.additionalResources.quizzes.length +
    subject.additionalResources.youtubeVideos.length +
    subject.additionalResources.articles.length;
  const totalResources =
    totalClassMaterials + totalAdditionalResources;

  return (
    <Card
      className="h-fit cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-lg ${subject.color} flex items-center justify-center`}
            >
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {subject.title}
              </CardTitle>
              <p className="text-sm text-gray-600">
                {subject.code}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {subject.modules.length} moduli
            </Badge>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                {subject.instructor}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                {subject.nextClass}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Target className="w-4 h-4" />
                {totalTopics} argomenti trattati
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" />
                {totalResources} risorse disponibili
              </div>
            </div>
          </div>

          {/* Attendance Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Frequenza Lezioni
              </span>
              <span className="text-sm font-medium">
                {attendancePercentage}%
              </span>
            </div>
            <Progress
              value={attendancePercentage}
              className="h-2"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>
                {subject.attendance} lezioni frequentate
              </span>
              <span>{subject.totalClasses} lezioni totali</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 border-t">
            <Button
              className="w-full flex items-center justify-center gap-2"
              onClick={(e: any) => {
                e.stopPropagation();
                onClick();
              }}
            >
              <FileText className="w-4 h-4" />
              Visualizza Materiali
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}