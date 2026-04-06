import React from 'react';

const Dashboard = () => {
    return (
        <section className="min-h-screen bg-base-200 px-4 py-10">
            <div className="mx-auto max-w-5xl rounded-xl border border-base-300 bg-base-100 p-6 shadow">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="mt-3 text-base-content/70">
                    Welcome back. This is your internal recruiter dashboard for exploring
                    GitHub developers.
                </p>
            </div>
        </section>
    );
};

export default Dashboard;