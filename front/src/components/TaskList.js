import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Table, Form } from 'react-bootstrap';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import TaskModal from './TaskModal';


const TaskList = () => {
    const { notify } = useToast();
    const [tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showEndedTasks, setShowEndedTasks] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = () => {
        axios.get('/api/tasks')
            .then(response => {
                setTasks(response.data);
            })
            .catch(error => {
                notify('error', "Failed to load tasks.");
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
                notify('success', response.data.message);
                fetchTasks();
            })
            .catch(error => {
                notify('error', "Failed to delete task.");
            });
    };

    const handleToggleEndedTasks = () => {
        setShowEndedTasks(!showEndedTasks);
    };

    const isCurrentTask = (task) => {
        const now = new Date();
        const startTime = new Date(new Date(task.start_time).getTime() - 60 * 60 * 1000); // subtract 1 hour
        const endTime = new Date(new Date(task.end_time).getTime() - 60 * 60 * 1000); // subtract 1 hour

        console.log('Current Time:', now.toISOString());
        console.log('Task Start Time:', startTime.toISOString());
        console.log('Task End Time:', endTime.toISOString());
        console.log('desiion :', startTime <= now && endTime >= now, " ",task.title);
        return startTime <= now && endTime >= now;
    };

    const filteredTasks = showEndedTasks
        ? tasks
        : tasks.filter(task => new Date(new Date(task.end_time).getTime() - 60 * 60 * 1000) > new Date());

    const sortedTasks = filteredTasks.sort((a, b) => {
        if (isCurrentTask(a)) return -1;
        if (isCurrentTask(b)) return 1;
        return 0;
    });

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={10}>
                    <h2 className="mt-5">Task List</h2>
                    <Button className="mb-3" onClick={handleAddTask}>Add Task</Button>
                    <Form.Check 
                        type="switch"
                        id="toggle-ended-tasks"
                        label="Show Ended Tasks"
                        checked={showEndedTasks}
                        onChange={handleToggleEndedTasks}
                        className="mb-3"
                    />
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
                            {sortedTasks.map(task => (
                                <tr key={task.id} className={isCurrentTask(task) ? 'table-success' : ''}>
                                    <td >{task.title} </td>
                                    <td>{task.description}</td>
                                    <td>{new Date(new Date(task.start_time).getTime() - 60 * 60 * 1000).toLocaleString()}</td>
                                    <td>{new Date(new Date(task.end_time).getTime() - 60 * 60 * 1000).toLocaleString()}</td>
                                    <td>{task.repeat_interval}</td>
                                    <td>
                                        <Button variant="warning" className="mr-2" onClick={() => handleEditTask(task)}>Edit</Button>
                                        <span> </span>
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
        </Container>
    );
};

export default TaskList;
