"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { api } from "../../utils/api";
import { 
  Sparkles, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  Calendar, 
  User, 
  ShieldCheck, 
  MessageSquare, 
  Star, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  FileText,
  Building,
  Phone,
  Mail
} from "lucide-react";

export default function CustomerDashboardPage() {
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"active" | "history" | "profile">("active");

  // Accordion details
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);

  // Feedback State
  const [feedbackBookingId, setFeedbackBookingId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [issues, setIssues] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Cancellation State
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [submittingCancel, setSubmittingCancel] = useState(false);

  // Profile Edit State
  const [profileName, setProfileName] = useState("");
  const [profileMobile, setProfileMobile] = useState("");
  const [profileCompanyName, setProfileCompanyName] = useState("");
  const [profileCity, setProfileCity] = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Check authentication
    const storedUser = localStorage.getItem("namastey_user");
    const token = localStorage.getItem("namastey_token");
    if (!token || !storedUser) {
      window.location.href = "/portal/login";
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setProfileName(parsedUser.name || "");
      setProfileMobile(parsedUser.mobile || "");
      setProfileCompanyName(parsedUser.companyName || "");
      setProfileCity(parsedUser.city || "");
    } catch (e) {}

    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/bookings");
      if (response.success) {
        setBookings(response.data?.bookings || []);
      } else {
        setError("Failed to fetch dashboard activities.");
      }
    } catch (err: any) {
      setError(err.message || "Could not retrieve bookings. Verify server availability.");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptQuotation = async (bookingId: string) => {
    if (!confirm("Are you sure you want to approve this proposed welcome service quotation?")) return;
    try {
      const response = await api.put(`/bookings/${bookingId}/accept-quotation`, {});
      if (response.success) {
        alert("Quotation approved successfully! Your booking is now confirmed.");
        fetchBookings();
      }
    } catch (err: any) {
      alert(err.message || "Failed to approve quotation.");
    }
  };

  const handleCancelBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelBookingId) return;
    
    setSubmittingCancel(true);
    try {
      const response = await api.put(`/bookings/${cancelBookingId}/cancel`, { cancelReason });
      if (response.success) {
        alert("Booking request cancelled successfully.");
        setCancelBookingId(null);
        setCancelReason("");
        fetchBookings();
      }
    } catch (err: any) {
      alert(err.message || "Failed to cancel booking.");
    } finally {
      setSubmittingCancel(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackBookingId) return;

    setSubmittingFeedback(true);
    try {
      const response = await api.put(`/bookings/${feedbackBookingId}/feedback`, {
        rating,
        text: feedbackText,
        suggestions,
        issues
      });
      if (response.success) {
        alert("Thank you for your valuable feedback!");
        setFeedbackBookingId(null);
        setFeedbackText("");
        setSuggestions("");
        setIssues("");
        fetchBookings();
      }
    } catch (err: any) {
      alert(err.message || "Failed to submit review.");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    setProfileSuccess(false);

    try {
      // Hit /users/profile or similar in backend
      // Wait, let's verify profile update endpoint in users.routes.js or auth routes.
      // If we don't have it directly or it's named differently, let's try /users/profile.
      const response = await api.put("/users/profile", {
        name: profileName,
        mobile: profileMobile
      });

      if (response.success) {
        const updatedUser = {
          ...user,
          name: profileName,
          mobile: profileMobile
        };
        localStorage.setItem("namastey_user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setProfileSuccess(true);
      }
    } catch (err: any) {
      alert(err.message || "Failed to update profile particulars.");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleDownloadInvoice = (booking: any) => {
    // Generate simple local printable mock invoice
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const itemsHtml = `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${booking.package?.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${booking.packagePrice}</td>
      </tr>
      ${booking.addons.map((a: any) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">Addon: ${a.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${a.price}</td>
        </tr>
      `).join("")}
      ${booking.quotation?.price > 0 ? `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Custom Quotation Adjustments</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right; font-weight: bold;">₹${booking.quotation.price - (booking.packagePrice + booking.addonsTotal)}</td>
        </tr>
      ` : ""}
    `;

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${booking.bookingId}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #b45309; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: bold; color: #b45309; }
            .details { margin-bottom: 30px; line-height: 1.6; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background: #f3f4f6; padding: 10px; border-bottom: 1px solid #ddd; text-align: left; }
            .total { text-align: right; font-size: 18px; font-weight: bold; color: #b45309; }
            .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">NAMASTEY.</div>
              <div>Premium Welcome Services</div>
            </div>
            <div style="text-align: right;">
              <div>INVOICE</div>
              <div style="font-weight: bold;">ID: ${booking.bookingId}</div>
              <div>Date: ${new Date(booking.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
          <div class="details">
            <strong>Billed To:</strong><br>
            Name: ${booking.customerName}<br>
            Email: ${booking.customerEmail}<br>
            Phone: ${booking.customerMobile}<br>
            ${booking.companyName ? `Company: ${booking.companyName}<br>` : ""}
          </div>
          <div class="details">
            <strong>Service Details:</strong><br>
            Route: ${booking.fromCity} (${booking.fromArea}) &rarr; ${booking.toCity} (${booking.toArea})<br>
            Arrival Schedule: ${new Date(booking.scheduledDate).toLocaleDateString()} at ${booking.scheduledTime}<br>
            ${booking.flightNumber ? `Flight: ${booking.flightNumber}<br>` : ""}
          </div>
          <table>
            <thead>
              <tr>
                <th>Service / Add-on</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <div class="total">
            Total Charged: ₹${booking.totalAmount}
          </div>
          <div class="footer">
            Thank you for choosing Namastey VIP Welcome Services. For corporate queries, contact operations@namastey.com.
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";
      case "under_review": return "bg-orange-500/10 border-orange-500/20 text-orange-400";
      case "quotation_sent": return "bg-purple-500/10 border-purple-500/20 text-purple-400";
      case "quotation_accepted": return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
      case "confirmed": return "bg-blue-500/10 border-blue-500/20 text-blue-400";
      case "operations_assigned": return "bg-indigo-500/10 border-indigo-500/20 text-indigo-400";
      case "team_on_the_way": return "bg-cyan-500/10 border-cyan-500/20 text-cyan-400";
      case "in_progress": return "bg-amber-500/10 border-amber-500/20 text-amber-400";
      case "completed": return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
      case "cancelled": return "bg-red-500/10 border-red-500/20 text-red-400";
      default: return "bg-stone-500/10 border-stone-500/20 text-stone-400";
    }
  };

  const getTimelineStepLabel = (status: string) => {
    return status.replace(/_/g, " ").toUpperCase();
  };

  // Filter bookings
  const activeBookings = bookings.filter(b => b.status !== "completed" && b.status !== "cancelled");
  const pastBookings = bookings.filter(b => b.status === "completed" || b.status === "cancelled");

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Welcome User Block */}
          {user && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-stone-900/30 border border-stone-800/80 rounded-2xl p-6 mb-8 backdrop-blur-md">
              <div>
                <span className="text-xs text-amber-400 font-semibold tracking-wider uppercase block mb-1">
                  VIP Club Member
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  Welcome, {user.name}
                </h1>
                <p className="text-stone-400 text-xs mt-1">
                  Email: {user.email} | Phone: {user.mobile}
                </p>
              </div>
              <a
                href="/portal/booking"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-amber-500/5"
              >
                <Sparkles className="w-4 h-4" />
                <span>New Welcome Request</span>
              </a>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex border-b border-stone-800 mb-8">
            <button
              onClick={() => setActiveTab("active")}
              className={`py-3.5 px-6 font-medium text-xs tracking-wider uppercase border-b-2 transition-all ${
                activeTab === "active"
                  ? "border-amber-500 text-amber-400"
                  : "border-transparent text-stone-400 hover:text-stone-200"
              }`}
            >
              Active Services ({activeBookings.length})
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`py-3.5 px-6 font-medium text-xs tracking-wider uppercase border-b-2 transition-all ${
                activeTab === "history"
                  ? "border-amber-500 text-amber-400"
                  : "border-transparent text-stone-400 hover:text-stone-200"
              }`}
            >
              Order History ({pastBookings.length})
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-3.5 px-6 font-medium text-xs tracking-wider uppercase border-b-2 transition-all ${
                activeTab === "profile"
                  ? "border-amber-500 text-amber-400"
                  : "border-transparent text-stone-400 hover:text-stone-200"
              }`}
            >
              Profile & Preferences
            </button>
          </div>

          {/* Content HUD */}
          {loading ? (
            <div className="text-center py-20">
              <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-stone-400 text-xs">Syncing real-time booking details...</p>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-4 px-6 rounded-2xl text-center">
              <AlertCircle className="w-5 h-5 mx-auto mb-2 text-red-500" />
              <span>{error}</span>
            </div>
          ) : (
            <div>
              {/* TAB 1: ACTIVE BOOKINGS */}
              {activeTab === "active" && (
                <div className="space-y-6">
                  {activeBookings.length === 0 ? (
                    <div className="border border-stone-850 bg-stone-900/10 rounded-2xl p-12 text-center">
                      <p className="text-stone-400 text-sm mb-4">No active booking requests at the moment.</p>
                      <a href="/portal/booking" className="text-amber-400 text-xs font-bold underline hover:text-amber-300">
                        Create custom request now &rarr;
                      </a>
                    </div>
                  ) : (
                    activeBookings.map((booking) => {
                      const isExpanded = expandedBookingId === booking._id;
                      return (
                        <div 
                          key={booking._id} 
                          className="bg-stone-900/35 border border-stone-800 rounded-2xl overflow-hidden transition-colors hover:border-stone-750"
                        >
                          {/* Accordion Trigger Panel */}
                          <div 
                            onClick={() => setExpandedBookingId(isExpanded ? null : booking._id)}
                            className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2.5">
                                <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/5 px-2 py-0.5 border border-amber-500/20 rounded">
                                  {booking.bookingId}
                                </span>
                                <h3 className="text-sm font-bold text-white font-serif">
                                  {booking.package?.name}
                                </h3>
                              </div>
                              <p className="text-[11px] text-stone-400 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-stone-500" />
                                <span>{booking.fromCity} &rarr; {booking.toCity}</span>
                                <span className="mx-1.5 font-light">|</span>
                                <Calendar className="w-3 h-3 text-stone-500" />
                                <span>{new Date(booking.scheduledDate).toLocaleDateString()} at {booking.scheduledTime}</span>
                              </p>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className={`text-[10px] font-bold tracking-wider uppercase py-1 px-3.5 border rounded-full ${getStatusColor(booking.status)}`}>
                                {booking.status.replace(/_/g, " ")}
                              </span>
                              {isExpanded ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                            </div>
                          </div>

                          {/* Accordion Expandable Panel */}
                          {isExpanded && (
                            <div className="border-t border-stone-800/80 bg-stone-950/40 p-6 space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                
                                {/* Route particulars */}
                                <div className="space-y-3 bg-stone-900/40 border border-stone-850 p-4 rounded-xl">
                                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 border-b border-stone-800 pb-1.5">Route Information</h4>
                                  <div className="text-xs space-y-2">
                                    <div>
                                      <span className="text-stone-500 block">From City/Terminal</span>
                                      <span className="text-stone-300 font-semibold">{booking.fromCity} ({booking.fromArea})</span>
                                      {booking.pickupAddress && <span className="text-stone-400 text-[10px] block mt-0.5">{booking.pickupAddress}</span>}
                                    </div>
                                    <div>
                                      <span className="text-stone-500 block">To City/Terminal</span>
                                      <span className="text-stone-300 font-semibold">{booking.toCity} ({booking.toArea})</span>
                                      {booking.dropAddress && <span className="text-stone-400 text-[10px] block mt-0.5">{booking.dropAddress}</span>}
                                    </div>
                                    {booking.flightNumber && (
                                      <div>
                                        <span className="text-stone-500 block">Flight tracking number</span>
                                        <span className="text-amber-400 font-mono font-semibold">{booking.flightNumber}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Custom Quote Card */}
                                <div className="space-y-3 bg-stone-900/40 border border-stone-850 p-4 rounded-xl">
                                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 border-b border-stone-800 pb-1.5">Pricing Details</h4>
                                  <div className="text-xs space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-stone-400">Package Base Fee:</span>
                                      <span className="text-stone-300">₹{booking.packagePrice}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-stone-400">Add-ons Total:</span>
                                      <span className="text-stone-300">₹{booking.addonsTotal}</span>
                                    </div>
                                    
                                    {booking.quotation?.price > 0 ? (
                                      <div className="pt-2 border-t border-stone-850 space-y-1.5">
                                        <div className="flex justify-between text-amber-400 font-bold">
                                          <span>Quoted Amount:</span>
                                          <span>₹{booking.quotation.price}</span>
                                        </div>
                                        {booking.quotation.notes && (
                                          <p className="text-[10px] text-stone-400 italic bg-stone-950 p-2 rounded border border-stone-800/60 leading-normal">
                                            Notes: {booking.quotation.notes}
                                          </p>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="pt-2 border-t border-stone-850 text-stone-500 text-[10px] italic">
                                        Pricing is subject to coordinator quotation review.
                                      </div>
                                    )}

                                    <div className="pt-2 border-t border-stone-800 flex justify-between items-baseline">
                                      <span className="font-bold text-stone-300">Total Price:</span>
                                      <span className="text-lg font-bold text-white">₹{booking.totalAmount}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Assigned Greeter & Operations Card */}
                                <div className="space-y-3 bg-stone-900/40 border border-stone-850 p-4 rounded-xl">
                                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 border-b border-stone-800 pb-1.5">Operations Assistant</h4>
                                  {booking.operations?.assignedName ? (
                                    <div className="text-xs space-y-2">
                                      <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center font-bold text-amber-500 border border-amber-500/25">
                                          {booking.operations.assignedName[0]}
                                        </div>
                                        <div>
                                          <span className="font-semibold text-stone-200 block">{booking.operations.assignedName}</span>
                                          <span className="text-[10px] text-stone-500 block">Greeting Coordinator</span>
                                        </div>
                                      </div>
                                      <div>
                                        <span className="text-stone-500 block">Contact Phone</span>
                                        <a href={`tel:${booking.operations.assignedPhone}`} className="text-amber-400 font-medium underline">
                                          {booking.operations.assignedPhone}
                                        </a>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-xs text-stone-500 italic py-2">
                                      Greeter will be assigned once quotation is accepted & schedule details are locked.
                                    </div>
                                  )}
                                </div>

                              </div>

                              {/* Interactive Timeline Stepper */}
                              <div className="bg-stone-900/20 border border-stone-850 rounded-xl p-5">
                                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Real-Time Arrival Timeline</h4>
                                <div className="relative pl-6 border-l border-stone-800 space-y-6">
                                  {booking.timeline && booking.timeline.map((node: any, idx: number) => (
                                    <div key={idx} className="relative">
                                      <span className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-amber-500 border-4 border-stone-950 box-content" />
                                      <div className="flex items-baseline justify-between gap-4">
                                        <span className="text-xs font-bold text-stone-200">{getTimelineStepLabel(node.status)}</span>
                                        <span className="text-[9px] text-stone-500">{new Date(node.timestamp).toLocaleString()}</span>
                                      </div>
                                      {node.comment && <p className="text-[11px] text-stone-400 mt-1 leading-normal">{node.comment}</p>}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Interactive CTA buttons */}
                              <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-stone-850">
                                {booking.status === "quotation_sent" && (
                                  <button
                                    onClick={() => handleAcceptQuotation(booking._id)}
                                    className="px-4 py-2 rounded-lg bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-all"
                                  >
                                    Accept Proposed Quotation
                                  </button>
                                )}

                                {booking.status !== "cancelled" && (
                                  <button
                                    onClick={() => setCancelBookingId(booking._id)}
                                    className="px-4 py-2 rounded-lg border border-red-500/20 text-red-400 text-xs hover:bg-red-500/10 transition-all font-semibold"
                                  >
                                    Cancel Service Request
                                  </button>
                                )}
                              </div>

                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* TAB 2: ORDER HISTORY */}
              {activeTab === "history" && (
                <div className="space-y-6">
                  {pastBookings.length === 0 ? (
                    <div className="border border-stone-850 bg-stone-900/10 rounded-2xl p-12 text-center">
                      <p className="text-stone-400 text-sm">No completed bookings on file.</p>
                    </div>
                  ) : (
                    pastBookings.map((booking) => (
                      <div 
                        key={booking._id} 
                        className="bg-stone-900/25 border border-stone-800 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold text-stone-400 bg-stone-900 border border-stone-800 px-1.5 py-0.5 rounded">
                              {booking.bookingId}
                            </span>
                            <h3 className="text-sm font-bold text-white font-serif">{booking.package?.name}</h3>
                          </div>
                          <p className="text-xs text-stone-400">
                            {booking.fromCity} &rarr; {booking.toCity} | {new Date(booking.scheduledDate).toLocaleDateString()}
                          </p>
                          {booking.feedback?.rating ? (
                            <div className="flex items-center gap-1 text-xs text-amber-400 pt-1">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              <span>{booking.feedback.rating} Star Review Submitted</span>
                            </div>
                          ) : booking.status === "completed" ? (
                            <span className="text-[10px] text-amber-500 font-semibold block pt-1">
                              Awaiting Feedback
                            </span>
                          ) : null}
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                          <span className={`text-[10px] font-bold uppercase py-1 px-3 border rounded-full ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>

                          <button
                            onClick={() => handleDownloadInvoice(booking)}
                            className="p-2 bg-stone-900 border border-stone-800 hover:border-amber-500/35 rounded-lg text-stone-400 hover:text-amber-400 transition-colors flex items-center gap-1.5 text-xs font-medium"
                            title="Generate Mock PDF Receipt"
                          >
                            <FileText className="w-4 h-4" />
                            <span className="hidden sm:inline">Receipt</span>
                          </button>

                          {booking.status === "completed" && !booking.feedback?.rating && (
                            <button
                              onClick={() => setFeedbackBookingId(booking._id)}
                              className="px-3.5 py-2 rounded-lg bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-all"
                            >
                              Share Review
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 3: PROFILE & PREFERENCES */}
              {activeTab === "profile" && (
                <div className="max-w-xl bg-stone-900/30 border border-stone-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
                  <h3 className="text-lg font-serif font-bold text-white border-b border-stone-850 pb-3 mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-amber-500" />
                    <span>Manage Account Particulars</span>
                  </h3>

                  {profileSuccess && (
                    <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs py-3 px-4 rounded-xl flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Account preferences updated successfully.</span>
                    </div>
                  )}

                  <form onSubmit={handleProfileUpdate} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-2.5 top-2.5 w-4 h-4 text-stone-500" />
                        <input
                          type="text"
                          required
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg py-2.5 pl-10 pr-3 text-xs text-stone-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                        Indian Mobile Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-2.5 top-2.5 w-4 h-4 text-stone-500" />
                        <input
                          type="tel"
                          required
                          value={profileMobile}
                          onChange={(e) => setProfileMobile(e.target.value)}
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg py-2.5 pl-10 pr-3 text-xs text-stone-200"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                          Company Name (Sponsor)
                        </label>
                        <div className="relative">
                          <Building className="absolute left-2.5 top-2.5 w-4 h-4 text-stone-500" />
                          <input
                            type="text"
                            value={profileCompanyName}
                            onChange={(e) => setProfileCompanyName(e.target.value)}
                            placeholder="Optional corporate association"
                            className="w-full bg-stone-950 border border-stone-800 rounded-lg py-2.5 pl-10 pr-3 text-xs text-stone-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          value={profileCity}
                          onChange={(e) => setProfileCity(e.target.value)}
                          placeholder="Home city"
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-xs text-stone-200"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={updatingProfile}
                        className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-all shadow-md shadow-amber-500/5 disabled:opacity-50"
                      >
                        {updatingProfile ? "Saving Details..." : "Save Preferences"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          )}

        </div>
      </main>

      {/* FEEDBACK OVERLAY MODAL */}
      {feedbackBookingId && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-serif font-bold text-white mb-1">Share Welcome Feedback</h3>
              <p className="text-xs text-stone-400">Your experiences help us refine our royal welcoming gestures.</p>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-2 text-center uppercase tracking-wider">
                  Select Rating
                </label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-8 h-8 ${rating >= star ? "text-amber-400 fill-amber-400" : "text-stone-700"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">Review Comments</label>
                <textarea
                  rows={2}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Share details of the welcome greeting experience..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-xs text-stone-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">Suggestions (Optional)</label>
                <input
                  type="text"
                  value={suggestions}
                  onChange={(e) => setSuggestions(e.target.value)}
                  placeholder="e.g. Include local regional drinks..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-xs text-stone-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">Encountered Issues (Optional)</label>
                <input
                  type="text"
                  value={issues}
                  onChange={(e) => setIssues(e.target.value)}
                  placeholder="e.g. Greeter was delayed by 5 mins..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-xs text-stone-200"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors"
                >
                  {submittingFeedback ? "Submitting..." : "Submit Review"}
                </button>
                <button
                  type="button"
                  onClick={() => setFeedbackBookingId(null)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-800 text-stone-300 hover:text-white transition-colors text-xs font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CANCELLATION OVERLAY MODAL */}
      {cancelBookingId && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-stone-900 border border-stone-850 rounded-2xl p-6 sm:p-8 space-y-5">
            <div>
              <h3 className="text-lg font-serif font-bold text-white mb-1">Confirm Cancellation</h3>
              <p className="text-xs text-stone-400">Please provide a reason to help us verify your request.</p>
            </div>

            <form onSubmit={handleCancelBooking} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-stone-450 mb-1">Cancellation Reason</label>
                <textarea
                  rows={3}
                  required
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Flight got cancelled / Journey postponed..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-xs text-stone-200"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submittingCancel}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors"
                >
                  {submittingCancel ? "Processing..." : "Confirm Cancellation"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCancelBookingId(null);
                    setCancelReason("");
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-stone-800 text-stone-300 hover:text-white transition-colors text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
