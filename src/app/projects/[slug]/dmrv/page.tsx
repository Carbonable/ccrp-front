'use client';

const DMRV_BASE_URL = 'https://dmrv.carbonable.io/projects';

const DMRV_SLUGS: Record<string, string> = {
  'banegas-farm': 'banegas-farm',
  'las-delicias': 'las-delicias',
  'manjarisoa': 'manjarisoa',
};

export default function DmrvPage({ params }: Readonly<{ params: { slug: string } }>) {
  const dmrvSlug = DMRV_SLUGS[params.slug];

  if (!dmrvSlug) {
    return (
      <div className="mt-6 text-neutral-300">
        dMRV data is not yet available for this project.
      </div>
    );
  }

  return (
    <div className="w-full mt-4">
      <iframe
        src={`${DMRV_BASE_URL}/${dmrvSlug}`}
        title="dMRV Data"
        sandbox="allow-scripts allow-same-origin"
        style={{
          width: '100%',
          height: 'calc(100vh - 200px)',
          border: 'none',
          borderRadius: '8px',
        }}
      />
    </div>
  );
}
