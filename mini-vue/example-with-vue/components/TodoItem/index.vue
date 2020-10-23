<template>
  <div class="todoitem" :class="{done: todo.done}">
    <span class="align-center">{{todo.txt}}</span>
    <button class="align-center" @click="$emit('toggle')">{{todo.done ? "UnComplete" : "Complete"}}</button>
  </div>
</template>

<script>
export default {
  name: "TodoItem",
  props: {
    todo: {
      validator: (prop) => {
        const keys = Object.keys(prop)
        return ["txt", "done"].every(key => ~keys.indexOf(key))
      }
    }
  }
}
</script>

<style>
.todoitem {
  line-height: 40px;
}
.align-center {
  vertical-align: middle;
}
.done {
  text-decoration: line-through;
  color: #cac9c9;
}
</style>
