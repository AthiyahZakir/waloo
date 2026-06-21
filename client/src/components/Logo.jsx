export default function Logo({ size = 24 }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Space Grotesk, sans-serif',
        fontWeight: 700,
        fontSize: size,
        color: 'var(--color-ink)',
        transform: 'rotate(180deg)',
        lineHeight: 1,
      }}
      aria-hidden="true"
    >
      ?
    </span>
  );
}