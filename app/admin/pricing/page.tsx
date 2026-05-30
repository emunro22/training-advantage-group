"use client";

import { useEffect, useState } from "react";
import { Tag, Plus, Trash2, Edit2, X, ToggleLeft, ToggleRight } from "lucide-react";
import type { SpecialOffer, PriceOverride } from "@/lib/storage";

const EMPTY_OFFER = {
  title: "",
  description: "",
  discountType: "percentage" as "percentage" | "fixed",
  discountValue: 0,
  courseName: "",
  validUntil: "",
  active: true,
  promoCode: "",
};

const EMPTY_OVERRIDE = {
  courseName: "",
  courseId: "",
  originalPrice: "",
  overridePrice: "",
  label: "",
  active: true,
};

export default function PricingAdmin() {
  const [offers, setOffers] = useState<SpecialOffer[]>([]);
  const [overrides, setOverrides] = useState<PriceOverride[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"offers" | "overrides">("offers");

  const [showOfferForm, setShowOfferForm] = useState(false);
  const [editOfferId, setEditOfferId] = useState<string | null>(null);
  const [offerForm, setOfferForm] = useState(EMPTY_OFFER);

  const [showOverrideForm, setShowOverrideForm] = useState(false);
  const [editOverrideId, setEditOverrideId] = useState<string | null>(null);
  const [overrideForm, setOverrideForm] = useState(EMPTY_OVERRIDE);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/pricing");
    const data = await res.json();
    setOffers(data.specialOffers ?? []);
    setOverrides(data.priceOverrides ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  // ── Offers ──
  function openAddOffer() {
    setOfferForm(EMPTY_OFFER);
    setEditOfferId(null);
    setError("");
    setShowOfferForm(true);
  }

  function openEditOffer(o: SpecialOffer) {
    setOfferForm({
      title: o.title,
      description: o.description,
      discountType: o.discountType,
      discountValue: o.discountValue,
      courseName: o.courseName ?? "",
      validUntil: o.validUntil ?? "",
      active: o.active,
      promoCode: o.promoCode ?? "",
    });
    setEditOfferId(o.id);
    setError("");
    setShowOfferForm(true);
  }

  async function saveOffer() {
    if (!offerForm.title) { setError("Title is required."); return; }
    setSaving(true);
    setError("");
    const method = editOfferId ? "PUT" : "POST";
    const body = editOfferId
      ? { type: "offer", id: editOfferId, ...offerForm }
      : { type: "offer", ...offerForm };

    const res = await fetch("/api/admin/pricing", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) { setShowOfferForm(false); await load(); }
    else { const d = await res.json(); setError(d.error ?? "Failed"); }
    setSaving(false);
  }

  async function deleteOffer(id: string) {
    if (!confirm("Delete this offer?")) return;
    await fetch("/api/admin/pricing", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "offer", id }),
    });
    await load();
  }

  async function toggleOffer(o: SpecialOffer) {
    await fetch("/api/admin/pricing", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "offer", id: o.id, active: !o.active }),
    });
    await load();
  }

  // ── Overrides ──
  function openAddOverride() {
    setOverrideForm(EMPTY_OVERRIDE);
    setEditOverrideId(null);
    setError("");
    setShowOverrideForm(true);
  }

  function openEditOverride(o: PriceOverride) {
    setOverrideForm({
      courseName: o.courseName,
      courseId: o.courseId,
      originalPrice: o.originalPrice,
      overridePrice: o.overridePrice,
      label: o.label ?? "",
      active: o.active,
    });
    setEditOverrideId(o.id);
    setError("");
    setShowOverrideForm(true);
  }

  async function saveOverride() {
    if (!overrideForm.courseName || !overrideForm.overridePrice) { setError("Course name and new price are required."); return; }
    setSaving(true);
    setError("");
    const method = editOverrideId ? "PUT" : "POST";
    const body = editOverrideId
      ? { type: "override", id: editOverrideId, ...overrideForm }
      : { type: "override", ...overrideForm };

    const res = await fetch("/api/admin/pricing", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) { setShowOverrideForm(false); await load(); }
    else { const d = await res.json(); setError(d.error ?? "Failed"); }
    setSaving(false);
  }

  async function deleteOverride(id: string) {
    if (!confirm("Delete this price override?")) return;
    await fetch("/api/admin/pricing", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "override", id }),
    });
    await load();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Pricing & Offers</h1>
        <p className="text-gray-500 text-sm mt-1">Manage special offers and price overrides for courses</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(["offers", "overrides"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${tab === t ? "bg-white text-navy shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            {t === "offers" ? `Special Offers (${offers.length})` : `Price Overrides (${overrides.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 text-sm">Loading…</div>
      ) : tab === "offers" ? (
        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">Promotions shown on the site to attract bookings</p>
            <button onClick={openAddOffer} className="flex items-center gap-2 bg-navy text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-navy-light transition-colors shadow-sm">
              <Plus size={16} /> Add Offer
            </button>
          </div>
          {offers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <Tag size={32} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No special offers yet.</p>
              <button onClick={openAddOffer} className="text-blue-brand font-semibold text-sm hover:underline mt-2">Add your first offer →</button>
            </div>
          ) : offers.map((o) => (
            <div key={o.id} className={`bg-white rounded-2xl border p-4 flex items-start gap-4 ${o.active ? "border-orange-brand/30" : "border-gray-100 opacity-60"}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-sm text-gray-800">{o.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${o.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {o.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{o.description}</p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                  <span className="font-semibold text-orange-brand">
                    {o.discountType === "percentage" ? `${o.discountValue}% off` : `£${o.discountValue} off`}
                  </span>
                  {o.courseName && <span>Course: {o.courseName}</span>}
                  {o.validUntil && <span>Expires: {o.validUntil}</span>}
                  {o.promoCode && <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{o.promoCode}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => toggleOffer(o)} className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors" title="Toggle active">
                  {o.active ? <ToggleRight size={16} className="text-green-600" /> : <ToggleLeft size={16} />}
                </button>
                <button onClick={() => openEditOffer(o)} className="p-2 rounded-lg text-gray-400 hover:text-orange-brand hover:bg-orange-50 transition-colors">
                  <Edit2 size={15} />
                </button>
                <button onClick={() => deleteOffer(o.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </section>
      ) : (
        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">Override the displayed price for specific courses</p>
            <button onClick={openAddOverride} className="flex items-center gap-2 bg-navy text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-navy-light transition-colors shadow-sm">
              <Plus size={16} /> Add Override
            </button>
          </div>
          {overrides.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <Tag size={32} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No price overrides set.</p>
            </div>
          ) : overrides.map((o) => (
            <div key={o.id} className={`bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 ${!o.active ? "opacity-60" : ""}`}>
              <div className="flex-1">
                <div className="font-semibold text-sm text-gray-800 mb-0.5">{o.courseName}</div>
                <div className="text-xs text-gray-400">
                  <span className="line-through mr-2">{o.originalPrice}</span>
                  <span className="text-green-600 font-bold">{o.overridePrice}</span>
                  {o.label && <span className="ml-2 bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">{o.label}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEditOverride(o)} className="p-2 rounded-lg text-gray-400 hover:text-orange-brand hover:bg-orange-50 transition-colors">
                  <Edit2 size={15} />
                </button>
                <button onClick={() => deleteOverride(o.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Offer form modal */}
      {showOfferForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="font-bold text-gray-900">{editOfferId ? "Edit Offer" : "Add Special Offer"}</h3>
              <button onClick={() => setShowOfferForm(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg">{error}</div>}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Title *</label>
                <input type="text" value={offerForm.title} onChange={(e) => setOfferForm((f) => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" placeholder="e.g. Summer Discount" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Description</label>
                <textarea value={offerForm.description} onChange={(e) => setOfferForm((f) => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Discount Type</label>
                  <select value={offerForm.discountType} onChange={(e) => setOfferForm((f) => ({ ...f, discountType: e.target.value as "percentage" | "fixed" }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand bg-white">
                    <option value="percentage">Percentage %</option>
                    <option value="fixed">Fixed £</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Amount</label>
                  <input type="number" value={offerForm.discountValue} onChange={(e) => setOfferForm((f) => ({ ...f, discountValue: +e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" min="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Course (optional)</label>
                  <input type="text" value={offerForm.courseName} onChange={(e) => setOfferForm((f) => ({ ...f, courseName: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" placeholder="All courses if blank" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Valid Until</label>
                  <input type="date" value={offerForm.validUntil} onChange={(e) => setOfferForm((f) => ({ ...f, validUntil: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Promo Code (optional)</label>
                <input type="text" value={offerForm.promoCode} onChange={(e) => setOfferForm((f) => ({ ...f, promoCode: e.target.value.toUpperCase() }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand font-mono" placeholder="SUMMER10" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={offerForm.active} onChange={(e) => setOfferForm((f) => ({ ...f, active: e.target.checked }))} className="w-4 h-4 rounded" />
                <span className="text-sm font-semibold text-gray-700">Active (visible on site)</span>
              </label>
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t bg-gray-50/50">
              <button onClick={() => setShowOfferForm(false)} className="px-4 py-2 text-sm text-gray-500">Cancel</button>
              <button onClick={saveOffer} disabled={saving} className="px-5 py-2 bg-navy text-white rounded-xl text-sm font-semibold hover:bg-navy-light disabled:opacity-40">
                {saving ? "Saving…" : editOfferId ? "Save Changes" : "Add Offer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Override form modal */}
      {showOverrideForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="font-bold text-gray-900">{editOverrideId ? "Edit Override" : "Add Price Override"}</h3>
              <button onClick={() => setShowOverrideForm(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg">{error}</div>}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Course Name *</label>
                <input type="text" value={overrideForm.courseName} onChange={(e) => setOverrideForm((f) => ({ ...f, courseName: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Original Price</label>
                  <input type="text" value={overrideForm.originalPrice} onChange={(e) => setOverrideForm((f) => ({ ...f, originalPrice: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" placeholder="£395" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">New Price *</label>
                  <input type="text" value={overrideForm.overridePrice} onChange={(e) => setOverrideForm((f) => ({ ...f, overridePrice: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" placeholder="£295" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Label (optional)</label>
                <input type="text" value={overrideForm.label} onChange={(e) => setOverrideForm((f) => ({ ...f, label: e.target.value }))} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-brand" placeholder="e.g. Limited Time" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t bg-gray-50/50">
              <button onClick={() => setShowOverrideForm(false)} className="px-4 py-2 text-sm text-gray-500">Cancel</button>
              <button onClick={saveOverride} disabled={saving} className="px-5 py-2 bg-navy text-white rounded-xl text-sm font-semibold hover:bg-navy-light disabled:opacity-40">
                {saving ? "Saving…" : editOverrideId ? "Save Changes" : "Add Override"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
