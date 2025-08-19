"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/lib/api";
import {
  Search,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  UserX,
  Shield,
  ShieldOff,
} from "lucide-react";

interface UsersTableProps {
  users: User[];
  onSuspendUser: (id: string, reason: string, duration: string) => void;
}

export function UsersTable({ users, onSuspendUser }: UsersTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [verificationFilter, setVerificationFilter] = useState<string>("all");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesVerification =
      verificationFilter === "all" ||
      (verificationFilter === "verified" && user.isVerified) ||
      (verificationFilter === "unverified" && !user.isVerified);

    return matchesSearch && matchesRole && matchesVerification;
  });

  const getRoleBadge = (role: string) => {
    const variants = {
      ADMIN: "destructive",
      HOST: "default",
      GUEST: "secondary",
    } as const;

    return (
      <Badge variant={variants[role as keyof typeof variants] || "secondary"}>
        {role}
      </Badge>
    );
  };

  const getVerificationStatus = (user: User) => {
    if (user.isVerified) {
      return (
        <div className="flex items-center space-x-1">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-sm text-green-600">Verified</span>
        </div>
      );
    }
    return (
      <div className="flex items-center space-x-1">
        <XCircle className="h-4 w-4 text-red-500" />
        <span className="text-sm text-red-600">Unverified</span>
      </div>
    );
  };

  const getHostStatus = (user: User) => {
    if (user.role !== "HOST") return null;

    const status = user.hostApprovalStatus;
    if (status === "APPROVED") {
      return (
        <div className="flex items-center space-x-1">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-sm text-green-600">Approved</span>
        </div>
      );
    } else if (status === "PENDING") {
      return (
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4 text-yellow-500" />
          <span className="text-sm text-yellow-600">Pending</span>
        </div>
      );
    } else if (status === "REJECTED") {
      return (
        <div className="flex items-center space-x-1">
          <XCircle className="h-4 w-4 text-red-500" />
          <span className="text-sm text-red-600">Rejected</span>
        </div>
      );
    } else if (status === "SUSPENDED") {
      return (
        <div className="flex items-center space-x-1">
          <XCircle className="h-4 w-4 text-red-500" />
          <span className="text-sm text-red-600">Suspended</span>
        </div>
      );
    } else {
      // Default case for null, undefined, or any other status
      return (
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-500">Not Set</span>
        </div>
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="HOST">Host</SelectItem>
            <SelectItem value="GUEST">Guest</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={verificationFilter}
          onValueChange={setVerificationFilter}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by verification" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="unverified">Unverified</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead>Host Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{getVerificationStatus(user)}</TableCell>
                <TableCell>{getHostStatus(user)}</TableCell>
                <TableCell>
                  <div className="text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => router.push(`/users/${user.id}`)}
                      >
                        <UserCheck className="mr-2 h-4 w-4" />
                        Overview
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => router.push(`/users/${user.id}/edit`)}
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onSuspendUser(user.id, "", "")}
                      >
                        <UserX className="mr-2 h-4 w-4" />
                        Suspend
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No users found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
