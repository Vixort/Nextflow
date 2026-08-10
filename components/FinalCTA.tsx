export default function FinalCTA() {
  return (
    <section className="bg-[#fafafa] py-24 sm:py-32">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.04em] text-[#09090b] text-center max-w-3xl mx-auto leading-[0.92]">
          Ready to scale your digital infrastructure?
        </h2>
        <p className="text-base text-[#71717a] text-center max-w-[50ch] mx-auto mt-4">
          Talk to our engineering team about your architecture challenges. No sales pitch — just technical expertise.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="bg-[#09090b] text-white h-12 px-8 rounded-md text-sm font-medium hover:bg-[#18181b] transition-colors active:scale-[0.98]">
            Start a conversation
          </button>
          <button className="border border-[#e4e4e7] text-[#52525b] h-12 px-8 rounded-md text-sm font-medium hover:border-[#a1a1aa] hover:text-[#09090b] transition-colors active:scale-[0.98]">
            Read documentation
          </button>
        </div>
      </div>
    </section>
  )
}
