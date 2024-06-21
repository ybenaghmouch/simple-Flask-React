import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import 'react-toastify/dist/ReactToastify.css';

const TaskModal = ({ show, onHide, task, fetchTasks }) => {
    const { notify } = useToast();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        repeat_interval: 'none'
    });

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description,
                start_time: new Date(task.start_time).toISOString().slice(0, 16),
                end_time: new Date(task.end_time).toISOString().slice(0, 16),
                repeat_interval: task.repeat_interval || 'none'
            });
        } else {
            setFormData({
                title: '',
                description: '',
                start_time: '',
                end_time: '',
                repeat_interval: 'none'
            });
        }
    }, [task]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = task ? `/api/task/${task.id}` : '/api/tasks';
        const method = task ? 'put' : 'post';

        axios[method](url, formData)
            .then(response => {
                notify('success', response.data.message);
                fetchTasks();
                onHide();
            })
            .catch(error => {
                const errorMessage = error.response && error.response.data && error.response.data.message
                    ? error.response.data.message
                    : "Failed to save task. Please try again.";
                notify('error', errorMessage);
            });
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{task ? 'Edit Task' : 'Add Task'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="start_time">
                        <Form.Label>Start Time</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="start_time"
                            value={formData.start_time}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="end_time">
                        <Form.Label>End Time</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="end_time"
                            value={formData.end_time}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="repeat_interval">
                        <Form.Label>Repeat Interval</Form.Label>
                        <Form.Control
                            as="select"
                            name="repeat_interval"
                            value={formData.repeat_interval}
                            onChange={handleChange}
                        >
                            <option value="none">None</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                        </Form.Control>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        {task ? 'Save Changes' : 'Add Task'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default TaskModal;
