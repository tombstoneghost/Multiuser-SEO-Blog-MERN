import {useState, useEffect} from 'react';
import Link from 'next/link';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import {withRouter} from 'next/router';
import {getCookie, isAuth} from '../../actions/auth';
import {getCategories} from '../../actions/category';
import {getTags} from '../../actions/tag';
import {singleBlog, updateBlog} from '../../actions/blog';
import {quillModules, quillFormats} from '../../helpers/quill';
import {API} from '../../config';

const ReactQuill = dynamic(() => import('react-quill'), {ssr: false});

const BlogUpdate = ({router}) => {
    const [body, setBody] = useState('');
    const [values, setValues] = useState({
        error: '',
        success: '',
        formData: '',
        title: '',
    });

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);

    const [checkedCategories, setCheckedCategories] = useState([]);
    const [checkedTag, setCheckedTags] = useState([]);

    const {error, success, formData, title} = values;
    const token = getCookie('t');

    useEffect(() => {
        setValues({...values, formData: new FormData()});
        initBlog();
        initCategories();
        initTags();
    },[router])

    const initBlog = () => {
        if(router.query.slug) {
            singleBlog(router.query.slug)
            .then(data => {
                if(data.error) {
                    console.log(data.error);
                } else {
                    setValues({...values, title: data.title});
                    setBody(data.body);
                    setCategoriesArray(data.categories);
                    setTagsArray(data.tags);
                }
            });
        }
    };

    const setCategoriesArray = blogCategories => {
        let cat = [];
        blogCategories.map((c, i) => {
            cat.push(c._id);
        });

        setCheckedCategories(cat);
    };

    const setTagsArray = blogTags => {
        let tag = [];
        blogTags.map((t, i) => {
            tag.push(t._id);
        });

        setCheckedTags(tag);
    };

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

    const findOutCategory = c => {
        const result = checkedCategories.indexOf(c);

        if(result !== -1) {
            return true;
        } else {
            return false;
        }
    };

    const findOutTag = t => {
        const result = checkedTag.indexOf(t);

        if(result !== -1) {
            return true;
        } else {
            return false;
        }
    };

    const showCategories = () => {
        return(
            categories && categories.map((c,i) => (
                <li key={i} className="list-unstyled">
                    <input onChange={handleCategoriesToggle(c._id)} checked={findOutCategory(c._id)} className="mr-2" type="checkbox"/>
                    <label className="form-check-label">{c.name}</label>
                </li>
            ))
        );
    };

    const showTags = () => {
        return(
            tags && tags.map((t,i) => (
                <li key={i} className="list-unstyled">
                    <input onChange={handleTagsToggle(t._id)} checked={findOutTag(t._id)} className="mr-2" type="checkbox" value={t._id}/>
                    <label className="form-check-label">{t.slug}</label>
                </li>
            ))
        );
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

    const handleChange = name => e => {
        const value = name === 'photo' ? e.target.files[0] : e.target.value;
        formData.set(name, value);
        setValues({...value, [name]: value, formData, error: ''});
    };

    const handleBody = e => {
        setBody(e);
        formData.set('body', e);
    };

    const editBlog = (e) => {
        e.preventDefault();
        
        updateBlog(formData, token, router.query.slug)
        .then(data => {
            if(data.error) {
                console.log(data.error);
                setValues({...values, error: data.error});
            } else {
                setValues({...values, title: '', success: `Blog titled "${data.title}" is successfully updated`});
                if(isAuth() && isAuth().role === 1) {
                    Router.replace(`/admin`);
                } else if(isAuth() && isAuth().role === 0) {
                    Router.replace(`/user`);
                }
            }
        })
    };

    const updateBlogForm = () => {
        return(
            <form onSubmit={editBlog}>
                <div className="form-group">
                    <label className="text-muted">Title</label>
                    <input type="text" value={title} className="form-control" onChange={handleChange('title')}/>
                </div>
                <div className="form-group">
                    <ReactQuill modules={quillModules} formats={quillFormats} value={body} placeholder="Write something amazing..." onChange={handleBody}/>
                </div>
                <div className="form-group">
                    <button className="btn btn-primary" type="submit">Update</button>
                </div>
            </form>
        );
    };

    const showError = () => (
        <div className="alert alert-danger" style={{display: error ? '' : 'none'}}>{error}</div>
    );

    const showSuccess = () => (
        <div className="alert alert-success" style={{display: success ? '' : 'none'}}>{success}</div>
    );

    return(
        <div className="container-fluid pb-5">
            <div className="row">
                <div className="col-md-8">
                    {updateBlogForm()}
                    <div className="pt-3">
                        {showError()}
                        {showSuccess()}
                    </div>

                    {body && <img src={`${API}/blog/photo/${router.query.slug}`} alt={title} style={{width: '100%', height: '250px'}}/> }
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
}

export default withRouter(BlogUpdate);