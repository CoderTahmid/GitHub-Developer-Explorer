import React from 'react';
import { Link, useRouteError } from 'react-router-dom';

const ErrorPage = () => {
    const error = useRouteError();
    const message = error?.statusText || error?.message || 'The page you requested does not exist.';

    return (
        <section className="min-h-screen bg-base-200 px-4 py-10">
            <div className="mx-auto max-w-2xl rounded-2xl border border-base-300 bg-base-100 p-8 text-center shadow-sm">
                <p className="text-sm uppercase tracking-widest text-base-content/60">Error</p>
                <h1 className="mt-2 text-3xl font-bold">Oops! Something went wrong.</h1>
                <p className="mt-3 text-base-content/70">{message}</p>

                <div className="mt-6">
                    <Link to="/" className="btn btn-neutral">
                        Go to Home
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ErrorPage;