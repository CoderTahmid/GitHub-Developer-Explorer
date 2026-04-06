import React, { useEffect, useState } from 'react';
import { FiExternalLink, FiTrash2, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const SHORTLIST_STORAGE_KEY = 'gde_shortlisted_candidates';

const getShortlistedCandidates = () => {
    try {
        const raw = localStorage.getItem(SHORTLIST_STORAGE_KEY);
        if (!raw) {
            return [];
        }

        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const saveShortlistedCandidates = (candidates) => {
    localStorage.setItem(SHORTLIST_STORAGE_KEY, JSON.stringify(candidates));
};

const removeCandidateFromShortlist = (username) => {
    const existing = getShortlistedCandidates();
    const next = existing.filter((candidate) => candidate.login !== username);
    saveShortlistedCandidates(next);
    return next;
};

const ShortlistedCandidates = () => {
    const [candidates, setCandidates] = useState(() => getShortlistedCandidates());

    useEffect(() => {
        const handleStorage = () => {
            setCandidates(getShortlistedCandidates());
        };

        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const handleRemove = async (username) => {
        const result = await Swal.fire({
            title: 'Remove candidate?',
            text: `Do you want to remove @${username} from shortlist?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, remove',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#111111',
            cancelButtonColor: '#6b7280',
        });

        if (!result.isConfirmed) {
            return;
        }

        const next = removeCandidateFromShortlist(username);
        setCandidates(next);
        toast.info(`${username} removed from shortlist.`);
    };

    return (
        <section className="min-h-screen bg-base-200 px-4 py-8 sm:py-10">
            <div className="mx-auto max-w-6xl space-y-6">
                <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
                    <h1 className="text-3xl font-bold">Shortlisted Candidates</h1>
                    <p className="mt-2 text-base-content/70">
                        Keep track of selected developers for recruiter review.
                    </p>
                </div>

                {candidates.length === 0 ? (
                    <div className="rounded-xl border border-base-300 bg-base-100 p-6 text-base-content/70">
                        No shortlisted candidates yet. Go to developer profile and click "Shortlist this user".
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {candidates.map((candidate) => (
                            <article key={candidate.login} className="card border border-base-300 bg-base-100 shadow-sm">
                                <div className="card-body">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={candidate.avatar_url}
                                            alt={`${candidate.login} avatar`}
                                            className="h-14 w-14 rounded-full border border-base-300 object-cover"
                                        />
                                        <div className="min-w-0">
                                            <h2 className="card-title truncate text-lg">{candidate.name || candidate.login}</h2>
                                            <p className="text-sm text-base-content/60">@{candidate.login}</p>
                                        </div>
                                    </div>

                                    <p className="mt-2 line-clamp-2 text-sm text-base-content/70">
                                        {candidate.bio || 'No bio provided.'}
                                    </p>

                                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-base-content/70">
                                        <span className="badge badge-outline">Followers: {candidate.followers ?? 0}</span>
                                        <span className="badge badge-outline">Following: {candidate.following ?? 0}</span>
                                        <span className="badge badge-outline">Repos: {candidate.public_repos ?? 0}</span>
                                    </div>

                                    <div className="card-actions mt-4 justify-between">
                                        <div className="flex gap-2">
                                            <Link to={`/developer/${candidate.login}`} className="btn btn-outline btn-sm">
                                                <FiUser />
                                                Open profile
                                            </Link>
                                            <a
                                                href={candidate.html_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="btn btn-outline btn-sm"
                                            >
                                                <FiExternalLink />
                                                GitHub
                                            </a>
                                        </div>

                                        <button
                                            onClick={() => handleRemove(candidate.login)}
                                            className="btn btn-error btn-outline btn-sm"
                                        >
                                            <FiTrash2 />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ShortlistedCandidates;