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

### 1. Clone and install

```bash
git clone <your-repo-url>
cd GitHub-Developer-Explorer
npm install
```

### 2. Configure environment variables

Create or update `.env.local` in the project root:

```env
VITE_AUTH_EMAIL=tahmid.ibne@gmail.com
VITE_AUTH_PASSWORD=12345
```

These are used for the mock login system.

### 3. Start development server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

### 5. Preview production build

```bash
npm run preview
```

## Available Scripts

- `npm run dev` -> Start Vite development server
- `npm run build` -> Build production assets
- `npm run preview` -> Preview production build
- `npm run lint` -> Run ESLint

## Folder Structure Explanation

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

### `src/components`

- Reusable UI elements.
- `DeveloperCard.jsx`: Card for each searched user (internal profile navigation + external GitHub link).
- `Navbar.jsx`, `Footer.jsx`: Layout navigation and footer.

### `src/pages`

- Route-level screens.
- `Login.jsx`: Mock authentication form.
- `Dashboard.jsx`: Displays key metrics and chart.
- `SearchDeveloper.jsx`: Search UI and paginated user listing.
- `DeveloperProfile.jsx`: User details, repository list, shortlist action.
- `ShortlistedCandidates.jsx`: View/remove shortlisted users.
- `ErrorPage.jsx`: Invalid route and router error fallback UI.
- `MainLayout.jsx`: Shared shell (navbar, outlet, footer, toast container).

### `src/routes`

- Route protection logic.
- `RouteGuards.jsx`:
	- `ProtectedRoute` for authenticated-only pages.
	- `PublicOnlyRoute` for login-only access when logged out.

### `src/utils`

- `auth.js` stores mock authentication helper functions and localStorage session key handling.

### `src/main.jsx`

- App bootstrap and router configuration.
- Defines route loaders and all GitHub API calling logic.

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

## Feature Summary

- Mock login with env credentials
- Protected routes and public-only login route
- GitHub developer search with pagination
- Developer profile details and repository listing
- Candidate shortlist with persistence and remove confirmations
- Toast notifications for shortlist actions
- Dashboard metrics + bar chart visualization
- Custom route error page

## Notes

- This project uses mock authentication for assignment/demo purposes (not production security).
- GitHub unauthenticated requests are rate-limited; heavy usage may temporarily return API limit errors.
