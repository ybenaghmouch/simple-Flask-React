import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
// Set default axios configuration to include credentials
axios.defaults.withCredentials = true;

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        weight: '',
        height: '',
        age: '',
        gender: '',
        activity_level: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/register', formData)
            .then(response => {
                if (response.status === 201) {
                    navigate('/');
                    toast.success(response.data.message, {
                        position: "top-right"
                    });
                    
                } else if (response.status === 400) {
                    toast.error(response.data.message, {
                        position: "top-right"
                    });
                    
                }
            })
            .catch(error => {
                const errorMessage = error.response && error.response.data && error.response.data.message
                    ? error.response.data.message
                    : "Registration failed. Please try again.";
                toast.error(errorMessage, {
                    position: "top-right"
                });
            });
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={8}>
                    <h1 className="text-center mt-5">Register</h1>
                    <Form onSubmit={handleSubmit} className="mt-4">
                        <Form.Group controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                minLength="2"
                                maxLength="150"
                                placeholder="Enter your username"
                            />
                        </Form.Group>

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
                                minLength="6"
                                maxLength="150"
                                placeholder="Enter your password"
                            />
                        </Form.Group>

                        <Form.Group controlId="confirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="Confirm your password"
                            />
                        </Form.Group>

                        <Form.Group controlId="weight">
                            <Form.Label>Weight (kg)</Form.Label>
                            <Form.Control
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                required
                                placeholder="Enter your weight"
                            />
                        </Form.Group>

                        <Form.Group controlId="height">
                            <Form.Label>Height (cm)</Form.Label>
                            <Form.Control
                                type="number"
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                required
                                placeholder="Enter your height"
                            />
                        </Form.Group>

                        <Form.Group controlId="age">
                            <Form.Label>Age</Form.Label>
                            <Form.Control
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                required
                                placeholder="Enter your age"
                            />
                        </Form.Group>

                        <Form.Group controlId="gender">
                            <Form.Label>Gender</Form.Label>
                            <Form.Control
                                as="select"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="activity_level">
                            <Form.Label>Activity Level</Form.Label>
                            <Form.Control
                                as="select"
                                name="activity_level"
                                value={formData.activity_level}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Activity Level</option>
                                <option value="sedentary">Sedentary</option>
                                <option value="light">Light</option>
                                <option value="moderate">Moderate</option>
                                <option value="active">Active</option>
                                <option value="very_active">Very Active</option>
                            </Form.Control>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Register
                        </Button>
                    </Form>
                    <ToastContainer />
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
