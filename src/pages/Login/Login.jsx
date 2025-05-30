import React, { useState } from 'react'
import './Login.css'
import assets from '../../assets/assets'
import { signup, login , resetPass} from '../../config/firebase'


const Login = () => {
    const [currentState, setCurrentState] = useState("Sign Up")
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const onSubmitHandler = (event) => {
        event.preventDefault();
        if (currentState === "Sign Up") {
            signup(userName, email, password);
        } else {
            login(email, password);
        }
    }
    
    return (
        <div className='login'>
            <img src={assets.logo_big} alt="" className="logo" />
            <form onSubmit={onSubmitHandler} className="login-form">
                <h2>{currentState}</h2>
                {currentState === "Sign Up" ? (
                    <input 
                        type="text" 
                        placeholder='user name' 
                        className="form-input"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)} 
                        required 
                    />
                ) : null}
                <input 
                    type="email" 
                    placeholder='email address' 
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder='password' 
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit">{currentState === "Sign Up" ? "Create Account" : "Login Now"}</button>
                <div className="login-term">
                    <input type="checkbox" />
                    <p>Agree to the terms of use & privacy policy. </p>
                </div>
                <div className="login-forgot">
                    {
                        currentState === "Sign Up" ?
                            <p className="login-toggle">
                                Already have an accout? <span onClick={() => setCurrentState("Login")}>Login Here</span>
                            </p>
                            :
                            <p className="login-toggle">
                                Create An Account <span onClick={() => setCurrentState("Sign Up")}>Click here</span>
                            </p>
                    }
                    {
                        currentState == "Login"? 
                        <p className="login-toggle">
                                Forget Password <span onClick={() => resetPass(email)}>reset here</span>
                            </p> :
                            null

                    }
                </div>
            </form>
        </div>
    )
}

export default Login