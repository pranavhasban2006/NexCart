import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/slices/authSlice';
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, loading, error } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(login({email,password}));
    };

    return (
        <div className="flex bg-white flex-col md:flex-row">
            {/* Left side: Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 border-t md:border-none border-gray-200">
                <div className="w-full max-w-md bg-white border border-gray-100 rounded-lg p-8 shadow-sm">
                    <div className="flex justify-center mb-6">
                        <h2 className="text-xl font-bold">NexCart</h2>
                    </div>
                    <h1 className="text-3xl font-bold mb-2 text-center">Hey There! 👋</h1>
                    <p className="text-gray-500 mb-8 text-center text-sm">
                        Enter your username and password to login.
                    </p>

                    <form onSubmit={onSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-semibold mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-800 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                        <p className="mt-4 text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-blue-600 hover:underline font-semibold">
                                Register
                            </Link>
                        </p>
                    </form>
                </div>
            </div>

            {/* Right side: Image */}
            <div className="hidden md:block w-1/2">
                <div className="h-full w-full">
                    <img
                        src="https://images.unsplash.com/photo-1549576490-b0b4831ef60a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                        alt="Login"
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;
