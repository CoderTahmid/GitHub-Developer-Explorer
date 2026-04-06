import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiExternalLink } from 'react-icons/fi';

const DeveloperCard = ({ user }) => {
    const navigate = useNavigate();

    return (
        <article
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/developer/${user.login}`)}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    navigate(`/developer/${user.login}`);
                }
            }}
            className="card cursor-pointer border border-base-300 bg-base-100 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-base-content/20"
        >
            <div className="card-body gap-4">
                <div className="flex items-center gap-4">
                    <img
                        src={user.avatar_url}
                        alt={`${user.login} avatar`}
                        className="h-14 w-14 rounded-full border border-base-300 object-cover"
                    />
                    <div className="min-w-0">
                        <h2 className="card-title truncate text-lg">{user.login}</h2>
                        <p className="text-xs text-base-content/60">GitHub User</p>
                    </div>
                </div>

                <div className="card-actions mt-2 flex items-center justify-end gap-2">
                    <a
                        href={user.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline btn-sm"
                        onClick={(event) => event.stopPropagation()}
                    >
                        Profile link
                        <FiExternalLink />
                    </a>
                    <span className="btn btn-neutral btn-sm">
                        View profile
                        <FiArrowRight />
                    </span>
                </div>
            </div>
        </article>
    );
};

export default DeveloperCard;
