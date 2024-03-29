<template>
  <Spin :spinning="state.loading" wrapper-class-name="spin-loading">
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
            @change="onDragChange"
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
                <span @click="onEdit(element, item.name)">{{
                  element.title
                }}</span>
                <Button class="button-icon" @click="onDelete(element)">
                  <template #icon><DeleteOutlined /></template>
                </Button>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
  </Spin>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import draggable from "vuedraggable";
import { axiosInstance } from "../axios.config";
import HeaderPage from "./HeaderPage.vue";
import ModalAdd from "./ModalAdd.vue";
import { Button, Modal, Spin } from "ant-design-vue";
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
  loading: false,
});

const onDragChange = async (event) => {
  const keys = Object.keys(event);
  if (keys.includes("removed") || keys.includes("moved")) {
    const newValues = [...state.todoList].map((todoValue) => {
      return {
        ...todoValue,
        listJobs: todoValue.listJobs
          .map((subValue, index) => {
            if (index !== 0) {
              return {
                ...subValue,
                status: todoValue.name,
                index: todoValue.listJobs.length - index,
              };
            } else {
              return null;
            }
          })
          .filter((subValue) => subValue),
      };
    });
    await axiosInstance.post(
      "/api/todo/bulk",
      {
        todoList: newValues,
      },
      { params: { id: "Test" } }
    );
  } else if (keys.includes("added")) {
  }
};

const todoListLabel = state.todoList.map((jobs) => {
  return { label: jobs.name, value: jobs.name };
});

const addJobs = async (values) => {
  const newValues = { ...values };
  state.loading = true;
  await axiosInstance
    .post("/api/todo", {
      ...newValues,
    })
    .then(async () => {
      await getData();
    })
    .finally(() => {
      state.loading = false;
    });
};

const editJobs = async (values) => {
  const newValues = { ...values };
  state.loading = true;
  await axiosInstance
    .patch(`/api/todo/${newValues._id}`, {
      ...newValues,
    })
    .then(async () => {
      await getData();
    })
    .finally(() => {
      state.loading = false;
    });
};

const onEdit = (element, status) => {
  state.elementSelected = { ...element, status };
  state.openEditModal = true;
};

const resetModal = () => {
  state.elementSelected = {};
  state.openEditModal = false;
};

const getData = () => {
  state.loading = true;
  axiosInstance
    .get("/api/todo")
    .then((response) => {
      state.todoList = state.todoList.map((todoSection) => {
        const listJobsTemp = response?.data?.todoList?.filter((value) => {
          return value.status === todoSection.name;
        });
        return {
          name: todoSection.name,
          listJobs:
            listJobsTemp?.length > 0
              ? [defaultTitle, ...listJobsTemp]
              : [defaultTitle],
        };
      });
    })
    .finally(() => {
      state.loading = false;
    });
};

const onDelete = (element) => {
  const newValues = { ...element };
  Modal.confirm({
    title: "Delete task",
    content: "Are you sure to delete it?",
    okText: "Delete",
    cancelText: "Cancel",
    maskClosable: true,
    onOk: async () => {
      state.loading = true;

      await axiosInstance
        .delete(`/api/todo`, {
          params: {
            id: newValues._id,
          },
        })
        .then(async () => {
          await getData();
        })
        .finally(() => {
          state.loading = false;
        });
    },
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

.spin-loading {
  width: 100%;
  height: 100%;
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
