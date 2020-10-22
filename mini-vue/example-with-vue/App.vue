<template>
  <div class="app">
    <h1>{{title}}</h1>
    <TodoForm></TodoForm>
    <TodoList :todos="todos"></TodoList>
  </div>
</template>

<script>
import TodoForm from "./components/TodoForm"
import TodoList from "./components/TodoList"

export default {
  name: "App",
  components: {
    TodoForm,
    TodoList,
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
      }]
    }
  }
}
</script>

<style>

</style>
