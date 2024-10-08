export default function BaselinePage() {
  const iframeUrl = 'https://baseline-front-flax.vercel.app/';

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
