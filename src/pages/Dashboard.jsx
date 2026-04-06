import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const SHORTLIST_STORAGE_KEY = 'gde_shortlisted_candidates';
const SEARCHED_USERS_STORAGE_KEY = 'gde_searched_users';

const parseStorageArray = (value) => {
    try {
        const parsed = JSON.parse(value ?? '[]');
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const Dashboard = () => {
    const [totalSearchedUsers, setTotalSearchedUsers] = useState(0);
    const [totalShortlistedCandidates, setTotalShortlistedCandidates] = useState(0);
    const [totalRepositories, setTotalRepositories] = useState(0);

    useEffect(() => {
        const updateStats = () => {
            const searchedUsers = parseStorageArray(localStorage.getItem(SEARCHED_USERS_STORAGE_KEY));
            const shortlisted = parseStorageArray(localStorage.getItem(SHORTLIST_STORAGE_KEY));

            setTotalSearchedUsers(searchedUsers.length);
            setTotalShortlistedCandidates(shortlisted.length);
            setTotalRepositories(
                shortlisted.reduce((sum, candidate) => sum + (Number(candidate.public_repos) || 0), 0),
            );
        };

        updateStats();

        const handleStorage = () => {
            updateStats();
        };

        window.addEventListener('storage', handleStorage);
        window.addEventListener('focus', updateStats);

        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('focus', updateStats);
        };
    }, []);

    const chartData = useMemo(
        () => [
            { name: 'Searched', value: totalSearchedUsers },
            { name: 'Shortlisted', value: totalShortlistedCandidates },
            { name: 'Repositories', value: totalRepositories },
        ],
        [totalRepositories, totalSearchedUsers, totalShortlistedCandidates],
    );

    return (
        <section className="min-h-screen bg-base-200 px-4 py-10">
            <div className="mx-auto max-w-6xl space-y-6">
                <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
                    <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
                    <p className="mt-2 text-base-content/70">
                        Track search activity, shortlisted candidates, and repository volume.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <article className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
                        <p className="text-sm text-base-content/60">Total searched users</p>
                        <p className="mt-2 text-4xl font-bold">{totalSearchedUsers}</p>
                    </article>

                    <article className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
                        <p className="text-sm text-base-content/60">Total shortlisted candidates</p>
                        <p className="mt-2 text-4xl font-bold">{totalShortlistedCandidates}</p>
                    </article>

                    <article className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
                        <p className="text-sm text-base-content/60">Total repositories (aggregated)</p>
                        <p className="mt-2 text-4xl font-bold">{totalRepositories}</p>
                    </article>
                </div>

                <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
                    <h2 className="text-xl font-bold">Overview Graph</h2>
                    <div className="mt-4 h-80 w-full">
                        <ResponsiveContainer>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#111111" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Link to="/search" className="btn btn-neutral">
                        Go to Developer Search
                    </Link>
                    <Link to="/shortlisted" className="btn btn-outline">
                        View Shortlisted Candidates
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Dashboard;