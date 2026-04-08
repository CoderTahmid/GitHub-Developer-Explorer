# GitHub Developer Explorer

A recruiter-focused web app to search GitHub developers, inspect profiles and repositories, shortlist candidates, and monitor activity from a dashboard.

## Tech Stack

- React 19 + Vite
- React Router (with route loaders)
- Tailwind CSS + DaisyUI
- React Icons
- React Toastify
- SweetAlert2
- Recharts

## How To Run The Project



```bash
git clone https://github.com/CoderTahmid/GitHub-Developer-Explorer
cd GitHub-Developer-Explorer
npm install
npm run dev
```

## Folder Structure 

```text
src/
	components/
		DeveloperCard.jsx
		Footer.jsx
		Navbar.jsx
	pages/
		Dashboard.jsx
		DeveloperProfile.jsx
		ErrorPage.jsx
		Login.jsx
		MainLayout.jsx
		SearchDeveloper.jsx
		ShortlistedCandidates.jsx
	routes/
		RouteGuards.jsx
	utils/
		auth.js
	main.jsx
```

## State Management Explanation

This project uses lightweight, built-in state management with React hooks + React Router + localStorage.

### 1. Route loader state (server data)

- API responses are fetched in loaders in `src/main.jsx`.
- UI pages read this data using `useLoaderData`.
- This keeps API logic outside UI components and matches the separation requirement.

### 2. Component local state (UI behavior)

Pages use `useState`/`useMemo` for presentational interactions, such as:

- Loading skeleton visibility using `useNavigation` status
- Pagination button rendering
- Repository "See more" display count
- Toggle UI states (like shortlist button text/state)

### 3. Persistent client state (localStorage)

- Auth session: `gde_auth_session`
- Shortlisted candidates: `gde_shortlisted_candidates`
- Searched users history: `gde_searched_users`

These values survive refresh and are used by dashboard metrics and route guards.

## How API Integration Works

GitHub API integration is implemented through React Router loaders in `src/main.jsx`.

### Search users endpoint

- Loader: `searchDevelopersLoader`
- Route: `/search`
- API:

```text
https://api.github.com/search/users?q={keyword}&per_page=12&page={page}
```

- Returns to UI:
	- `users`
	- `totalCount`
	- `keyword`
	- `currentPage`
	- `error`

### Developer profile + repositories endpoints

- Loader: `developerProfileLoader`
- Route: `/developer/:username`
- APIs:

```text
https://api.github.com/users/{username}
https://api.github.com/users/{username}/repos?per_page=100&sort=updated
```

- Returns to UI:
	- `profile`
	- `repositories`
	- `error`

### Error handling strategy

- If API status is not OK, loader extracts GitHub error message when available.
- Loaders return safe fallback objects with `error` strings so pages can render clear alerts.
- Router-level error UI is handled by `errorElement` using `ErrorPage.jsx`.

## Live side link

https://sunny-hotteok-9d438d.netlify.app/
