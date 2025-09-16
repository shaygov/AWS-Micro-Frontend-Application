import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  background-color: #2c3e50;
  padding: 2rem 0;
  z-index: 1000;
`

const Logo = styled.div`
  color: #ecf0f1;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
  padding: 0 1rem;
`

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const NavItem = styled.li`
  margin-bottom: 0.5rem;
`

const NavLink = styled(Link)<{ $active: boolean }>`
  display: block;
  padding: 1rem 2rem;
  color: ${props => props.$active ? '#3498db' : '#ecf0f1'};
  text-decoration: none;
  background-color: ${props => props.$active ? '#34495e' : 'transparent'};
  transition: all 0.3s ease;

  &:hover {
    background-color: #34495e;
    color: #3498db;
  }
`

const MicroFrontendBadge = styled.span`
  background: #e74c3c;
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  margin-left: 0.5rem;
`

export function Navigation() {
  const location = useLocation()

  return (
    <Nav>
      <Logo>
        AWS Micro Frontend
        <MicroFrontendBadge>MF</MicroFrontendBadge>
      </Logo>
      <NavList>
        <NavItem>
          <NavLink to="/" $active={location.pathname === '/'}>
            Dashboard
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/users" $active={location.pathname === '/users'}>
            Users
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/settings" $active={location.pathname === '/settings'}>
            Settings
          </NavLink>
        </NavItem>
      </NavList>
    </Nav>
  )
}







