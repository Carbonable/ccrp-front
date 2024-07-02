import dynamic from 'next/dynamic';

const LoginForm = dynamic(() => import('@/components/authentication/Login'), {
  ssr: false,
})


export default function LoginPage() {
  return (
    <div className="text-center mt-12">
      <h1 className="uppercase text-3xl font-bold">
        Carbon assets portfolio manager
      </h1>
      <h2 className="font-light">
        Powered by <span className="text-greenish-500">Carbonable</span>
      </h2>
      <div className="mt-12 md:w-8/12 mx-auto">
        <LoginForm />
      </div>
    </div>
  );
}