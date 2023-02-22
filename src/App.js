import { useEffect, useState } from "react";
import { Container, Form, Button, ListGroup } from "react-bootstrap";
import "./App.css";
import Parse from "parse";

const APPLICATION_ID = "rvedkI4PzMjTOw2HifvtCruG09Yoop4HJzF4VqXE";
const JAVASCRIPT_KEY = "b2Ye5wIDLIVaAPdyWRYH100VadSB29xAWhXwfEHz";

Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY);
Parse.serverURL = "https://parseapi.back4app.com/";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const query = new Parse.Query("Todo");
      const results = await query.find();
      const todos = results.map((result) => {
        return {
          id: result.id,
          task: result.get("task"),
          completed: result.get("completed"),
        };
      });
      setTodos(todos);
    } catch (error) {
      console.log(error);
    }
  };

  const addTodo = async () => {
    try {
      if (input.trim() !== "") {
        const Todo = Parse.Object.extend("Todo");
        const todo = new Todo();
        todo.set("task", input);
        todo.set("completed", false);
        await todo.save();
        setTodos([...todos, { id: todo.id, task: input, completed: false }]);
        setInput("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const Todo = Parse.Object.extend("Todo");
      const todo = new Todo();
      todo.id = id;
      todo.set("completed", !todos.find((todo) => todo.id === id).completed);
      await todo.save();
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const Todo = Parse.Object.extend("Todo");
      const todo = new Todo();
      todo.id = id;
      await todo.destroy();
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container className="mt-4">
      <h1 className="header">Todo App</h1>
      <Form className="form">
        <Form.Control
          type="text"
          placeholder="Add a new todo..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button variant="primary" className="add-button" onClick={addTodo}>
          Add
        </Button>
      </Form>
      <ListGroup className="list">
        {todos.map((todo) => (
          <ListGroup.Item key={todo.id} className="d-flex align-items-center">
            <div className="task">
              <Form.Check
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo.id)}
              />
              <div
                className={`flex-grow-1 ${
                  todo.completed ? "text-decoration-line-through" : ""
                }`}
              >
                {todo.task}
              </div>
            </div>
            <Button
              variant="danger"
              className="del-button"
              onClick={() => deleteTodo(todo.id)}
            >
              Delete
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}

export default App;
