<template>
  <select class="filter" :value="value" @change="$emit('input', $event.target.value)">
    <option value="all">全部</option>
    <option value="uncompleted">未完成</option>
    <option value="completed">完成</option>
  </select>
</template>

<script>
export default {
  name: "TodoFilter",
  props: {
    value: String,
  },
}
</script>

<style>
.filter {
  margin: 10px 0;
}
</style>
