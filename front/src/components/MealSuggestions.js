import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const MealSuggestions = () => {
    const [suggestions, setSuggestions] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const response = await axios.get('/api/meal_suggestion');
                setSuggestions(response.data);
            } catch (error) {
                console.error('Error fetching meal suggestions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSuggestions();
    }, []);

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={10}>
                    <h2 className="text-center mt-5">Meal Suggestions</h2>
                    {loading ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                            <ClipLoader color={"#123abc"} loading={loading} css={override} size={150} />
                        </div>
                    ) : (
                        suggestions ? (
                            Object.entries(suggestions).map(([meal, recipes]) => (
                                <div key={meal}>
                                    <h3>{meal.charAt(0).toUpperCase() + meal.slice(1)}</h3>
                                    <Row>
                                        {recipes.map(recipe => (
                                            <Col md={4} key={recipe.recipe.label}>
                                                <Card className="mb-4">
                                                    <Card.Img variant="top" src={recipe.recipe.image} alt={recipe.recipe.label} />
                                                    <Card.Body>
                                                        <Card.Title>{recipe.recipe.label}</Card.Title>
                                                        <Card.Text>{recipe.recipe.source}</Card.Text>
                                                        <a href={recipe.recipe.url} className="btn btn-primary" target="_blank" rel="noopener noreferrer">View Recipe</a>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            ))
                        ) : (
                            <p>No meal suggestions available at the moment.</p>
                        )
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default MealSuggestions;
