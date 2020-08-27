import {useState, useEffect} from 'react';
import {signup, isAuth} from '../../actions/auth';
import Router from 'next/router'

const SignupComponent = () => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        loading: false,
        message: ''
    });

    const {name, email, password, error, loading, message} = values;

    useEffect(() => {
        isAuth() && Router.push('/');
    },[])

    const handleSubmit = (e) => {
        e.preventDefault();
        //console.table({name, email, password, error, loading, message, showForm})
        setValues({...values, loading: true, error: false});
        const user = {name, email, password}

        signup(user)
        .then(data => {
            if(data.error) {
                setValues({...values, error: data.error, loading: false});
                console.log(data.error);
            } else {
                setValues({
                    ...values,
                    name:'',
                    email: '',
                    password:'',
                    error: '',
                    loading: false,
                    message: data.message
                });
            }
        })
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

    const signupForm = () => {
        return(
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input value={name} onChange={handleChange('name')} type="text" className="form-control" placeholder="Enter your Name"/>
                </div>
                <div className="form-group">
                    <input value={email} onChange={handleChange('email')} type="email" className="form-control" placeholder="Enter your E-Mail"/>
                </div>
                <div className="form-group">
                    <input value={password} onChange={handleChange('password')} type="password" className="form-control" placeholder="Enter your Password"/>
                </div>

                <div>
                    <button className="btn btn-primary">Signup</button>
                </div>
            </form>
        );
    };
    
    return(
        <>
            {showEroor()}
            {showLoading()}
            {showMessage()}
            {signupForm()}
        </>
    );
};

export default SignupComponent;