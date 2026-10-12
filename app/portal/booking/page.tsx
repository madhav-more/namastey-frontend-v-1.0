"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { api } from "../../utils/api";
import { useSession } from '../../utils/session';
import type { City, Theme, Addon } from '../../utils/types';
import type { Service, GreetingPackage } from "../../utils/workflow";
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  AlertCircle, 
  Plane, 
  Check, 
  Info 
} from "lucide-react";

export default function BookingWizardPage() {
  // Wizard state
  const [step, setStep] = useState(1);
  const { isClient, user } = useSession();
  const isAuthenticated = !!user;

  // Loaded metadata
  const [cities, setCities] = useState<City[]>([]);
  const [packages, setPackages] = useState<GreetingPackage[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState("");
  const submission = useRef<{ key: string; id: string } | null>(null);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Form Fields
  const [fromCity, setFromCity] = useState("");
  const [fromArea, setFromArea] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [toCity, setToCity] = useState("");
  const [toArea, setToArea] = useState("");
  const [dropAddress, setDropAddress] = useState("");
  
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);

  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [selectedThemeId, setSelectedThemeId] = useState("");
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState("");

  const [customerName, setCustomerName] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);
  const [customerMobile, setCustomerMobile] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [city, setCity] = useState("");
  const [vipRequirements, setVipRequirements] = useState("");
  const [supportingDocsUrl, setSupportingDocsUrl] = useState(""); // single URL/comma separated

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successBookingId, setSuccessBookingId] = useState<string | null>(null);

  // Check auth and load static data
  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get('/data/catalogue');
        setCities(res.data.cities); setServices(res.data.services); setPackages(res.data.packages); setThemes(res.data.themes); setAddons(res.data.addons);
        const params = new URLSearchParams(window.location.search);
        const chosen = res.data.services.find((s: Service) => s.id === params.get('serviceId'));
        if (chosen) { setServiceId(chosen.id); const pkg = res.data.packages.find((p: GreetingPackage) => p.id === params.get('packageId') && p.serviceIds.includes(chosen.id)); if (pkg) setSelectedPackageId(pkg.id); }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load services. Refresh and try again.");
      } finally {
        setLoadingData(false);
      }
    }
    loadData();
  }, []);

  const handleAddonToggle = (id: string) => {
    setSelectedAddonIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const travelService = ['airport', 'railway'].includes(services.find(s => s.id === serviceId)?.kind || '');
  const handleNextStep = () => {
    // Basic validations per step
    setError(null);
    if (step === 1) {
      if (!serviceId || !fromCity || !fromArea || (travelService && (!toCity || !toArea)) || !scheduledDate || !scheduledTime) {
        setError("Please complete all mandatory location & schedule details.");
        return;
      }
      // Check date is in future
      const selectedDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      if (selectedDateTime.getTime() <= Date.now()) {
        setError("Arrival schedule date & time must be in the future.");
        return;
      }
    } else if (step === 2) {
      if (!packages.some(p => p.id === selectedPackageId && p.serviceIds.includes(serviceId))) {
        setError("Please select a greeting package.");
        return;
      }
    } else if (step === 3) {
      // Step 3 is addons and notes. Safe to proceed.
    }
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setError(null);
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setError(null);
    if (!(customerName ?? user?.name) || !(customerEmail ?? user?.email) || !(customerMobile ?? user?.mobile)) {
      setError("Please complete your contact details.");
      return;
    }

    if (!isAuthenticated) {
      setError("Authentication Required: Please login or register to submit a booking request.");
      return;
    }

    if (submitting) return;
    setSubmitting(true);
    try {
      const payload = {
        serviceId,
        fromCity,
        fromArea,
        pickupAddress,
        toCity: travelService ? toCity : fromCity,
        toArea: travelService ? toArea : fromArea,
        dropAddress: travelService ? dropAddress : pickupAddress,
        scheduledDate: new Date(`${scheduledDate}T${scheduledTime}`).toISOString(),
        scheduledTime,
        packageId: selectedPackageId,
        culturalThemeId: selectedThemeId,
        addonIds: selectedAddonIds,
        specialInstructions,
        customerName: customerName ?? user?.name,
        customerEmail: customerEmail ?? user?.email,
        customerMobile: customerMobile ?? user?.mobile,
        companyName,
        city,
        flightNumber,
        numberOfGuests: Number(numberOfGuests),
        vipRequirements,
        supportingDocuments: supportingDocsUrl ? supportingDocsUrl.split(",").map(url => url.trim()) : [],
      };

      const key = JSON.stringify(payload);
      if (submission.current?.key !== key) submission.current = { key, id: crypto.randomUUID() };
      const response = await api.post("/bookings", { ...payload, requestId: submission.current.id });
      if (response.success && response.data?.booking) {
        setSuccessBookingId(response.data.booking.bookingId || "Request Sent");
        setStep(5); // Success step
      } else {
        setError("Failed to register welcome request.");
      }
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : '') || "Booking submission failed. Please verify details.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-2">
              Welcome Booking Wizard
            </h1>
            <p className="text-stone-400 text-xs sm:text-sm">
              Complete the steps to request a bespoke quote tailored to your exact journey.
            </p>
          </div>

          {/* Stepper HUD */}
          {step <= 4 && (
            <div className="grid grid-cols-4 gap-2 mb-10 text-center">
              {[
                { s: 1, label: "Travel & Schedule" },
                { s: 2, label: "Experience" },
                { s: 3, label: "Add-ons & Notes" },
                { s: 4, label: "Contact Details" }
              ].map((item) => (
                <div key={item.s} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all mb-2 ${
                    step >= item.s
                      ? "bg-amber-500 border-amber-500 text-stone-950 shadow-md shadow-amber-500/10"
                      : "border-stone-800 text-stone-500 bg-stone-900/40"
                  }`}>
                    {item.s}
                  </div>
                  <span className={`text-[10px] sm:text-xs font-semibold ${step === item.s ? "text-amber-400" : "text-stone-500"}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Loading HUD */}
          {loadingData ? (
            <div className="text-center py-20">
              <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-stone-400 text-sm">Loading dynamic catalog criteria...</p>
            </div>
          ) : (
            <div className="bg-stone-900/30 border border-stone-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
              
              {/* STEP 1: ROUTING & TRAVEL DETAILS */}
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-serif font-bold text-white border-b border-stone-800 pb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-amber-500" />
                    <span>Travel Route & Schedule Details</span>
                  </h3>

                  <label className="block text-sm">Greeting service *<select required value={serviceId} onChange={e => { setServiceId(e.target.value); setSelectedPackageId(''); }} className="mt-2 w-full rounded-lg border border-stone-700 bg-stone-950 p-3"><option value="">Choose service</option>{services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pick-up / From Area */}
                    <div className="space-y-4 border border-stone-800/80 rounded-xl p-4 bg-stone-950/40">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400/80 mb-2">Greeting Origin</h4>
                      <div>
                        <label className="block text-[11px] text-stone-400 mb-1">Select City *</label>
                        <select
                          value={fromCity}
                          onChange={(e) => {
                            setFromCity(e.target.value);
                            setFromArea(""); // reset area
                          }}
                          className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2 text-sm text-stone-200"
                        >
                          <option value="">-- Choose City --</option>
                          {cities.map((c) => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] text-stone-400 mb-1">Select Area / Terminal *</label>
                        <select
                          value={fromArea}
                          disabled={!fromCity}
                          onChange={(e) => setFromArea(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2 text-sm text-stone-200 disabled:opacity-55"
                        >
                          <option value="">-- Choose Area/Terminal --</option>
                          {cities.find(c => c.name === fromCity)?.areas.map((a) => (
                            <option key={a.id} value={a.name}>{a.name} ({a.type})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] text-stone-400 mb-1">Venue / pickup address (Optional)</label>
                        <textarea
                          rows={2}
                          value={pickupAddress}
                          onChange={(e) => setPickupAddress(e.target.value)}
                          placeholder="e.g. Gate 3 Arrival Lounge, or specific terminal column number"
                          className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2 text-xs text-stone-200"
                        />
                      </div>
                    </div>

                    {travelService && <>
                    {/* Destination Area */}
                    <div className="space-y-4 border border-stone-800/80 rounded-xl p-4 bg-stone-950/40">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400/80 mb-2">Transit Destination</h4>
                      <div>
                        <label className="block text-[11px] text-stone-400 mb-1">Select City *</label>
                        <select
                          value={toCity}
                          onChange={(e) => {
                            setToCity(e.target.value);
                            setToArea("");
                          }}
                          className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2 text-sm text-stone-200"
                        >
                          <option value="">-- Choose City --</option>
                          {cities.map((c) => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] text-stone-400 mb-1">Select Area / Spot *</label>
                        <select
                          value={toArea}
                          disabled={!toCity}
                          onChange={(e) => setToArea(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2 text-sm text-stone-200 disabled:opacity-55"
                        >
                          <option value="">-- Choose Area/Terminal --</option>
                          {cities.find(c => c.name === toCity)?.areas.map((a) => (
                            <option key={a.id} value={a.name}>{a.name} ({a.type})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] text-stone-400 mb-1">Drop-off Destination Address (Optional)</label>
                        <textarea
                          rows={2}
                          value={dropAddress}
                          onChange={(e) => setDropAddress(e.target.value)}
                          placeholder="e.g. JW Marriott Lobby, or residential address"
                          className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2 text-xs text-stone-200"
                        />
                      </div>
                    </div>
                    </>}
                  </div>

                  {/* Flight Info & Guest Count */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-stone-800/80">
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">Arrival Date *</label>
                      <div className="relative">
                        <Calendar className="absolute left-2.5 top-2.5 w-4 h-4 text-stone-500" />
                        <input
                          type="date"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-lg py-2 pl-9 pr-3 text-xs text-stone-200"
                        />
                  </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">Arrival Time *</label>
                      <div className="relative">
                        <Clock className="absolute left-2.5 top-2.5 w-4 h-4 text-stone-500" />
                        <input
                          type="time"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-lg py-2 pl-9 pr-3 text-xs text-stone-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">Flight Number (Optional)</label>
                      <div className="relative">
                        <Plane className="absolute left-2.5 top-2.5 w-4 h-4 text-stone-500" />
                        <input
                          type="text"
                          value={flightNumber}
                          onChange={(e) => setFlightNumber(e.target.value)}
                          placeholder="e.g. AI-101"
                          className="w-full bg-stone-900 border border-stone-800 rounded-lg py-2 pl-9 pr-3 text-xs text-stone-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">Guest Count *</label>
                      <input
                        type="number"
                        min={1}
                        value={numberOfGuests}
                        onChange={(e) => setNumberOfGuests(Math.max(1, Number(e.target.value)))}
                        className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2 text-xs text-stone-200 text-center"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: EXPERIENCE (PACKAGES & THEMES) */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-white mb-1 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      <span>Select Greeting Package</span>
                    </h3>
                    <p className="text-xs text-stone-400 mb-4">
                      All packages are custom-quoted based on route parameters. Pricing shows base coordination.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {packages.filter(p => p.serviceIds.includes(serviceId)).map((pkg) => (
                        <div
                          key={pkg.id}
                          onClick={() => setSelectedPackageId(pkg.id)}
                          className={`border rounded-xl p-4 cursor-pointer transition-all ${
                            selectedPackageId === pkg.id
                              ? "bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/5"
                              : "bg-stone-950/20 border-stone-800 hover:border-stone-700"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-white text-sm">{pkg.name}</h4>
                            <span className="text-xs font-bold text-amber-400">Base: ₹{pkg.price}</span>
                          </div>
                          <p className="text-[11px] text-stone-400 leading-relaxed mb-3">{pkg.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {pkg.includes.slice(0, 3).map((inc: string, i: number) => (
                              <span key={i} className="text-[9px] bg-stone-900 border border-stone-800 rounded-full px-2 py-0.5 text-stone-300">
                                {inc}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-stone-800/80">
                    <h3 className="text-sm font-semibold text-white mb-1">
                      Choose Cultural Theme (Optional)
                    </h3>
                    <p className="text-[11px] text-stone-400 mb-4">
                      Infuse the welcome with local colors, traditional dress code, and classical gestures.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {themes.map((theme) => (
                        <div
                          key={theme.id}
                          onClick={() => setSelectedThemeId(prev => prev === theme.id ? "" : theme.id)}
                          className={`border rounded-lg p-3 cursor-pointer text-center transition-all ${
                            selectedThemeId === theme.id
                              ? "bg-amber-500/10 border-amber-500"
                              : "bg-stone-950/20 border-stone-800 hover:border-stone-700"
                          }`}
                        >
                          <h4 className="font-bold text-xs text-white mb-1 leading-snug">{theme.name}</h4>
                          <span className="text-[9px] text-stone-400 block line-clamp-2 leading-relaxed">
                            {theme.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: ADDONS & NOTES */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-white mb-2 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      <span>Select Premium Add-ons</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {addons.map((addon) => (
                        <div
                          key={addon.id}
                          onClick={() => handleAddonToggle(addon.id)}
                          className={`flex items-center justify-between border rounded-xl p-4 cursor-pointer transition-all ${
                            selectedAddonIds.includes(addon.id)
                              ? "bg-amber-500/10 border-amber-500"
                              : "bg-stone-950/20 border-stone-800 hover:border-stone-700"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{addon.icon || "🎁"}</span>
                            <div>
                              <h4 className="font-bold text-white text-xs">{addon.name}</h4>
                              <p className="text-[10px] text-stone-400 leading-snug">{addon.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-amber-400 block">₹{addon.price}</span>
                            <span className={`text-[9px] font-semibold mt-1 inline-block ${
                              selectedAddonIds.includes(addon.id) ? "text-amber-500" : "text-stone-500"
                            }`}>
                              {selectedAddonIds.includes(addon.id) ? "Selected" : "Add"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-stone-800/80">
                    <label className="block text-sm font-semibold text-stone-300 mb-1">
                      Special Instructions / Customized Details
                    </label>
                    <p className="text-[10px] text-stone-400 mb-3">
                      List custom placard slogans, luggage specifics, surprise requirements, or extra greeter instructions.
                    </p>
                    <textarea
                      rows={4}
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="e.g. Please print 'Happy Anniversary Mom & Dad' on the placard and offer a bouquet of yellow roses..."
                      maxLength={500}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
                    />
                    <div className="text-right text-[10px] text-stone-500 mt-1">
                      {specialInstructions.length}/500 characters
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: CONTACT & GUEST VERIFICATION */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-white mb-2 flex items-center gap-2">
                      <User className="w-5 h-5 text-amber-500" />
                      <span>Contact & Sponsoring Particulars</span>
                    </h3>
                    <p className="text-xs text-stone-400 mb-4">
                      Confirm coordinator-facing communications. Sponsoring corporate names or custom preferences can be specified.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">Customer / Sponsor Name *</label>
                      <div className="relative">
                        <User className="absolute left-2.5 top-2.5 w-4 h-4 text-stone-500" />
                        <input
                          type="text"
                          required
                          value={customerName ?? user?.name ?? ""}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="e.g. Rajesh Kumar"
                          className="w-full bg-stone-900 border border-stone-800 rounded-lg py-2 pl-9 pr-3 text-xs text-stone-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">Customer Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-2.5 top-2.5 w-4 h-4 text-stone-500" />
                        <input
                          type="email"
                          required
                          value={customerEmail ?? user?.email ?? ""}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="e.g. rajesh@corporate.com"
                          className="w-full bg-stone-900 border border-stone-800 rounded-lg py-2 pl-9 pr-3 text-xs text-stone-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">Customer Mobile Number *</label>
                      <div className="relative">
                        <Phone className="absolute left-2.5 top-2.5 w-4 h-4 text-stone-500" />
                        <input
                          type="tel"
                          required
                          value={customerMobile ?? user?.mobile ?? ""}
                          onChange={(e) => setCustomerMobile(e.target.value)}
                          placeholder="e.g. 9876543210"
                          className="w-full bg-stone-900 border border-stone-800 rounded-lg py-2 pl-9 pr-3 text-xs text-stone-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">Company Name (Optional)</label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Royal Industries"
                        className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2 text-xs text-stone-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">Home/Office City (Optional)</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Pune"
                        className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2 text-xs text-stone-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">Supporting Document Link (Optional)</label>
                      <input
                        type="url"
                        value={supportingDocsUrl}
                        onChange={(e) => setSupportingDocsUrl(e.target.value)}
                        placeholder="e.g. Web link to passport copy / visa PDF"
                        className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2 text-xs text-stone-200"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-800/80">
                    <label className="block text-xs font-semibold text-stone-300 mb-1">Specific VIP Requirements</label>
                    <textarea
                      rows={2}
                      value={vipRequirements}
                      onChange={(e) => setVipRequirements(e.target.value)}
                      placeholder="e.g. Wheelchair transit assistant, fast-track baggage handling, senior citizen care..."
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2 text-xs text-stone-200"
                    />
                  </div>

                  {!isAuthenticated && (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-3">
                      <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <p className="font-semibold text-amber-400 mb-1">Authentication Required</p>
                        <p className="text-stone-400">
                          You are not signed in. You can fill out this form, but you must{" "}
                          <a href="/portal/login" className="text-amber-500 font-bold underline">Login</a> or{" "}
                          <a href="/portal/register" className="text-amber-500 font-bold underline">Register</a>{" "}
                          to submit your quote request successfully.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* WIZARD ACTIONS */}
              <div className="mt-8 pt-6 border-t border-stone-800/60 flex justify-between">
                {step > 1 ? (
                  <button
                    onClick={handlePrevStep}
                    className="px-5 py-2.5 rounded-xl border border-stone-800 text-stone-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <button
                    onClick={handleNextStep}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors flex items-center gap-1.5 text-xs font-bold"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold transition-all flex items-center gap-2 text-xs shadow-lg shadow-amber-500/10 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit Quote Request"}
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: SUCCESS PANEL */}
          {step === 5 && (
            <div className="bg-stone-900/40 border border-amber-500/20 rounded-2xl p-8 text-center shadow-xl backdrop-blur-md">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-amber-400" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-white mb-2">Quote Request Submitted!</h2>
              <p className="text-stone-400 text-sm max-w-md mx-auto mb-6 leading-relaxed">
                Thank you! Your Namastey welcome request has been filed under ID{" "}
                <span className="text-amber-400 font-mono font-semibold">{successBookingId}</span>. 
                Our coordinator team will review terminal regulations and issue a custom quote shortly.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/portal/dashboard"
                  className="px-6 py-3 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-colors flex items-center justify-center gap-2"
                >
                  Go to Client Dashboard
                  <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  onClick={() => {
                    setStep(1);
                    setSuccessBookingId(null);
                    // clear forms
                    setFromCity(""); setFromArea(""); setPickupAddress("");
                    setToCity(""); setToArea(""); setDropAddress("");
                    setScheduledDate(""); setScheduledTime("");
                    setFlightNumber(""); setSelectedAddonIds([]);
                    setSpecialInstructions(""); setVipRequirements("");
                  }}
                  className="px-6 py-3 rounded-xl border border-stone-800 text-stone-300 hover:text-white transition-colors text-xs font-bold"
                >
                  Book Another Service
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
