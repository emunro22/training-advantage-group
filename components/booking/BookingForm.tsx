"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, Loader2, ChevronDown, AlertCircle, Calendar, Users,
  MapPin, User, Phone, Mail, Building2, MessageSquare, CalendarDays,
  Clock, CreditCard, Banknote, X,
} from "lucide-react";
import { COURSES, LOCATIONS, COURSE_CATEGORIES } from "@/lib/courses";
import type { BookingFormData } from "@/lib/types";
import type { UpcomingCourse } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { computeDeposit } from "@/lib/order-contract";

const schema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  company: z.string().optional(),
  category: z.string().min(1, "Please select a training category"),
  courseId: z.string().min(1, "Please select a course"),
  preferredDate: z.string().min(1, "Please select a preferred date"),
  delegates: z.coerce.number().min(1, "At least 1 delegate required").max(50, "Max 50 delegates"),
  location: z.string().min(1, "Please select a location"),
  message: z.string().optional(),
  consent: z.boolean().refine((v) => v === true, "Please accept the Terms and Privacy Notice"),
});

type FormValues = z.infer<typeof schema>;
type Step = 1 | 2 | 3;
type PaymentType = "full" | "deposit";

// Parse upcoming course price string to pence. Returns -1 when price is unknown/POA.
function parseUpcomingPrice(price: string): number {
  const match = price.match(/\d[\d,]*/);
  if (!match) return -1;
  const num = parseInt(match[0].replace(/,/g, ""), 10);
  return isNaN(num) ? -1 : num * 100;
}

// Guess a catalog category from an upcoming course name
function guessCategoryFromName(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("driver cpc") || n.includes("dcpc")) return "driver-cpc";
  if (n.includes("tm cpc") || n.includes("transport manager")) return "tm-cpc";
  if (n.includes("hgv") || n.includes("pcv") || n.includes("cat c")) return "hgv-training";
  if (n.includes("adr")) return "adr";
  if (n.includes("plant") || n.includes("forklift") || n.includes("mewp") || n.includes("reach") || n.includes("telehandler")) return "plant-training";
  if (n.includes("consult") || n.includes("audit") || n.includes("olat") || n.includes("tacho")) return "consultancy";
  if (n.includes("instructor")) return "instructor-training";
  return "driver-cpc";
}

function mapLocationToValue(loc: string): string {
  const l = loc.toLowerCase();
  if (l.includes("bothwell")) return "bothwell";
  if (l.includes("motherwell")) return "motherwell";
  if (l.includes("glasgow")) return "glasgow";
  if (l.includes("remote") || l.includes("online")) return "remote";
  if (l.includes("on-site") || l.includes("onsite") || l.includes("client")) return "onsite";
  return "";
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      weekday: "short", day: "numeric", month: "short", year: "numeric",
    });
  } catch { return dateStr; }
}

function formatGBP(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}

export default function BookingForm({ defaultCourse }: { defaultCourse?: string }) {
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [upcomingCourses, setUpcomingCourses] = useState<UpcomingCourse[]>([]);
  const [selectedUpcomingId, setSelectedUpcomingId] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<PaymentType>("full");
  const [redirecting, setRedirecting] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [promoChecking, setPromoChecking] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountAmountPence: number; offerTitle: string } | null>(null);

  useEffect(() => {
    fetch("/api/upcoming-courses")
      .then((r) => r.json())
      .then((d) => setUpcomingCourses(d.courses ?? []))
      .catch(() => {});
  }, []);

  const {
    register, handleSubmit, watch, trigger, setValue, formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { delegates: 1, courseId: defaultCourse || "" },
  });

  const selectedCategory = watch("category");
  const selectedCourseId = watch("courseId");
  const delegates = watch("delegates") || 1;
  const filteredCourses = COURSES.filter((c) => !selectedCategory || c.category === selectedCategory);
  const selectedCourse = COURSES.find((c) => c.id === selectedCourseId);

  // The actual upcoming course object (when one is pre-selected)
  const selectedUpcoming = upcomingCourses.find((uc) => uc.id === selectedUpcomingId) ?? null;

  // Price: upcoming course's own price takes priority over catalog price
  const upcomingPricePence = selectedUpcoming ? parseUpcomingPrice(selectedUpcoming.price) : -1;
  const totalAmountPence = selectedUpcoming
    ? (upcomingPricePence >= 0 ? upcomingPricePence * delegates : 0)
    : (selectedCourse?.price ? selectedCourse.price * delegates * 100 : 0);

  // Course name for review/payment display
  const effectiveCourseName = selectedUpcoming?.courseName ?? selectedCourse?.name ?? selectedCourseId;

  const preferredDate = watch("preferredDate");
  const discountedTotalPence = appliedPromo ? totalAmountPence - appliedPromo.discountAmountPence : totalAmountPence;
  const deposit = computeDeposit(discountedTotalPence, preferredDate || undefined);

  const canPayOnline = totalAmountPence > 0;
  const canPayDeposit = totalAmountPence > 0 && !deposit.isFullPayment;

  async function applyPromoCode() {
    if (!promoCodeInput.trim()) return;
    setPromoChecking(true);
    setPromoError("");
    try {
      const res = await fetch("/api/checkout/validate-promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: promoCodeInput.trim(),
          courseId: selectedCourseId,
          courseName: effectiveCourseName,
          totalAmountPence,
        }),
      });
      const data = await res.json();
      if (!data.valid) {
        setPromoError(data.error ?? "This code is not valid.");
        setAppliedPromo(null);
        return;
      }
      setAppliedPromo({ code: promoCodeInput.trim(), discountAmountPence: data.discountAmountPence, offerTitle: data.offerTitle });
    } catch {
      setPromoError("Could not check that code. Please try again.");
    } finally {
      setPromoChecking(false);
    }
  }

  function clearPromoCode() {
    setAppliedPromo(null);
    setPromoCodeInput("");
    setPromoError("");
  }

  function selectUpcomingCourse(uc: UpcomingCourse) {
    const catalogCourse = COURSES.find((c) => c.id === uc.courseId);
    if (catalogCourse) {
      setValue("category", catalogCourse.category, { shouldValidate: true });
      setValue("courseId", catalogCourse.id, { shouldValidate: true });
    } else {
      // Course not in catalog — set a guessed category and use the upcoming course's own ID
      setValue("category", guessCategoryFromName(uc.courseName), { shouldValidate: true });
      setValue("courseId", uc.id, { shouldValidate: true });
    }
    setValue("preferredDate", uc.date, { shouldValidate: true });
    const locValue = mapLocationToValue(uc.location);
    if (locValue) setValue("location", locValue, { shouldValidate: true });
    setSelectedUpcomingId(uc.id);
  }

  function clearUpcomingSelection() {
    setSelectedUpcomingId(null);
    setValue("courseId", "");
    setValue("category", "");
  }

  const goToStep2 = async () => {
    const ok = await trigger(["firstName", "lastName", "email", "phone", "company"]);
    if (ok) setStep(2);
  };

  const goToStep3 = async () => {
    const ok = await trigger(["category", "courseId", "preferredDate", "delegates", "location"]);
    if (ok) setStep(3);
  };

  // Enquiry submission (POA courses or upcoming at £0)
  const onSubmitEnquiry = async (values: FormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const payload: BookingFormData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        company: values.company,
        courseId: values.courseId,
        courseName: effectiveCourseName,
        preferredDate: values.preferredDate,
        delegates: values.delegates,
        location: LOCATIONS.find((l) => l.value === values.location)?.label ?? values.location,
        message: values.message,
        sourcePage: typeof window !== "undefined" ? window.location.pathname : undefined,
        consent: values.consent,
      };
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Submission failed");
      }
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unexpected error occurred. Please try again or call us on 0141 258 2024.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Payment submission — redirect to Square checkout
  const onSubmitPayment = async (values: FormValues) => {
    setRedirecting(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          company: values.company ?? "",
          courseId: values.courseId,
          courseName: effectiveCourseName,
          preferredDate: values.preferredDate,
          delegates: values.delegates,
          location: LOCATIONS.find((l) => l.value === values.location)?.label ?? values.location,
          notes: values.message ?? "",
          paymentType,
          totalAmountPence,
          sourcePage: typeof window !== "undefined" ? window.location.pathname : undefined,
          consent: values.consent,
          discountCode: appliedPromo?.code,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not create payment session");
      window.location.href = data.checkoutUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start payment. Please call us on 0141 258 2024.");
      setRedirecting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 px-6"
      >
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={36} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-black text-navy mb-3">Booking Request Received!</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-2">
          Thank you, <strong>{watch("firstName")}</strong>. We&apos;ve sent a confirmation to <strong>{watch("email")}</strong>.
        </p>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          A member of our team will be in touch within 24 hours to confirm your booking and provide joining instructions.
        </p>
        <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-5 py-3 text-sm text-orange-800">
          <Phone size={14} />
          For urgent enquiries call <a href="tel:01412582024" className="font-bold hover:underline">0141 258 2024</a>
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      {/* Progress steps */}
      <div className="flex items-center justify-between mb-8 px-1">
        {[
          { n: 1, label: "Your Details" },
          { n: 2, label: "Course Info" },
          { n: 3, label: "Review & Pay" },
        ].map(({ n, label }, i) => (
          <div key={n} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all",
                step > n ? "bg-green-500 text-white" : step === n ? "bg-navy text-white ring-4 ring-navy/20" : "bg-gray-200 text-gray-500"
              )}>
                {step > n ? <CheckCircle2 size={18} /> : n}
              </div>
              <span className={cn("text-xs mt-1.5 font-medium hidden sm:block", step === n ? "text-navy" : "text-gray-400")}>
                {label}
              </span>
            </div>
            {i < 2 && (
              <div className={cn("flex-1 h-0.5 mx-2 rounded transition-all", step > n ? "bg-green-500" : "bg-gray-200")} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(canPayOnline ? onSubmitPayment : onSubmitEnquiry)}>
        <AnimatePresence mode="wait">

          {/* ── Step 1: Personal Details ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              <h3 className="text-lg font-bold text-navy mb-5 flex items-center gap-2">
                <User size={18} className="text-orange-brand" />
                Your Details
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <Field label="First Name *" error={errors.firstName?.message} icon={<User size={15} />}>
                  <input {...register("firstName")} placeholder="John" className={inputCls(!!errors.firstName)} />
                </Field>
                <Field label="Last Name *" error={errors.lastName?.message} icon={<User size={15} />}>
                  <input {...register("lastName")} placeholder="Smith" className={inputCls(!!errors.lastName)} />
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <Field label="Email Address *" error={errors.email?.message} icon={<Mail size={15} />}>
                  <input {...register("email")} type="email" placeholder="john@company.co.uk" className={inputCls(!!errors.email)} />
                </Field>
                <Field label="Phone Number *" error={errors.phone?.message} icon={<Phone size={15} />}>
                  <input {...register("phone")} type="tel" placeholder="0141 258 2024" className={inputCls(!!errors.phone)} />
                </Field>
              </div>
              <Field label="Company / Organisation" icon={<Building2 size={15} />}>
                <input {...register("company")} placeholder="Optional" className={inputCls(false)} />
              </Field>
              <div className="mt-6 flex justify-end">
                <button type="button" onClick={goToStep2} className="btn-primary">
                  Continue to Course Details →
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Course Details ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              <h3 className="text-lg font-bold text-navy mb-5 flex items-center gap-2">
                <Calendar size={18} className="text-orange-brand" />
                Course Details
              </h3>

              {/* Upcoming scheduled sessions */}
              {upcomingCourses.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <CalendarDays size={15} className="text-orange-brand" />
                    <span className="text-sm font-bold text-navy">Available Scheduled Sessions</span>
                    <span className="text-xs text-gray-400">(click to pre-fill your booking)</span>
                  </div>
                  <div className="grid gap-2">
                    {upcomingCourses.map((uc) => {
                      const isSelected = selectedUpcomingId === uc.id;
                      const spotsLeft = uc.spotsAvailable;
                      const isFull = spotsLeft <= 0;
                      return (
                        <button
                          key={uc.id}
                          type="button"
                          disabled={isFull}
                          onClick={() => selectUpcomingCourse(uc)}
                          className={cn(
                            "w-full text-left rounded-xl border-2 px-4 py-3 transition-all",
                            isSelected ? "border-orange-brand bg-orange-50"
                              : isFull ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                              : "border-gray-200 hover:border-orange-brand/50 hover:bg-orange-50/50"
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm text-navy truncate">{uc.courseName}</div>
                              <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(uc.date)}</span>
                                {uc.startTime && (
                                  <span className="flex items-center gap-1">
                                    <Clock size={11} />{uc.startTime}{uc.endTime ? ` – ${uc.endTime}` : ""}
                                  </span>
                                )}
                                <span className="flex items-center gap-1"><MapPin size={11} />{uc.location}</span>
                              </div>
                            </div>
                            <div className="flex-shrink-0 text-right">
                              <div className="font-bold text-sm text-orange-brand">{uc.price}</div>
                              <div className={cn("text-xs mt-0.5", isFull ? "text-red-500" : spotsLeft <= 3 ? "text-orange-600" : "text-green-600")}>
                                {isFull ? "Full" : `${spotsLeft} spot${spotsLeft === 1 ? "" : "s"} left`}
                              </div>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="flex items-center gap-1 mt-1.5 text-xs text-orange-brand font-semibold">
                              <CheckCircle2 size={11} /> Selected, details pre-filled below
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Don&apos;t see your date? Fill in your preference below and we&apos;ll check availability.</p>
                </div>
              )}

              {/* Course selection — locked when an upcoming session is chosen */}
              {selectedUpcoming ? (
                <div className="rounded-xl border-2 border-orange-brand/30 bg-orange-50/50 px-4 py-3 mb-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-orange-900 uppercase tracking-wide mb-0.5">Course (pre-selected)</div>
                    <div className="font-semibold text-sm text-navy">{selectedUpcoming.courseName}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {selectedUpcoming.price && selectedUpcoming.price !== "£0" ? selectedUpcoming.price : "Price on enquiry"}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={clearUpcomingSelection}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 transition-colors flex-shrink-0 border border-gray-200 hover:border-red-200 px-2.5 py-1.5 rounded-lg"
                  >
                    <X size={12} /> Change
                  </button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <Field label="Training Category *" error={errors.category?.message}>
                    <div className="relative">
                      <select {...register("category")} className={selectCls(!!errors.category)}>
                        <option value="">Select category…</option>
                        {COURSE_CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </Field>
                  <Field label="Course *" error={errors.courseId?.message}>
                    <div className="relative">
                      <select {...register("courseId")} className={selectCls(!!errors.courseId)} disabled={!selectedCategory}>
                        <option value="">Select course…</option>
                        {filteredCourses.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}{c.price ? ` – £${c.price}` : c.priceLabel ? ` – ${c.priceLabel}` : ""}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </Field>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <Field label="Preferred Date *" error={errors.preferredDate?.message} icon={<Calendar size={15} />}>
                  <input
                    {...register("preferredDate")}
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    className={inputCls(!!errors.preferredDate)}
                  />
                </Field>
                <Field label="Number of Delegates *" error={errors.delegates?.message} icon={<Users size={15} />}>
                  <input {...register("delegates")} type="number" min={1} max={50} className={inputCls(!!errors.delegates)} />
                </Field>
              </div>

              <Field label="Preferred Location *" error={errors.location?.message} icon={<MapPin size={15} />}>
                <div className="relative">
                  <select {...register("location")} className={selectCls(!!errors.location)}>
                    <option value="">Select location…</option>
                    {LOCATIONS.map((l) => (
                      <option key={l.value} value={l.value}>{l.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </Field>

              <Field label="Additional Notes" className="mt-4" icon={<MessageSquare size={15} />}>
                <textarea
                  {...register("message")}
                  rows={3}
                  placeholder="Any specific requirements, accessibility needs, or questions…"
                  className={inputCls(false) + " resize-none"}
                />
              </Field>

              <div className="mt-6 flex justify-between gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-outline">← Back</button>
                <button type="button" onClick={goToStep3} className="btn-primary">Review Booking →</button>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Review & Pay ── */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              <h3 className="text-lg font-bold text-navy mb-5">Review &amp; Pay</h3>

              <div className="bg-gray-light rounded-xl p-5 mb-4 space-y-3">
                <ReviewRow label="Name" value={`${watch("firstName")} ${watch("lastName")}`} />
                <ReviewRow label="Email" value={watch("email")} />
                <ReviewRow label="Phone" value={watch("phone")} />
                {watch("company") && <ReviewRow label="Company" value={watch("company") ?? ""} />}
              </div>

              <div className="bg-navy/5 rounded-xl p-5 mb-4 space-y-3">
                <ReviewRow label="Course" value={effectiveCourseName} highlight />
                <ReviewRow label="Date" value={formatDate(watch("preferredDate"))} />
                <ReviewRow label="Delegates" value={`${watch("delegates")} person(s)`} />
                <ReviewRow label="Location" value={LOCATIONS.find((l) => l.value === watch("location"))?.label ?? ""} />
                {watch("message") && <ReviewRow label="Notes" value={watch("message") ?? ""} />}
                {canPayOnline && !appliedPromo && <ReviewRow label="Total" value={formatGBP(totalAmountPence)} highlight />}
                {canPayOnline && appliedPromo && (
                  <>
                    <ReviewRow label="Subtotal" value={formatGBP(totalAmountPence)} />
                    <ReviewRow label={`Discount (${appliedPromo.code})`} value={`−${formatGBP(appliedPromo.discountAmountPence)}`} />
                    <ReviewRow label="Total" value={formatGBP(discountedTotalPence)} highlight />
                  </>
                )}
              </div>

              {/* Promo code */}
              {canPayOnline && (
                <div className="mb-5">
                  {appliedPromo ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                      <span className="text-sm text-green-800">
                        <strong>{appliedPromo.offerTitle}</strong> applied, code <span className="font-mono">{appliedPromo.code}</span>
                      </span>
                      <button type="button" onClick={clearPromoCode} className="text-xs text-green-700 hover:underline">Remove</button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoCodeInput}
                          onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                          placeholder="Have a promo code?"
                          className={inputCls(false) + " font-mono"}
                        />
                        <button
                          type="button"
                          onClick={applyPromoCode}
                          disabled={promoChecking || !promoCodeInput.trim()}
                          className="btn-outline whitespace-nowrap disabled:opacity-40"
                        >
                          {promoChecking ? "Checking…" : "Apply"}
                        </button>
                      </div>
                      {promoError && <p className="text-xs text-red-600 mt-1">{promoError}</p>}
                    </div>
                  )}
                </div>
              )}

              {/* Payment options */}
              {canPayOnline ? (
                <div className="mb-5">
                  <p className="text-sm font-bold text-navy mb-3">Choose payment option</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentType("full")}
                      className={cn(
                        "rounded-xl border-2 p-4 text-left transition-all",
                        paymentType === "full" ? "border-navy bg-navy/5" : "border-gray-200 hover:border-navy/40"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard size={16} className="text-navy" />
                        <span className="font-bold text-sm text-navy">Pay in Full</span>
                        {paymentType === "full" && <CheckCircle2 size={14} className="text-green-600 ml-auto" />}
                      </div>
                      <div className="text-xl font-black text-navy">{formatGBP(discountedTotalPence)}</div>
                      <div className="text-xs text-gray-500 mt-0.5">Nothing more to pay</div>
                    </button>

                    {canPayDeposit && (
                      <button
                        type="button"
                        onClick={() => setPaymentType("deposit")}
                        className={cn(
                          "rounded-xl border-2 p-4 text-left transition-all",
                          paymentType === "deposit" ? "border-orange-brand bg-orange-50" : "border-gray-200 hover:border-orange-brand/40"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Banknote size={16} className="text-orange-brand" />
                          <span className="font-bold text-sm text-orange-900">Pay Deposit</span>
                          {paymentType === "deposit" && <CheckCircle2 size={14} className="text-green-600 ml-auto" />}
                        </div>
                        <div className="text-xl font-black text-orange-brand">{formatGBP(deposit.depositPence)}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          Balance of {formatGBP(discountedTotalPence - deposit.depositPence)} due before course
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5 text-sm text-blue-800">
                  <strong>Price on application</strong>: this course is priced individually. Submit your request and we&apos;ll be in touch within 24 hours to confirm details and arrange payment.
                </div>
              )}

              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-sm text-red-700">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer">
                  <input type="checkbox" {...register("consent")} className="mt-0.5 w-4 h-4 rounded flex-shrink-0" />
                  <span>
                    I agree to the <Link href="/policies#terms" className="text-blue-brand hover:underline">Terms</Link> and{" "}
                    <Link href="/policies#privacy" className="text-blue-brand hover:underline">Privacy Notice</Link>, and to be
                    contacted by Training Advantage Group regarding this booking. *
                    {canPayOnline && " You will be securely redirected to Square to complete payment."}
                  </span>
                </label>
                {errors.consent && <p className="text-xs text-red-600 mt-1">{errors.consent.message}</p>}
              </div>

              <div className="flex justify-between gap-3">
                <button type="button" onClick={() => setStep(2)} className="btn-outline" disabled={redirecting}>← Back</button>
                <button type="submit" disabled={isSubmitting || redirecting} className="btn-primary min-w-[180px] justify-center">
                  {redirecting ? (
                    <><Loader2 size={16} className="animate-spin" /> Redirecting to payment…</>
                  ) : isSubmitting ? (
                    <><Loader2 size={16} className="animate-spin" /> Submitting…</>
                  ) : canPayOnline ? (
                    <><CreditCard size={16} /> Proceed to Payment</>
                  ) : (
                    "Submit Enquiry"
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}

function Field({ label, children, error, icon, className }: {
  label: string; children: React.ReactNode; error?: string; icon?: React.ReactNode; className?: string;
}) {
  return (
    <div className={className}>
      <label className="label">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">{icon}</div>
        )}
        <div className={icon ? "[&>input]:pl-9 [&>select]:pl-9 [&>textarea]:pl-9" : ""}>{children}</div>
      </div>
      {error && (
        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

function ReviewRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-gray-500 flex-shrink-0 w-24">{label}</span>
      <span className={cn("text-right", highlight ? "font-bold text-navy" : "text-gray-800")}>{value}</span>
    </div>
  );
}

const inputCls = (hasError: boolean) => cn("input-field", hasError ? "border-red-400 focus:ring-red-400" : "");
const selectCls = (hasError: boolean) => cn(
  "input-field appearance-none pr-9",
  hasError ? "border-red-400 focus:ring-red-400" : "",
  "disabled:bg-gray-100 disabled:cursor-not-allowed"
);
