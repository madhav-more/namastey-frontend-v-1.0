"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { api } from "../../utils/api";
import { 
  ShieldAlert, 
  Clock, 
  CheckCircle, 
  MapPin, 
  User, 
  ChevronRight, 
  Send, 
  AlertCircle, 
  Eye,
  Activity,
  Plus,
  Lock,
  Search,
  BookOpen
} from "lucide-react";

export default function AdminDashboardPage() {
  const [isClient, setIsClient] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected Booking for actions
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const selectedBooking = bookings.find(b => b._id === selectedBookingId);

  // Action forms state
  const [quotePrice, setQuotePrice] = useState("");
  const [quoteNotes, setQuoteNotes] = useState("");
  const [submittingQuote, setSubmittingQuote] = useState(false);

  const [assignedName, setAssignedName] = useState("");
  const [assignedPhone, setAssignedPhone] = useState("");
  const [submittingAssign, setSubmittingAssign] = useState(false);

  const [newStatus, setNewStatus] = useState("");
  const [statusComment, setStatusComment] = useState("");
  const [submittingStatus, setSubmittingStatus] = useState(false);

  // Filter Tabs
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Section Tabs (Leads, Preferences)
  const [activeConsole, setActiveConsole] = useState<"leads" | "preferences">("leads");

  useEffect(() => {
    setIsClient(true);
    
    // Check credentials
    const token = localStorage.getItem("namastey_token");
    const storedUser = localStorage.getItem("namastey_user");
    
    if (!token || !storedUser) {
      window.location.href = "/admin/login";
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      if (user.role !== "admin" && user.role !== "super_admin") {
        window.location.href = "/portal/login";
        return;
      }
      setIsAdmin(true);
    } catch (e) {
      window.location.href = "/admin/login";
      return;
    }

    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/bookings/admin/all");
      if (response.success) {
        setBookings(response.data?.bookings || []);
      } else {
        setError("Unable to sync booking leads database.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to contact admin services endpoint.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId || !quotePrice) return;

    setSubmittingQuote(true);
    try {
      const response = await api.put(`/bookings/${selectedBookingId}/quotation`, {
        price: Number(quotePrice),
        notes: quoteNotes
      });
      if (response.success) {
        alert("Custom quotation issued to client portal.");
        setQuotePrice("");
        setQuoteNotes("");
        fetchAllBookings();
      }
    } catch (err: any) {
      alert(err.message || "Quotation issuance failed.");
    } finally {
      setSubmittingQuote(false);
    }
  };

  const handleAssignOperations = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId || !assignedName || !assignedPhone) return;

    setSubmittingAssign(true);
    try {
      const response = await api.put(`/bookings/${selectedBookingId}/assign`, {
        assignedName,
        assignedPhone
      });
      if (response.success) {
        alert("Operations greeting assistant assigned.");
        setAssignedName("");
        setAssignedPhone("");
        fetchAllBookings();
      }
    } catch (err: any) {
      alert(err.message || "Greeter assignment failed.");
    } finally {
      setSubmittingAssign(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId || !newStatus) return;

    setSubmittingStatus(true);
    try {
      const response = await api.put(`/bookings/${selectedBookingId}/status`, {
        status: newStatus,
        comment: statusComment
      });
      if (response.success) {
        alert(`Status changed to ${newStatus.toUpperCase()}`);
        setNewStatus("");
        setStatusComment("");
        fetchAllBookings();
      }
    } catch (err: any) {
      alert(err.message || "Status transition update failed.");
    } finally {
      setSubmittingStatus(false);
    }
  };

  // Select a booking and populate default values for forms
  const selectBooking = (id: string) => {
    setSelectedBookingId(id);
    const booking = bookings.find(b => b._id === id);
    if (booking) {
      setNewStatus(booking.status || "");
      setAssignedName(booking.operations?.assignedName || "");
      setAssignedPhone(booking.operations?.assignedPhone || "");
      setQuotePrice(booking.quotation?.price > 0 ? String(booking.quotation.price) : "");
      setQuoteNotes(booking.quotation?.notes || "");
    }
  };

  // Filter bookings list
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    const matchesSearch = 
      b.bookingId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.fromCity?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.toCity?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadgeClass = (status: string) => {
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

  if (!isClient || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-stone-900/40 border border-stone-850 p-6 rounded-2xl mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                <span className="text-xs text-red-400 font-bold uppercase tracking-wider">Namastey Central Admin Control</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">Operations Dashboard</h1>
              <p className="text-stone-400 text-xs mt-1">Review quotation requests, manage dynamic timelines, and assign greeting staff.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setActiveConsole("leads")}
                className={`px-4.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                  activeConsole === "leads"
                    ? "bg-red-600 border-red-600 text-white"
                    : "border-stone-800 bg-stone-900/20 text-stone-400"
                }`}
              >
                Lead Board
              </button>
              <button
                onClick={() => setActiveConsole("preferences")}
                className={`px-4.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                  activeConsole === "preferences"
                    ? "bg-red-600 border-red-600 text-white"
                    : "border-stone-800 bg-stone-900/20 text-stone-400"
                }`}
              >
                Client Database
              </button>
            </div>
          </div>

          {/* MAIN LEADS WORKSPACE */}
          {activeConsole === "leads" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Filter and Leads List */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Search and Filters */}
                <div className="bg-stone-900/20 border border-stone-850 p-4 rounded-xl space-y-3.5">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search ID, customer name, email, or terminal routes..."
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg py-2 pl-10 pr-4 text-xs text-stone-250 placeholder-stone-600 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: "all", label: "All Requests" },
                      { id: "pending", label: "Pending" },
                      { id: "quotation_sent", label: "Quoted" },
                      { id: "quotation_accepted", label: "Accepted" },
                      { id: "confirmed", label: "Confirmed" },
                      { id: "operations_assigned", label: "Assigned" },
                      { id: "in_progress", label: "In Progress" },
                      { id: "completed", label: "Completed" }
                    ].map((filt) => (
                      <button
                        key={filt.id}
                        onClick={() => setStatusFilter(filt.id)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                          statusFilter === filt.id
                            ? "bg-red-950/20 border-red-500/40 text-red-400"
                            : "border-stone-850 bg-stone-950/40 text-stone-400 hover:text-stone-300"
                        }`}
                      >
                        {filt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Leads List Table */}
                {loading ? (
                  <div className="text-center py-16 bg-stone-900/10 border border-stone-850 rounded-2xl">
                    <div className="w-8 h-8 border-3 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-stone-400 text-xs">Accessing lead records...</p>
                  </div>
                ) : error ? (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-4 px-6 rounded-2xl text-center">
                    <AlertCircle className="w-5 h-5 mx-auto mb-2 text-red-500" />
                    <span>{error}</span>
                  </div>
                ) : filteredBookings.length === 0 ? (
                  <div className="border border-stone-850 bg-stone-900/10 rounded-2xl p-12 text-center text-xs text-stone-500">
                    No lead records match your search criteria.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredBookings.map((b) => (
                      <div
                        key={b._id}
                        onClick={() => selectBooking(b._id)}
                        className={`bg-stone-900/20 border rounded-2xl p-4.5 transition-all cursor-pointer flex justify-between items-center ${
                          selectedBookingId === b._id
                            ? "border-red-500 bg-stone-900/40 shadow-lg shadow-red-950/5"
                            : "border-stone-850 hover:border-stone-800"
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold text-red-400 bg-red-500/5 px-2 py-0.5 border border-red-500/20 rounded">
                              {b.bookingId}
                            </span>
                            <span className="text-xs text-stone-500">|</span>
                            <span className="text-xs font-bold text-stone-200">{b.customerName}</span>
                          </div>
                          
                          <p className="text-[11px] text-stone-400 flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-stone-500" />
                            <span>{b.fromCity} ({b.fromArea}) &rarr; {b.toCity} ({b.toArea})</span>
                          </p>

                          <div className="text-[10px] text-stone-500 flex gap-2 items-center">
                            <span>Sched: {new Date(b.scheduledDate).toLocaleDateString()} ({b.scheduledTime})</span>
                            {b.flightNumber && (
                              <>
                                <span>•</span>
                                <span className="text-amber-500 font-mono font-medium">{b.flightNumber}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`text-[9px] font-bold tracking-wider uppercase py-1 px-3 border rounded-full ${getStatusBadgeClass(b.status)}`}>
                            {b.status.replace(/_/g, " ")}
                          </span>
                          <ChevronRight className="w-4 h-4 text-stone-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>

              {/* Right Column: Panel Actions for Selected Lead */}
              <div>
                {selectedBooking ? (
                  <div className="bg-stone-900/30 border border-stone-800 rounded-2xl p-6 space-y-6 sticky top-24">
                    
                    {/* Selected Summary Card */}
                    <div>
                      <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-wider block mb-1">
                        Active Lead Focus
                      </span>
                      <h3 className="text-lg font-serif font-bold text-white">{selectedBooking.customerName}</h3>
                      <p className="text-xs text-stone-400">{selectedBooking.customerEmail} | {selectedBooking.customerMobile}</p>
                      
                      <div className="mt-4 p-3 bg-stone-950 rounded-xl border border-stone-850 space-y-1.5 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-stone-500">Package:</span>
                          <span className="text-stone-300 font-semibold">{selectedBooking.package?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Theme:</span>
                          <span className="text-stone-300">{selectedBooking.culturalTheme?.name || "None"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Guests Count:</span>
                          <span className="text-stone-300">{selectedBooking.numberOfGuests}</span>
                        </div>
                        {selectedBooking.vipRequirements && (
                          <div className="border-t border-stone-850 pt-1.5 mt-1 text-[10px] text-amber-400">
                            <strong>VIP req:</strong> {selectedBooking.vipRequirements}
                          </div>
                        )}
                        {selectedBooking.specialInstructions && (
                          <div className="border-t border-stone-850 pt-1.5 mt-1 text-[10px] text-stone-400 italic">
                            <strong>Notes:</strong> "{selectedBooking.specialInstructions}"
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quotation Builder Panel */}
                    <div className="border-t border-stone-800 pt-5">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Quotation Builder</h4>
                      <form onSubmit={handleSendQuotation} className="space-y-3 text-xs">
                        <div>
                          <label className="block text-[10px] text-stone-400 mb-1">Quoted Price Amount (INR)</label>
                          <input
                            type="number"
                            required
                            placeholder="e.g. 2500"
                            value={quotePrice}
                            onChange={(e) => setQuotePrice(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-850 rounded-lg p-2 text-xs text-stone-200"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-stone-400 mb-1">Quotation Notes / Terms</label>
                          <textarea
                            rows={2}
                            placeholder="e.g. VIP buggy transit included, airport terminal charges extra..."
                            value={quoteNotes}
                            onChange={(e) => setQuoteNotes(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-850 rounded-lg p-2 text-xs text-stone-200"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={submittingQuote}
                          className="w-full py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{submittingQuote ? "Sending..." : "Send Proposed Quote"}</span>
                        </button>
                      </form>
                    </div>

                    {/* Operations Greeter Allocation */}
                    <div className="border-t border-stone-800 pt-5">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Assign Greeting Assistant</h4>
                      <form onSubmit={handleAssignOperations} className="space-y-3 text-xs">
                        <div>
                          <label className="block text-[10px] text-stone-400 mb-1">Operations Coordinator Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Sunil Deshmukh"
                            value={assignedName}
                            onChange={(e) => setAssignedName(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-850 rounded-lg p-2 text-xs text-stone-200"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-stone-400 mb-1">Operations Coordinator Phone</label>
                          <input
                            type="tel"
                            required
                            placeholder="e.g. +91 9876543210"
                            value={assignedPhone}
                            onChange={(e) => setAssignedPhone(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-850 rounded-lg p-2 text-xs text-stone-200"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={submittingAssign}
                          className="w-full py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg transition-colors disabled:opacity-50"
                        >
                          {submittingAssign ? "Allocating Staff..." : "Allocate Greeting Staff"}
                        </button>
                      </form>
                    </div>

                    {/* Real-time Timeline Status Transition */}
                    <div className="border-t border-stone-800 pt-5">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Timeline Controller</h4>
                      <form onSubmit={handleUpdateStatus} className="space-y-3 text-xs">
                        <div>
                          <label className="block text-[10px] text-stone-400 mb-1">Select Status Level</label>
                          <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-850 rounded-lg p-2 text-xs text-stone-200"
                          >
                            <option value="">-- Choose Status --</option>
                            <option value="pending">Pending review</option>
                            <option value="under_review">Under Coordinator Review</option>
                            <option value="quotation_sent">Quotation Sent</option>
                            <option value="quotation_accepted">Quotation Approved</option>
                            <option value="confirmed">Confirmed Schedule</option>
                            <option value="operations_assigned">Operations Assistant Assigned</option>
                            <option value="team_on_the_way">Team On The Way</option>
                            <option value="in_progress">Greeting In Progress</option>
                            <option value="completed">Service Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-stone-400 mb-1">Timeline Log Comments</label>
                          <input
                            type="text"
                            placeholder="e.g. Greeter has reached arrival gate column 4."
                            value={statusComment}
                            onChange={(e) => setStatusComment(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-850 rounded-lg p-2 text-xs text-stone-200"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={submittingStatus}
                          className="w-full py-2 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-650 hover:to-red-550 text-white font-bold text-xs rounded-lg transition-all disabled:opacity-50"
                        >
                          {submittingStatus ? "Shifting Status..." : "Shift Booking Status"}
                        </button>
                      </form>
                    </div>

                  </div>
                ) : (
                  <div className="bg-stone-900/10 border border-stone-850 border-dashed rounded-2xl p-16 text-center text-xs text-stone-500 sticky top-24">
                    Select a request booking from the lead board to trigger operational coordinator panels.
                  </div>
                )}
              </div>

            </div>
          )}

          {/* MAIN PREFERENCES DATABASE */}
          {activeConsole === "preferences" && (
            <div className="bg-stone-900/20 border border-stone-850 rounded-2xl p-6">
              <h3 className="text-lg font-serif font-bold text-white border-b border-stone-850 pb-3 mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-red-500" />
                <span>Customer Preferences Database</span>
              </h3>

              <div className="space-y-4">
                {bookings.filter((v, i, a) => a.findIndex(t => t.customerEmail === v.customerEmail) === i).map((client, idx) => {
                  const clientHistory = bookings.filter(b => b.customerEmail === client.customerEmail);
                  return (
                    <div key={idx} className="bg-stone-950/40 border border-stone-850 rounded-xl p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <div>
                          <h4 className="font-bold text-white text-sm">{client.customerName}</h4>
                          <p className="text-stone-400 text-xs">Email: {client.customerEmail} | Phone: {client.customerMobile}</p>
                        </div>
                        <span className="text-[10px] bg-red-950/20 border border-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded">
                          Total Reservations: {clientHistory.length}
                        </span>
                      </div>

                      <div className="border-t border-stone-850/80 pt-3">
                        <span className="text-[10px] text-stone-500 uppercase font-semibold tracking-wider block mb-1">
                          Preference Notes Registry
                        </span>
                        <ul className="text-xs space-y-1.5 text-stone-300">
                          {clientHistory.map((hist, hIdx) => (
                            <li key={hIdx} className="list-disc list-inside">
                              {hist.scheduledDate ? `${new Date(hist.scheduledDate).toLocaleDateString()}: ` : ""}
                              {hist.specialInstructions || hist.vipRequirements ? (
                                <span>
                                  "{hist.specialInstructions || "No instruction"}" 
                                  {hist.vipRequirements && ` (VIP: ${hist.vipRequirements})`}
                                </span>
                              ) : (
                                <span className="text-stone-600">Standard coordination.</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
