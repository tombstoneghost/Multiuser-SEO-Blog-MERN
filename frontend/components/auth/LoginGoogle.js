import Link from 'next/link';
import {useState, useEffect} from 'react';
import Router from 'next/router';
import GoogleLogin from 'react-google-login';
import {getCookie, isAuth, updateUser, loginWithGoogle, authenticate} from '../../actions/auth';
import {getProfile, update} from '../../actions/user';
import { GOOGLE_CLIENT_ID } from '../../config';

const LoginGoogle = () => {
    const responseGoogle = (response) => {
        const tokenId = response.tokenId;
        const user = { tokenId };

        loginWithGoogle(user)
        .then(data => {
            if(data.error) {
                console.log(data.error);
            } else {
                authenticate(data, () => {
                    if(isAuth() && isAuth().role === 1) {
                        Router.push('/admin');
                    } else {
                        Router.push('user');
                    }
                });
            }
        });
    };

    return(
        <div className="pb-3">
            <GoogleLogin
                clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                buttonText="Login"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                theme="dark"
            />
        </div>
    );
};

export default LoginGoogle;