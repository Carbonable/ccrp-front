import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl p-8 text-neutral-100">
      <h1 className="mb-6 mt-12 border-b border-neutral-500 pb-2 text-xl font-bold">
        404 - Not Found
      </h1>
      <p className="text-lg text-neutral-300">
        Sorry, the page you were looking for could not be found.
      </p>
      <p className="mt-6">
        <Link
          href="/en/dashboard"
          className="inline-flex rounded-lg border border-neutral-500 bg-greenish-500 px-4 py-2 text-sm uppercase tracking-wide text-neutral-950 hover:brightness-110"
        >
          Return Home
        </Link>
      </p>
    </div>
  );
}
