"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CreateAdminModal } from "@/components/create-admin-modal"
import { mockAdmins } from "@/lib/mock-data"
import { Plus, Search, Shield, CheckCircle, XCircle } from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"

export default function AdminsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [admins, setAdmins] = useState(mockAdmins)
  const { toast } = useToast()

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleToggleStatus = (adminId: string, currentStatus: boolean) => {
    setAdmins(admins.map((a) => (a.id === adminId ? { ...a, isActive: !currentStatus } : a)))
    toast({
      title: currentStatus ? "Admin deactivated" : "Admin activated",
      description: `Admin account has been ${currentStatus ? "deactivated" : "activated"}`,
    })
  }

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, string> = {
      super_admin: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      game_manager: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      user_manager: "bg-green-500/10 text-green-500 border-green-500/20",
      finance_admin: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      support_admin: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    }

    return (
      <Badge variant="outline" className={roleColors[role]}>
        <Shield className="mr-1 h-3 w-3" />
        {role.replace("_", " ")}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
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
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
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
            {filteredAdmins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{admin.name}</p>
                    <p className="text-sm text-muted-foreground">{admin.id}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{admin.email}</span>
                </TableCell>
                <TableCell>{getRoleBadge(admin.role)}</TableCell>
                <TableCell>
                  <Badge variant={admin.isActive ? "default" : "secondary"}>
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
                    <span className="text-sm">
                      {formatDistanceToNow(new Date(admin.lastLogin), { addSuffix: true })}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">Never</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm">{format(new Date(admin.createdAt), "MMM dd, yyyy")}</span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant={admin.isActive ? "destructive" : "default"}
                    size="sm"
                    onClick={() => handleToggleStatus(admin.id, admin.isActive)}
                  >
                    {admin.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CreateAdminModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={() => {
          // Refresh admins list
        }}
      />
    </div>
  )
}
