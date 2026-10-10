import { FileText, Calculator, CheckCircle2, UserCheck, Star } from "lucide-react";

export default function WorkflowSteps() {
  const steps = [
    {
      num: "01",
      title: "Submit Quote Request",
      icon: FileText,
      desc: "Fill in travel dates, location, guest requirements, and choose your preferred welcome theme.",
    },
    {
      num: "02",
      title: "Admin Prepares Quote",
      icon: Calculator,
      desc: "Our operations manager reviews flight schedules & terminal logistics to craft a custom quote.",
    },
    {
      num: "03",
      title: "Accept Quotation",
      icon: CheckCircle2,
      desc: "Review your transparent quotation in your dashboard and click Accept to confirm your booking.",
    },
    {
      num: "04",
      title: "Live Operations Sync",
      icon: UserCheck,
      desc: "Receive assigned greeter details and real-time timeline notifications straight to your dashboard.",
    },
    {
      num: "05",
      title: "Arrival & Feedback",
      icon: Star,
      desc: "Experience flawless VIP reception and leave instant star ratings for continuous service excellence.",
    },
  ];

  return (
    <section className="py-24 bg-stone-950 text-stone-200 border-t border-stone-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-amber-400 font-semibold font-sans">
            Transparent Workflow
          </h2>
          <p className="text-3xl sm:text-5xl font-bold font-serif text-white tracking-tight">
            How Your Service Unfolds
          </p>
          <p className="text-stone-400 text-base font-light">
            Designed for maximum clarity, speed, and trust at every stage of your travel booking.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {steps.map((s, idx) => {
            const IconComponent = s.icon;
            return (
              <div
                key={idx}
                className="relative p-6 rounded-2xl bg-stone-900/60 border border-stone-800/80 hover:border-amber-500/40 transition-all space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold font-serif text-amber-500/30">
                      {s.num}
                    </span>
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold font-serif text-white mt-4">
                    {s.title}
                  </h3>
                  <p className="text-xs text-stone-400 mt-2 font-light leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
