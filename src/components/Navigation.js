import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
   import Container from 'react-bootstrap/Container';
   import {Nav,Navbar, NavDropdown, Button} from 'react-bootstrap';
   import {useLogoutUserMutation} from "../services/appApi"
   import {useSelector} from "react-redux";
   import {LinkContainer} from "react-router-bootstrap";

function Navigation() {
  const user = useSelector((state) => state.user);
  const [logoutUser] = useLogoutUserMutation();
  async function handleLogout(e) {
    e.preventDefault();
    await logoutUser(user);
    // redirect to home page
    window.location.replace("/")

  }
  
  return (
    <div>
    <Navbar expand="lg" className="bg-body-tertiary bss">
      <Container>
        <LinkContainer to="/">
        <Navbar.Brand>maibeX <span style={{fontWeight: "700", color: "orange", textShadow: "1px 2px 2px black"}}>Chat</span></Navbar.Brand>
        </LinkContainer>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {!user && (
 <LinkContainer to="/login">
            <Nav.Link >Login</Nav.Link>
            </LinkContainer>

            )}
           

            <LinkContainer to="/chat">
            <Nav.Link >Chat</Nav.Link>
            </LinkContainer>


          {user && 
            <NavDropdown title={
              <>
              <img src={user.picture} alt="user profile" style={{ width: 30, height: 30, marginRight: 10, objectFit: "cover", borderRadius: "50%"}} />
              {user.name}
              </>
            }
            
            id="basic-nav-dropdown">
             
              <NavDropdown.Item href="#action/3.4">
               <Button variant="danger" onClick= {handleLogout}>Logout</Button>
              </NavDropdown.Item>
            </NavDropdown>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </div>
  )
}



export default Navigation;