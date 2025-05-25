import { useState } from "react";
import { loginUser } from "../../services/authService";
import InputField from "../../components/ui/inputField";
import {Button} from "../../components/ui/button";
import {usersData} from "../../services/userService";
import loginImg from "../../../public/logoLogin.jpg";
import "./login.css";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

   const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    
    setPassword(e.target.value);
  };
    const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

    const handleLogin = async () => {
        try{
        const token = await loginUser(email, password);
        localStorage.setItem('token', token);
        alert('Login successful!');
        navigate('/trainList');  
        const users = await usersData();
        console.log("users ", users.data);

        }
        catch (error : any) {
            alert('Login failed: ' + error.message);
        } 
    }

    return (
      <div className="flex flex-col md:flex-row items-center justify-center  gap-2 bg-slate-500">
       <div>
        <img src={loginImg} alt="" className="w-[80%] h-[100vh] "/>
       </div>

        <div className="flex flex-col items-center justify-center pr-44 ">
        <h1 className="text-2xl mb-5">Login</h1>
        <div className="w-80">
          <InputField
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmail}
          ></InputField>

            <div className="flex items-center justify-between">
              <InputField
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={handlePassword}
              />
              <span
                className="ml-[-400px] mr-4 mb-2 cursor-pointer"
                onClick={handlePasswordVisibility}
              >
                {showPassword ? (
                  <MdOutlineVisibility />
                ) : (
                  <MdOutlineVisibilityOff />
                )}
              </span>
            </div>
        </div>
            <Button onClick={handleLogin}>Login</Button>
        </div>
      </div>
    );
}

export default Login;
