/** @jsx MiniReact.createElement */
import MiniReact from "../src/mini-react";
import MiniReactDOM from "../src/mini-react-dom";
import cn from "classnames";
import PropTypes from "prop-types";
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
const TodoItem = ({ done, id, txt, onChange }) => {
  return (
    <li className={cn("item", { "item--done": done })}>
      <input onChange={ () => onChange(id) } id={ id } type="checkbox" checked={ done } /><label htmlFor={id}>{txt}</label>
    </li>
  )
}
TodoItem.propTypes = {
  done: PropTypes.boolean,
  id: PropTypes.string,
  txt: PropTypes.string,
  onChange: PropTypes.func,
}
class App extends MiniReact.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos,
    };
    this.renderTodoItem = this.renderTodoItem.bind(this);
    this.toggleTodo = this.toggleTodo.bind(this);
  }
  renderTodoItem (item) {
    return (
      <TodoItem 
        {...item}
        onChange={this.toggleTodo}
      />
    )
  }
  toggleTodo(id) {
    const { todos } = this.state;
    const newTodos = todos.map(todo => {
      if (todo.id === id) {
        return Object.assign({}, todo, {
          done: !todo.done,
        });
      }
      return todo;
    });
    this.setState({
      todos: newTodos,
    })
  }
  render() {
    return (
      <section>
        <h1>TODOS</h1>
        <ul>
        {this.state.todos.map(this.renderTodoItem)}
        </ul>
      </section>
    )
  }
}

MiniReactDOM.render(<App />, document.getElementById("root"));
