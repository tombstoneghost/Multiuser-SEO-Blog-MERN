import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import {singleCategories} from '../../actions/category';
import {API, DOMAIN, APP_NAME} from '../../config';
import moment from 'moment';
import renderHTML from 'react-render-html';
import Card from '../../components/blog/Card';


const Category = ({category, blogs, query}) => {
    const head = () => (
        <Head>
            <title>{category.name} | {APP_NAME}</title>
            <meta name="description" content={`Best programming tutorials on ${category.name}`}/>
            <link ref="canonical" href={`${DOMAIN}/categories/${query.slug}`}/>
            <meta property="og:title" content={`${category.name} | ${APP_NAME}`} />
            <meta property="og:description" content={`Best programming tutorials on ${category.name}`}/>
            <meta property="og:type" content="website"/>
            <meta property="og:url" content={`${DOMAIN}/categories/${query.slug}`}/>
            <meta property="og:site_name" content={`${APP_NAME}`}/>

            <meta property="og:image" content={`${DOMAIN}/static/images/blog.png`}/>
            <meta property="og:image:secure_url" content={`${DOMAIN}/static/images/blog.png`}/>
            <meta property="og:image:type" content="image/jpeg"/>
        </Head>
    );

    return(
        <>
            {head()}
            <Layout>
                <main>
                    <div className="container-fluid text-center">
                        <header>
                            <div className="col-md-12 pt-3">
                                <h1 className="display-4 font-weight-bold">
                                    {category.name}
                                </h1>
                                {blogs.map((b, i) => (
                                    <Card key={i} blog={b}/>
                                ))}
                            </div>
                        </header>
                    </div>
                </main>
            </Layout>
        </>
    );
};

Category.getInitialProps = ({query}) => {
    return singleCategories(query.slug)
    .then(data => {
        if(data.error) {
            console.log(data.error);
        } else {
            return {
                category: data.category,
                blogs: data.blogs,
                query
            };
        }
    });
};

export default Category;