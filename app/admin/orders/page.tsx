"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ShoppingBag, RefreshCw, CheckCircle2, Clock, Banknote, CreditCard,
  XCircle, ChevronDown, ChevronUp, Mail, Phone, Building2, Calendar,
  MapPin, Users, Trash2, PlusCircle, X, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Order {
  id: string;
  status: string;
  payment_type: string;
  amount_paid_pence: number;
  total_amount_pence: number;
  remaining_balance_pence: number;
  square_order_id: string | null;
  square_payment_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  course_id: string;
  course_name: string;
  preferred_date: string;
  delegates: number;
  location: string;
  notes: string;
  created_at: string;
}

function formatGBP(pence: number) {
  return `£${(pence / 100).toFixed(2)}`;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    pending:      { label: "Pending",       cls: "bg-yellow-50 text-yellow-700 border-yellow-200",  icon: <Clock size={11} /> },
    paid:         { label: "Paid in Full",  cls: "bg-green-50 text-green-700 border-green-200",    icon: <CheckCircle2 size={11} /> },
    deposit_paid: { label: "Deposit Paid",  cls: "bg-blue-50 text-blue-700 border-blue-200",       icon: <Banknote size={11} /> },
    cancelled:    { label: "Cancelled",     cls: "bg-red-50 text-red-700 border-red-200",           icon: <XCircle size={11} /> },
  };
  const s = map[status] ?? { label: status, cls: "bg-gray-50 text-gray-600 border-gray-200", icon: null };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold ${s.cls}`}>
      {s.icon}{s.label}
    </span>
  );
}

function OrderRow({ order, onRefresh }: { order: Order; onRefresh: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function changeStatus(newStatus: string) {
    setUpdating(true);
    try {
      await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id, status: newStatus }),
      });
      onRefresh();
    } finally { setUpdating(false); }
  }

  async function deleteOrder() {
    setDeleting(true);
    try {
      await fetch("/api/admin/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id }),
      });
      onRefresh();
    } finally { setDeleting(false); setConfirmDelete(false); }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-bold text-sm text-navy">{order.first_name} {order.last_name}</span>
            <StatusBadge status={order.status} />
            {order.payment_type === "deposit" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold">
                <Banknote size={10} /> Deposit
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500 mt-0.5 truncate">{order.course_name}</div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-bold text-sm text-green-700">{formatGBP(order.amount_paid_pence)}</div>
          {order.remaining_balance_pence > 0 && (
            <div className="text-xs text-red-500">+{formatGBP(order.remaining_balance_pence)} due</div>
          )}
        </div>
        <div className="text-xs text-gray-400 flex-shrink-0 hidden sm:block w-28 text-right">
          {formatDate(order.created_at)}
        </div>
        <div className="text-gray-400 flex-shrink-0">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 px-5 py-5 grid sm:grid-cols-2 gap-6">
          {/* Customer */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Customer</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Mail size={13} className="text-gray-400" />
                <a href={`mailto:${order.email}`} className="hover:text-navy hover:underline">{order.email}</a>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Phone size={13} className="text-gray-400" />
                <a href={`tel:${order.phone}`} className="hover:text-navy hover:underline">{order.phone}</a>
              </div>
              {order.company && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Building2 size={13} className="text-gray-400" />
                  {order.company}
                </div>
              )}
            </div>
          </div>

          {/* Course */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Course Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-700"><Calendar size={13} className="text-gray-400" />{order.preferred_date}</div>
              <div className="flex items-center gap-2 text-gray-700"><MapPin size={13} className="text-gray-400" />{order.location}</div>
              <div className="flex items-center gap-2 text-gray-700"><Users size={13} className="text-gray-400" />{order.delegates} delegate{order.delegates > 1 ? "s" : ""}</div>
            </div>
          </div>

          {/* Payment */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Payment</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Paid:</span>
                <span className="font-bold text-green-700">{formatGBP(order.amount_paid_pence)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total:</span>
                <span className="text-gray-700">{formatGBP(order.total_amount_pence)}</span>
              </div>
              {order.remaining_balance_pence > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Balance due:</span>
                  <span className="font-bold text-red-600">{formatGBP(order.remaining_balance_pence)}</span>
                </div>
              )}
              <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                {order.payment_type === "full" ? <><CreditCard size={11} /> Full payment</> : <><Banknote size={11} /> Deposit paid</>}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Actions</h4>
            <div className="flex flex-wrap gap-2 mb-3">
              {order.status !== "paid" && (
                <button onClick={() => changeStatus("paid")} disabled={updating}
                  className="text-xs px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 transition-colors font-semibold">
                  Mark Paid
                </button>
              )}
              {order.status !== "cancelled" && (
                <button onClick={() => changeStatus("cancelled")} disabled={updating}
                  className="text-xs px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100 transition-colors font-semibold">
                  Cancel
                </button>
              )}
              {order.status === "cancelled" && (
                <button onClick={() => changeStatus("pending")} disabled={updating}
                  className="text-xs px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors font-semibold">
                  Restore
                </button>
              )}
            </div>

            {/* Delete */}
            {!confirmDelete ? (
              <button onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 transition-colors">
                <Trash2 size={12} /> Delete order
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={deleteOrder} disabled={deleting}
                  className="text-xs px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-semibold">
                  {deleting ? "Deleting…" : "Confirm delete"}
                </button>
                <button onClick={() => setConfirmDelete(false)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
              </div>
            )}

            {order.notes && (
              <div className="mt-3 text-xs text-gray-500 bg-gray-50 rounded-lg p-2.5">
                <span className="font-semibold text-gray-600">Notes:</span> {order.notes}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Add Order Modal ─────────────────────────────────────────────────────────

function AddOrderModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", company: "",
    courseName: "", preferredDate: "", delegates: 1, location: "", notes: "",
    paymentType: "full" as "full" | "deposit",
    amountPaid: "", totalAmount: "",
  });

  function set(key: string, value: string | number) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const amountPaidPence = Math.round(parseFloat(form.amountPaid || "0") * 100);
    const totalAmountPence = Math.round(parseFloat(form.totalAmount || "0") * 100);
    if (!form.firstName || !form.lastName || !form.email || !form.courseName || !form.preferredDate) {
      setErr("Please fill in all required fields.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          delegates: Number(form.delegates),
          amountPaidPence,
          totalAmountPence,
        }),
      });
      if (!res.ok) throw new Error("Failed to create order");
      onAdded();
      onClose();
    } catch {
      setErr("Failed to save order. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const F = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
  const inp = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-black text-navy">Add Order Manually</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <F label="First Name *"><input value={form.firstName} onChange={(e) => set("firstName", e.target.value)} className={inp} placeholder="John" /></F>
            <F label="Last Name *"><input value={form.lastName} onChange={(e) => set("lastName", e.target.value)} className={inp} placeholder="Smith" /></F>
            <F label="Email *"><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inp} placeholder="john@company.co.uk" /></F>
            <F label="Phone *"><input value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inp} placeholder="0141 258 2024" /></F>
            <F label="Company"><input value={form.company} onChange={(e) => set("company", e.target.value)} className={inp} placeholder="Optional" /></F>
            <F label="Delegates">
              <input type="number" min={1} max={50} value={form.delegates} onChange={(e) => set("delegates", Number(e.target.value))} className={inp} />
            </F>
          </div>

          <F label="Course Name *"><input value={form.courseName} onChange={(e) => set("courseName", e.target.value)} className={inp} placeholder="e.g. Driver CPC Classroom (7hr)" /></F>
          <div className="grid sm:grid-cols-2 gap-4">
            <F label="Course Date *"><input type="date" value={form.preferredDate} onChange={(e) => set("preferredDate", e.target.value)} className={inp} /></F>
            <F label="Location *"><input value={form.location} onChange={(e) => set("location", e.target.value)} className={inp} placeholder="e.g. Bothwell HQ" /></F>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <F label="Payment Type">
              <select value={form.paymentType} onChange={(e) => set("paymentType", e.target.value)} className={inp}>
                <option value="full">Full Payment</option>
                <option value="deposit">Deposit</option>
              </select>
            </F>
            <F label="Amount Paid (£)"><input type="number" step="0.01" min="0" value={form.amountPaid} onChange={(e) => set("amountPaid", e.target.value)} className={inp} placeholder="0.00" /></F>
            <F label="Total Course Price (£)"><input type="number" step="0.01" min="0" value={form.totalAmount} onChange={(e) => set("totalAmount", e.target.value)} className={inp} placeholder="0.00" /></F>
          </div>

          <F label="Notes"><textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} className={inp + " resize-none"} rows={2} placeholder="Optional" /></F>

          {err && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
              <AlertCircle size={14} /> {err}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-navy text-white text-sm font-bold hover:bg-navy/90 transition-colors">
              {saving ? "Saving…" : "Save Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────

type StatusFilter = "confirmed" | "pending" | "cancelled" | "all";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>("confirmed");
  const [showAddModal, setShowAddModal] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      const data = await res.json();
      setOrders(data.orders ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Apply filter client-side so switching tabs is instant
  const filteredOrders = orders.filter((o) => {
    if (filter === "confirmed") return o.status === "paid" || o.status === "deposit_paid";
    if (filter === "pending") return o.status === "pending";
    if (filter === "cancelled") return o.status === "cancelled";
    return true;
  });

  const paidOrders = orders.filter((o) => o.status === "paid" || o.status === "deposit_paid");
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.amount_paid_pence, 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  const FILTERS: { value: StatusFilter; label: string }[] = [
    { value: "confirmed", label: `Confirmed (${paidOrders.length})` },
    { value: "pending", label: `Pending (${pendingCount})` },
    { value: "cancelled", label: "Cancelled" },
    { value: "all", label: "All" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {showAddModal && (
        <AddOrderModal onClose={() => setShowAddModal(false)} onAdded={load} />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <ShoppingBag size={24} className="text-orange-brand" />
            Orders
          </h1>
          <p className="text-gray-500 text-sm mt-1">Confirmed paid bookings from Square and manual entries</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} disabled={loading}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-navy border border-gray-200 hover:border-gray-300 px-3 py-2 rounded-xl transition-all">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 text-sm bg-navy text-white px-4 py-2 rounded-xl hover:bg-navy/90 transition-colors font-semibold">
            <PlusCircle size={15} />
            Add Order
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Confirmed Orders", value: paidOrders.length },
          { label: "Pending Payment", value: pendingCount },
          { label: "Total Received", value: formatGBP(totalRevenue) },
          { label: "Cancelled", value: orders.filter((o) => o.status === "cancelled").length },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="text-xl font-black text-navy">{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(({ value, label }) => (
          <button key={value} onClick={() => setFilter(value)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-semibold transition-all border",
              filter === value ? "bg-navy text-white border-navy" : "bg-white text-gray-600 border-gray-200 hover:border-navy/40 hover:text-navy"
            )}>
            {label}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">
          <RefreshCw size={24} className="animate-spin mx-auto mb-3" />
          Loading orders…
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <ShoppingBag size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-semibold">No orders found</p>
          <p className="text-gray-400 text-sm mt-1">
            {filter === "confirmed" ? "Confirmed orders will appear here after Square payment is received." : `No ${filter} orders.`}
          </p>
          {filter === "confirmed" && (
            <button onClick={() => setShowAddModal(true)}
              className="mt-4 inline-flex items-center gap-2 text-sm bg-navy text-white px-4 py-2 rounded-xl hover:bg-navy/90 transition-colors font-semibold">
              <PlusCircle size={14} /> Add Manual Order
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <OrderRow key={order.id} order={order} onRefresh={load} />
          ))}
        </div>
      )}
    </div>
  );
}
