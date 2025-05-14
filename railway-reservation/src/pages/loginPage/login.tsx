import { useState } from "react";
import { loginUser } from "../../services/authService";
import InputField from "../../components/ui/inputField";
import {Button} from "../../components/ui/button";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
     
    const handleLogin = async () => {
        try{
        const token = await loginUser(email, password);
        localStorage.setItem('token', token);
        alert('Login successful!');
        }
        catch (error : any) {
            alert('Login failed: ' + error.message);
        }
        
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl mb-5">Login</h1>
        <div className="w-80">
          <InputField
            type="email"
            placeholder="Email"
            value="{email}"
            onChange={(e)=> setEmail(e.target.value)}
          ></InputField>
            <InputField
                type="password"
                placeholder="Password"
                value="{password}"
                onChange={(e)=> setPassword(e.target.value)}
            ></InputField>
            <Button>Login</Button>
        </div>
     </div>
    );
}