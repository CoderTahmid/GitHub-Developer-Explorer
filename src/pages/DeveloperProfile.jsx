import React, { useEffect, useState } from 'react';
import { FiArrowLeft, FiExternalLink, FiMapPin, FiUsers, FiGitBranch, FiStar, FiGitCommit } from 'react-icons/fi';
import { Link, useParams } from 'react-router-dom';

const DeveloperProfile = () => {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const controller = new AbortController();

        const fetchProfile = async () => {
            setLoading(true);
            setError('');

            try {
                const [profileResponse, reposResponse] = await Promise.all([
                    fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
                        headers: {
                            Accept: 'application/vnd.github+json',
                        },
                        signal: controller.signal,
                    }),
                    fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`, {
                        headers: {
                            Accept: 'application/vnd.github+json',
                        },
                        signal: controller.signal,
                    }),
                ]);

                if (!profileResponse.ok) {
                    let message = 'Failed to fetch developer profile.';

                    try {
                        const errorData = await profileResponse.json();
                        if (errorData?.message) {
                            message = errorData.message;
                        }
                    } catch {
                        // keep fallback message
                    }

                    throw new Error(message);
                }

                if (!reposResponse.ok) {
                    let message = 'Failed to fetch repositories.';

                    try {
                        const errorData = await reposResponse.json();
                        if (errorData?.message) {
                            message = errorData.message;
                        }
                    } catch {
                        // keep fallback message
                    }

                    throw new Error(message);
                }

                const profileData = await profileResponse.json();
                const repositoriesData = await reposResponse.json();

                setProfile(profileData);
                setRepositories(repositoriesData ?? []);
            } catch (fetchError) {
                if (fetchError.name === 'AbortError') {
                    return;
                }

                setError(fetchError.message || 'Something went wrong while loading the developer profile.');
                setProfile(null);
                setRepositories([]);
            } finally {
                setLoading(false);
            }
        };

        if (!username) {
            setError('Developer username is missing.');
            setLoading(false);
            return undefined;
        }

        fetchProfile();

        return () => controller.abort();
    }, [username]);

    const formattedCreatedAt = profile?.created_at
        ? new Date(profile.created_at).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : '-';

    return (
        <section className="min-h-screen bg-base-200 px-4 py-8 sm:py-10">
            <div className="mx-auto max-w-6xl space-y-6">
                <Link to="/search" className="btn btn-ghost btn-sm w-fit">
                    <FiArrowLeft />
                    Back to search
                </Link>

                {loading && (
                    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                        <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
                            <div className="skeleton h-24 w-24 rounded-full" />
                            <div className="mt-4 space-y-3">
                                <div className="skeleton h-5 w-48" />
                                <div className="skeleton h-4 w-full" />
                                <div className="skeleton h-4 w-5/6" />
                            </div>
                        </div>
                        <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
                            <div className="skeleton h-6 w-52" />
                            <div className="mt-4 space-y-3">
                                <div className="skeleton h-20 w-full" />
                                <div className="skeleton h-20 w-full" />
                            </div>
                        </div>
                    </div>
                )}

                {error && !loading && (
                    <div className="alert alert-error">
                        <span>{error}</span>
                    </div>
                )}

                {!loading && profile && (
                    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                        <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
                            <div className="flex flex-col items-center text-center">
                                <img
                                    src={profile.avatar_url}
                                    alt={`${profile.login} avatar`}
                                    className="h-24 w-24 rounded-full border border-base-300 object-cover"
                                />
                                <h1 className="mt-4 text-2xl font-bold">{profile.name || profile.login}</h1>
                                <p className="text-sm text-base-content/60">@{profile.login}</p>
                                <a
                                    href={profile.html_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-outline btn-sm mt-4"
                                >
                                    Open GitHub profile
                                    <FiExternalLink />
                                </a>
                            </div>

                            <div className="mt-6 space-y-3 text-sm">
                                <div className="flex items-center justify-between gap-3 rounded-lg bg-base-200 px-4 py-3">
                                    <span className="inline-flex items-center gap-2 text-base-content/70"><FiUsers /> Followers</span>
                                    <span className="font-semibold">{profile.followers}</span>
                                </div>
                                <div className="flex items-center justify-between gap-3 rounded-lg bg-base-200 px-4 py-3">
                                    <span className="inline-flex items-center gap-2 text-base-content/70"><FiUsers /> Following</span>
                                    <span className="font-semibold">{profile.following}</span>
                                </div>
                                <div className="flex items-center justify-between gap-3 rounded-lg bg-base-200 px-4 py-3">
                                    <span className="inline-flex items-center gap-2 text-base-content/70"><FiGitBranch /> Public repos</span>
                                    <span className="font-semibold">{profile.public_repos}</span>
                                </div>
                                <div className="flex items-center justify-between gap-3 rounded-lg bg-base-200 px-4 py-3">
                                    <span className="inline-flex items-center gap-2 text-base-content/70"><FiMapPin /> Location</span>
                                    <span className="font-semibold text-right">{profile.location || 'Not provided'}</span>
                                </div>
                                <div className="flex items-center justify-between gap-3 rounded-lg bg-base-200 px-4 py-3">
                                    <span className="inline-flex items-center gap-2 text-base-content/70"><FiGitBranch /> Company</span>
                                    <span className="font-semibold text-right">{profile.company || 'Not provided'}</span>
                                </div>
                                <div className="flex items-center justify-between gap-3 rounded-lg bg-base-200 px-4 py-3">
                                    <span className="inline-flex items-center gap-2 text-base-content/70"><FiGitCommit /> Created</span>
                                    <span className="font-semibold text-right">{formattedCreatedAt}</span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
                            <h2 className="text-2xl font-bold">Profile details</h2>
                            <div className="mt-4 rounded-xl bg-base-200 p-5">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-base-content/60">Bio</h3>
                                <p className="mt-2 leading-7 text-base-content/80">
                                    {profile.bio || 'No bio provided.'}
                                </p>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-xl font-bold">Repositories</h3>

                                {repositories.length === 0 ? (
                                    <div className="mt-4 rounded-xl border border-base-300 bg-base-200 p-5 text-base-content/70">
                                        No repositories available.
                                    </div>
                                ) : (
                                    <div className="mt-4 grid gap-4">
                                        {repositories.map((repository) => (
                                            <article key={repository.id} className="rounded-xl border border-base-300 bg-base-200 p-5 transition hover:shadow-sm">
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                    <div>
                                                        <h4 className="text-lg font-semibold">{repository.name}</h4>
                                                        <p className="mt-1 text-sm text-base-content/70">
                                                            {repository.description || 'No description provided.'}
                                                        </p>
                                                    </div>
                                                    <a
                                                        href={repository.html_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="btn btn-outline btn-sm w-fit"
                                                    >
                                                        Open repo
                                                        <FiExternalLink />
                                                    </a>
                                                </div>

                                                <div className="mt-4 flex flex-wrap gap-3 text-xs text-base-content/70">
                                                    <span className="badge badge-outline">Stars: {repository.stargazers_count}</span>
                                                    <span className="badge badge-outline">Forks: {repository.forks_count}</span>
                                                    <span className="badge badge-outline">Language: {repository.language || 'Unknown'}</span>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default DeveloperProfile;