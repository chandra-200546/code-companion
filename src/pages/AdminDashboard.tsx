import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Users, CalendarDays, ArrowLeft, Lock } from "lucide-react";
import { Link } from "react-router-dom";

interface AdminData {
  totalUsers: number;
  signupsByDate: Record<string, number>;
  userList: { email: string; created_at: string; last_sign_in: string | null }[];
}

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<AdminData | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const { data: result, error: fnError } = await supabase.functions.invoke("admin-stats", {
        body: { password },
      });
      if (fnError) throw fnError;
      if (result.error) {
        setError("Wrong password");
        return;
      }
      setData(result);
      setAuthenticated(true);
    } catch {
      setError("Failed to authenticate");
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-sm p-6 space-y-4">
          <div className="flex items-center gap-2 justify-center text-primary">
            <Lock className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Admin Access</h2>
          </div>
          <Input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
          <Button onClick={handleLogin} disabled={loading} className="w-full">
            {loading ? "Verifying..." : "Access Dashboard"}
          </Button>
          <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground justify-center">
            <ArrowLeft className="w-3 h-3" /> Back
          </Link>
        </Card>
      </div>
    );
  }

  const sortedDates = data ? Object.entries(data.signupsByDate).sort(([a], [b]) => b.localeCompare(a)) : [];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-3xl font-bold text-foreground">{data?.totalUsers}</p>
            </div>
          </Card>
          <Card className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-full bg-accent/10">
              <CalendarDays className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Signups Today</p>
              <p className="text-3xl font-bold text-foreground">
                {data?.signupsByDate[new Date().toISOString().split("T")[0]] || 0}
              </p>
            </div>
          </Card>
        </div>

        {/* Signups by Date */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Signups by Date</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Signups</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedDates.map(([date, count]) => (
                <TableRow key={date}>
                  <TableCell>{date}</TableCell>
                  <TableCell>{count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* User List */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-foreground">All Users</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Signed Up</TableHead>
                <TableHead>Last Sign In</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.userList.map((u, i) => (
                <TableRow key={i}>
                  <TableCell className="font-mono text-sm">{u.email}</TableCell>
                  <TableCell>{new Date(u.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{u.last_sign_in ? new Date(u.last_sign_in).toLocaleDateString() : "Never"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
