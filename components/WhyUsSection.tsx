const PAIN_POINTS = [
  {
    title: 'Scaling bottlenecks',
    description:
      'Traffic spikes crash your servers. Manual scaling means lost revenue during peak hours.',
  },
  {
    title: 'Security vulnerabilities',
    description:
      'Outdated dependencies and unpatched infrastructure leave your data exposed to breaches.',
  },
  {
    title: 'Slow iteration cycles',
    description:
      'Monolithic architectures make every deployment a risk. Your team ships features in weeks, not days.',
  },
]

const SOLUTIONS = [
  {
    title: 'Event-driven auto-scaling',
    description:
      'Handles 50K+ concurrent users without manual intervention. Scale-to-zero when idle.',
  },
  {
    title: 'Defense-in-depth security',
    description:
      'Automated patching, WAF, DDoS mitigation, and SOC 2 compliance baked into every layer.',
  },
  {
    title: 'Ship daily, not monthly',
    description:
      'Modular microservice architecture with CI/CD pipelines. Deploy with confidence, rollback in seconds.',
  },
]

export default function WhyUsSection() {
  return (
    <section className="relative border-t border-[rgba(255,255,255,0.06)] bg-[#09090b] py-24 overflow-hidden">
      {/* Background Detail */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -right-40 -top-40 w-[600px] lg:w-[800px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column — Problems */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.04em] text-white mb-8">
              Your current stack is holding you back
            </h2>
            <div className="space-y-6">
              {PAIN_POINTS.map((point) => (
                <div
                  key={point.title}
                  className="border-l-2 border-[rgba(255,255,255,0.1)] pl-4"
                >
                  <h3 className="text-sm font-semibold text-white">
                    {point.title}
                  </h3>
                  <p className="text-sm text-[#71717a] mt-1">
                    {point.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column — Our Solution */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.04em] text-white mb-8">
              Architecture that eliminates these problems
            </h2>
            <div className="space-y-6">
              {SOLUTIONS.map((solution) => (
                <div
                  key={solution.title}
                  className="border-l-2 border-white/20 pl-4"
                >
                  <h3 className="text-sm font-semibold text-white">
                    {solution.title}
                  </h3>
                  <p className="text-sm text-[#71717a] mt-1">
                    {solution.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
