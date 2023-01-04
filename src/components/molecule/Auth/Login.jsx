import React, { useRef, useState } from 'react'
import styles from './Login.module.scss'
import classNames from 'classnames/bind'
import axios from 'axios'
import AuthService from '../../../services/auth.service'

const cl = classNames.bind(styles)

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleChange = (event, key) => {
        if (key === "email") {
            setEmail(event.target.value);
        } else if (key === "password") {
            setPassword(event.target.value);
        }
    }

    const handleSubmit = () => {
        AuthService.login(email, password);
    }

    return (
        <>
            <div className={cl('container')} id="container">
                <div className={cl('form-container')}>
                    <form onSubmit={handleSubmit}>
                        <h1>Đăng nhập vào hệ thống</h1>
                        <input type="email" placeholder="Email" name='email' value={email} onChange={(event) => handleChange(event, "email")} />
                        <input type="password" placeholder="Password" value={password} name='password' onChange={(event) => handleChange(event, "password")} />
                        <a href="#">Quên mật khẩu?</a>
                        <button type='submit'>Đăng nhập</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login
