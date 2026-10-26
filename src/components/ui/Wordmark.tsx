// Text-based placeholder wordmark until the vector logo is supplied.
export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-display inline-flex items-center text-[1.75rem] leading-none font-medium tracking-[0.18em] md:text-[2rem] ${className}`}
    >
      DOLLY
    </span>
  );
}
