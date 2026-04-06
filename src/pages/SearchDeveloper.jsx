import React, { useEffect, useMemo, useState } from 'react';
import { FiExternalLink, FiSearch } from 'react-icons/fi';

const PER_PAGE = 12;

const getPageNumbers = (currentPage, totalPages) => {
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
        return [1, 2, 3, 4, 5];
    }

    if (currentPage >= totalPages - 2) {
        return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
};

const SearchDeveloper = () => {
    const [inputValue, setInputValue] = useState('frontend');
    const [keyword, setKeyword] = useState('frontend');
    const [users, setUsers] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const controller = new AbortController();

        const fetchUsers = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await fetch(
                    `https://api.github.com/search/users?q=${encodeURIComponent(keyword)}&per_page=${PER_PAGE}&page=${currentPage}`,
                    {
                        headers: {
                            Accept: 'application/vnd.github+json',
                        },
                        signal: controller.signal,
                    },
                );

                if (!response.ok) {
                    let message = 'Failed to fetch developers from GitHub.';

                    try {
                        const errorData = await response.json();
                        if (errorData?.message) {
                            message = errorData.message;
                        }
                    } catch {
                        // Keep fallback message when response has no JSON body.
                    }

                    throw new Error(message);
                }

                const data = await response.json();
                setUsers(data.items ?? []);
                setTotalCount(Math.min(data.total_count ?? 0, 1000));
            } catch (fetchError) {
                if (fetchError.name === 'AbortError') {
                    return;
                }

                setUsers([]);
                setTotalCount(0);
                setError(fetchError.message || 'Something went wrong while searching developers.');
            } finally {
                setLoading(false);
            }
        };

        if (!keyword.trim()) {
            setUsers([]);
            setTotalCount(0);
            setError('Please enter a keyword to search developers.');
            return () => {
                controller.abort();
            };
        }

        fetchUsers();

        return () => {
            controller.abort();
        };
    }, [keyword, currentPage]);

    const totalPages = useMemo(() => Math.max(1, Math.ceil(totalCount / PER_PAGE)), [totalCount]);
    const pageNumbers = useMemo(() => getPageNumbers(currentPage, totalPages), [currentPage, totalPages]);

    const handleSearchSubmit = (event) => {
        event.preventDefault();

        const nextKeyword = inputValue.trim();
        if (!nextKeyword) {
            setError('Please enter a keyword to search developers.');
            return;
        }

        setCurrentPage(1);
        setKeyword(nextKeyword);
    };

    return (
        <section className="min-h-screen bg-base-200 px-4 py-8 sm:py-10">
            <div className="mx-auto max-w-6xl space-y-6">
                <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
                    <h1 className="text-3xl font-bold">Developer Search</h1>
                    <p className="mt-2 text-base-content/70">
                        Search GitHub developers by keyword and quickly open their public profile.
                    </p>

                    <form onSubmit={handleSearchSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <label className="input input-bordered flex items-center gap-2 sm:flex-1">
                            <FiSearch className="text-base-content/60" />
                            <input
                                type="text"
                                className="grow"
                                placeholder="Try: react, node, python"
                                value={inputValue}
                                onChange={(event) => setInputValue(event.target.value)}
                            />
                        </label>
                        <button type="submit" className="btn btn-neutral min-w-28">
                            Search
                        </button>
                    </form>

                    <div className="mt-3 text-sm text-base-content/70">
                        {loading ? 'Searching developers...' : `Showing results for "${keyword}"`}
                    </div>
                </div>

                {error && (
                    <div className="alert alert-error">
                        <span>{error}</span>
                    </div>
                )}

                {!error && !loading && users.length === 0 && (
                    <div className="rounded-xl border border-base-300 bg-base-100 p-6 text-base-content/70">
                        No developers found for this keyword.
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {loading &&
                        Array.from({ length: PER_PAGE }).map((_, index) => (
                            <div key={index} className="card border border-base-300 bg-base-100 shadow-sm">
                                <div className="card-body gap-4">
                                    <div className="skeleton h-14 w-14 rounded-full" />
                                    <div className="space-y-2">
                                        <div className="skeleton h-4 w-2/3" />
                                        <div className="skeleton h-3 w-1/2" />
                                    </div>
                                </div>
                            </div>
                        ))}

                    {!loading &&
                        users.map((user) => (
                            <article key={user.id} className="card border border-base-300 bg-base-100 shadow-sm transition hover:shadow-md">
                                <div className="card-body">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={user.avatar_url}
                                            alt={`${user.login} avatar`}
                                            className="h-14 w-14 rounded-full border border-base-300 object-cover"
                                        />
                                        <div>
                                            <h2 className="card-title text-lg">{user.login}</h2>
                                            <p className="text-xs text-base-content/60">GitHub User</p>
                                        </div>
                                    </div>
                                    <div className="card-actions mt-4 justify-end">
                                        <a
                                            href={user.html_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn btn-outline btn-sm"
                                        >
                                            Profile
                                            <FiExternalLink />
                                        </a>
                                    </div>
                                </div>
                            </article>
                        ))}
                </div>

                {!error && totalPages > 1 && (
                    <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl border border-base-300 bg-base-100 p-4">
                        <button
                            className="btn btn-sm"
                            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                            disabled={currentPage === 1 || loading}
                        >
                            Previous
                        </button>

                        {pageNumbers.map((pageNumber) => (
                            <button
                                key={pageNumber}
                                className={`btn btn-sm ${pageNumber === currentPage ? 'btn-neutral' : ''}`}
                                onClick={() => setCurrentPage(pageNumber)}
                                disabled={loading}
                            >
                                {pageNumber}
                            </button>
                        ))}

                        <button
                            className="btn btn-sm"
                            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages || loading}
                        >
                            Next
                        </button>

                        <span className="ml-1 text-sm text-base-content/70">
                            Page {currentPage} of {totalPages}
                        </span>
                    </div>
                )}
            </div>
        </section>
    );
};

export default SearchDeveloper;