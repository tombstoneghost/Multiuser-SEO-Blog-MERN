import {useState, useEffect} from 'react';
import {signin, authenticate, isAuth} from '../../actions/auth';
import Router from 'next/router';

const SigninComponent = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
        error: '',
        loading: false,
        message: ''
    });

    const {email, password, error, loading, message} = values;

    useEffect(() => {
        isAuth() && Router.push('/');
    },[])

    const handleSubmit = (e) => {
        e.preventDefault();
        //console.table({name, email, password, error, loading, message, showForm})
        setValues({...values, loading: true, error: false});
        const user = {email, password}

        signin(user)
        .then(data => {
            if(data.error) {
                setValues({...values, error: data.error, loading: false});
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

    const handleChange = name => e => {
        setValues({...values, error: false, [name]: e.target.value});
    };

    const showLoading = () => (
        loading ? (
            <div className="alert alert-info">Loading...</div>
        ) : (
            <div></div>
        )
    );

    const showEroor = () => (
        error ? (
            <div className="alert alert-danger">{error}</div>
        ) : (
            <div></div>
        )
    );

    const showMessage = () => (
        message ? (
            <div className="alert alert-info">{message}</div>
        ) : (
            <div></div>
        )
    );

    const signinForm = () => {
        return(
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input value={email} onChange={handleChange('email')} type="email" className="form-control" placeholder="Enter your E-Mail"/>
                </div>
                <div className="form-group">
                    <input value={password} onChange={handleChange('password')} type="password" className="form-control" placeholder="Enter your Password"/>
                </div>

                <div>
                    <button className="btn btn-primary">Signin</button>
                </div>
            </form>
        );
    };
    
    return(
        <>
            {showEroor()}
            {showLoading()}
            {showMessage()}
            {signinForm()}
        </>
    );
};

export default SigninComponent;