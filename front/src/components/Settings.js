import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Set default axios configuration to include credentials
axios.defaults.withCredentials = true;

const Settings = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        weight: '',
        height: '',
        age: '',
        gender: '',
        activity_level: '',
        cuisine_type: '',
        password: '',
        confirmPassword: ''
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        // Fetch user data on component mount
        axios.get('/api/settings')
            .then(response => {
                setFormData({
                    username: response.data.username,
                    email: response.data.email,
                    weight: response.data.weight,
                    height: response.data.height,
                    age: response.data.age,
                    gender: response.data.gender,
                    activity_level: response.data.activity_level,
                    cuisine_type: response.data.cuisine_type,
                    password: '',
                    confirmPassword: ''
                });
            })
            .catch(error => {
                toast.error("Failed to load settings.", {
                    position: "top-right"
                });
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/settings', formData)
            .then(response => {
                toast.success(response.data.message, {
                    position: "top-right"
                });
            })
            .catch(error => {
                const errorMessage = error.response && error.response.data && error.response.data.message
                    ? error.response.data.message
                    : "Failed to update settings. Please try again.";
                toast.error(errorMessage, {
                    position: "top-right"
                });
            });
    };

    const handleDeleteUser = () => {
        axios.delete('/api/delete_user')
            .then(response => {
                toast.success(response.data.message, {
                    position: "top-right"
                });
                // Perform logout and redirect to login page
                localStorage.removeItem('isAuthenticated');
                window.location.href = '/login';
            })
            .catch(error => {
                const errorMessage = error.response && error.response.data && error.response.data.message
                    ? error.response.data.message
                    : "Failed to delete user. Please try again.";
                toast.error(errorMessage, {
                    position: "top-right"
                });
            });
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={8}>
                    <h1 className="text-center mt-5">Settings</h1>
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

                        <Form.Group controlId="cuisine_type">
                            <Form.Label>Preferred Cuisine Type</Form.Label>
                            <Form.Control
                                as="select"
                                name="cuisine_type"
                                value={formData.cuisine_type}
                                onChange={handleChange}
                                optional
                            >
                                <option value="">Select Cuisine Type</option>
                                <option value="american">American</option>
                                <option value="asian">Asian</option>
                                <option value="british">British</option>
                                <option value="caribbean">Caribbean</option>
                                <option value="central_europe">Central Europe</option>
                                <option value="chinese">Chinese</option>
                                <option value="eastern_europe">Eastern Europe</option>
                                <option value="french">French</option>
                                <option value="indian">Indian</option>
                                <option value="italian">Italian</option>
                                <option value="japanese">Japanese</option>
                                <option value="kosher">Kosher</option>
                                <option value="mediterranean">Mediterranean</option>
                                <option value="mexican">Mexican</option>
                                <option value="middle_eastern">Middle Eastern</option>
                                <option value="nordic">Nordic</option>
                                <option value="south_american">South American</option>
                                <option value="south_east_asian">South East Asian</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                optional
                                minLength="6"
                                maxLength="150"
                                placeholder="Enter your new password"
                            />
                        </Form.Group>

                        <Form.Group controlId="confirmPassword">
                            <Form.Label>Confirm New Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                optional
                                placeholder="Confirm your new password"
                            />
                        </Form.Group>

                        <div className="form-actions">
                            <Button variant="primary" type="submit">
                                Save Settings
                            </Button>
                            <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                                Delete Account
                            </Button>
                        </div>
                    </Form>
                    <ToastContainer />
                </Col>
            </Row>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete your account? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteUser}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Settings;
