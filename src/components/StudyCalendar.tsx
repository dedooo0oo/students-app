import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Calendar,
  Clock,
  Briefcase,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Plus,
  Settings,
  Trash2,
  Edit3,
} from "lucide-react";
import { Subject, WorkScheduleEntry } from "../data/mockData";
import { Label } from "./ui/label";

interface StudySession {
  id: string;
  subjectId: string;
  subjectTitle: string;
  topicTitle: string;
  date: string; // ISO yyyy-mm-dd
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  duration: number; // hours
  type: "studio" | "recupero" | "ripasso";
  color: string;
}

interface StudyCalendarProps {
  subjects: Subject[];
  workSchedule: WorkScheduleEntry[];
  onWorkScheduleUpdate: (schedule: WorkScheduleEntry[]) => void;
}

export function StudyCalendar({
  subjects,
  workSchedule,
  onWorkScheduleUpdate,
}: StudyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"week" | "month">("week");
  const [isWorkScheduleOpen, setIsWorkScheduleOpen] =
    useState(false);
  const [newWorkEntry, setNewWorkEntry] = useState<
    Partial<WorkScheduleEntry>
  >({
    day: "Lunedì",
    startTime: "09:00",
    endTime: "17:00",
    type: "lavoro",
  });

  // user-editable sessions (persist in component state)
  const [userSessions, setUserSessions] = useState<
    StudySession[]
  >([]);
  const [selectedSession, setSelectedSession] =
    useState<StudySession | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Generate smart study schedule (base plan)
  const baseSessions = useMemo(() => {
    const sessions: StudySession[] = [];
    const today = new Date();
    let sessionIndex = 0;

    // Flatten topics that need study (we include not-attended OR flagged by estimatedStudyHours)
    const topicsToPlan: { subject: Subject; topic: any }[] = [];
    subjects.forEach((subject) => {
      subject.modules.forEach((module) => {
        module.topics.forEach((topic: any) => {
          // Plan for topics with some estimated study hours OR not attended
          if (
            !topic.attended ||
            (topic.estimatedStudyHours &&
              topic.estimatedStudyHours > 0)
          ) {
            topicsToPlan.push({ subject, topic });
          }
        });
      });
    });

    // Spread topics across the next N days, avoiding work hours
    const planningHorizonDays = Math.max(
      14,
      Math.ceil(topicsToPlan.length / 2) * 7,
    );
    const maxDailySlots = 3;

    let dayOffset = 0;
    for (let i = 0; i < topicsToPlan.length; i++) {
      const { subject, topic } = topicsToPlan[i];
      const duration = Math.min(
        Math.max(1, Math.round(topic.estimatedStudyHours || 1)),
        3,
      );

      // find a date (increment dayOffset until we find a day with enough free slots considering work schedule)
      let candidateDate: Date | null = null;
      let candidateDayOffset = dayOffset;
      while (!candidateDate) {
        const d = new Date(today);
        d.setDate(d.getDate() + candidateDayOffset);
        const dayName = d.toLocaleDateString("it-IT", {
          weekday: "long",
        });
        const work = workSchedule.find(
          (w) => w.day.toLowerCase() === dayName.toLowerCase(),
        );
        // Count already scheduled base sessions on this date
        const dateStr = d.toISOString().split("T")[0];
        const countOnDate = sessions.filter(
          (s) => s.date === dateStr,
        ).length;
        // allow up to maxDailySlots unless work consumes whole day
        if (work) {
          // compute working hours
          const startW = parseInt(
            work.startTime.split(":")[0],
            10,
          );
          const endW = parseInt(work.endTime.split(":")[0], 10);
          const availableSlots = 12 - (endW - startW); // rough heuristic
          if (
            countOnDate <
            Math.max(1, Math.min(maxDailySlots, availableSlots))
          ) {
            candidateDate = d;
          } else {
            candidateDayOffset++;
          }
        } else {
          if (countOnDate < maxDailySlots) candidateDate = d;
          else candidateDayOffset++;
        }

        // safety cap
        if (candidateDayOffset > planningHorizonDays) {
          candidateDate = d; // fallback
        }
      }

      // pick a start hour: prefer late afternoon if no work, otherwise after work end
      const dStr = candidateDate.toISOString().split("T")[0];
      const dayName = candidateDate.toLocaleDateString(
        "it-IT",
        { weekday: "long" },
      );
      const workOnDay = workSchedule.find(
        (w) => w.day.toLowerCase() === dayName.toLowerCase(),
      );
      let startHour = 16;
      if (workOnDay) {
        const endHour = parseInt(
          workOnDay.endTime.split(":")[0],
          10,
        );
        startHour = Math.min(18, Math.max(endHour + 1, 13));
      } else {
        // if there are already sessions that day, schedule earlier
        const count = sessions.filter(
          (s) => s.date === dStr,
        ).length;
        startHour = count === 0 ? 16 : 10 + count * 2;
      }

      const startTime = `${startHour.toString().padStart(2, "0")}:00`;
      const endTime = `${(startHour + duration).toString().padStart(2, "0")}:00`;

      sessions.push({
        id: `auto-${subject.id}-${topic.id}-${i}`,
        subjectId: subject.id,
        subjectTitle: subject.title,
        topicTitle: topic.title,
        date: dStr,
        startTime,
        endTime,
        duration,
        type: topic.attended ? "ripasso" : "recupero",
        color: subject.color,
      });

      sessionIndex++;
      // bump dayOffset gradually to spread topics across several days
      if (i % 2 === 1) dayOffset++;
    }

    return sessions;
  }, [subjects, workSchedule]);

  // Merge baseSessions with user edits (userSessions acts as overrides/persistent in-state)
  useEffect(() => {
    // Map existing user edits by id
    const userMap = new Map(userSessions.map((s) => [s.id, s]));
    // Merge preserving any user modified session (same id) or include base session
    const merged = baseSessions.map(
      (bs) => userMap.get(bs.id) ?? bs,
    );
    // Also include any user-only sessions (created by user) that don't exist in base
    const extra = userSessions.filter(
      (s) =>
        s.id &&
        !s.id.startsWith("auto-") &&
        !merged.find((m) => m.id === s.id),
    );
    setUserSessions((prev) => {
      // replace entire list with merged + extras but keep order: merged first
      return [...merged, ...extra];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseSessions]);

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff =
      startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      return date;
    });
  };

  const weekDays = getWeekDays();

  const getSessionsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return userSessions.filter((s) => s.date === dateStr);
  };

  const getWorkForDay = (date: Date) => {
    const dayName = date.toLocaleDateString("it-IT", {
      weekday: "long",
    });
    return workSchedule.find(
      (w) => w.day.toLowerCase() === dayName.toLowerCase(),
    );
  };

  const handleAddWorkEntry = () => {
    if (
      newWorkEntry.day &&
      newWorkEntry.startTime &&
      newWorkEntry.endTime &&
      newWorkEntry.type
    ) {
      const entry: WorkScheduleEntry = {
        id: Date.now().toString(),
        day: newWorkEntry.day,
        startTime: newWorkEntry.startTime,
        endTime: newWorkEntry.endTime,
        type: newWorkEntry.type as any,
      };
      onWorkScheduleUpdate([...workSchedule, entry]);
      setIsWorkScheduleOpen(false);
      setNewWorkEntry({
        day: "Lunedì",
        startTime: "09:00",
        endTime: "17:00",
        type: "lavoro",
      });
    }
  };

  const handleDeleteWorkEntry = (id: string) => {
    onWorkScheduleUpdate(
      workSchedule.filter((w) => w.id !== id),
    );
  };

  const getTotalStudyHours = () => {
    return userSessions.reduce(
      (acc, session) => acc + session.duration,
      0,
    );
  };

  const getMissedLessons = () => {
    let count = 0;
    subjects.forEach((subject) => {
      subject.modules.forEach((module) => {
        module.topics.forEach((topic: any) => {
          if (!topic.attended) count++;
        });
      });
    });
    return count;
  };

  // Session editing
  const openEdit = (session: StudySession) => {
    setSelectedSession({ ...session });
    setIsEditOpen(true);
  };

  const saveSessionEdit = () => {
    if (!selectedSession) return;
    setUserSessions((prev) => {
      const exists = prev.findIndex(
        (s) => s.id === selectedSession.id,
      );
      if (exists >= 0) {
        const copy = [...prev];
        copy[exists] = { ...selectedSession };
        return copy;
      }
      return [...prev, selectedSession];
    });
    setIsEditOpen(false);
    setSelectedSession(null);
  };

  const deleteSession = (id: string) => {
    setUserSessions((prev) => prev.filter((s) => s.id !== id));
    setIsEditOpen(false);
    setSelectedSession(null);
  };

  const createManualSession = (
    subjectId?: string,
    topicTitle?: string,
  ) => {
    const subject =
      subjects.find((s) => s.id === subjectId) || subjects[0];
    const templateDate = new Date();
    templateDate.setDate(templateDate.getDate() + 1);
    const dateStr = templateDate.toISOString().split("T")[0];
    const newS: StudySession = {
      id: `user-${Date.now()}`,
      subjectId: subject.id,
      subjectTitle: subject.title,
      topicTitle: topicTitle || "Studio libero",
      date: dateStr,
      startTime: "18:00",
      endTime: "19:00",
      duration: 1,
      type: "studio",
      color: subject.color,
    };
    setUserSessions((prev) => [newS, ...prev]);
    openEdit(newS);
  };

  return (
    <div className="space-y-4">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Ore Studio Pianificate
                </p>
                <p className="text-2xl font-bold">
                  {getTotalStudyHours()}h
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Lezioni da Recuperare
                </p>
                <p className="text-2xl font-bold">
                  {getMissedLessons()}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Sessioni Studio
                </p>
                <p className="text-2xl font-bold">
                  {userSessions.length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Impegni Lavorativi
                </p>
                <p className="text-2xl font-bold">
                  {workSchedule.length}
                </p>
              </div>
              <Briefcase className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Calendario Studio Intelligente
            </CardTitle>
            <div className="flex items-center gap-2">
              <Dialog
                open={isWorkScheduleOpen}
                onOpenChange={setIsWorkScheduleOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Orari Lavoro
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Gestisci Orari di Lavoro
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Giorno</Label>
                      <Select
                        value={newWorkEntry.day}
                        onValueChange={(value: any) =>
                          setNewWorkEntry({
                            ...newWorkEntry,
                            day: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "Lunedì",
                            "Martedì",
                            "Mercoledì",
                            "Giovedì",
                            "Venerdì",
                            "Sabato",
                            "Domenica",
                          ].map((day) => (
                            <SelectItem key={day} value={day}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Ora Inizio</Label>
                        <Input
                          type="time"
                          value={newWorkEntry.startTime}
                          onChange={(e) =>
                            setNewWorkEntry({
                              ...newWorkEntry,
                              startTime: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Ora Fine</Label>
                        <Input
                          type="time"
                          value={newWorkEntry.endTime}
                          onChange={(e) =>
                            setNewWorkEntry({
                              ...newWorkEntry,
                              endTime: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Tipo</Label>
                      <Select
                        value={newWorkEntry.type}
                        onValueChange={(value: any) =>
                          setNewWorkEntry({
                            ...newWorkEntry,
                            type: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lavoro">
                            Lavoro
                          </SelectItem>
                          <SelectItem value="impegno">
                            Impegno
                          </SelectItem>
                          <SelectItem value="altro">
                            Altro
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={handleAddWorkEntry}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Aggiungi
                    </Button>

                    <div className="space-y-2">
                      <Label>Impegni Esistenti</Label>
                      {workSchedule.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <div className="text-sm">
                            <span className="font-medium">
                              {entry.day}
                            </span>{" "}
                            - {entry.startTime} to{" "}
                            {entry.endTime}
                            <Badge
                              variant="outline"
                              className="ml-2"
                            >
                              {entry.type}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteWorkEntry(entry.id)
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setDate(newDate.getDate() - 7);
                  setCurrentDate(newDate);
                }}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium min-w-[120px] text-center">
                {currentDate.toLocaleDateString("it-IT", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setDate(newDate.getDate() + 7);
                  setCurrentDate(newDate);
                }}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => createManualSession()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuova Sessione
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Week View */}
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((date, index) => {
              const sessions = getSessionsForDate(date);
              const workEntry = getWorkForDay(date);
              const isToday =
                date.toDateString() ===
                new Date().toDateString();

              return (
                <div
                  key={index}
                  className={`min-h-[200px] p-2 rounded-lg border-2 ${
                    isToday
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="text-center mb-2">
                    <div className="text-xs text-gray-500">
                      {date.toLocaleDateString("it-IT", {
                        weekday: "short",
                      })}
                    </div>
                    <div
                      className={`text-lg font-bold ${isToday ? "text-blue-600" : ""}`}
                    >
                      {date.getDate()}
                    </div>
                  </div>

                  <div className="space-y-1">
                    {workEntry && (
                      <div className="text-xs p-2 bg-purple-100 rounded border border-purple-300">
                        <div className="font-medium flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          {workEntry.type}
                        </div>
                        <div className="text-purple-700">
                          {workEntry.startTime} -{" "}
                          {workEntry.endTime}
                        </div>
                      </div>
                    )}

                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        onClick={() => openEdit(session)}
                        className={`cursor-pointer text-xs p-2 rounded border flex flex-col gap-1 ${
                          session.type === "recupero"
                            ? "bg-orange-100 border-orange-300"
                            : "bg-green-100 border-green-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium truncate">
                            {session.subjectTitle}
                          </div>
                          <div className="text-[10px]">
                            {session.duration}h
                          </div>
                        </div>
                        <div className="text-gray-600 truncate text-[12px]">
                          {session.topicTitle}
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-[12px]">
                          <Clock className="w-3 h-3" />
                          {session.startTime}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Edit Session Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifica Sessione</DialogTitle>
          </DialogHeader>

          {selectedSession && (
            <div className="space-y-4">
              <div>
                <Label>Materia</Label>
                <div className="bg-gray-50 p-2 rounded">
                  {selectedSession.subjectTitle}
                </div>
              </div>

              <div>
                <Label>Argomento</Label>
                <Input
                  value={selectedSession.topicTitle}
                  onChange={(e) =>
                    setSelectedSession((s) =>
                      s
                        ? { ...s, topicTitle: e.target.value }
                        : s,
                    )
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Data</Label>
                  <Input
                    type="date"
                    value={selectedSession.date}
                    onChange={(e) =>
                      setSelectedSession((s) =>
                        s ? { ...s, date: e.target.value } : s,
                      )
                    }
                  />
                </div>
                <div>
                  <Label>Ora Inizio</Label>
                  <Input
                    type="time"
                    value={selectedSession.startTime}
                    onChange={(e) =>
                      setSelectedSession((s) =>
                        s
                          ? { ...s, startTime: e.target.value }
                          : s,
                      )
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Durata (ore)</Label>
                <Input
                  type="number"
                  min={1}
                  max={8}
                  value={selectedSession.duration}
                  onChange={(e) => {
                    const dur = parseInt(
                      e.target.value || "1",
                      10,
                    );
                    setSelectedSession((s) =>
                      s
                        ? {
                            ...s,
                            duration: dur,
                            endTime: `${(parseInt(s.startTime.split(":")[0], 10) + dur).toString().padStart(2, "0")}:00`,
                          }
                        : s,
                    );
                  }}
                />
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button
                  variant="destructive"
                  onClick={() =>
                    selectedSession &&
                    deleteSession(selectedSession.id)
                  }
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Elimina
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditOpen(false);
                      setSelectedSession(null);
                    }}
                  >
                    Annulla
                  </Button>
                  <Button onClick={saveSessionEdit}>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Salva
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}