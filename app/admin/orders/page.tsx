"use client";

import { useEffect, useState, useCallback } from "react";
import { ShoppingBag, RefreshCw, CheckCircle2, Clock, Banknote, CreditCard, XCircle, ChevronDown, ChevronUp, Mail, Phone, Building2, Calendar, MapPin, Users } from "lucide-react";
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
  updated_at: string;
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

function OrderRow({ order, onStatusChange }: { order: Order; onStatusChange: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);

  async function changeStatus(newStatus: string) {
    setUpdating(true);
    try {
      await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id, status: newStatus }),
      });
      onStatusChange();
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Summary row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-bold text-sm text-navy">
              {order.first_name} {order.last_name}
            </span>
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

      {/* Expanded detail */}
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
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar size={13} className="text-gray-400" />
                {order.preferred_date}
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin size={13} className="text-gray-400" />
                {order.location}
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Users size={13} className="text-gray-400" />
                {order.delegates} delegate{order.delegates > 1 ? "s" : ""}
              </div>
            </div>
          </div>

          {/* Payment */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Payment</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Paid today:</span>
                <span className="font-bold text-green-700">{formatGBP(order.amount_paid_pence)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total course:</span>
                <span className="text-gray-700">{formatGBP(order.total_amount_pence)}</span>
              </div>
              {order.remaining_balance_pence > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Balance due:</span>
                  <span className="font-bold text-red-600">{formatGBP(order.remaining_balance_pence)}</span>
                </div>
              )}
              {order.payment_type === "full" ? (
                <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
                  <CreditCard size={11} /> Full payment
                </div>
              ) : (
                <div className="flex items-center gap-1 mt-1 text-xs text-blue-600">
                  <Banknote size={11} /> Deposit paid
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Actions</h4>
            <div className="flex flex-wrap gap-2">
              {order.status !== "paid" && (
                <button
                  onClick={() => changeStatus("paid")}
                  disabled={updating}
                  className="text-xs px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 transition-colors font-semibold"
                >
                  Mark as Paid
                </button>
              )}
              {order.status !== "cancelled" && (
                <button
                  onClick={() => changeStatus("cancelled")}
                  disabled={updating}
                  className="text-xs px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 transition-colors font-semibold"
                >
                  Cancel Order
                </button>
              )}
              {order.status === "cancelled" && (
                <button
                  onClick={() => changeStatus("pending")}
                  disabled={updating}
                  className="text-xs px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors font-semibold"
                >
                  Restore
                </button>
              )}
            </div>
            {order.notes && (
              <div className="mt-3 text-xs text-gray-500 bg-gray-50 rounded-lg p-2.5">
                <span className="font-semibold text-gray-600">Notes:</span> {order.notes}
              </div>
            )}
            {order.square_payment_id && (
              <p className="text-[10px] text-gray-300 mt-2 font-mono">
                Square: {order.square_payment_id.slice(0, 12)}…
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

type StatusFilter = "all" | "pending" | "paid" | "deposit_paid" | "cancelled";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const url = filter === "all" ? "/api/admin/orders" : `/api/admin/orders?status=${filter}`;
      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();
      setOrders(data.orders ?? []);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const totalPaid = orders
    .filter((o) => o.status === "paid" || o.status === "deposit_paid")
    .reduce((sum, o) => sum + o.amount_paid_pence, 0);

  const FILTERS: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "paid", label: "Paid" },
    { value: "deposit_paid", label: "Deposit Paid" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <ShoppingBag size={24} className="text-orange-brand" />
            Orders
          </h1>
          <p className="text-gray-500 text-sm mt-1">All bookings with completed Square payments</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-navy border border-gray-200 hover:border-gray-300 px-3 py-2 rounded-xl transition-all"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Orders", value: orders.length },
          { label: "Pending", value: orders.filter((o) => o.status === "pending").length },
          { label: "Paid / Deposit", value: orders.filter((o) => o.status === "paid" || o.status === "deposit_paid").length },
          { label: "Revenue Received", value: formatGBP(totalPaid) },
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
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-semibold transition-all border",
              filter === value
                ? "bg-navy text-white border-navy"
                : "bg-white text-gray-600 border-gray-200 hover:border-navy/40 hover:text-navy"
            )}
          >
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
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <ShoppingBag size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-semibold">No orders found</p>
          <p className="text-gray-400 text-sm mt-1">
            {filter === "all" ? "Orders will appear here after customers complete payment." : `No ${filter} orders.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} onStatusChange={load} />
          ))}
        </div>
      )}
    </div>
  );
}
