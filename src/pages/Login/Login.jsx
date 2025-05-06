import React, { useState } from 'react'
import './Login.css'
import assets from '../../assets/assets'
const Login = () => {
    const [currentState, setCurrentState] = useState("Sign Up")
    return (
        <div className='login'>
            <img src={assets.logo_big} alt="" className="logo" />
            <form className="login-form">
                <h2>{currentState}</h2>
                {currentState === "Sign Up" ? <input type="text" placeholder='user name' className="form-input" required /> : null}
                <input type="email" placeholder='email address' className="form-input" required />
                <input type="password" placeholder='password' className="form-input" required />
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
                </div>
            </form>
        </div>
    )
}

export default Login
