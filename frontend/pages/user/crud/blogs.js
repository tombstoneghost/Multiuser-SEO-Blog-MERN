import Layout from '../../../components/Layout';
import Private from '../../../components/auth/Private';
import BlogRead from '../../../components/crud/BlogRead';
import Link from 'next/link';
import {isAuth} from '../../../actions/auth';

const Blog = () => {
    const username = isAuth() && isAuth().username;

    return(
        <Layout>
            <Private>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 pt-4 pb-4">
                            <h2 className="text-center">Manage blog</h2>
                        </div>
                        <div className="col-md-12">
                            <BlogRead username={username}/>
                        </div>
                    </div>
                </div>
            </Private>
        </Layout>
    );
};

export default Blog;