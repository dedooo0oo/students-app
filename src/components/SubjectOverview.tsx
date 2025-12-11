import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  Calendar,
  Clock,
  MapPin,
  Download,
  User,
  Mail,
  ArrowLeft,
  GraduationCap,
} from "lucide-react";
import {
  mockStudentData,
  mockSubjects,
} from "../data/mockData";

interface SubjectOverviewProps {
  onBack: () => void;
}

export function SubjectOverview({
  onBack,
}: SubjectOverviewProps) {
  const {
    studentName,
    studentId,
    semester,
    upcomingClasses,
    overallAttendance,
    facultyInfo,
  } = mockStudentData;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Subject Overview
            </h1>
            <p className="text-gray-600 mt-1">
              {studentName} • {studentId} • {semester}
            </p>
          </div>
        </div>

        {/* Detailed Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Classes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingClasses.map((classItem, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <div className="font-medium text-sm mb-2">
                      {classItem.subject}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {classItem.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        {classItem.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Overall Attendance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Overall Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">
                    {overallAttendance}%
                  </div>
                  <p className="text-sm text-gray-600">
                    Overall Progress
                  </p>
                </div>
                <Progress
                  value={overallAttendance}
                  className="h-3"
                />
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    {overallAttendance >= 75
                      ? "✅ Great attendance! Keep it up."
                      : "⚠️ Attendance below 75%. Consider attending more classes."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Faculty Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Faculty Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {facultyInfo.map((faculty, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        {faculty.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        {faculty.department}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {faculty.email}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Subject Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Subject Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {mockSubjects.length}
                </div>
                <p className="text-sm text-gray-600">
                  Total Subjects
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {mockSubjects.reduce(
                    (acc, subject) =>
                      acc + subject.modules.length,
                    0,
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  Total Modules
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {mockSubjects.reduce(
                    (acc, subject) =>
                      acc +
                      subject.modules.reduce(
                        (modAcc, module) =>
                          modAcc + module.topics.length,
                        0,
                      ),
                    0,
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  Total Topics
                </p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t flex justify-center">
              <Button className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download Full Syllabus
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}