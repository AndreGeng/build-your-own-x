import React from "react";
import ReactDOM from "react-dom";
import cn from "classnames";
import { normalize, schema } from "normalizr";
import produce, { original } from "immer";

import "./index.pcss";

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
class TodoItem extends React.Component {
  render() {
    const {
      done,
      id,
      txt,
      onChange,
    } = this.props;
    return (
      <li className={cn("item", { "item--done": done })}>
        <input onChange={ () => onChange(id) } id={ id } type="checkbox" checked={ done } /><label htmlFor={id}>{txt}</label>
      </li>
    )
  }
}
class App extends React.Component {
  constructor(props) {
    super(props);
    const todo = new schema.Entity('todos');
    const todoSchema = [todo];
    const todoNormalize = normalize(todos, todoSchema);
    this.state = {
      todos: {
        byId: todoNormalize.entities.todos,
        allIds: todoNormalize.result,
      }
    };
  }
  onItemStatusChange = (id) => {
    this.setState(produce(draft => {
      draft.todos.byId[id].done = !original(draft.todos.byId[id]).done
    }))
  }
  renderList() {
    const { todos } = this.state;
    return todos.allIds.map(id => {
      const item = todos.byId[id];
      return <TodoItem { ...item } onChange={this.onItemStatusChange} />;
    })
  }
  render() {
    return (
      <section className="app">
        <h1>TODOS</h1>
        {this.renderList()}
      </section>
    )
  }
}

ReactDOM.render(<App />, document.getElementById("root"))
