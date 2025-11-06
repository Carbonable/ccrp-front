'use client';

export default function CalculatorPage() {
  const iframeUrl = 'https://planifier.carbonable.io';

  return (
    <div className="w-full">
      <iframe
        key={iframeUrl}
        src={iframeUrl}
        title="Kalculator"
        sandbox="allow-scripts allow-same-origin"
        style={{
          width: '100%',
          height: '100vh',
          border: 'none',
          overflow: 'hidden',
        }}
      />
    </div>
  );
}
