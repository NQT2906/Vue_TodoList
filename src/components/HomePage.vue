<template>
  <div class="container">
    <HeaderPage :header="'Todo List'" />
    <ModalAdd
      :addJobs="addNewJob && addNewJob"
      :todoListLabel="todoListLabel && todoListLabel"
    />
    <div class="content">
      <div
        class="sub-container"
        v-for="(item, index) in state.todoList"
        :key="index"
      >
        <div class="item-content-header">{{ item.name }}</div>
        <draggable
          class="item-content"
          :list="item.listJobs"
          group="item.name"
          :item-key="item.name"
        >
          <template
            v-for="_element in item.listJobs"
            :key="element.id"
            v-slot:item="{ element }"
          >
            <div class="item-subcontent" :slot="'item2-' + index">
              {{ element }}
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from "vue";
import HeaderPage from "./HeaderPage.vue";
import ModalAdd from "./ModalAdd.vue";
import draggable from "vuedraggable";

const state = reactive({
  todoList: [
    {
      name: "Todo",
      listJobs: ["Xem phim", "Xem phim1", "Xem phim2"],
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

const todoListLabel = state.todoList.map((jobs) => {
  return { label: jobs.name, value: jobs.name };
});

const addNewJob = (newJob, at) => {
  if (state.todoList) {
    state.todoList = state.todoList.map((jobs) => {
      if (jobs.name === at) {
        return {
          name: jobs.name,
          listJobs: [newJob, ...jobs.listJobs],
        };
      } else {
        return jobs;
      }
    });
  }
};
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

.sub-container {
  margin-right: 2rem;
  border: 1px solid #fff;
  border-radius: 8px;
  width: 100%;
  height: 300px;
}
.item-content-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #fff;
  width: 100%;
  font-weight: bold;
  color: #fff;
  padding: 0.5rem;
  height: 50px;
  position: absolute;
}

.item-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 248px;
  overflow-y: auto;
  margin-top: 50px;
  padding: 5px 10px;
}

.item-subcontent {
  padding: 0.5rem;
  margin: 5px;
  background-color: #00796b;
  font-weight: bold;
  color: #fff;
}
.item-subcontent:hover {
  cursor: grab;
}

::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
