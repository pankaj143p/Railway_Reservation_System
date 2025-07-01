import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../../services/authService';
import { Alert } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const SignupForm = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (phone: string) =>
    /^[0-9]{10,15}$/.test(phone);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!fullName || !email || !phone || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Invalid email format.');
      return;
    }
    if (!validatePhone(phone)) {
      setError('Invalid phone number.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

try {
  await registerUser(fullName, email, phone, password);
  setSuccess(true);
  setTimeout(() => {
    navigate('/login');
  }, 1200);
} catch (err: any) {

  if (
    err.message &&
    err.message === 'User with this email already exists!'
  ) {
    setError('You have already registered with this email.');
  } else {
    setError('Signup failed. Please try again.');
    console.log('Signup error:', err);
  }
}
}

  return (
    <StyledWrapper>
      <div className="container">
        <div className="left">
          <form className="form" onSubmit={handleSignup}>
            {success && (
              <Alert
                iconMapping={{
                  success: <CheckCircleOutlineIcon fontSize="inherit" />,
                }}
                severity="success"
                sx={{ mb: 2 }}
              >
                Signup successful! Redirecting to login...
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <div className="input-block">
              <input className="input" type="text" id="fullname" value={fullName} onChange={e => setFullName(e.target.value)} required placeholder=" " />
              <label htmlFor="fullname">Full Name</label>
            </div>
            <div className="input-block">
              <input className="input" type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder=" " />
              <label htmlFor="email">Email</label>
            </div>
            <div className="input-block">
              <input className="input" type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} required placeholder=" " />
              <label htmlFor="phone">Phone</label>
            </div>
            <div className="input-block">
              <input className="input" type="password" id="pass" value={password} onChange={e => setPassword(e.target.value)} required placeholder=" " />
              <label htmlFor="pass">Password</label>
            </div>
            <div className="input-block">
              <input className="input" type="password" id="confirmPass" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder=" " />
              <label htmlFor="confirmPass">Confirm Password</label>
            </div>
            <div className="input-block">
              <span className="forgot">
                <a href="/login">Already have an account?  Login</a>
              </span>
              <button type="submit">Sign Up</button>
            </div>
          </form>
        </div>
        <div className="right">
          <div className="img">
            {/* ...SVG code unchanged... */}
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 731.67004 550.61784">
              {/* ...SVG paths... */}
            </svg>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .container {
    padding-top: 35px;
    display: flex;
    flex-direction: row;
    width: 520px;
    height: 600px;
    max-width: 99vw;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    background-color: #ffffff25;
    border-radius: 15px;
    box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.03);
    border: 0.1px solid rgba(128, 128, 128, 0.178);
    margin: 40px auto;
    transition: all 0.3s;
  }
  .left {
    width: 66%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,0.7);
    z-index: 1;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    width: 100%;
    left: 0;
    backdrop-filter: blur(20px);
    position: relative;
    padding: 20px 0;
  }
  .form::before {
    position: absolute;
    content: "";
    width: 40%;
    height: 40%;
    right: 1%;
    z-index: -1;
    background: radial-gradient(
      circle,
      rgb(194, 13, 170) 20%,
      rgb(26, 186, 235) 60%,
      rgb(26, 186, 235) 100%
    );
    filter: blur(70px);
    border-radius: 50%;
  }
  .right {
    width: 34%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,0.3);
  }
  .img {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .container::after {
    position: absolute;
    content: "";
    width: 80%;
    height: 80%;
    right: -40%;
    background: rgb(157, 173, 203);
    background: radial-gradient(
      circle,
      rgba(157, 173, 203, 1) 61%,
      rgba(99, 122, 159, 1) 100%
    );
    border-radius: 50%;
    z-index: -1;
  }
  .input,
  button {
    background: rgba(253, 253, 253, 0.7);
    outline: none;
    border: 1px solid #bfc9d8;
    border-radius: 0.5rem;
    padding: 10px;
    margin: 10px auto;
    width: 80%;
    display: block;
    color: #425981;
    font-weight: 500;
    font-size: 1.1em;
    transition: border 0.2s;
  }
  .input:focus {
    border: 1.5px solid #6c63ff;
  }
  .input-block {
    position: relative;
    margin-bottom: 20px;
  }
  label {
    position: absolute;
    left: 15%;
    top: 37%;
    pointer-events: none;
    color: gray;
    background: transparent;
    transition: all 0.4s;
    font-size: 1em;
  }
  .input:focus + label,
  .input:valid + label {
    transform: translateY(-120%) scale(0.9);
    color: #6c63ff;
    background: #fff;
    padding: 0 5px;
  }
  .forgot {
    display: block;
    margin: 5px 0 10px 0;
    margin-left: 35px;
    color: #5e7eb6;
    font-size: 0.9em;
  }
  button {
    background-color: #5e7eb6;
    color: white;
    font-size: medium;
    box-shadow: 2px 4px 8px rgba(70, 70, 70, 0.178);
    cursor: pointer;
    margin-top: 10px;
    transition: background 0.2s;
  }
  button:hover {
    background-color: #6c63ff;
  }
  a {
    color: #5e7eb6;
    text-decoration: none;
  }
  .input {
    box-shadow: inset 4px 4px 4px rgba(165, 163, 163, 0.15),
      4px 4px 4px rgba(218, 218, 218, 0.13);
  }
  @media (max-width: 900px) {
    .container {
      width: 95vw;
      height: auto;
      flex-direction: column;
      min-height: 500px;
    }
    .left, .right {
      width: 100%;
      height: 50%;
      min-height: 250px;
    }
    .img {
      height: 200px;
    }
  }
  @media (max-width: 600px) {
    .container {
      width: 99vw;
      min-width: unset;
      height: auto;
      flex-direction: column;
      border-radius: 10px;
      box-shadow: 0px 0px 10px rgba(0,0,0,0.08);
    }
    .left, .right {
      width: 100%;
      min-height: 180px;
      height: auto;
    }
    .form {
      padding: 10px 0;
    }
    .img {
      height: 120px;
    }
    .input, button {
      width: 95%;
      font-size: 1em;
    }
    label {
      left: 8%;
      font-size: 0.95em;
    }
  }
`;

export default SignupForm;