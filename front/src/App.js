import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { PersonCircle } from 'react-bootstrap-icons';
import { AuthContext } from './context/AuthContext';
import Register from './components/Register';
import Login from './components/Login';
import Settings from './components/Settings';
import MealSuggestions from './components/MealSuggestions';
import TaskList from './components/TaskList';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    return !isAuthenticated ? children : <Navigate to="/" />;
};

const Home = () => (
    <Container>
        <TaskList />
    </Container>
);

function App() {
    const { isAuthenticated, setIsAuthenticated, logout } = useContext(AuthContext);

    useEffect(() => {
        if (localStorage.getItem('isAuthenticated') === 'true') {
            setIsAuthenticated(true);
        }
    }, [setIsAuthenticated]);

    return (
        <Router>
            <div className="App">
                <Navbar bg="dark" variant="dark" expand="lg">
                    <Container>
                        <Navbar.Brand href="/">MyApp</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                
                                {isAuthenticated && <Nav.Link as={Link} to="/tasks">Tasks</Nav.Link>}
                                {isAuthenticated && <Nav.Link as={Link} to="/meal_suggestions">Meal Suggestions</Nav.Link>}
                            </Nav>
                            <Nav className="ms-auto">
                                {!isAuthenticated && <Nav.Link as={Link} to="/register">Register</Nav.Link>}
                                {!isAuthenticated && <Nav.Link as={Link} to="/login">Login</Nav.Link>}
                                
                            </Nav>
                            {isAuthenticated && (
                                <Nav className="ms-auto">
                                    <NavDropdown title={<PersonCircle size={30} />} id="basic-nav-dropdown">
                                        <NavDropdown.Item as={Link} to="/settings">Settings</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                                    </NavDropdown>
                                </Nav>
                            )}
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

                <Container className="mt-3">
                    <Routes>
                        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
                        <Route path="/meal_suggestions" element={<PrivateRoute><MealSuggestions /></PrivateRoute>} />
                        <Route path="/tasks" element={<PrivateRoute><TaskList /></PrivateRoute>} />
                    </Routes>
                </Container>
            </div>
        </Router>
    );
}

export default App;
