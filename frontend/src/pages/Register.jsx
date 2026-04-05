import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import {register} from '../redux/slices/authSlice';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import { toast } from 'sonner';

const Register = () => {
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [name,setName]=useState('');
  const [confirmPassword,setConfirmPassword]=useState('');
  const { error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if(password !== confirmPassword){
      toast.error("Passwords do not match");
      return;
    }
    //register user 
    dispatch(register({name, email, password})).then((res) => {
      if(res.payload && res.payload._id) {
        navigate("/");
      }
    });
  }
  return (
    <div className="flex bg-white">
      {/* Left side: Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-md bg-white border border-gray-100 rounded-lg p-8 shadow-sm">
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-bold">NexCart</h2> {/* Replaced Rabbit with NexCart */}
          </div>
          <h1 className="text-3xl font-bold mb-2 text-center">Welcome! 👋</h1>
          <p className="text-gray-500 mb-8 text-center text-sm">
            Please fill in your details to create an account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold mb-1">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                required
                value={name}
                onChange={(e)=>setName(e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                required
                value={email}
                onChange={(e)=>setEmail(e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                required
                value={password}
                onChange={(e)=>setPassword(e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                required
                value={confirmPassword}
                onChange={(e)=>setConfirmPassword(e.target.value)} 
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Sign Up
            </button>
            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline font-semibold">
                Login
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
            alt="Register"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
