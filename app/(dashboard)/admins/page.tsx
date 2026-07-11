"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CreateAdminModal } from "@/components/create-admin-modal"
import { Plus, Search, Shield, CheckCircle, XCircle, Loader2, Lock } from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { adminsApi } from "@/lib/api"
import { Admin, UserRole } from "@/types"

export default function AdminsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [admins, setAdmins] = useState<Admin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const [isAccessDenied, setIsAccessDenied] = useState(false)
  const { toast } = useToast()

  const fetchAdmins = async () => {
    try {
      setIsLoading(true)
      setDebugInfo(null)
      const response = await adminsApi.fetchAllAdmins() as any
      const data = response?.data?.admins || []
      const adminsArray = Array.isArray(data) ? data : [data]

      if (adminsArray.length === 0) {
        setDebugInfo(`Raw Response: ${JSON.stringify(response, null, 2)}`);
      }

      const formattedAdmins = adminsArray.map((admin: any) => ({
        id: admin.admin_id,
        name: admin.email ? admin.email.split('@')[0] : "Admin",
        email: admin.email,
        role: admin.role as UserRole,
        isActive: admin.is_active,
        lastLogin: admin.last_login,
        createdAt: admin.createdAt || new Date().toISOString(),
      }))

      setAdmins(formattedAdmins)
    } catch (error: any) {
      console.error("Failed to fetch admins:", error)
      if (error?.status === 403 || error?.message?.toLowerCase().includes("access denied")) {
        setIsAccessDenied(true)
      } else {
        setDebugInfo(`API Error: ${error?.message || 'Unknown error'}\nStatus: ${error?.status || 'N/A'}`)
        toast({
          title: "Error loading admins",
          description: error?.message || "Could not connect to the server.",
          variant: "destructive"
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleToggleStatus = async (adminId: string, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        await adminsApi.deactivateAdmin(adminId)
      } else {
        await adminsApi.activateAdmin(adminId)
      }
      
      setAdmins(admins.map((a) => (a.id === adminId ? { ...a, isActive: !currentStatus } : a)))
      toast({
        title: currentStatus ? "Admin deactivated" : "Admin activated",
        description: `Admin account has been ${currentStatus ? "deactivated" : "activated"}`,
      })
    } catch (error: any) {
      toast({
        title: "Action failed",
        description: error?.message || "Failed to update admin status",
        variant: "destructive"
      })
    }
  }

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, string> = {
      super_admin: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      admin: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      game_manager: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      user_manager: "bg-green-500/10 text-green-500 border-green-500/20",
      finance_admin: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      support_admin: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    }

    return (
      <Badge variant="outline" className={roleColors[role] || "bg-gray-500/10 text-gray-500"}>
        <Shield className="mr-1 h-3 w-3" />
        {role.replace("_", " ")}
      </Badge>
    )
  }

  return (
    <div className="relative min-h-[500px]">
      <div className={cn("space-y-6 transition-all duration-300", isAccessDenied && "blur-md pointer-events-none select-none opacity-50")}>
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Management</h1>
          <p className="text-muted-foreground mt-1">Manage administrator accounts and permissions</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Admin
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search admins..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Admins Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead>Admin</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredAdmins.length > 0 ? (
              filteredAdmins.map((admin) => (
                <TableRow key={admin.id} className="hover:bg-slate-50/50">
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-900">{admin.name}</p>
                      <p className="text-sm font-mono text-muted-foreground">{admin.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-600">{admin.email}</span>
                  </TableCell>
                  <TableCell>{getRoleBadge(admin.role)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={admin.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-50 text-slate-600 border-slate-200"}>
                      {admin.isActive ? (
                        <>
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle className="mr-1 h-3 w-3" />
                          Inactive
                        </>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {admin.lastLogin ? (
                      <span className="text-sm text-slate-600">
                        {formatDistanceToNow(new Date(admin.lastLogin), { addSuffix: true })}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">Never</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-600">{format(new Date(admin.createdAt), "MMM dd, yyyy")}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={admin.isActive ? "outline" : "default"}
                      size="sm"
                      className={admin.isActive ? "text-rose-500 border-rose-200 hover:bg-rose-50 hover:text-rose-600" : ""}
                      onClick={() => handleToggleStatus(admin.id, admin.isActive)}
                    >
                      {admin.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No admins found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {debugInfo && (
        <div className="p-4 bg-red-50 border-t border-red-100 text-sm overflow-auto text-red-800 rounded-b-lg">
          <strong>Debug Info (API Response/Error):</strong>
          <pre className="mt-2 whitespace-pre-wrap font-mono text-xs">{debugInfo}</pre>
        </div>
      )}

      <CreateAdminModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={fetchAdmins}
      />
      </div>

      {isAccessDenied && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px] rounded-lg" />
          <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center max-w-md bg-card border shadow-xl rounded-2xl animate-in fade-in zoom-in-95 duration-300">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 border-[6px] border-rose-50/50 mb-6">
              <Lock className="h-8 w-8 text-rose-500" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-2 text-foreground">Access Denied</h2>
            <p className="text-muted-foreground text-sm">
              Super Admin or higher role required.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
