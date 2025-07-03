"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Trash2, Download, Upload, User, Palette, Bell, Shield } from "lucide-react"

interface SettingsScreenProps {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
  onClearAllData: () => void
  onExportData: () => void
  onImportData: () => void
}

export default function SettingsScreen({
  darkMode,
  setDarkMode,
  onClearAllData,
  onExportData,
  onImportData,
}: SettingsScreenProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <img src="/tr4cka-logo.png" alt="tr4cka" className="w-8 h-8 rounded-lg" />
            <span>Profile</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">tr4cka User</h3>
              <p className="text-sm text-muted-foreground">Building habits, achieving goals</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Appearance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
            </div>
            <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Daily Reminders</Label>
              <p className="text-sm text-muted-foreground">Get notified about pending tasks</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Progress Updates</Label>
              <p className="text-sm text-muted-foreground">Weekly progress summaries</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Data Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button variant="outline" onClick={onExportData} className="flex items-center space-x-2 bg-transparent">
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </Button>

            <Button variant="outline" onClick={onImportData} className="flex items-center space-x-2 bg-transparent">
              <Upload className="h-4 w-4" />
              <span>Import Data</span>
            </Button>
          </div>

          <div className="pt-4 border-t">
            <Button variant="destructive" onClick={onClearAllData} className="w-full flex items-center space-x-2">
              <Trash2 className="h-4 w-4" />
              <span>Clear All Data</span>
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              This action cannot be undone. All tasks, groups, and progress will be deleted.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <img src="/tr4cka-logo.png" alt="tr4cka" className="w-6 h-6 rounded" />
              <span className="font-semibold">tr4cka</span>
            </div>
            <p className="text-sm text-muted-foreground">Version 1.0.0</p>
            <p className="text-xs text-muted-foreground">Built with ❤️ for productivity enthusiasts</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
