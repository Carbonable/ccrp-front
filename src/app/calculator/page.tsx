export default function CalculatorPage() {
  const iframeUrl = 'https://prod-carbonable-calculator.fly.dev/calculator';


  return (
    <div>
      <iframe
        key={iframeUrl}
        src={iframeUrl}
        title="Carculator"
        sandbox="allow-scripts allow-same-origin"
        style={{ width: '100%', height: '100vh', border: 'none' }}
      />
    </div>
  );
}
