import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

const RegisterPage = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await fetch('https://cp.dhytv.com/v1/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      if (response.ok) {
        console.log('Registration successful with data:', data);
        // After successful registration, navigate to login with the form data
        navigate('/login', { state: { email: data.email, password: data.password } });
      } else {
        console.error('Registration failed:', response.statusText);
        // Handle registration failure (e.g., show an error message)
      }
    } catch (error) {
      console.error('An error occurred during registration:', error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div className="back-ground">
      <div className="register-page">
        <h1 className="artistic-word">Register</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* <div>
            <label>Username:</label>
            <input
              type="text"
              {...register('username', { required: true })}
            />
          </div> */}
          <div>
            <label>Email:</label>
            <input
              type="email"
              {...register('email', { required: true })}
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              {...register('password', { required: true })}
            />
          </div>
          <button type="submit" className="nav-button">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
