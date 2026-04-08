import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as setLoginSession } from '../utils/auth';

const HARDCODED_EMAIL = 'admin@gmail.com';
const HARDCODED_PASSWORD = '12345';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const enteredEmail = email.trim();

		if (enteredEmail === HARDCODED_EMAIL && password === HARDCODED_PASSWORD) {
            setLoginSession();
            setError('');
            navigate('/dashboard', { replace: true });
            return;
        }

        setError('Invalid email or password.');
    };

    return (
		<div className="hero bg-base-200 min-h-screen">
			<div className="hero-content flex-col lg:flex-row-reverse">
				<div className="text-center lg:text-left">
					<h1 className="text-5xl font-bold">Login now!</h1>
					<p className="py-6">Sign in to access your recruiter dashboard for tracking and exploring GitHub developers.</p>
				</div>
				<div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
					<div className="card-body">
						<form className="fieldset" onSubmit={handleSubmit}>
							<label className="label">Email</label>
							<input
								type="email"
								className="input"
								placeholder="Email"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								required
							/>
							<label className="label">Password</label>
							<input
								type="password"
								className="input"
								placeholder="Password"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								required
							/>
							<div>
								<a className="link link-hover">Forgot password?</a>
							</div>
							{error && <p className="mt-2 text-sm text-error">{error}</p>}
							<button type="submit" className="btn btn-neutral mt-4">Login</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;