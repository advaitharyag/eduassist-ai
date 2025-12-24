"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen, Calendar, FileText, Code, TrendingUp, Edit, Plus, X, Sparkles } from "lucide-react"

export default function StudentDashboard() {
  const [notesInput, setNotesInput] = useState("")
  const [codeInput, setCodeInput] = useState("")
  const [notesOutput, setNotesOutput] = useState("")
  const [codeOutput, setCodeOutput] = useState("")
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false)
  const [isGeneratingCode, setIsGeneratingCode] = useState(false)

  const [tasks, setTasks] = useState([
    { id: 1, title: "Complete Math Assignment", done: false },
    { id: 2, title: "Read Chapter 5 - Physics", done: true },
    { id: 3, title: "Practice Coding Problems", done: false },
  ])
  const [isEditingTasks, setIsEditingTasks] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")

  const [deadlines, setDeadlines] = useState([
    { id: 1, title: "Math Quiz", date: "Tomorrow, 10:00 AM", priority: "red", done: false },
    { id: 2, title: "Science Project", date: "Friday, 3:00 PM", priority: "yellow", done: false },
    { id: 3, title: "History Essay", date: "Next Monday", priority: "green", done: false },
  ])
  const [isEditingDeadlines, setIsEditingDeadlines] = useState(false)
  const [newDeadline, setNewDeadline] = useState({ title: "", date: "", priority: "yellow" })

  const [subjects, setSubjects] = useState([
    { id: 1, name: "Mathematics", totalTasks: 20, completedTasks: 17, color: "blue" },
    { id: 2, name: "Physics", totalTasks: 25, completedTasks: 18, color: "green" },
    { id: 3, name: "Programming", totalTasks: 10, completedTasks: 9, color: "purple" },
  ])
  const [isEditingProgress, setIsEditingProgress] = useState(false)

  const toggleTask = (id: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task)))
  }

  const addTask = () => {
    if (newTaskTitle.trim()) {
      setTasks([...tasks, { id: Date.now(), title: newTaskTitle, done: false }])
      setNewTaskTitle("")
    }
  }

  const removeTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const toggleDeadline = (id: number) => {
    setDeadlines(deadlines.map((deadline) => (deadline.id === id ? { ...deadline, done: !deadline.done } : deadline)))
  }

  const addDeadline = () => {
    if (newDeadline.title.trim() && newDeadline.date.trim()) {
      setDeadlines([...deadlines, { ...newDeadline, id: Date.now(), done: false }])
      setNewDeadline({ title: "", date: "", priority: "yellow" })
    }
  }

  const removeDeadline = (id: number) => {
    setDeadlines(deadlines.filter((deadline) => deadline.id !== id))
  }

  const calculateProgress = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0
  }

  const updateSubjectProgress = (id: number, field: "completedTasks" | "totalTasks", value: number) => {
    setSubjects(subjects.map((subject) => (subject.id === id ? { ...subject, [field]: Math.max(0, value) } : subject)))
  }

  const generateNotes = async () => {
    if (!notesInput.trim()) return

    setIsGeneratingNotes(true)
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `
ROLE: academic_assistant
TASK: exam_notes
TOPIC: ${notesInput}

STYLE:
- concise
- technical
- bullet_points
- no_conversation

SECTIONS:
- Definition
- Key characteristics
- Types/Models
- Advantages
- Disadvantages
- Applications
- Keywords

LIMIT: 700_words
`,
          context: { role: "student", feature: "notes-generator" },
        }),
      })

      const data = await response.json()
      if (data.response) {
        setNotesOutput(data.response)
      } else if (data.error) {
        setNotesOutput(data.error)
      } else {
        setNotesOutput("Error generating notes. Please try again.")
      }
    } catch (error) {
      setNotesOutput("Failed to connect to AI. Please check your API key.")
    } finally {
      setIsGeneratingNotes(false)
    }
  }

  const convertPseudocode = async () => {
    if (!codeInput.trim()) return

    setIsGeneratingCode(true)
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `
ROLE: programming_tutor
TASK: pseudocode_to_python

INPUT:
${codeInput}

OUTPUT:
- python_code 
- java_code
- c_code
- explanation_steps

RULES:
- code_first
- no_comments_in_code
- no_greetings
- beginner_friendly

FORMAT:
[CODE]
Explanation:
- Step 1
- Step 2
`,
          context: { role: "student", feature: "pseudocode-converter" },
        }),
      })

      const data = await response.json()
      if (data.response) {
        setCodeOutput(data.response)
      } else if (data.error) {
        setCodeOutput(data.error)
      } else {
        setCodeOutput("Error converting code. Please try again.")
      }
    } catch (error) {
      setCodeOutput("Failed to connect to AI. Please check your API key.")
    } finally {
      setIsGeneratingCode(false)
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
              Today's Study Plan
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditingTasks(!isEditingTasks)}
              className="hover:bg-primary/10"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-muted-foreground">Your tasks for today</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Checkbox id={`task-${task.id}`} checked={task.done} onCheckedChange={() => toggleTask(task.id)} />
              <label
                htmlFor={`task-${task.id}`}
                className={`flex-1 cursor-pointer ${task.done ? "line-through text-muted-foreground" : "font-medium"}`}
              >
                {task.title}
              </label>
              {isEditingTasks && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTask(task.id)}
                  className="hover:bg-destructive/10"
                >
                  <X className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          ))}

          {isEditingTasks && (
            <div className="flex gap-2 pt-2 border-t">
              <Input
                placeholder="Add new task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                className="focus:ring-2 focus:ring-primary/20"
              />
              <Button size="icon" onClick={addTask} className="shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="card-hover border-l-4 border-l-accent/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-accent/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-accent" />
              </div>
              Upcoming Deadlines
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditingDeadlines(!isEditingDeadlines)}
              className="hover:bg-accent/10"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-muted-foreground">Don't miss these</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {deadlines.map((deadline) => (
            <div
              key={deadline.id}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Checkbox
                id={`deadline-${deadline.id}`}
                checked={deadline.done}
                onCheckedChange={() => toggleDeadline(deadline.id)}
                className="mt-1"
              />
              <div
                className={`flex-1 border-l-4 pl-3 ${deadline.priority === "red"
                  ? "border-l-red-500"
                  : deadline.priority === "yellow"
                    ? "border-l-yellow-500"
                    : "border-l-green-500"
                  } ${deadline.done ? "opacity-50" : ""}`}
              >
                <p className={`font-medium ${deadline.done ? "line-through" : ""}`}>{deadline.title}</p>
                <p className="text-sm text-muted-foreground">{deadline.date}</p>
              </div>
              {isEditingDeadlines && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeDeadline(deadline.id)}
                  className="hover:bg-destructive/10"
                >
                  <X className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          ))}

          {isEditingDeadlines && (
            <div className="space-y-2 pt-2 border-t">
              <Input
                placeholder="Deadline title..."
                value={newDeadline.title}
                onChange={(e) => setNewDeadline({ ...newDeadline, title: e.target.value })}
                className="focus:ring-2 focus:ring-accent/20"
              />
              <Input
                placeholder="Date and time..."
                value={newDeadline.date}
                onChange={(e) => setNewDeadline({ ...newDeadline, date: e.target.value })}
                className="focus:ring-2 focus:ring-accent/20"
              />
              <div className="flex gap-2">
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus:ring-2 focus:ring-accent/20"
                  value={newDeadline.priority}
                  onChange={(e) => setNewDeadline({ ...newDeadline, priority: e.target.value })}
                >
                  <option value="red">High Priority</option>
                  <option value="yellow">Medium Priority</option>
                  <option value="green">Low Priority</option>
                </select>
                <Button size="icon" onClick={addDeadline} className="shrink-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="card-hover border-l-4 border-l-chart-1/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-chart-1/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-chart-1" />
              </div>
              Progress Tracker
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditingProgress(!isEditingProgress)}
              className="hover:bg-chart-1/10"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-muted-foreground">Your learning progress</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {subjects.map((subject) => {
            const progress = calculateProgress(subject.completedTasks, subject.totalTasks)
            return (
              <div key={subject.id} className="space-y-2 p-3 rounded-lg bg-muted/30">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{subject.name}</span>
                  <span className="text-muted-foreground font-mono">
                    {progress}% ({subject.completedTasks}/{subject.totalTasks})
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${subject.color === "blue"
                      ? "bg-blue-500"
                      : subject.color === "green"
                        ? "bg-green-500"
                        : "bg-purple-500"
                      }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {isEditingProgress && (
                  <div className="flex gap-2 text-xs pt-2">
                    <div className="flex items-center gap-1 flex-1">
                      <Label className="text-xs text-muted-foreground">Completed:</Label>
                      <Input
                        type="number"
                        className="h-8 focus:ring-2 focus:ring-primary/20"
                        value={subject.completedTasks}
                        onChange={(e) =>
                          updateSubjectProgress(subject.id, "completedTasks", Number.parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                    <div className="flex items-center gap-1 flex-1">
                      <Label className="text-xs text-muted-foreground">Total:</Label>
                      <Input
                        type="number"
                        className="h-8 focus:ring-2 focus:ring-primary/20"
                        value={subject.totalTasks}
                        onChange={(e) =>
                          updateSubjectProgress(subject.id, "totalTasks", Number.parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card className="md:col-span-2 card-hover border-t-4 border-t-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <span className="gradient-text">AI Notes Generator</span>
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          </CardTitle>
          <CardDescription className="text-muted-foreground">Generate study notes from your topics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Enter your topic or paste lecture content..."
            value={notesInput}
            onChange={(e) => setNotesInput(e.target.value)}
            rows={4}
            className="focus:ring-2 focus:ring-primary/20 resize-none"
          />
          <Button
            className="w-full sm:w-auto"
            onClick={generateNotes}
            disabled={isGeneratingNotes || !notesInput.trim()}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isGeneratingNotes ? "Generating..." : "Generate Notes"}
          </Button>
          {notesOutput && (
            <div className="mt-4 p-4 bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg border border-border/50">
              <p className="text-sm whitespace-pre-wrap">{notesOutput}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="card-hover border-t-4 border-t-accent/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg">
              <Code className="h-5 w-5 text-accent" />
            </div>
            <span className="gradient-text">Pseudocode Converter</span>
            <Sparkles className="h-4 w-4 text-accent animate-pulse" />
          </CardTitle>
          <CardDescription className="text-muted-foreground">Convert algorithms to code</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Enter pseudocode..."
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            rows={4}
            className="focus:ring-2 focus:ring-accent/20 resize-none font-mono text-sm"
          />
          <Button
            className="w-full sm:w-auto"
            variant="secondary"
            onClick={convertPseudocode}
            disabled={isGeneratingCode || !codeInput.trim()}
          >
            <Code className="h-4 w-4 mr-2" />
            {isGeneratingCode ? "Converting..." : "Convert to Code"}
          </Button>
          {codeOutput && (
            <div className="mt-4 p-4 bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg border border-border/50">
              <pre className="text-sm whitespace-pre-wrap font-mono">{codeOutput}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
