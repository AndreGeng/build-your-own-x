<template>
  <div class="app">
    <h1>{{title}}</h1>
    <TodoForm @addTodo="addTodo"></TodoForm>
    <TodoFilter v-model="filter"></TodoFilter>
    <TodoList :todos="filteredTodos" @toggleTodo="toggleTodo"></TodoList>
  </div>
</template>

<script>
import TodoForm from "./components/TodoForm"
import TodoList from "./components/TodoList"
import TodoFilter from "./components/TodoFilter"

export default {
  name: "App",
  components: {
    TodoForm,
    TodoList,
    TodoFilter,
  },
  data() {
    return {
      title: "Todo App",
      todos: [{
        txt: "dinner with my friends",
        done: false,
      }, {
        txt: "visit parents and children",
        done: false,
      }],
      filter: "all",
    }
  },
  methods: {
    toggleTodo(todo) {
      console.log("App: toggleTodo")
      todo.done = !todo.done
    },
    addTodo(txt) {
      console.log("App: addTodo")
      this.todos.unshift({
        txt,
        done: false,
      })
    }
  },
  computed: {
    filteredTodos() {
      const filter = this.filter
      return this.todos.filter((todo) => {
        switch(filter) {
          case "all":
            return true;
          case "uncompleted":
            return todo.done === false;
          case "completed":
            return todo.done === true;
        }
      })
    }
  }
}
</script>

<style>

</style>
