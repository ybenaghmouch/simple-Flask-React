import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TaskModal from './TaskModal';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = () => {
        axios.get('/api/tasks')
            .then(response => {
                setTasks(response.data);
            })
            .catch(error => {
                toast.error("Failed to load tasks.", {
                    position: "top-right"
                });
            });
    };

    const handleAddTask = () => {
        setSelectedTask(null);
        setShowModal(true);
    };

    const handleEditTask = (task) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    const handleDeleteTask = (taskId) => {
        axios.delete(`/api/task/${taskId}`)
            .then(response => {
                toast.success(response.data.message, {
                    position: "top-right"
                });
                fetchTasks();
            })
            .catch(error => {
                toast.error("Failed to delete task.", {
                    position: "top-right"
                });
            });
    };

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={10}>
                    <h2 className="mt-5">Task List</h2>
                    <Button className="mb-3" onClick={handleAddTask}>Add Task</Button>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Repeat Interval</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map(task => (
                                <tr key={task.id}>
                                    <td>{task.title}</td>
                                    <td>{task.description}</td>
                                    <td>{new Date(task.start_time).toLocaleString()}</td>
                                    <td>{new Date(task.end_time).toLocaleString()}</td>
                                    <td>{task.repeat_interval}</td>
                                    <td>
                                        <Button variant="warning" className="mr-2" onClick={() => handleEditTask(task)}>Edit</Button>
                                        <Button variant="danger" onClick={() => handleDeleteTask(task.id)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <TaskModal
                show={showModal}
                onHide={() => setShowModal(false)}
                task={selectedTask}
                fetchTasks={fetchTasks}
            />
            <ToastContainer />
        </Container>
    );
};

export default TaskList;
