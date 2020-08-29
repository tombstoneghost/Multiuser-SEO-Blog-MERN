import {useState, useEffect} from 'react';
import Link from 'next/link';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import {withRouter} from 'next/router';
import {getCookie, isAuth} from '../../actions/auth';
import {getCategories} from '../../actions/category';
import {getTags} from '../../actions/tag';
import {createBlog} from '../../actions/blog';
import {quillModules, quillFormats} from '../../helpers/quill';

const ReactQuill = dynamic(() => import('react-quill'), {ssr: false});

const BlogCreate = ({router}) => {
    const blogFromLS = () => {
        if(typeof window === 'undefined') {
            return false;
        } if(localStorage.getItem('blog')) {
            return JSON.parse(localStorage.getItem('blog'));
        } else {
            return false
        }
    };

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);

    const [checkedCategories, setCheckedCategories] = useState([]);
    const [checkedTag, setCheckedTags] = useState([]);

    const [body, setBody] = useState(blogFromLS());
    const [values, setValues] = useState({
        error: '',
        sizeError: '',
        success: '',
        formData: '',
        title: '',
        hidePublishButton: false
    });

    const {error, sizeError, success, formData, title, hidePublishButton} = values;
    const token = getCookie('t');

    useEffect(() => {
        setValues({...values, formData: new FormData()})
        initCategories();
        initTags();
    },[router]);

    const initCategories = () => {
        getCategories()
        .then(data => {
            if(data.error) {
                setValues({...values, error: data.error})
            } else {
                setCategories(data);
            }
        });
    };

    const initTags = () => {
        getTags()
        .then(data => {
            if(data.error) {
                setValues({...values, error: data.error})
            } else {
                setTags(data);
            }
        });
    };

    const publishBlog = e => {
        e.preventDefault();
        
        console.log(formData);

        createBlog(formData, token)
        .then(data => {
            if(data.error) {
                setValues({...values, error: data.error});
            } else {
                setValues({...values, title: '', error: '', success: `A new blog titled "${data.title}" is created. Page will reload in 5 seconds.`});
                setBody('');
                setCategories([]);
                setTags([]);
                setTimeout(function(){
                    window.location.reload(1);
                }, 5000);
            }
        })
    };

    const handleChange = name => e => {
        const value = name === 'photo' ? e.target.files[0] : e.target.value;
        formData.set(name, value);
        setValues({...value, [name]: value, formData, error: ''});
    };

    const handleBody = e => {
        setBody(e);
        formData.set('body', e);
        if(typeof window !== 'undefined') {
            localStorage.setItem('blog', JSON.stringify(e));
        }
    };

    const handleCategoriesToggle = (c) => () => {
        setValues({...values, error: ''});

        const clickedCategory = checkedCategories.indexOf(c)
        const all = [...checkedCategories];

        if(clickedCategory === -1) {
            all.push(c);
        } else {
            all.splice(clickedCategory,1);
        }

        console.log(all);
        setCheckedCategories(all);
        formData.set('categories', all);
    };

    const handleTagsToggle = (t) => () => {
        setValues({...values, error: ''});

        const clickedTags = checkedTag.indexOf(t)
        const all = [...checkedTag];

        if(clickedTags === -1) {
            all.push(t);
        } else {
            all.splice(clickedTags,1);
        }

        console.log(all);
        setCheckedTags(all);
        formData.set('tags', all);
    };

    const showCategories = () => {
        return(
            categories && categories.map((c,i) => (
                <li key={i} className="list-unstyled">
                    <input onChange={handleCategoriesToggle(c._id)} className="mr-2" type="checkbox"/>
                    <label className="form-check-label">{c.name}</label>
                </li>
            ))
        );
    };

    const showTags = () => {
        return(
            tags && tags.map((t,i) => (
                <li key={i} className="list-unstyled">
                    <input onChange={handleTagsToggle(t._id)} className="mr-2" type="checkbox" value={t._id}/>
                    <label className="form-check-label">{t.slug}</label>
                </li>
            ))
        );
    };

    const showError = () => (
        <div className="alert alert-danger" style={{display: error ? '' : 'none'}}>{error}</div>
    );

    const showSuccess = () => (
        <div className="alert alert-success" style={{display: success ? '' : 'none'}}>{success}</div>
    );

    const createBlogForm = () => {
        return(
            <form onSubmit={publishBlog}>
                <div className="form-group">
                    <label className="text-muted">Title</label>
                    <input type="text" value={title} className="form-control" onChange={handleChange('title')}/>
                </div>
                <div className="form-group">
                    <ReactQuill modules={quillModules} formats={quillFormats} value={body} placeholder="Write something amazing..." onChange={handleBody}/>
                </div>
                <div className="form-group">
                    <button className="btn btn-primary" type="submit">Publish</button>
                </div>
            </form>
        );
    };

    return(
        <div className="container-fluid pb-5">
            <div className="row">
                <div className="col-md-8">
                    {createBlogForm()}
                    <div className="pt-3">
                        {showError()}
                        {showSuccess()}
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-group pb-2">
                        <h5>Featured Image</h5>
                        <hr/>
                        <small className="text-muted">Max Size: 1mb</small>
                        <br/>
                        <label className="btn btn-outline-info">
                            Upload featured image
                            <input onChange={handleChange('photo')} type="file" accept="image/*" hidden/>
                        </label>
                    </div>
                    <div>
                        <h5>Categories</h5>
                        <hr/>
                        <ul style={{maxHeight: '200px', overflowY: 'scroll'}}>{showCategories()}</ul>
                    </div>
                    <div>
                        <h5>Tags</h5>
                        <hr/>
                        <ul style={{maxHeight: '200px', overflowY: 'scroll'}}>{showTags()}</ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withRouter(BlogCreate);