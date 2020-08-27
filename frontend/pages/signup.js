import Layout from '../components/Layout';
import Link from 'next/link';

const Signup = () => {
    return(
        <Layout>
            <h2>Signup Page</h2>
            <Link href="/">
                <a>Home</a>
            </Link>
        </Layout>
    );
};

export default Signup;