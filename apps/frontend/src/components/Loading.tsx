interface LoadingProps {
  text?: string
  size?: 'small' | 'medium' | 'large'
}

export function Loading({ text = 'Loading...', size = 'medium' }: LoadingProps) {
  const sizes = {
    small: { spinner: 24, font: 14 },
    medium: { spinner: 40, font: 16 },
    large: { spinner: 56, font: 18 }
  }
  
  const { spinner, font } = sizes[size]

  return (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <div 
        className="loading-spinner" 
        style={{ 
          width: `${spinner}px`, 
          height: `${spinner}px`, 
          border: `${spinner / 10}px solid #f3f3f3`, 
          borderTop: `${spinner / 10}px solid #0070f3`, 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite', 
          margin: '0 auto' 
        }}
      ></div>
      <p style={{ marginTop: '15px', color: '#666', fontSize: `${font}px` }}>{text}</p>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div style={{
      border: '1px solid rgba(0, 0, 0, 0.08)',
      borderRadius: '16px',
      padding: '24px',
      background: 'white',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)'
    }}>
      <div style={{ 
        height: '24px', 
        width: '60%', 
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: '4px',
        marginBottom: '12px'
      }} />
      <div style={{ 
        height: '16px', 
        width: '100%', 
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: '4px',
        marginBottom: '8px'
      }} />
      <div style={{ 
        height: '16px', 
        width: '80%', 
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: '4px',
        marginBottom: '16px'
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ 
          height: '28px', 
          width: '80px', 
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          borderRadius: '20px'
        }} />
        <div style={{ 
          height: '16px', 
          width: '60px', 
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          borderRadius: '4px'
        }} />
      </div>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}

export function AppGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}
