/* eslint-disable react/jsx-indent, @typescript-eslint/indent */

'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown, Image } from 'react-bootstrap';
import {
  BoxArrowRight,
  Lock,
  PersonFill,
  PersonPlusFill,
  Person,
} from 'react-bootstrap-icons';
import Link from 'next/link';

const NavBar: React.FC = () => {
  const { data: session } = useSession();
  const currentUser = session?.user?.email;
  const pathName = usePathname();

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        {/* Change ICStudy brand link to UserHomePage when logged in */}
        <Link href={currentUser ? '/userHome' : '/'}>
          <Image src="/ICStudy.png" alt="ICStudy Logo" height="40" style={{ cursor: 'pointer' }} />
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto justify-content-start">
            {currentUser && (
              <>
                {/* Home link for logged in user */}
                <Nav.Link
                  id="home-nav"
                  href="/userHome"
                  active={pathName === '/userHome'}
                >
                  Home
                </Nav.Link>
                <Nav.Link
                  id="find-session-nav"
                  href="/sessions"
                  active={pathName === '/sessions'}
                >
                  Find Session
                </Nav.Link>
                <Nav.Link
                  id="my-sessions-nav"
                  href="/mysessions"
                  active={pathName === '/mysessions'}
                >
                  My Sessions
                </Nav.Link>
                <Nav.Link
                  id="create-session-nav"
                  href="/session"
                  active={pathName === '/session'}
                >
                  Create Session
                </Nav.Link>
                <Nav.Link
                  id="LeaderBoard"
                  href="/LeaderBoard"
                  active={pathName === '/LeaderBoard'}
                >
                  Leaderboard
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {session ? (
              <NavDropdown id="login-dropdown" title={currentUser}>
                <NavDropdown.Item id="view-profile" href="/profile">
                  <Person />
                  View Profile
                </NavDropdown.Item>
                <NavDropdown.Item
                  id="login-dropdown-change-password"
                  href="/auth/change-password"
                >
                  <Lock />
                  Change Password
                </NavDropdown.Item>
                <NavDropdown.Item
                  id="login-dropdown-sign-out"
                  href="/api/auth/signout"
                >
                  <BoxArrowRight />
                  Sign Out
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown id="login-dropdown" title="Login">
                <NavDropdown.Item
                  id="login-dropdown-sign-in"
                  href="/auth/signin"
                >
                  <PersonFill />
                  Sign in
                </NavDropdown.Item>
                <NavDropdown.Item
                  id="login-dropdown-sign-up"
                  href="/auth/signup"
                >
                  <PersonPlusFill />
                  Sign up
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
