export default function ValueProposition() {
  return (
    <section className="relative bg-[#09090b] py-24 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] lg:w-[1000px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.04em] text-white mb-10 leading-[0.92]">
          Built for teams that ship fast
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.08] rounded-xl overflow-hidden border border-white/[0.08]">
          {/* Row 1: Cell 1 (LARGE - col-span-2) */}
          <div className="bg-[#0f0f11] p-8 lg:p-10 md:col-span-2 relative flex flex-col justify-between min-h-[260px]">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white">Performance at Scale</h3>
              <p className="text-sm text-[#a1a1aa] mt-2 max-w-[45ch] leading-relaxed">
                Sub-200ms response times under 50K concurrent connections. Our event-driven architecture eliminates bottlenecks before they reach your users.
              </p>
            </div>
            <div className="mt-8 text-5xl lg:text-6xl font-extrabold tracking-[-0.04em] text-white/10 select-none">
              &lt;200ms
            </div>
          </div>

          {/* Row 1: Cell 2 (Regular - col-span-1) */}
          <div className="bg-[#0f0f11] p-8 lg:p-10 md:col-span-1 flex flex-col justify-between min-h-[260px]">
            <div>
              <h3 className="text-lg font-semibold text-white">Enterprise Security</h3>
              <p className="text-sm text-[#a1a1aa] mt-2 max-w-[45ch] leading-relaxed">
                SOC 2 compliant infrastructure with end-to-end encryption, RBAC, and automated threat detection built into every deployment layer.
              </p>
            </div>
          </div>

          {/* Row 2: Cell 3 (Regular - col-span-1) */}
          <div className="bg-[#0f0f11] p-8 lg:p-10 md:col-span-1 flex flex-col justify-between min-h-[260px]">
            <div>
              <h3 className="text-lg font-semibold text-white">Intelligent Scaling</h3>
              <p className="text-sm text-[#a1a1aa] mt-2 max-w-[45ch] leading-relaxed">
                Auto-scaling infrastructure that responds to traffic spikes in under 3 seconds. Pay for what you use, scale to what you need.
              </p>
            </div>
          </div>

          {/* Row 2: Cell 4 (LARGE - col-span-2) */}
          <div className="bg-[#0f0f11] p-8 lg:p-10 md:col-span-2 relative flex flex-col justify-between min-h-[260px]">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white">99.99% Uptime SLA</h3>
              <p className="text-sm text-[#a1a1aa] mt-2 max-w-[45ch] leading-relaxed">
                Redundant multi-region deployment with automated failover. Your platform stays online even when entire availability zones don&apos;t.
              </p>
            </div>
            <div className="mt-8 text-5xl lg:text-6xl font-extrabold tracking-[-0.04em] text-white/10 select-none">
              99.99%
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
