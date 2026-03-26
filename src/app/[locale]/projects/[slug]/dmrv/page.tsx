'use client';

const DMRV_BASE_URL = 'https://dmrv.carbonable.io/project';

/**
 * Maps CCRP Sanity project slugs to dMRV slugs.
 * Matches if the Sanity slug contains the dMRV project name.
 */
const DMRV_MAPPINGS = [
  { match: 'banegas-farm', dmrvSlug: 'banegas-farm' },
  { match: 'las-delicias', dmrvSlug: 'las-delicias' },
  { match: 'manjarisoa', dmrvSlug: 'manjarisoa' },
];

function findDmrvSlug(sanitySlug: string): string | null {
  const mapping = DMRV_MAPPINGS.find((m) => sanitySlug.includes(m.match));
  return mapping?.dmrvSlug ?? null;
}

export default function DmrvPage({ params }: Readonly<{ params: { slug: string } }>) {
  const dmrvSlug = findDmrvSlug(params.slug);

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
        title="dMRV Satellite Monitoring"
        allow="webgl; fullscreen"
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
