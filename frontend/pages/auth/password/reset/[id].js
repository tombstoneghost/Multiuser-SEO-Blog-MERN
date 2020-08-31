import {useState, useEffect} from 'react';
import Layout from '../../../../components/Layout';
import {forgotPassword, resetPassword} from '../../../../actions/auth';
import {withRouter} from 'next/router';

const ResetPassword = ({router}) => {
    const [values, setValues] = useState({
        name: '',
        newPassword: '',
        error: '',
        message: '',
        showForm: true
    });

    const {name, newPassword, error, message, showForm} = values;

    const handleChange = name => e => {
        setValues({...values, message: '', error: '', [name]: e.target.value});
    };

    const handleSubmit = e => {
        e.precentDefault();
        resetPassword({
            newPassword,
            resetPasswordLink: router.query.id
        })
        .then(data => {
            if(data.error) {
                setValues({...values, error: data.error, showForm: false, newPassword: ''});
            } else {
                setValues({...values, message: data.message, showForm: false, newPassword: '', error: false});
            }
        });
    }

    const showError = () => (
        error ? <div className="alert alert-danger">{error}</div> : ''
    );

    const showMessage = () => (
        message ? <div className="alert alert-success">{message}</div> : ''
    );

    const passwordResetForm = () => {
        return(
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group pt-5">
                        <input type="password" onChange={handleChange('newPassword')} className="form-control" value={newPassword} placeholder="Type new Password" required/>
                    </div>
                    <div>
                        <button className="btn btn-primary" type="submit">Change Password</button>
                    </div>
                </form>
            </div>
        );
    };

    return(
        <Layout>
            <div className="container">
                <h2 className="text-center">Forgot Password</h2>
                <hr/>
                {showError()}
                {showMessage()}
                {showForm && passwordResetForm()}
            </div>
        </Layout>
    );
};

export default withRouter(resetPassword);