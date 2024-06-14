import React, { useState, useContext } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Set default axios configuration to include credentials
axios.defaults.withCredentials = true;

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
  const { setIsAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/login', formData)
            .then(response => {
                if (response.status === 200) {
                    setIsAuthenticated(true);
                    localStorage.setItem('isAuthenticated', 'true');
                    toast.success(response.data.message, { position: "top-right" });
                    navigate('/');
                } else if (response.status === 400) {
                    toast.error(response.data.message, { position: "top-right" });
                }
            })
            .catch(error => {
                const errorMessage = error.response && error.response.data && error.response.data.message
                    ? error.response.data.message
                    : "Login failed. Please try again.";
                toast.error(errorMessage, { position: "top-right" });
            });
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={8}>
                    <h1 className="text-center mt-5">Login</h1>
                    <Form onSubmit={handleSubmit} className="mt-4">
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter your email"
                            />
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Enter your password"
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Login
                        </Button>
                    </Form>
                    <ToastContainer />
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
