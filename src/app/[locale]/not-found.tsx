import Link from 'next/link';
import Title from '@/components/common/Title'; // Assuming you're using a Title component for consistency
import { GreenButton } from '@/components/common/Button';

export default function NotFound() {
  return (
    <div className="2xl:max-w-8xl max-w-full p-4 lg:mx-auto lg:max-w-6xl lg:p-8 xl:max-w-7xl">
      <Title title="404 - Not Found" />
      <div className="mt-6">
        <p className="text-lg">Sorry, the page you were looking for could not be found.</p>
        <p className="mt-4">
          <GreenButton>
            <Link href="/">Return Home</Link>
          </GreenButton>
        </p>
      </div>
    </div>
  );
}
