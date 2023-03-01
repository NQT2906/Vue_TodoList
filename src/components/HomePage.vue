<template>
  <div class="container">
    <HeaderPage v-bind:header="Todo List" />
    <div class="content">
      <div
        v-for="(item, index) in state.todoList"
        :key="index"
        class="item-content"
      >
        <div class="sub-container">
          <div class="item-content-header">{{ item.name }}</div>
          <div
            class="item-subcontent"
            v-for="(subItem, subIndex) in item.listJobs"
            :key="subIndex"
          >
            <div>{{ subItem }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";
import HeaderPage from "./HeaderPage.vue";

const state = reactive({
  count: 0,
  count1: 0,
  todoList: [
    {
      name: "Todo",
      listJobs: ["Xem phim"],
    },
    {
      name: "Doing",
      listJobs: ["Netflix and chill"],
    },
    {
      name: "Done",
      listJobs: ["Học bài"],
    },
  ],
});

watch([() => state.count, () => state.count1], (newValues, oldValues) => {
  console.log("New values:", newValues);
  console.log("Old values:", oldValues);
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.content {
  display: flex;
  flex-direction: row;
  margin-left: 2rem;
  width: 90%;
}

.item-content {
  display: flex;
  align-self: stretch;
  width: 100%;
}

.sub-container {
  margin-right: 2rem;
  border: 1px solid #fff;
  border-radius: 8px;
  width: 100%;
}

.item-content-header {
  text-align: center;
  border-bottom: 1px solid #fff;
  width: 100%;
  font-weight: bold;
  color: #fff;
  padding: 0.5rem;
}

.item-subcontent {
  padding: 0.5rem;
}
</style>
