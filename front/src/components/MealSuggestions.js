import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Set default axios configuration to include credentials
axios.defaults.withCredentials = true;

const MealSuggestions = () => {
    const [suggestions, setSuggestions] = useState({});

    useEffect(() => {
        // Fetch meal suggestions from the backend
        axios.get('/api/meal_suggestion')
            .then(response => {
                setSuggestions(response.data);
            })
            .catch(error => {
                toast.error("Failed to load meal suggestions.", {
                    position: "top-right"
                });
            });
    }, []);

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={10}>
                    <h2 className="mt-5">Meal Suggestions</h2>
                    {Object.keys(suggestions).length > 0 ? (
                        Object.entries(suggestions).map(([meal, recipes]) => (
                            <div key={meal}>
                                <h3 className="mt-4">{meal.charAt(0).toUpperCase() + meal.slice(1)}</h3>
                                <Row>
                                    {recipes.map((recipe, index) => (
                                        <Col md={4} key={index}>
                                            <Card className="mb-4">
                                                <Card.Img variant="top" src={recipe.recipe.image} alt={recipe.recipe.label} />
                                                <Card.Body>
                                                    <Card.Title>{recipe.recipe.label}</Card.Title>
                                                    <Card.Text>{recipe.recipe.source}</Card.Text>
                                                    <Button variant="primary" href={recipe.recipe.url} target="_blank">View Recipe</Button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        ))
                    ) : (
                        <p>No meal suggestions available at the moment.</p>
                    )}
                </Col>
            </Row>
            <ToastContainer />
        </Container>
    );
};

export default MealSuggestions;
