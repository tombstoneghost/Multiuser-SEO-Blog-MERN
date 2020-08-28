import Layout from '../../components/Layout';
import Admin from '../../components/auth/Admin';
import Link from 'next/link';

const AdminIndex = () => {
    return(
        <Layout>
            <Admin>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 pt-4 pb-4">
                            <h2 className="text-center">Admin Dashboard</h2>
                        </div>
                        <div className="col-md-4">
                            <ul className="list-group">
                                <li className="list-group-item">
                                    <Link href="/admin/crud/category-tag">
                                        <a>Create Category/Tag</a>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-8">Right</div>
                    </div>
                </div>
            </Admin>
        </Layout>
    );
};

export default AdminIndex;