import fetch from 'isomorphic-fetch';
import Cookies from 'js-cookie';
import {API} from '../config';
import Router from 'next/router'

export const handleResponse = response => {
    if(response.status === 401) {
        removeCookie('t');
        removeLocalStorage('user');
        Router.push({
            pathname: '/signin',
            query: {
                message: 'Your session is expired. Please signin'
            }
        });
    }
};

export const preSignup = (user) => {
    return fetch(`${API}/pre-signup`, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            'Content-Type':'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => {
        console.log(err);
    });
};

export const signup = (user) => {
    return fetch(`${API}/signup`, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            'Content-Type':'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => {
        console.log(err);
    });
};

export const signin = (user) => {
    return fetch(`${API}/signin`, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            'Content-Type':'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => {
        console.log(err);
    });
};

export const signout = (next) => {
    removeCookie('t');
    removeLocalStorage('user');
    next();

    return fetch(`${API}/signout`, {
        method: "GET"
    }).then(response => {
        console.log('Signout Success');
    }).catch(err => console.log(err));
};

export const setCookie = (key, value) => {
    if(process.browser) {
        Cookies.set(key, value, {
            expires: 1
        });
    }
};

export const removeCookie = (key) => {
    if(process.browser) {
        Cookies.remove(key, {
            expires: 1
        });
    }
};

export const getCookie = (key) => {
    if(process.browser) {
        return Cookies.get(key);
    }
};

export const setLocalStorage = (key, value) => {
    if(process.browser) {
        localStorage.setItem(key, JSON.stringify(value));
    }
};

export const removeLocalStorage = (key, value) => {
    if(process.browser) {
        localStorage.removeItem(key);
    }
};

export const authenticate = (data, next) => {
    setCookie('t', data.token)
    setLocalStorage('user', data.user);
    next();
};

export const isAuth = () => {
    if(process.browser) {
        const cookieChecked = getCookie('t');
        if(cookieChecked) {
            if(localStorage.getItem('user')) {
                return JSON.parse(localStorage.getItem('user'));
            } else {
                return false;
            }
        }
    }
};

export const updateUser = (user, next) => {
    if(process.browser) {
        if(localStorage.getItem('user')) {
            let auth = JSON.parse(localStorage.getItem('user'));
            auth = user;
            localStorage.setItem('user', JSON.stringify(auth));
            next();
        }
    }
};

export const forgotPassword = (email) => {
    return fetch(`${API}/forgot-password`, {
        method: "PUT",
        headers: {
            Accept: 'application/json',
            'Content-Type':'application/json'
        },
        body: JSON.stringify(email)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => {
        console.log(err);
    });
};

export const resetPassword = (resetInfo) => {
    return fetch(`${API}/reset-password`, {
        method: "PUT",
        headers: {
            Accept: 'application/json',
            'Content-Type':'application/json'
        },
        body: JSON.stringify(resetInfo)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => {
        console.log(err);
    });
};

