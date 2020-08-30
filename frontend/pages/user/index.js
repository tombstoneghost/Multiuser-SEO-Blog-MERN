import Layout from '../../components/Layout';
import Private from '../../components/auth/Private'
import Link from 'next/link';

const UserIndex = () => {
    return(
        <Layout>
            <Private>
            <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 pt-4 pb-4">
                            <h2 className="text-center">User Dashboard</h2>
                        </div>
                        <div className="col-md-4">
                            <ul className="list-group">
                                <li className="list-group-item">
                                    <a href="/user/crud/blog">Create Blog</a>
                                </li>
                                <li className="list-group-item">
                                    <Link href="/user/crud/blogs">
                                        <a>Update/Delete Blog</a>
                                    </Link>
                                </li>
                                <li className="list-group-item">
                                    <a href="/user/update">Profile Update</a>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-8">Right</div>
                    </div>
                </div>
            </Private>
        </Layout>
    );
};

export default UserIndex;