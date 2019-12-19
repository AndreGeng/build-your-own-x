/** @jsx MiniReact.createElement */
import MiniReact, { useState, useCallback } from "../src/mini-react";
import MiniReactDOM from "../src/mini-react-dom";
import cn from "classnames";
import PropTypes from "prop-types";
import "./index.pcss"

const todoList = [{
  id: 1,
  txt: "起床",
  done: true,
}, {
  id: 2,
  txt: "洗漱",
  done: false,
}, {
  id: 3,
  txt: "打酱油",
  done: false,
}]
// let i = 4;
// while (i < 10000) {
//   todoList.push({
//     id: i,
//     txt: i,
//     done: false,
//   });
//   i++;
// }
const TodoItem = ({ done, id, txt, onChange }) => {
  return (
    <li className={cn("item", { "item--done": done })}>
      <input onChange={() => onChange(id)} id={ id } type="checkbox" checked={ done } /><label htmlFor={id}>{txt}</label>
    </li>
  )
}
TodoItem.propTypes = {
  done: PropTypes.boolean,
  id: PropTypes.string,
  txt: PropTypes.string,
  onChange: PropTypes.func,
}
const App = () => {
  const [todos, setTodos] = useState(todoList);
  const [count, setCount] = useState(0);
  const renderTodoItem = (item) => {
    return (
      <TodoItem 
        {...item}
        onChange={toggleTodo}
      />
    )
  };
  const toggleTodo = useCallback((id) => {
    setTodos((todos) => {
      const newTodos = todos.map(todo => {
        if (todo.id === id) {
          return Object.assign({}, todo, {
            done: !todo.done,
          });
        }
        return todo;
      });
      return newTodos;
    });
    setCount(count => count + 1);
  }, [todos, count])
  return (
    <section>
      <h1>TODOS</h1>
      <p>点击数：{count}</p>
      <ul>
      {todos.map(renderTodoItem)}
      </ul>
    </section>
  )
}

MiniReactDOM.render(<App />, document.getElementById("root"));
