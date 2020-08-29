import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import {useState} from 'react';
import {singleBlog} from '../../actions/blog';
import {API, DOMAIN, APP_NAME} from '../../config';
import moment from 'moment';
import renderHTML from 'react-render-html';

const SingleBlog = ({blog, query}) => {
    const head = () => (
        <Head>
            <title>{blog.title} | {APP_NAME}</title>
            <meta name="description" content={blog.mdesc}/>
            <link ref="canonical" href={`${DOMAIN}/blogs/${query.slug}`}/>
            <meta property="og:title" content={`${blog.title} | ${APP_NAME}`} />
            <meta property="og:description" content={blog.mdesc}/>
            <meta property="og:type" content="website"/>
            <meta property="og:url" content={`${DOMAIN}${query.slug}`}/>
            <meta property="og:site_name" content={`${APP_NAME}`}/>

            <meta property="og:image" content={`${API}/blog/photo/${blog.photo}`}/>
            <meta property="og:image:secure_url" content={`${API}/blog/photo/${blog.photo}`}/>
            <meta property="og:image:type" content="image/jpeg"/>
        </Head>
    );

    const showBlogCategories = blog => {
        return blog.categories.map((c, i) => (
            <Link key={i} href={`/categories/${blog.slug}`}>
                <a className="btn btn-primary mr-1 ml-1 mt-3">{c.name}</a>
            </Link>
        ));
    };

    const showBlogTags = blog => {
        return blog.tags.map((t, i) => (
            <Link key={i} href={`/categories/${blog.slug}`}>
                <a className="btn btn-outline-primary mr-1 ml-1 mt-3">{t.slug}</a>
            </Link>
        ));
    };

    return(
        <>
            {head()}
            <Layout>
                <main>
                    <article>
                        <div className="container-fluid">
                            <section>
                                <div className="row" style={{marginTop: '-30px'}}>
                                    <img src={`${API}/blog/photo/${blog.slug}`} alt={blog.title} className="img img-fluid featured-image" />
                                </div>
                            </section>
                            <section>
                                <div className="container">
                                    <h1 className="display-2 pt-3 pb-3 text-center font-weigh-bold">
                                        {blog.title}
                                    </h1>
                                    <p className="lead mt-3 mark">
                                        Written by {blog.postedBy.name} | Published {moment(blog.updatedAt).fromNow()}
                                    </p>
                                    <div className="pb-3">
                                        {showBlogCategories(blog)}
                                        {showBlogTags(blog)}
                                        <br />
                                        <br />
                                    </div> 
                                </div>
                            </section>
                        </div>
                        <div className="container">
                            <section>
                                <div className="col-md-12">
                                    {renderHTML(blog.body)}
                                </div>
                            </section>
                        </div>
                        <div className="container pb-5">
                            <h4 className="text-center pt-5 pb-5 h2">Related Blogs</h4>
                        </div>
                        <div className="container pb-5">
                            <h4 className="text-center pt-5 pb-5 h2">Comments</h4>
                        </div>
                    </article>
                </main>
            </Layout>
        </>
    );   
};

SingleBlog.getInitialProps = ({query}) => {
    return singleBlog(query.slug)
        .then(data => {
            if(data.error) {
                console.log(data.error);
            } else {
                return {
                    blog: data,
                    query: query
                }
            }
        })
};

export default SingleBlog;