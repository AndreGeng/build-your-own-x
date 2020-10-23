<template>
  <section class="todo-form">
    <input v-model="newTodo">
    <button @click="addTodo">添加todo</button>
  </section>
</template>

<script>
export default {
  name: "TodoForm",
  data() {
    return {
      newTodo: "",
    }
  },
  methods: {
    addTodo() {
      this.$emit("addTodo", this.newTodo)
      this.newTodo = ""
    }
  }
}
</script>


<style>

</style>
