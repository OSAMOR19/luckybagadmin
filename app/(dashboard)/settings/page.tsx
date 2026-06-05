"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Save, Shield, Bell, Palette, Database } from "lucide-react"

export default function SettingsPage() {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  // General Settings
  const [platformName, setPlatformName] = useState("LuckyBag Admin")
  const [supportEmail, setSupportEmail] = useState("support@luckybag.com")
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  // Security Settings
  const [twoFactorRequired, setTwoFactorRequired] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState("30")
  const [passwordExpiry, setPasswordExpiry] = useState("90")

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [transactionAlerts, setTransactionAlerts] = useState(true)
  const [gameAlerts, setGameAlerts] = useState(true)
  const [userAlerts, setUserAlerts] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Failed to save settings",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage platform configuration and preferences</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Platform Settings
              </CardTitle>
              <CardDescription>Configure basic platform information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platformName">Platform Name</Label>
                <Input
                  id="platformName"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  placeholder="Enter platform name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  placeholder="support@example.com"
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">Temporarily disable platform access</p>
                </div>
                <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Configure security and authentication policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require 2FA for all admin accounts</p>
                </div>
                <Switch checked={twoFactorRequired} onCheckedChange={setTwoFactorRequired} />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  placeholder="30"
                />
                <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                <Input
                  id="passwordExpiry"
                  type="number"
                  value={passwordExpiry}
                  onChange={(e) => setPasswordExpiry(e.target.value)}
                  placeholder="90"
                />
                <p className="text-sm text-muted-foreground">Force password change after this period</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive email notifications</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Transaction Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified about large transactions</p>
                </div>
                <Switch checked={transactionAlerts} onCheckedChange={setTransactionAlerts} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Game Alerts</Label>
                  <p className="text-sm text-muted-foreground">Notifications for game events</p>
                </div>
                <Switch checked={gameAlerts} onCheckedChange={setGameAlerts} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>User Alerts</Label>
                  <p className="text-sm text-muted-foreground">Notifications for new user registrations</p>
                </div>
                <Switch checked={userAlerts} onCheckedChange={setUserAlerts} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Role-Based Access Control
              </CardTitle>
              <CardDescription>View permission matrix for different admin roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border border-border overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-3 font-medium">Permission</th>
                        <th className="text-center p-3 font-medium">Super Admin</th>
                        <th className="text-center p-3 font-medium">Game Manager</th>
                        <th className="text-center p-3 font-medium">User Manager</th>
                        <th className="text-center p-3 font-medium">Finance Admin</th>
                        <th className="text-center p-3 font-medium">Support Admin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "View Dashboard", permissions: [true, true, true, true, true] },
                        { name: "View Users", permissions: [true, true, true, true, true] },
                        { name: "Manage Users", permissions: [true, false, true, false, false] },
                        { name: "View Games", permissions: [true, true, false, false, true] },
                        { name: "Manage Games", permissions: [true, true, false, false, false] },
                        { name: "View Transactions", permissions: [true, true, true, true, true] },
                        { name: "Manage Transactions", permissions: [true, false, false, true, false] },
                        { name: "View Admins", permissions: [true, false, false, false, false] },
                        { name: "Manage Admins", permissions: [true, false, false, false, false] },
                        { name: "View Settings", permissions: [true, false, false, false, false] },
                        { name: "Manage Settings", permissions: [true, false, false, false, false] },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-t border-border">
                          <td className="p-3 text-sm">{row.name}</td>
                          {row.permissions.map((hasPermission, roleIdx) => (
                            <td key={roleIdx} className="text-center p-3">
                              {hasPermission ? (
                                <span className="inline-block w-5 h-5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                                  ✓
                                </span>
                              ) : (
                                <span className="inline-block w-5 h-5 rounded-full bg-gray-500/20 text-gray-500 flex items-center justify-center">
                                  ✗
                                </span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-muted-foreground">
                  Permission changes require system restart to take effect
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
