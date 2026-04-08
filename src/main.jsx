import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import MainLayout from './pages/MainLayout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import SearchDeveloper from './pages/SearchDeveloper.jsx';
import DeveloperProfile from './pages/DeveloperProfile.jsx';
import ShortlistedCandidates from './pages/ShortlistedCandidates.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import { ProtectedRoute, PublicOnlyRoute } from './routes/RouteGuards.jsx';

const SEARCH_PER_PAGE = 12;
const SEARCHED_USERS_STORAGE_KEY = 'gde_searched_users';

const updateSearchedUsersStorage = (users) => {
	try {
		const raw = localStorage.getItem(SEARCHED_USERS_STORAGE_KEY);
		const existing = raw ? JSON.parse(raw) : [];
		const safeExisting = Array.isArray(existing) ? existing : [];

		const lookup = new Map(safeExisting.map((user) => [user.login, user]));
		users.forEach((user) => {
			lookup.set(user.login, {
				login: user.login,
				avatar_url: user.avatar_url,
				html_url: user.html_url,
			});
		});

		localStorage.setItem(SEARCHED_USERS_STORAGE_KEY, JSON.stringify(Array.from(lookup.values())));
	} catch {
		// Ignore malformed storage and skip dashboard tracking update.
	}
};

const getGithubErrorMessage = async (response, fallbackMessage) => {
	try {
		const errorData = await response.json();
		if (errorData?.message) {
			return errorData.message;
		}
	} catch {
		// Keep fallback message.
	}

	return fallbackMessage;
};

const searchDevelopersLoader = async ({ request }) => {
	const url = new URL(request.url);
	const keyword = (url.searchParams.get('q') ?? 'frontend').trim();
	const pageParam = Number.parseInt(url.searchParams.get('page') ?? '1', 10);
	const currentPage = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

	if (!keyword) {
		return {
			users: [],
			totalCount: 0,
			keyword: '',
			currentPage,
			error: 'Please enter a keyword to search developers.',
		};
	}

	try {
		const response = await fetch(
			`https://api.github.com/search/users?q=${encodeURIComponent(keyword)}&per_page=${SEARCH_PER_PAGE}&page=${currentPage}`,
			{
				headers: {
					Accept: 'application/vnd.github+json',
				},
			},
		);

		if (!response.ok) {
			const message = await getGithubErrorMessage(response, 'Failed to fetch developers from GitHub.');
			return {
				users: [],
				totalCount: 0,
				keyword,
				currentPage,
				error: message,
			};
		}

		const data = await response.json();
		const users = data.items ?? [];
		updateSearchedUsersStorage(users);

		return {
			users,
			totalCount: Math.min(data.total_count ?? 0, 1000),
			keyword,
			currentPage,
			error: '',
		};
	} catch {
		return {
			users: [],
			totalCount: 0,
			keyword,
			currentPage,
			error: 'Something went wrong while searching developers.',
		};
	}
};

const developerProfileLoader = async ({ params }) => {
	const username = params?.username?.trim();

	if (!username) {
		return {
			profile: null,
			repositories: [],
			error: 'Developer username is missing.',
		};
	}

	try {
		const [profileResponse, reposResponse] = await Promise.all([
			fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
				headers: {
					Accept: 'application/vnd.github+json',
				},
			}),
			fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`, {
				headers: {
					Accept: 'application/vnd.github+json',
				},
			}),
		]);

		if (!profileResponse.ok) {
			const message = await getGithubErrorMessage(profileResponse, 'Failed to fetch developer profile.');
			return {
				profile: null,
				repositories: [],
				error: message,
			};
		}

		if (!reposResponse.ok) {
			const message = await getGithubErrorMessage(reposResponse, 'Failed to fetch repositories.');
			return {
				profile: null,
				repositories: [],
				error: message,
			};
		}

		const [profile, repositories] = await Promise.all([
			profileResponse.json(),
			reposResponse.json(),
		]);

		return {
			profile,
			repositories: Array.isArray(repositories) ? repositories : [],
			error: '',
		};
	} catch {
		return {
			profile: null,
			repositories: [],
			error: 'Something went wrong while loading the developer profile.',
		};
	}
};

const router = createBrowserRouter([
	{
		path: "/",
		element: <MainLayout></MainLayout>,
		errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: "/",
				element: (
					<PublicOnlyRoute>
						<Login></Login>
					</PublicOnlyRoute>
				)
			},
			{
				path: "/dashboard",
				element: (
					<ProtectedRoute>
						<Dashboard></Dashboard>
					</ProtectedRoute>
				)
			},
			{
				path: "/search",
				loader: searchDevelopersLoader,
				element: (
					<ProtectedRoute>
						<SearchDeveloper></SearchDeveloper>
					</ProtectedRoute>
				)
			},
			{
				path: "/developer/:username",
				loader: developerProfileLoader,
				element: (
					<ProtectedRoute>
						<DeveloperProfile></DeveloperProfile>
					</ProtectedRoute>
				)
			},
			{
				path: "/shortlisted",
				element: (
					<ProtectedRoute>
						<ShortlistedCandidates></ShortlistedCandidates>
					</ProtectedRoute>
				)
			},
    ]
	},
]);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
