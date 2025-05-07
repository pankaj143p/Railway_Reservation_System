import { useState } from "react";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

     

    return (
        <div>
            <h1>Login Page</h1>
            <p>Please enter your credentials to log in.</p>
        </div>
    );
}