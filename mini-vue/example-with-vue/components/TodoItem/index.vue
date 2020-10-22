<template>
  <div class="todoitem">
    <input type="radio" class="align-center">
    <span class="align-center">{{todo.txt}}</span>
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
</style>
