import Link from "next/link";
import Title from "@/components/common/Title"; // Assuming you're using a Title component for consistency
import { GreenButton } from "@/components/common/Button";

export default function NotFound() {
  return (
    <div className="p-4 lg:p-8 lg:mx-auto max-w-full lg:max-w-6xl xl:max-w-7xl 2xl:max-w-8xl">
      <Title title="404 - Not Found" />
      <div className="mt-6">
        <p className="text-lg">
          Sorry, the page you were looking for could not be found.
        </p>
        <p className="mt-4">
          <GreenButton>
            <Link href="/">Return Home</Link>
          </GreenButton>
        </p>
      </div>
    </div>
  );
}
