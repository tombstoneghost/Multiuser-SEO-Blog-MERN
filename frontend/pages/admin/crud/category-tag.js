import Layout from '../../../components/Layout';
import Admin from '../../../components/auth/Admin';
import Category from '../../../components/crud/Category';
import Tag from '../../../components/crud/Tag';
import Link from 'next/link';

const CategoryTag = () => {
    return(
        <Layout>
            <Admin>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 pt-4 pb-4">
                            <h2 className="text-center">Manage Categories and Tags</h2>
                        </div>
                        <div className="col-md-6">
                            <h3 className="text-center text-muted mt-2">Categories</h3>
                            <Category />
                        </div>
                        <div className="col-md-6">
                            <h3 className="text-center text-muted mt-2">Tags</h3>
                            <Tag />
                        </div>
                    </div>
                </div>
            </Admin>
        </Layout>
    );
};

export default CategoryTag;