import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import {singleTag} from '../../actions/tag';
import {API, DOMAIN, APP_NAME} from '../../config';
import moment from 'moment';
import renderHTML from 'react-render-html';
import Card from '../../components/blog/Card';


const Tag = ({tag, blogs}) => {
    const head = () => (
        <Head>
            <title>{tag.name} | {APP_NAME}</title>
            <meta name="description" content={`Best programming tutorials on ${tag.name}`}/>
            <link ref="canonical" href={`${DOMAIN}/tags/${query.slug}`}/>
            <meta property="og:title" content={`${tag.name} | ${APP_NAME}`} />
            <meta property="og:description" content={`Best programming tutorials on ${tag.name}`}/>
            <meta property="og:type" content="website"/>
            <meta property="og:url" content={`${DOMAIN}/tags/${query.slug}`}/>
            <meta property="og:site_name" content={`${APP_NAME}`}/>

            <meta property="og:image" content={`${DOMAIN}/static/images/blog.png`}/>
            <meta property="og:image:secure_url" content={`${DOMAIN}/static/images/blog.png`}/>
            <meta property="og:image:type" content="image/jpeg"/>
        </Head>
    );

    return(
        <>
            <Layout>
                <main>
                    <div className="container-fluid text-center">
                        <header>
                            <div className="col-md-12 pt-3">
                                <h1 className="display-4 font-weight-bold">
                                    {tag.slug}
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

Tag.getInitialProps = ({query}) => {
    return singleTag(query.slug)
    .then(data => {
        if(data.error) {
            console.log(data.error);
        } else {
            return {
                tag: data.tag,
                blogs: data.blogs
            };
        }
    });
};

export default Tag;