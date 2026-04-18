import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="text-center">
      <h1 className="text-3xl font-bold text-slate-900">404</h1>
      <p className="mt-2 text-slate-600">Page not found.</p>
      <Link
        to="/dashboard"
        className="mt-4 inline-block rounded bg-slate-900 px-4 py-2 text-white"
      >
        Go to Dashboard
      </Link>
    </section>
  );
}

export default NotFoundPage;
