import React, { useState } from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import {APP_NAME} from '../config';
import Link from 'next/link';
import {signout, isAuth} from '../actions/auth';
import Router from 'next/router';
import NProgress from 'nprogress';

Router.onRouteChangeStart = url => NProgress.start();
Router.onRouteChangeComplete = url => NProgress.done();
Router.onRouteChangeError = url => NProgress.done();

const Header = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
        <Navbar color="light" light expand="md">
            <Link href="/">
                <NavLink className="font-weight-bold">{APP_NAME}</NavLink>
            </Link>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
                <Nav className="ml-auto" navbar>
                    <NavItem>
                        <Link href="/blogs">
                            <NavLink>
                                Blogs
                            </NavLink>
                        </Link>
                    </NavItem>
                    {!isAuth() && (<>
                        <NavItem>
                            <Link href="/signin">
                                <NavLink>
                                    Signin
                                </NavLink>
                            </Link>
                        </NavItem>
                        <NavItem>
                            <Link href="/signup">
                                <NavLink>
                                    Signup
                                </NavLink>
                            </Link>
                        </NavItem>
                    </>)}

                    {isAuth() && isAuth().role === 0 && (
                        <NavItem>
                            <Link href="/user">
                                <NavLink>
                                    Dashboard
                                </NavLink>
                            </Link>
                        </NavItem>
                    )}

                    {isAuth() && isAuth().role === 1 && (
                        <NavItem>
                            <Link href="/admin">
                                <NavLink>
                                    Dashboard
                                </NavLink>
                            </Link>
                        </NavItem>
                    )}

                    {isAuth() && (
                        <NavItem>
                            <NavLink style={{cursor: 'pointer'}} onClick={() => signout(() => Router.push('/signin'))}>
                                Signout
                            </NavLink>
                        </NavItem>
                    )}
                </Nav>
            </Collapse>
        </Navbar>
    </div>
  );
}

export default Header;
