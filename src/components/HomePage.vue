<template>
  <div class="container">
    <HeaderPage :header="'Todo List'" />
    <ModalAdd
      :addJobs="addJobs && addJobs"
      :editJobs="editJobs && editJobs"
      :todoListLabel="todoListLabel && todoListLabel"
      :elementSelected="state.elementSelected"
      :openEditModal="state.openEditModal"
      :resetModal="resetModal"
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
            <div
              class="item-subcontent"
              :slot="'item-' + item.name + '-' + index"
              v-if="element.title !== ''"
            >
              <span @click="onEdit(element)">{{ element.title }}</span>
              <Button class="button-icon" @click="onDelete">
                <template #icon><DeleteOutlined /></template>
              </Button>
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import draggable from "vuedraggable";
import { axiosInstance } from "../axios.config";
import HeaderPage from "./HeaderPage.vue";
import ModalAdd from "./ModalAdd.vue";
import { Button, Modal } from "ant-design-vue";
import { DeleteOutlined } from "@ant-design/icons-vue";

const defaultTitle = { title: "" };

const state = reactive({
  todoList: [
    {
      name: "To Do",
      listJobs: [defaultTitle],
    },
    {
      name: "Doing",
      listJobs: [defaultTitle],
    },
    {
      name: "Done",
      listJobs: [defaultTitle],
    },
  ],
  elementSelected: {},
  openEditModal: false,
});

const todoListLabel = state.todoList.map((jobs) => {
  return { label: jobs.name, value: jobs.name };
});

const addJobs = async (values) => {
  const newValues = { ...values };
  await axiosInstance
    .post("/api/todo", {
      ...newValues,
    })
    .then(async () => {
      await getData();
    });
};

const editJobs = async (values) => {
  const newValues = { ...values };
  await axiosInstance
    .patch(`/api/todo/${newValues._id}`, {
      ...newValues,
    })
    .then(async () => {
      await getData();
    });
};

const onEdit = (element) => {
  state.elementSelected = element;
  state.openEditModal = true;
};

const resetModal = () => {
  state.elementSelected = {};
  state.openEditModal = false;
};

const getData = () => {
  axiosInstance.get("/api/todo").then((response) => {
    state.todoList = state.todoList.map((todoSection) => {
      const listJobsTemp = response?.data?.todoList?.filter((value) => {
        return value.status === todoSection.name;
      });
      return {
        name: todoSection.name,
        listJobs:
          listJobsTemp?.length > 0
            ? listJobsTemp?.length === 1
              ? [defaultTitle, ...listJobsTemp]
              : [...listJobsTemp]
            : [defaultTitle],
      };
    });
  });
};

const onDelete = () => {
  Modal.confirm({
    title: "Confirm",
    icon: createVNode(ExclamationCircleOutlined),
    content: "Bla bla ...",
    okText: "确认",
    cancelText: "取消",
  });
};

onMounted(() => {
  getData();
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
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.item-subcontent > span {
  font-weight: bold;
  color: #fff;
}
.item-subcontent:hover {
  cursor: grab;
}

.button-icon {
  background-color: transparent;
  border: none;
  color: #fff;
  z-index: 1000;
}
.button-icon:hover,
.button-icon:active,
.button-icon:focus {
  background-color: transparent;
  border: none;
  color: #fff;
  outline-color: none;
  box-shadow: none;
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
