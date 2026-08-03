"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, AlertCircle, HelpCircle, RefreshCw, Search } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface FraudReport {
  id: string;
  phone: string;
  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "UNKNOWN";
  provider: string;
  reason: string | null;
  createdAt: string;
  order: { orderNumber: string } | null;
}

const RISK_META = {
  LOW:     { label: "Low Risk",     color: "bg-green-100 text-green-800",  icon: CheckCircle2 },
  MEDIUM:  { label: "Medium Risk",  color: "bg-amber-100 text-amber-800",  icon: AlertCircle  },
  HIGH:    { label: "High Risk",    color: "bg-red-100 text-red-800",      icon: AlertTriangle},
  UNKNOWN: { label: "Unknown",      color: "bg-slate-100 text-slate-600",  icon: HelpCircle   },
};

export default function AdminFraudPage() {
  const [reports, setReports] = useState<FraudReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [checkPhone, setCheckPhone] = useState("");
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<FraudReport | null>(null);

  const fetchReports = async (riskLevel?: string) => {
    setLoading(true);
    try {
      const query = riskLevel && riskLevel !== "ALL" ? `?riskLevel=${riskLevel}` : "";
      const data = await apiFetch<{ data: FraudReport[] }>(`/api/fraud/history${query}`);
      setReports(data.data || []);
    } catch {
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  const handleFilterChange = (level: string) => {
    setFilter(level);
    fetchReports(level);
  };

  const handleManualCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkPhone.trim()) return;
    setChecking(true);
    setCheckResult(null);
    try {
      const data = await apiFetch<{ data: FraudReport }>("/api/fraud/check", {
        method: "POST",
        body: JSON.stringify({ phone: checkPhone }),
      });
      setCheckResult(data.data);
    } catch {
      // ignore
    } finally {
      setChecking(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Fraud Detection Dashboard</h1>

      {/* Manual Check */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="font-semibold text-slate-800 mb-4">Manual Phone Check</h2>
        <form onSubmit={handleManualCheck} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="tel"
              value={checkPhone}
              onChange={(e) => setCheckPhone(e.target.value)}
              placeholder="Enter phone number to check..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <Button type="submit" disabled={checking} className="gap-2">
            {checking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {checking ? "Checking..." : "Check"}
          </Button>
        </form>

        {checkResult && (
          <div className={`mt-4 p-4 rounded-lg border ${
            checkResult.riskLevel === "HIGH" ? "bg-red-50 border-red-200" :
            checkResult.riskLevel === "MEDIUM" ? "bg-amber-50 border-amber-200" :
            "bg-green-50 border-green-200"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Phone: <span className="font-mono">{checkPhone}</span></p>
                <p className="text-xs text-slate-500 mt-1">Provider: {checkResult.provider} · Score: {checkResult.riskScore}/100</p>
                {checkResult.reason && <p className="text-xs mt-1 text-slate-600">{checkResult.reason}</p>}
              </div>
              <Badge className={RISK_META[checkResult.riskLevel]?.color}>
                {RISK_META[checkResult.riskLevel]?.label}
              </Badge>
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {["ALL", "HIGH", "MEDIUM", "LOW", "UNKNOWN"].map((level) => (
          <button
            key={level}
            onClick={() => handleFilterChange(level)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === level
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"
            }`}
          >
            {level === "ALL" ? "All Reports" : RISK_META[level as keyof typeof RISK_META]?.label}
          </button>
        ))}
      </div>

      {/* Reports Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Risk Level</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Score</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Provider</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                  ))}
                </tr>
              ))
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-slate-400">No fraud reports found.</td>
              </tr>
            ) : (
              reports.map((report) => {
                const meta = RISK_META[report.riskLevel] || RISK_META.UNKNOWN;
                const IconComp = meta.icon;
                return (
                  <tr key={report.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono font-medium">{report.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${meta.color}`}>
                        <IconComp className="w-3.5 h-3.5" />
                        {meta.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${report.riskScore > 70 ? "bg-red-500" : report.riskScore > 30 ? "bg-amber-500" : "bg-green-500"}`}
                            style={{ width: `${report.riskScore}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">{report.riskScore}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{report.provider}</td>
                    <td className="px-6 py-4 font-mono text-xs">{report.order?.orderNumber || "—"}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{new Date(report.createdAt).toLocaleDateString("en-BD")}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
