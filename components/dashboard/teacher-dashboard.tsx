"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  BookOpen,
  Calendar,
  FileText,
  Presentation,
  Users,
  Edit2,
  Save,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react"

export default function TeacherDashboard() {
  const [lectureInput, setLectureInput] = useState("")
  const [pptTopic, setPptTopic] = useState("")
  const [lectureOutput, setLectureOutput] = useState("")
  const [pptOutput, setPptOutput] = useState("")
  const [isGeneratingLecture, setIsGeneratingLecture] = useState(false)
  const [isGeneratingPpt, setIsGeneratingPpt] = useState(false)

  const [scheduleDate, setScheduleDate] = useState(new Date())
  const [isEditingSchedule, setIsEditingSchedule] = useState(false)
  const [classSchedule, setClassSchedule] = useState([
    { id: 1, class: "Math 101", time: "9:00 AM", room: "Room 205" },
    { id: 2, class: "Physics 201", time: "11:00 AM", room: "Lab 3" },
    { id: 3, class: "Chemistry 101", time: "2:00 PM", room: "Room 301" },
  ])
  const [editSchedule, setEditSchedule] = useState(classSchedule)

  const [isEditingStats, setIsEditingStats] = useState(false)
  const [stats, setStats] = useState({
    totalStudents: 127,
    avgAttendance: 94,
    pendingAssignments: 23,
  })
  const [editStats, setEditStats] = useState(stats)

  const [isEditingSyllabus, setIsEditingSyllabus] = useState(false)
  const [syllabus, setSyllabus] = useState([
    { id: 1, subject: "Math 101", completed: 15, total: 20, color: "blue" },
    { id: 2, subject: "Physics 201", completed: 12, total: 20, color: "green" },
    { id: 3, subject: "Chemistry 101", completed: 17, total: 20, color: "purple" },
  ])
  const [editSyllabus, setEditSyllabus] = useState(syllabus)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
  }

  const changeScheduleDate = (days: number) => {
    const newDate = new Date(scheduleDate)
    newDate.setDate(newDate.getDate() + days)
    setScheduleDate(newDate)
  }

  const handleSaveSchedule = () => {
    setClassSchedule(editSchedule)
    setIsEditingSchedule(false)
  }

  const handleCancelSchedule = () => {
    setEditSchedule(classSchedule)
    setIsEditingSchedule(false)
  }

  const handleSaveStats = () => {
    setStats(editStats)
    setIsEditingStats(false)
  }

  const handleCancelStats = () => {
    setEditStats(stats)
    setIsEditingStats(false)
  }

  const handleSaveSyllabus = () => {
    setSyllabus(editSyllabus)
    setIsEditingSyllabus(false)
  }

  const handleCancelSyllabus = () => {
    setEditSyllabus(syllabus)
    setIsEditingSyllabus(false)
  }

  const calculateProgress = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0
  }

  const generateLectureNotes = async () => {
    if (!lectureInput.trim()) return

    setIsGeneratingLecture(true)
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `
ROLE: university_faculty
TASK: lecture_notes
TOPIC: ${lectureInput}

DURATION: 45_60_minutes
STYLE:
- formal
- instructional
- classroom_ready

SECTIONS:
- Learning Objectives
- Prerequisites
- Concept Explanation
- Key Definitions
- Examples
- Common Misconceptions
- Teaching Tips
- Revision Summary
`,
          context: { role: "teacher", feature: "lecture-notes" },
        }),
      })

      const data = await response.json()
      if (data.response) {
        setLectureOutput(data.response)
      } else {
        setLectureOutput("Error generating lecture notes. Please try again.")
      }
    } catch (error) {
      setLectureOutput("Failed to connect to AI. Please check your API key.")
    } finally {
      setIsGeneratingLecture(false)
    }
  }

  const generatePptOutline = async () => {
    if (!pptTopic.trim()) return

    setIsGeneratingPpt(true)
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `
ROLE: instructional_designer
TASK: ppt_outline
TOPIC: ${pptTopic}

SLIDE_COUNT: 10 (exact)

OUTPUT_STRUCTURE:
Slide 1:
- title
- bullet_points (max 5)
- suggested_visual

Slide 2:
- title
- bullet_points (max 5)
- suggested_visual

... repeat until Slide 10

CONTENT_DISTRIBUTION:
Slide 1: Title & overview
Slide 2: Definition
Slide 3: Core concepts
Slide 4: Architecture / diagram
Slide 5: Models / types
Slide 6: Working / flow
Slide 7: Examples / use cases
Slide 8: Advantages
Slide 9: Limitations / challenges
Slide 10: Summary

RULES:
- slide_by_slide
- no paragraphs
- no speaker notes
- no greetings
- no extra text
`,
          context: { role: "teacher", feature: "ppt-outline" },
        }),
      })

      const data = await response.json()
      if (data.response) {
        setPptOutput(data.response)
      } else {
        setPptOutput("Error generating PPT outline. Please try again.")
      }
    } catch (error) {
      setPptOutput("Failed to connect to AI. Please check your API key.")
    } finally {
      setIsGeneratingPpt(false)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="card-hover border-l-4 border-l-primary/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              Today's Schedule
            </CardTitle>
            {!isEditingSchedule ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditingSchedule(true)}
                className="hover:bg-primary/10"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            ) : (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSaveSchedule}
                  className="hover:bg-green-500/10 bg-transparent"
                >
                  <Save className="h-4 w-4 text-green-600" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelSchedule}
                  className="hover:bg-destructive/10 bg-transparent"
                >
                  <X className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between pt-2">
            <Button size="sm" variant="ghost" onClick={() => changeScheduleDate(-1)} className="hover:bg-primary/10">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardDescription className="text-center font-medium">{formatDate(scheduleDate)}</CardDescription>
            <Button size="sm" variant="ghost" onClick={() => changeScheduleDate(1)} className="hover:bg-primary/10">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {isEditingSchedule ? (
            <>
              {editSchedule.map((schedule, index) => (
                <div key={schedule.id} className="space-y-2 border rounded-lg p-3 bg-muted/30">
                  <Input
                    placeholder="Class name"
                    value={schedule.class}
                    onChange={(e) => {
                      const updated = [...editSchedule]
                      updated[index].class = e.target.value
                      setEditSchedule(updated)
                    }}
                    className="focus:ring-2 focus:ring-primary/20"
                  />
                  <div className="flex gap-2">
                    <Input
                      placeholder="Time"
                      value={schedule.time}
                      onChange={(e) => {
                        const updated = [...editSchedule]
                        updated[index].time = e.target.value
                        setEditSchedule(updated)
                      }}
                      className="focus:ring-2 focus:ring-primary/20"
                    />
                    <Input
                      placeholder="Room"
                      value={schedule.room}
                      onChange={(e) => {
                        const updated = [...editSchedule]
                        updated[index].room = e.target.value
                        setEditSchedule(updated)
                      }}
                      className="focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              {classSchedule.map((schedule) => (
                <div
                  key={schedule.id}
                  className="border-l-4 border-blue-500 pl-3 p-2 rounded-r-lg hover:bg-muted/50 transition-colors"
                >
                  <p className="font-medium">{schedule.class}</p>
                  <p className="text-sm text-muted-foreground">
                    {schedule.time} • {schedule.room}
                  </p>
                </div>
              ))}
            </>
          )}
        </CardContent>
      </Card>

      <Card className="card-hover border-l-4 border-l-accent/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Users className="h-5 w-5 text-accent" />
              </div>
              Class Statistics
            </CardTitle>
            {!isEditingStats ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditingStats(true)}
                className="hover:bg-accent/10"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            ) : (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSaveStats}
                  className="hover:bg-green-500/10 bg-transparent"
                >
                  <Save className="h-4 w-4 text-green-600" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelStats}
                  className="hover:bg-destructive/10 bg-transparent"
                >
                  <X className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            )}
          </div>
          <CardDescription className="text-muted-foreground">Overview of your students</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {isEditingStats ? (
            <>
              <div className="space-y-2">
                <Label>Total Students</Label>
                <Input
                  type="number"
                  value={editStats.totalStudents}
                  onChange={(e) => setEditStats({ ...editStats, totalStudents: Number.parseInt(e.target.value) || 0 })}
                  className="focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div className="space-y-2">
                <Label>Average Attendance (%)</Label>
                <Input
                  type="number"
                  value={editStats.avgAttendance}
                  onChange={(e) => setEditStats({ ...editStats, avgAttendance: Number.parseInt(e.target.value) || 0 })}
                  className="focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div className="space-y-2">
                <Label>Pending Assignments</Label>
                <Input
                  type="number"
                  value={editStats.pendingAssignments}
                  onChange={(e) =>
                    setEditStats({ ...editStats, pendingAssignments: Number.parseInt(e.target.value) || 0 })
                  }
                  className="focus:ring-2 focus:ring-accent/20"
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-lg border border-blue-500/20">
                <span className="text-muted-foreground">Total Students</span>
                <span className="text-3xl font-bold text-blue-600">{stats.totalStudents}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg border border-green-500/20">
                <span className="text-muted-foreground">Average Attendance</span>
                <span className="text-3xl font-bold text-green-600">{stats.avgAttendance}%</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-lg border border-orange-500/20">
                <span className="text-muted-foreground">Pending Assignments</span>
                <span className="text-3xl font-bold text-orange-600">{stats.pendingAssignments}</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="card-hover border-l-4 border-l-chart-1/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-chart-1/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-chart-1" />
              </div>
              Syllabus Progress
            </CardTitle>
            {!isEditingSyllabus ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditingSyllabus(true)}
                className="hover:bg-chart-1/10"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            ) : (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSaveSyllabus}
                  className="hover:bg-green-500/10 bg-transparent"
                >
                  <Save className="h-4 w-4 text-green-600" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelSyllabus}
                  className="hover:bg-destructive/10 bg-transparent"
                >
                  <X className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            )}
          </div>
          <CardDescription className="text-muted-foreground">Track course completion</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {isEditingSyllabus ? (
            <>
              {editSyllabus.map((item, index) => (
                <div key={item.id} className="space-y-2 border rounded-lg p-3 bg-muted/30">
                  <Input
                    placeholder="Subject name"
                    value={item.subject}
                    onChange={(e) => {
                      const updated = [...editSyllabus]
                      updated[index].subject = e.target.value
                      setEditSyllabus(updated)
                    }}
                    className="focus:ring-2 focus:ring-chart-1/20"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Completed</Label>
                      <Input
                        type="number"
                        min="0"
                        value={item.completed}
                        onChange={(e) => {
                          const updated = [...editSyllabus]
                          updated[index].completed = Number.parseInt(e.target.value) || 0
                          setEditSyllabus(updated)
                        }}
                        className="focus:ring-2 focus:ring-chart-1/20"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Total</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.total}
                        onChange={(e) => {
                          const updated = [...editSyllabus]
                          updated[index].total = Number.parseInt(e.target.value) || 1
                          setEditSyllabus(updated)
                        }}
                        className="focus:ring-2 focus:ring-chart-1/20"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground text-center font-mono">
                    {calculateProgress(item.completed, item.total)}% complete
                  </p>
                </div>
              ))}
            </>
          ) : (
            <>
              {syllabus.map((item) => {
                const progress = calculateProgress(item.completed, item.total)
                return (
                  <div key={item.id} className="p-3 rounded-lg bg-muted/30">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">{item.subject}</span>
                      <span className="text-muted-foreground font-mono">
                        {item.completed} completed of {item.total}
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${item.color === "blue"
                          ? "bg-blue-500"
                          : item.color === "green"
                            ? "bg-green-500"
                            : "bg-purple-500"
                          }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2 card-hover border-t-4 border-t-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <span className="gradient-text">Lecture Notes Generator</span>
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          </CardTitle>
          <CardDescription className="text-muted-foreground">Generate structured lecture notes with AI</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Enter lecture topic and key points..."
            value={lectureInput}
            onChange={(e) => setLectureInput(e.target.value)}
            rows={4}
            className="focus:ring-2 focus:ring-primary/20 resize-none"
          />
          <Button
            className="w-full sm:w-auto"
            onClick={generateLectureNotes}
            disabled={isGeneratingLecture || !lectureInput.trim()}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isGeneratingLecture ? "Generating..." : "Generate Lecture Notes"}
          </Button>
          {lectureOutput && (
            <div className="mt-4 p-4 bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg border border-border/50">
              <p className="text-sm whitespace-pre-wrap">{lectureOutput}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="card-hover border-t-4 border-t-accent/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg">
                <Presentation className="h-5 w-5 text-accent" />
              </div>
              <span className="gradient-text">PPT Outline Creator</span>
              <Sparkles className="h-4 w-4 text-accent animate-pulse" />
            </CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">Create presentation outlines</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="ppt-topic">Presentation Topic</Label>
            <Input
              id="ppt-topic"
              placeholder="e.g., Introduction to Quantum Mechanics"
              value={pptTopic}
              onChange={(e) => setPptTopic(e.target.value)}
              className="focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <Button
            className="w-full sm:w-auto"
            variant="secondary"
            onClick={generatePptOutline}
            disabled={isGeneratingPpt || !pptTopic.trim()}
          >
            <Presentation className="h-4 w-4 mr-2" />
            {isGeneratingPpt ? "Generating..." : "Generate Outline"}
          </Button>
          {pptOutput && (
            <div className="mt-4 p-4 bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg border border-border/50">
              <p className="text-sm whitespace-pre-wrap">{pptOutput}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
