<template>
  <div class="todolist">
    <TodoItem v-for="todo in todos" :todo="todo"></TodoItem>
  </div>
</template>

<script>
import TodoItem from "../TodoItem"

export default {
  name: "TodoList",
  components: {
    TodoItem,
  },
  props: {
    todos: Array
  }
}
</script>
