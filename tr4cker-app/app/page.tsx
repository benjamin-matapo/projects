"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Calendar,
  Users,
  CheckCircle2,
  Circle,
  Clock,
  Repeat,
  Edit3,
  Trash2,
  Sun,
  Moon,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format, isToday } from "date-fns"
import SettingsScreen from "@/components/settings-screen"

interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  dueTime?: string
  recurring: "none" | "daily" | "weekly" | "custom"
  customInterval?: number
  groupId?: string
  createdAt: Date
  completedAt?: Date
}

interface Group {
  id: string
  name: string
  color: string
  active: boolean
}

interface DayProgress {
  date: string
  percentage: number
  completedTasks: number
  totalTasks: number
}

const defaultGroups: Group[] = [
  { id: "1", name: "Health", color: "bg-green-500", active: true },
  { id: "2", name: "Work", color: "bg-blue-500", active: true },
  { id: "3", name: "Personal", color: "bg-purple-500", active: true },
]

export default function TodoHabitTracker() {
  const [activeTab, setActiveTab] = useState("today")
  const [tasks, setTasks] = useState<Task[]>([])
  const [groups, setGroups] = useState<Group[]>(defaultGroups)
  const [progress, setProgress] = useState<DayProgress[]>([])
  const [showTaskDialog, setShowTaskDialog] = useState(false)
  const [showGroupDialog, setShowGroupDialog] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    const savedGroups = localStorage.getItem("groups")
    const savedProgress = localStorage.getItem("progress")
    const savedDarkMode = localStorage.getItem("darkMode")

    if (savedTasks) setTasks(JSON.parse(savedTasks))
    if (savedGroups) setGroups(JSON.parse(savedGroups))
    if (savedProgress) setProgress(JSON.parse(savedProgress))
    if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode))
  }, [])

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem("groups", JSON.stringify(groups))
  }, [groups])

  useEffect(() => {
    localStorage.setItem("progress", JSON.stringify(progress))
  }, [progress])

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // Calculate today's progress
  const todaysTasks = tasks.filter((task) => {
    const taskGroup = groups.find((g) => g.id === task.groupId)
    return taskGroup?.active !== false
  })

  const completedToday = todaysTasks.filter((task) => task.completed).length
  const todayProgress = todaysTasks.length > 0 ? (completedToday / todaysTasks.length) * 100 : 0

  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return "bg-green-500"
    if (percentage >= 25) return "bg-orange-500"
    return "bg-red-500"
  }

  const getProgressColorText = (percentage: number) => {
    if (percentage >= 75) return "text-green-500"
    if (percentage >= 25) return "text-orange-500"
    return "text-red-500"
  }

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const updated = {
            ...task,
            completed: !task.completed,
            completedAt: !task.completed ? new Date() : undefined,
          }

          // Trigger confetti for completion
          if (!task.completed) {
            setShowConfetti(true)
            setTimeout(() => setShowConfetti(false), 3000)
          }

          return updated
        }
        return task
      }),
    )

    // Update progress tracking
    updateDayProgress()
  }

  const updateDayProgress = () => {
    const today = format(new Date(), "yyyy-MM-dd")
    const activeTasks = tasks.filter((task) => {
      const taskGroup = groups.find((g) => g.id === task.groupId)
      return taskGroup?.active !== false
    })

    const completed = activeTasks.filter((task) => task.completed).length
    const total = activeTasks.length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

    setProgress((prev) => {
      const existing = prev.find((p) => p.date === today)
      if (existing) {
        return prev.map((p) =>
          p.date === today ? { ...p, percentage, completedTasks: completed, totalTasks: total } : p,
        )
      } else {
        return [...prev, { date: today, percentage, completedTasks: completed, totalTasks: total }]
      }
    })
  }

  const addTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title || "",
      description: taskData.description,
      completed: false,
      dueTime: taskData.dueTime,
      recurring: taskData.recurring || "none",
      customInterval: taskData.customInterval,
      groupId: taskData.groupId,
      createdAt: new Date(),
    }
    setTasks((prev) => [...prev, newTask])
    setShowTaskDialog(false)
    setEditingTask(null)
  }

  const updateTask = (taskData: Partial<Task>) => {
    if (!editingTask) return

    setTasks((prev) => prev.map((task) => (task.id === editingTask.id ? { ...task, ...taskData } : task)))
    setShowTaskDialog(false)
    setEditingTask(null)
  }

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  const addGroup = (groupData: Partial<Group>) => {
    const newGroup: Group = {
      id: Date.now().toString(),
      name: groupData.name || "",
      color: groupData.color || "bg-gray-500",
      active: true,
    }
    setGroups((prev) => [...prev, newGroup])
    setShowGroupDialog(false)
    setEditingGroup(null)
  }

  const updateGroup = (groupData: Partial<Group>) => {
    if (!editingGroup) return

    setGroups((prev) => prev.map((group) => (group.id === editingGroup.id ? { ...group, ...groupData } : group)))
    setShowGroupDialog(false)
    setEditingGroup(null)
  }

  const toggleGroup = (groupId: string) => {
    setGroups((prev) => prev.map((group) => (group.id === groupId ? { ...group, active: !group.active } : group)))
  }

  const TaskDialog = () => (
    <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingTask ? "Edit Task" : "Add New Task"}</DialogTitle>
        </DialogHeader>
        <TaskForm task={editingTask} onSubmit={editingTask ? updateTask : addTask} groups={groups} />
      </DialogContent>
    </Dialog>
  )

  const GroupDialog = () => (
    <Dialog open={showGroupDialog} onOpenChange={setShowGroupDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingGroup ? "Edit Group" : "Add New Group"}</DialogTitle>
        </DialogHeader>
        <GroupForm group={editingGroup} onSubmit={editingGroup ? updateGroup : addGroup} />
      </DialogContent>
    </Dialog>
  )

  useEffect(() => {
    updateDayProgress()
  }, [tasks, groups])

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="bg-background text-foreground min-h-screen">
        {/* Confetti Animation */}
        <AnimatePresence>
          {showConfetti && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
            >
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="text-6xl">
                🎉
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <div className="hidden lg:flex">
          <div className="w-64 bg-card border-r min-h-screen p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("today")}>
                  <img src="/tr4cka-logo.png" alt="tr4cka" className="w-8 h-8 rounded-lg" />
                  <h1 className="text-xl font-bold text-foreground">tr4cka</h1>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4 text-amber-500" />
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                  <Moon className="h-4 w-4 text-blue-500" />
                </div>
              </div>

              <nav className="space-y-2">
                <Button
                  variant={activeTab === "today" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("today")}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Today
                </Button>
                <Button
                  variant={activeTab === "calendar" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("calendar")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Calendar
                </Button>
                <Button
                  variant={activeTab === "groups" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("groups")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Groups
                </Button>
                <Button
                  variant={activeTab === "settings" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("settings")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </nav>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">Active Groups</h3>
                <div className="space-y-1">
                  {groups
                    .filter((g) => g.active)
                    .map((group) => (
                      <div key={group.id} className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${group.color}`} />
                        <span className="text-sm">{group.name}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6">
            <MainContent />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="p-4 pb-20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("today")}>
                <img src="/tr4cka-logo.png" alt="tr4cka" className="w-8 h-8 rounded-lg" />
                <h1 className="text-xl font-bold text-foreground">tr4cka</h1>
              </div>
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4 text-amber-500" />
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                <Moon className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Dark</span>
              </div>
            </div>
            <MainContent />
          </div>

          {/* Mobile Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-card border-t">
            <div className="flex items-center justify-around py-2">
              <Button
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center space-y-1 ${activeTab === "today" ? "text-primary" : ""}`}
                onClick={() => setActiveTab("today")}
              >
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-xs">Today</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center space-y-1 ${activeTab === "calendar" ? "text-primary" : ""}`}
                onClick={() => setActiveTab("calendar")}
              >
                <Calendar className="h-5 w-5" />
                <span className="text-xs">Calendar</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center space-y-1 ${activeTab === "groups" ? "text-primary" : ""}`}
                onClick={() => setActiveTab("groups")}
              >
                <Users className="h-5 w-5" />
                <span className="text-xs">Groups</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center space-y-1 ${activeTab === "settings" ? "text-primary" : ""}`}
                onClick={() => setActiveTab("settings")}
              >
                <User className="h-5 w-5" />
                <span className="text-xs">Settings</span>
              </Button>
            </div>
          </div>
        </div>

        <TaskDialog />
        <GroupDialog />
      </div>
    </div>
  )

  function MainContent() {
    return (
      <div className="space-y-6">
        {activeTab === "today" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Progress Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Today's Progress</span>
                  <span className={`text-2xl font-bold ${getProgressColorText(todayProgress)}`}>
                    {Math.round(todayProgress)}%
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Progress value={todayProgress} className="h-3" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>
                      {completedToday} of {todaysTasks.length} tasks completed
                    </span>
                    <span>{todaysTasks.length - completedToday} remaining</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add Task Button */}
            <Button
              onClick={() => {
                setEditingTask(null)
                setShowTaskDialog(true)
              }}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Task
            </Button>

            {/* Tasks List */}
            <div className="space-y-3">
              <AnimatePresence>
                {todaysTasks.map((task) => {
                  const group = groups.find((g) => g.id === task.groupId)
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card className={`transition-all ${task.completed ? "opacity-60" : ""}`}>
                        <CardContent className="p-4 cursor-pointer" onClick={() => toggleTask(task.id)}>
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              {task.completed ? (
                                <CheckCircle2 className="h-6 w-6 text-green-500" />
                              ) : (
                                <Circle className="h-6 w-6" />
                              )}
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className={`font-medium ${task.completed ? "line-through" : ""}`}>{task.title}</h3>
                                {group && (
                                  <Badge variant="secondary" className={`${group.color} text-white`}>
                                    {group.name}
                                  </Badge>
                                )}
                              </div>

                              {task.description && (
                                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                              )}

                              <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                                {task.dueTime && (
                                  <div className="flex items-center space-x-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{task.dueTime}</span>
                                  </div>
                                )}
                                {task.recurring !== "none" && (
                                  <div className="flex items-center space-x-1">
                                    <Repeat className="h-3 w-3" />
                                    <span>{task.recurring}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingTask(task)
                                  setShowTaskDialog(true)
                                }}
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {activeTab === "calendar" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-[calc(100vh-200px)] flex flex-col justify-center"
          >
            <Card className="max-w-5xl mx-auto w-full">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center space-x-3">
                  <img src="/tr4cka-logo.png" alt="tr4cka" className="w-8 h-8 rounded-lg" />
                  <span>Progress Calendar</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-6">
                <div className="w-full max-w-4xl sm:max-w-4xl max-w-xs md:max-w-2xl mx-auto overflow-x-hidden">
                  <CalendarComponent
                    mode="single"
                    className="rounded-lg border mx-auto w-full overflow-x-hidden"
                    classNames={{
                      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 justify-center w-full",
                      month: "space-y-4 w-full",
                      caption: "flex justify-center pt-1 relative items-center w-full",
                      caption_label: "text-base sm:text-lg font-semibold w-full text-center px-1",
                      nav: "space-x-1 flex items-center",
                      nav_button: "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-1 overflow-x-hidden",
                      head_row: "flex justify-center w-full",
                      head_cell:
                        "text-muted-foreground rounded-md w-8 h-8 sm:w-12 sm:h-12 font-normal text-xs sm:text-sm flex items-center justify-center p-0",
                      row: "flex w-full mt-2 justify-center",
                      cell: "relative p-0 text-center text-xs sm:text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md overflow-x-hidden",
                      day: "h-8 w-8 sm:h-12 sm:w-12 p-0 font-normal aria-selected:opacity-100 rounded-md hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground flex flex-col items-center justify-center mx-auto",
                      day_selected:
                        "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                      day_today: "bg-accent text-accent-foreground font-semibold",
                      day_outside: "text-muted-foreground opacity-50",
                      day_disabled: "text-muted-foreground opacity-50",
                      day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                      day_hidden: "invisible",
                    }}
                    components={{
                      Day: ({ date, ...props }) => {
                        const dateStr = format(date, "yyyy-MM-dd")
                        const dayProgress = progress.find((p) => p.date === dateStr)
                        const percentage = dayProgress?.percentage || 0

                        const getCalendarDayColor = (percentage: number) => {
                          if (percentage >= 75) return "bg-green-500 text-white hover:bg-green-600"
                          if (percentage >= 50) return "bg-yellow-500 text-white hover:bg-yellow-600"
                          if (percentage >= 25) return "bg-orange-500 text-white hover:bg-orange-600"
                          if (percentage > 0) return "bg-red-500 text-white hover:bg-red-600"
                          return "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }

                        return (
                          <div
                            {...props}
                            className={`
                              relative h-8 w-8 sm:h-12 sm:w-12 p-0 text-center cursor-pointer rounded-lg m-0.5 sm:m-1 flex flex-col items-center justify-center
                              transition-all duration-200 hover:scale-105 hover:shadow-md
                              ${isToday(date) ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900" : ""}
                              ${getCalendarDayColor(percentage)}
                            `}
                          >
                            <span className="text-[0.7rem] sm:text-xs font-semibold leading-none">{date.getDate()}</span>
                            {/* Hide percentage text on screens <375px, show only on sm+ */}
                            {dayProgress && percentage > 0 && (
                              <span className="hidden sm:block text-[0.7rem] opacity-90 font-medium">
                                {Math.round(percentage)}%
                              </span>
                            )}
                          </div>
                        )
                      },
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm w-full max-w-2xl">
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <div className="w-6 h-6 bg-red-500 rounded-lg shadow-sm" />
                    <div>
                      <div className="font-medium text-red-700 dark:text-red-300">Needs Work</div>
                      <div className="text-xs text-red-600 dark:text-red-400">0-25%</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                    <div className="w-6 h-6 bg-orange-500 rounded-lg shadow-sm" />
                    <div>
                      <div className="font-medium text-orange-700 dark:text-orange-300">Fair</div>
                      <div className="text-xs text-orange-600 dark:text-orange-400">25-50%</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                    <div className="w-6 h-6 bg-yellow-500 rounded-lg shadow-sm" />
                    <div>
                      <div className="font-medium text-yellow-700 dark:text-yellow-300">Good</div>
                      <div className="text-xs text-yellow-600 dark:text-yellow-400">50-75%</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div className="w-6 h-6 bg-green-500 rounded-lg shadow-sm" />
                    <div>
                      <div className="font-medium text-green-700 dark:text-green-300">Excellent</div>
                      <div className="text-xs text-green-600 dark:text-green-400">75-100%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === "groups" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Button
              onClick={() => {
                setEditingGroup(null)
                setShowGroupDialog(true)
              }}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Group
            </Button>

            <div className="space-y-3">
              {groups.map((group) => (
                <Card key={group.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${group.color}`} />
                        <div>
                          <h3 className="font-medium">{group.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {tasks.filter((t) => t.groupId === group.id).length} tasks
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch checked={group.active} onCheckedChange={() => toggleGroup(group.id)} />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingGroup(group)
                            setShowGroupDialog(true)
                          }}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "settings" && (
          <SettingsScreen
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onClearAllData={() => {
              if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
                setTasks([])
                setGroups(defaultGroups)
                setProgress([])
                localStorage.clear()
              }
            }}
            onExportData={() => {
              const data = {
                tasks,
                groups,
                progress,
                exportDate: new Date().toISOString(),
              }
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
              const url = URL.createObjectURL(blob)
              const a = document.createElement("a")
              a.href = url
              a.download = `tr4cka-backup-${format(new Date(), "yyyy-MM-dd")}.json`
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
              URL.revokeObjectURL(url)
            }}
            onImportData={() => {
              const input = document.createElement("input")
              input.type = "file"
              input.accept = ".json"
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onload = (e) => {
                    try {
                      const data = JSON.parse(e.target?.result as string)
                      if (data.tasks) setTasks(data.tasks)
                      if (data.groups) setGroups(data.groups)
                      if (data.progress) setProgress(data.progress)
                    } catch (error) {
                      alert("Invalid file format")
                    }
                  }
                  reader.readAsText(file)
                }
              }
              input.click()
            }}
          />
        )}
      </div>
    )
  }
}

function TaskForm({
  task,
  onSubmit,
  groups,
}: {
  task: Task | null
  onSubmit: (data: Partial<Task>) => void
  groups: Group[]
}) {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    dueTime: task?.dueTime || "",
    recurring: task?.recurring || "none",
    customInterval: task?.customInterval || 1,
    groupId: task?.groupId || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Task Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="Enter task title"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Enter task description"
        />
      </div>

      <div>
        <Label htmlFor="dueTime">Due Time (Optional)</Label>
        <Input
          id="dueTime"
          type="time"
          value={formData.dueTime}
          onChange={(e) => setFormData((prev) => ({ ...prev, dueTime: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="recurring">Recurring</Label>
        <Select
          value={formData.recurring}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, recurring: value as any }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">One-time</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.recurring === "custom" && (
        <div>
          <Label htmlFor="customInterval">Custom Interval (days)</Label>
          <Input
            id="customInterval"
            type="number"
            min="1"
            value={formData.customInterval}
            onChange={(e) => setFormData((prev) => ({ ...prev, customInterval: Number.parseInt(e.target.value) }))}
          />
        </div>
      )}

      <div>
        <Label htmlFor="group">Group</Label>
        <Select
          value={formData.groupId}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, groupId: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a group" />
          </SelectTrigger>
          <SelectContent>
            {groups.map((group) => (
              <SelectItem key={group.id} value={group.id}>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${group.color}`} />
                  <span>{group.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">
        {task ? "Update Task" : "Add Task"}
      </Button>
    </form>
  )
}

function GroupForm({
  group,
  onSubmit,
}: {
  group: Group | null
  onSubmit: (data: Partial<Group>) => void
}) {
  const [formData, setFormData] = useState({
    name: group?.name || "",
    color: group?.color || "bg-blue-500",
  })

  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-purple-500",
    "bg-pink-500",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Group Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Enter group name"
          required
        />
      </div>

      <div>
        <Label>Color</Label>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              className={`w-12 h-12 rounded-lg ${color} ${formData.color === color ? "ring-2 ring-offset-2 ring-primary" : ""}`}
              onClick={() => setFormData((prev) => ({ ...prev, color }))}
            />
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full">
        {group ? "Update Group" : "Add Group"}
      </Button>
    </form>
  )
}
