interface BrandLogoProps {
  className?: string
}

export default function BrandLogo({ className = '' }: BrandLogoProps) {
  return (
    <div className={`brand-lockup ${className}`}>
      <div className="brand-logo-crop">
        <img
          className="brand-mark"
          src="/logo%20Developer%20Station%2025-01.svg"
          alt="Developer Station 25 logo"
        />
      </div>
    </div>
  )
}
