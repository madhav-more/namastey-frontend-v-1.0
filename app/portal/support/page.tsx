"use client";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  MessageSquare, 
  Phone, 
  Mail, 
  Plus, 
  Minus, 
  Send, 
  User, 
  Clock, 
  CheckCheck 
} from "lucide-react";

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Chat Simulation State
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: "user" | "agent"; text: string; time: string }>>([
    { sender: "agent", text: "Namaste! Welcome to Namastey VIP Support. How can we assist you with your airport greeting schedule today?", time: "Just now" }
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      q: "What is your typical lead time for booking a welcome service?",
      a: "For guaranteed greeter availability and smooth customs coordination, we highly recommend booking at least 24 hours prior to flight arrival. Urgent requests under 12 hours are subject to express review and higher booking margins."
    },
    {
      q: "Do you offer airside meet-and-greet immediately at the gate?",
      a: "Yes, our premium packages include airside greets directly at the aerobridge/gate. However, buggy transfers and fast-track immigration queues are subject to specific terminal regulations and security clearances at each airport."
    },
    {
      q: "Can I sponsor welcome greetings for corporate clients?",
      a: "Absolutely. Sponsoring organizations can book under their company profile and designate guest particulars (name, email, language preference, flight detail). The guest receives a SMS link with their greeter's contact information while the sponsor handles billing."
    },
    {
      q: "How are cancellations and rescheduling handled?",
      a: "Reservations can be rescheduled or cancelled through the customer portal up to 12 hours before scheduled arrival with no cancellation penalties. Within 12 hours, a 50% late-action charge is applied to compensate greeting staff."
    },
    {
      q: "Do you monitor flight delays or early arrivals?",
      a: "Yes, we monitor all flights in real-time using flight numbers provided. Our greeters adjust their reporting times automatically, ensuring they are at the terminal regardless of delays."
    }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: "user" as const, text: inputText, time: currentTime };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");

    // Simulate Agent Auto-Response after 1 sec
    setTimeout(() => {
      let replyText = "Understood. Our administrative desk is currently verifying terminal coordinators. We will update your timeline status shortly.";
      if (inputText.toLowerCase().includes("cancel") || inputText.toLowerCase().includes("refund")) {
        replyText = "For cancellation requests, you can use the 'Cancel Service' action on your active booking details page. Refunds are processed within 3 working days.";
      } else if (inputText.toLowerCase().includes("delayed") || inputText.toLowerCase().includes("flight")) {
        replyText = "We monitor flight details automatically. If your flight is delayed, our greeting team will be notified and adapt their schedule accordingly. No manual action is needed.";
      } else if (inputText.toLowerCase().includes("greeter") || inputText.toLowerCase().includes("phone")) {
        replyText = "Coordinator details are assigned and shown on your active booking timeline card roughly 2 hours before the flight's scheduled landing.";
      }

      setMessages(prev => [...prev, {
        sender: "agent",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950 relative">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Namastey Support Centre</span>
            </div>
            <h1 className="text-4xl font-serif font-bold text-white mb-4">
              We're Here to Help
            </h1>
            <p className="text-stone-400 text-xs sm:text-sm">
              Have questions about airport VIP clearances, regional cultural attire, or billing? Contact us via multiple channels.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left: Contact Channels */}
            <div className="space-y-6">
              <h3 className="text-lg font-serif font-bold text-white mb-2">Direct Contact Channels</h3>
              
              <a 
                href="https://wa.me/919876543210" 
                target="_blank" 
                rel="noreferrer"
                className="flex gap-4 p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                  💬
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm mb-0.5">WhatsApp VIP Desk</h4>
                  <p className="text-stone-400 text-xs leading-relaxed mb-1">Direct instant chat coordination with standby greeters.</p>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Available 24/7 &rarr;</span>
                </div>
              </a>

              <a 
                href="tel:+91206754321" 
                className="flex gap-4 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 hover:bg-amber-500/10 hover:border-amber-500/30 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm mb-0.5">VIP Operations Phone</h4>
                  <p className="text-stone-400 text-xs leading-relaxed mb-1">Direct phone helpline for urgent airport arrival adjustments.</p>
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">+91 (20) 675-4321 &rarr;</span>
                </div>
              </a>

              <a 
                href="mailto:operations@namastey.com"
                className="flex gap-4 p-5 rounded-2xl bg-stone-900/40 border border-stone-800 hover:border-amber-500/25 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5 text-stone-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm mb-0.5">Email Communications</h4>
                  <p className="text-stone-400 text-xs leading-relaxed mb-1">Corporate partnership arrangements and invoicing queries.</p>
                  <span className="text-[10px] text-stone-300 font-bold uppercase tracking-wider">operations@namastey.com &rarr;</span>
                </div>
              </a>
            </div>

            {/* Middle: FAQ Accordion */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-lg font-serif font-bold text-white mb-2">Frequently Answered Queries</h3>

              <div className="space-y-4">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div 
                      key={idx} 
                      className="bg-stone-900/20 border border-stone-800 rounded-xl overflow-hidden transition-all duration-300"
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full p-5 flex items-center justify-between text-left gap-4 font-bold text-white text-sm sm:text-base hover:bg-stone-900/40 transition-colors"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? <Minus className="w-4 h-4 text-amber-500 shrink-0" /> : <Plus className="w-4 h-4 text-amber-500 shrink-0" />}
                      </button>
                      
                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-stone-400 text-xs sm:text-sm leading-relaxed border-t border-stone-900/40">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </section>
      </main>

      {/* Floating Chat Widget Toggle */}
      <button
        onClick={() => setChatOpen(prev => !prev)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-stone-950 font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all z-40 border border-amber-400"
      >
        {chatOpen ? "✕" : "💬"}
      </button>

      {/* Simulated Live Support Chat Drawer */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 w-[340px] sm:w-[380px] h-[480px] bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-stone-950 p-4 border-b border-stone-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center font-bold text-amber-400">
              N
            </div>
            <div>
              <h4 className="font-bold text-white text-xs leading-none">Namastey VIP Desk</h4>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Coordinator Online</span>
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-stone-950/30">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-2.5 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                  msg.sender === "user" ? "bg-amber-500 text-stone-950 font-bold" : "bg-stone-800 text-stone-300"
                }`}>
                  {msg.sender === "user" ? "U" : "A"}
                </div>
                <div>
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === "user" 
                      ? "bg-amber-500 text-stone-950 font-medium rounded-tr-none" 
                      : "bg-stone-900 border border-stone-800 text-stone-200 rounded-tl-none"
                  }`}>
                    {msg.text}
                  </div>
                  <span className={`text-[9px] text-stone-500 mt-1 block ${msg.sender === "user" ? "text-right" : ""}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-stone-950 border-t border-stone-800 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about delays, cancel action, etc..."
              className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
            />
            <button
              type="submit"
              className="w-9 h-9 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center justify-center shrink-0 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      <Footer />
    </div>
  );
}
