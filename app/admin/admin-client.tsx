"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import {
  Users,
  Files,
  Mail,
  DollarSign,
  Trash2,
  CheckCircle,
  Eye,
  ShieldAlert,
  Search,
  Grid,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { deleteUser, toggleMessageReadStatus, deleteContactMessage } from "@/actions/admin"

interface AdminUser {
  id: string
  name: string | null
  email: string | null
  role: string
  plan: string
  createdAt: string
}

interface AdminConversion {
  id: string
  toolUsed: string
  inputFileName: string
  outputFileName: string
  status: string
  size: number
  createdAt: string
  userId: string | null
}

interface AdminMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  isRead: boolean
  createdAt: string
}

interface AdminClientProps {
  initialUsers: AdminUser[]
  initialConversions: AdminConversion[]
  initialMessages: AdminMessage[]
}

export function AdminClient({
  initialUsers,
  initialConversions,
  initialMessages,
}: AdminClientProps) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers)
  const [conversions] = useState<AdminConversion[]>(initialConversions)
  const [messages, setMessages] = useState<AdminMessage[]>(initialMessages)

  const [searchQuery, setSearchQuery] = useState("")

  // Calculate high level stats
  const totalUsers = users.length
  const proUsersCount = users.filter((u) => u.plan === "PRO").length
  const totalMRR = proUsersCount * 9 // $9/mo
  const totalConversions = conversions.length
  const unreadMessagesCount = messages.filter((m) => !m.isRead).length

  const handleUserDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user profile? All files and history logs will be purged.")) {
      try {
        const res = await deleteUser(id)
        if (res?.success) {
          setUsers((prev) => prev.filter((u) => u.id !== id))
          toast.success(res.message)
        } else {
          toast.error(res?.error || "Failed to delete user.")
        }
      } catch (err) {
        toast.error("An error occurred during user deletion.")
      }
    }
  }

  const handleMessageStatus = async (id: string, isRead: boolean) => {
    try {
      const res = await toggleMessageReadStatus(id, isRead)
      if (res?.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, isRead } : m))
        )
        toast.success(res.message)
      } else {
        toast.error(res?.error || "Failed to update status.")
      }
    } catch (err) {
      toast.error("Failed to update message read status.")
    }
  }

  const handleMessageDelete = async (id: string) => {
    try {
      const res = await deleteContactMessage(id)
      if (res?.success) {
        setMessages((prev) => prev.filter((m) => m.id !== id))
        toast.success(res.message)
      } else {
        toast.error(res?.error || "Failed to delete message.")
      }
    } catch (err) {
      toast.error("Failed to delete support message.")
    }
  }

  const filteredUsers = React.useMemo(() => {
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, users])

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight dark:text-white flex items-center gap-2">
          <ShieldAlert className="w-8 h-8 text-rose-500" /> Admin Analytics Center
        </h1>
        <p className="text-sm text-slate-500 mt-1">Monitor system growth, oversee user profiles, and manage support logs.</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-slate-950/40 backdrop-blur shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Signups</CardTitle>
            <Users className="w-5 h-5 text-slate-400" />
          </CardHeader>
          <CardContent>
            <h3 className="text-3xl font-black dark:text-white">{totalUsers}</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">
              Active accounts registered in DB
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-slate-950/40 backdrop-blur shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly MRR</CardTitle>
            <DollarSign className="w-5 h-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <h3 className="text-3xl font-black text-emerald-500">${totalMRR}</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">
              {proUsersCount} active PRO subscriptions
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-slate-950/40 backdrop-blur shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Operations</CardTitle>
            <Files className="w-5 h-5 text-slate-400" />
          </CardHeader>
          <CardContent>
            <h3 className="text-3xl font-black dark:text-white">{totalConversions}</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">
              Document and image processes logged
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-slate-950/40 backdrop-blur shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Support Inbox</CardTitle>
            <Mail className="w-5 h-5 text-slate-400" />
          </CardHeader>
          <CardContent>
            <h3 className="text-3xl font-black dark:text-white">{unreadMessagesCount} unread</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">
              {messages.length} total contact inquiries
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Layout */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="bg-slate-200/50 dark:bg-white/5 rounded-xl p-1 mb-6 flex justify-start gap-1 w-full max-w-lg">
          <TabsTrigger value="users" className="font-semibold text-xs py-2 w-full">User Manager</TabsTrigger>
          <TabsTrigger value="conversions" className="font-semibold text-xs py-2 w-full">System Logs</TabsTrigger>
          <TabsTrigger value="messages" className="font-semibold text-xs py-2 w-full">Support Inbox</TabsTrigger>
        </TabsList>

        {/* 1. User Manager */}
        <TabsContent value="users">
          <Card className="border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-black/35 backdrop-blur shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-base font-bold dark:text-white">Registered Users</CardTitle>
                <CardDescription className="text-xs">Search and manage client profile records.</CardDescription>
              </div>
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-white dark:bg-slate-950 border-slate-200 dark:border-white/10 text-xs"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-100/50 dark:bg-white/5">
                    <TableRow className="border-b border-slate-200 dark:border-white/10">
                      <TableHead className="text-xs font-bold text-slate-500">Name</TableHead>
                      <TableHead className="text-xs font-bold text-slate-500">Email</TableHead>
                      <TableHead className="text-xs font-bold text-slate-500">Role</TableHead>
                      <TableHead className="text-xs font-bold text-slate-500">Plan</TableHead>
                      <TableHead className="text-xs font-bold text-slate-500">Joined</TableHead>
                      <TableHead className="text-xs font-bold text-slate-500 text-right">Delete</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((u) => (
                      <TableRow key={u.id} className="border-b border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <TableCell className="text-xs font-bold text-slate-800 dark:text-slate-200">{u.name || "N/A"}</TableCell>
                        <TableCell className="text-xs text-slate-500 font-medium">{u.email}</TableCell>
                        <TableCell className="text-xs">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${
                            u.role === "ADMIN"
                              ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                              : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                          }`}>
                            {u.role}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${
                            u.plan === "PRO"
                              ? "bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
                              : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                          }`}>
                            {u.plan}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-slate-500 font-medium">
                          {formatDistanceToNow(new Date(u.createdAt), { addSuffix: true })}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUserDelete(u.id)}
                            className="w-8 h-8 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. Conversions logs list */}
        <TabsContent value="conversions">
          <Card className="border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-black/35 backdrop-blur shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="p-6">
              <CardTitle className="text-base font-bold dark:text-white">Processed File Operations</CardTitle>
              <CardDescription className="text-xs">System logs of all user file conversions.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-100/50 dark:bg-white/5">
                    <TableRow className="border-b border-slate-200 dark:border-white/10">
                      <TableHead className="text-xs font-bold text-slate-500">Tool</TableHead>
                      <TableHead className="text-xs font-bold text-slate-500">Input File</TableHead>
                      <TableHead className="text-xs font-bold text-slate-500">Output File</TableHead>
                      <TableHead className="text-xs font-bold text-slate-500">Size</TableHead>
                      <TableHead className="text-xs font-bold text-slate-500">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {conversions.map((conv) => (
                      <TableRow key={conv.id} className="border-b border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <TableCell className="font-bold text-xs uppercase tracking-wide">
                          <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 text-[9px] font-black">
                            {conv.toolUsed}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-xs truncate">{conv.inputFileName}</TableCell>
                        <TableCell className="text-xs text-slate-500 max-w-xs truncate">{conv.outputFileName}</TableCell>
                        <TableCell className="text-xs font-medium text-slate-500">{formatFileSize(conv.size)}</TableCell>
                        <TableCell className="text-xs text-slate-500 font-medium">
                          {formatDistanceToNow(new Date(conv.createdAt), { addSuffix: true })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. Support Messages Inbox */}
        <TabsContent value="messages">
          <Card className="border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-black/35 backdrop-blur shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="p-6">
              <CardTitle className="text-base font-bold dark:text-white">Customer Inquiries Inbox</CardTitle>
              <CardDescription className="text-xs">Read and process user contact messages.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`border p-5 rounded-2xl relative transition-all ${
                        msg.isRead
                          ? "border-slate-200/60 bg-slate-50/50 dark:border-white/5 dark:bg-slate-900/10 opacity-75"
                          : "border-cyan-500/20 bg-cyan-500/5 dark:border-cyan-500/30"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold dark:text-white flex items-center gap-2">
                            {msg.subject}
                            {!msg.isRead && (
                              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                            )}
                          </h4>
                          <p className="text-[10px] text-slate-500 font-semibold mt-1">
                            From: {msg.name} ({msg.email}) | {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                          </p>
                        </div>

                        {/* Message Actions */}
                        <div className="flex gap-2 shrink-0 pt-2 sm:pt-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMessageStatus(msg.id, !msg.isRead)}
                            className="h-8 text-xs border-slate-200 dark:border-white/5"
                          >
                            <CheckCircle className={`w-3.5 h-3.5 mr-1 ${msg.isRead ? "text-cyan-500" : "text-slate-400"}`} />
                            {msg.isRead ? "Mark Unread" : "Mark Read"}
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleMessageDelete(msg.id)}
                            className="h-8 w-8 text-rose-500 hover:bg-rose-500/10 border-slate-200 dark:border-white/5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 space-y-2">
                  <Mail className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto animate-bounce" />
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Support inbox is empty.</p>
                  <p className="text-xs text-slate-500">Contact submissions from users will appear here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
