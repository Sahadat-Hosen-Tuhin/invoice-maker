interface BrandLogoProps {
  className?: string
  includeTagline?: boolean
}

export default function BrandLogo({
  className = '',
  includeTagline = true,
}: BrandLogoProps) {
  return (
    <div className={`brand-lockup ${className}`}>
      <div className="brand-logo-crop">
        <img
          className="brand-mark"
          src="/logo%20Developer%20Station%2025-01.svg"
          alt="Developer Station 25 logo"
        />
      </div>
      {includeTagline && <span className="brand-tagline">Build · Innovate · Grow</span>}
    </div>
  )
}
