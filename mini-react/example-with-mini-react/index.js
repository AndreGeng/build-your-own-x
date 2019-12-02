/** @jsx MiniReact.createElement */
import MiniReact from "../src/mini-react";
import MiniReactDOM from "../src/mini-react-dom";
import cn from "classnames";
import "./index.pcss"

const todos = [{
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
const renderTodoItem = (item, index) => {
  return (
    <li className={cn("item", {"item--done": item.done})} onClick={(e) => {
      e.preventDefault();
      toggleTodo(item.id);
    }}>
      <input id={index} type="checkbox" checked={item.done} />
      <label htmlFor={index}>{item.txt}</label>
    </li>
  )
}
const getApp = (todos) => {
  return (
    <section>
      <h1>TODOS</h1>
      <ul>
        {todos.map(renderTodoItem)}
      </ul>
    </section>
  )
}
const toggleTodo = (id) => {
  const item = todos.filter(todo => todo.id === id)[0]
  item.done = !item.done;
  MiniReactDOM.render(getApp(todos), document.getElementById("root"));
}

MiniReactDOM.render(getApp(todos), document.getElementById("root"));
