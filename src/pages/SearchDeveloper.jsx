import React, { useMemo } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useLoaderData, useNavigate, useNavigation } from 'react-router-dom';
import DeveloperCard from '../components/DeveloperCard';

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
    const navigate = useNavigate();
    const navigation = useNavigation();
    const { users, totalCount, keyword, currentPage, error } = useLoaderData();
    const hasKeyword = Boolean(keyword?.trim());

    const loading =
        navigation.state === 'loading' &&
        Boolean(navigation.location?.pathname?.startsWith('/search'));
    const returnToSearch = hasKeyword
        ? `/search?q=${encodeURIComponent(keyword)}&page=${currentPage}`
        : '/search';

    const totalPages = useMemo(() => Math.max(1, Math.ceil(totalCount / PER_PAGE)), [totalCount]);
    const pageNumbers = useMemo(() => getPageNumbers(currentPage, totalPages), [currentPage, totalPages]);

    const handleSearchSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const nextKeyword = String(formData.get('q') || '').trim();
        if (!nextKeyword) {
            return;
        }

        navigate(`/search?q=${encodeURIComponent(nextKeyword)}&page=1`);
    };

    const handlePageChange = (nextPage) => {
        navigate(`/search?q=${encodeURIComponent(keyword)}&page=${nextPage}`);
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
                                name="q"
                                type="text"
                                className="grow"
                                placeholder="Try: react, node, python"
                                defaultValue={keyword || ''}
                            />
                        </label>
                        <button type="submit" className="btn btn-neutral min-w-28">
                            Search
                        </button>
                    </form>

                    <div className="mt-3 text-sm text-base-content/70">
                        {loading
                            ? 'Searching developers...'
                            : hasKeyword
                                ? `Showing results for "${keyword}"`
                                : 'Enter a keyword and click Search to find developers.'}
                    </div>
                </div>

                {error && (
                    <div className="alert alert-error">
                        <span>{error}</span>
                    </div>
                )}

                {!error && !loading && hasKeyword && users.length === 0 && (
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
                            <DeveloperCard
                                key={user.id}
                                user={user}
                                returnTo={returnToSearch}
                            />
                        ))}
                </div>

                {!error && totalPages > 1 && (
                    <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl border border-base-300 bg-base-100 p-4">
                        <button
                            className="btn btn-sm"
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1 || loading}
                        >
                            Previous
                        </button>

                        {pageNumbers.map((pageNumber) => (
                            <button
                                key={pageNumber}
                                className={`btn btn-sm ${pageNumber === currentPage ? 'btn-neutral' : ''}`}
                                onClick={() => handlePageChange(pageNumber)}
                                disabled={loading}
                            >
                                {pageNumber}
                            </button>
                        ))}

                        <button
                            className="btn btn-sm"
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
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