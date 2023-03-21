<template>
  <div class="wrapper-button-modal">
    <Button
      type="primary"
      @click="
        () => {
          handleOpenModal();
        }
      "
      class="button-modal"
      ghost
    >
      Add job
    </Button>

    <Modal
      :visible="state.isOpenModal || props.openEditModal"
      :title="props.openEditModal ? 'Edit task' : 'Add task'"
      @ok="handleOk"
      @cancel="handleCloseModal"
      destroy-on-close="true"
    >
      <Form
        class="modal-form"
        ref="formRef"
        id="todoModal"
        :model="formState"
        :rules="rules"
      >
        <template #footer>
          <Button @click="handleCloseModal"> Cancel </Button>
          <Button type="primary" @click="handleOk"> Submit </Button>
        </template>

        <Form.Item
          name="title"
          label="Title"
          :label-col="{ span: 24 }"
          :wrapper-col="{ span: 24 }"
        >
          <Input v-model:value="formState.title" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          :label-col="{ span: 24 }"
          :wrapper-col="{ span: 24 }"
        >
          <Textarea rows="4" v-model:value="formState.description" />
        </Form.Item>
        <Form.Item
          name="status"
          label="Process"
          :label-col="{ span: 24 }"
          :wrapper-col="{ span: 24 }"
        >
          <Select
            :options="props.todoListLabel"
            v-model:value="formState.status"
            class="modal-select"
          />
        </Form.Item>
      </Form>
    </Modal>
  </div>
</template>

<script setup>
import { Button, Form, Input, Modal, Select, Textarea } from "ant-design-vue";
import { defineProps, reactive, ref, watch } from "vue";

const props = defineProps({
  addJobs: {
    type: Function,
    required: false,
  },
  editJobs: {
    type: Function,
    required: false,
  },
  todoListLabel: {
    type: Array,
    required: false,
  },
  elementSelected: {
    type: Object,
    required: false,
  },
  openEditModal: {
    type: Boolean,
    required: false,
  },
  resetModal: {
    type: Function,
    required: false,
  },
});

const validateTitle = async (_rule, value) => {
  if (value === "") {
    return Promise.reject("Please input the title!");
  } else {
    return Promise.resolve();
  }
};
const validateStatus = async (_rule, value) => {
  if (value === "") {
    return Promise.reject("Please input the status!");
  } else {
    return Promise.resolve();
  }
};

const rules = {
  title: [{ required: true, validator: validateTitle, trigger: "change" }],
  status: [{ required: true, validator: validateStatus, trigger: "change" }],
};

const state = reactive({
  isOpenModal: false,
});

const formState = reactive({
  title: !Object.keys(props.elementSelected).length
    ? ""
    : props.elementSelected?.title,
  description: !Object.keys(props.elementSelected).length
    ? ""
    : props.elementSelected?.description,
  status: !Object.keys(props.elementSelected).length
    ? "To Do"
    : props.elementSelected?.status,
});

const formRef = ref();

const handleOpenModal = () => {
  state.isOpenModal = true;
};

const handleCloseModal = () => {
  formRef.value.resetFields();
  if (props.openEditModal) {
    props.resetModal();
  }
  state.isOpenModal = false;
};

const handleOk = () => {
  try {
    formRef.value.validateFields();
    const values = formRef.value.getFieldsValue();

    if (values.title && values.status) {
      if (props.openEditModal) {
        props.editJobs({ ...props.elementSelected, ...values });
      } else {
        props.addJobs(values);
      }
      if (props.openEditModal) {
        props.resetModal();
      }
      state.isOpenModal = false;
      formRef.value.resetFields();
    }
  } catch (err) {
    console.log({ err });
  }
};

watch(
  () => [props.elementSelected],
  () => {
    if (Object.keys(props.elementSelected).length > 0) {
      formState.title = props.elementSelected?.title;
      formState.description = props.elementSelected?.description;
      formState.status = props.elementSelected?.status;
    } else {
      formState.title = "";
      formState.description = "";
      formState.status = "To Do";
    }
  }
);
</script>

<style>
.wrapper-button-modal {
  padding: 1rem;
}

.ant-modal-title {
  text-transform: uppercase;
}
.button-modal {
  text-transform: uppercase;
  background-color: #00796b !important;
  border-color: #00796b !important;
}

.button-modal span {
  font-weight: 700;
  color: #fff;
}

.modal-form {
  width: 100%;
}

.modal-select {
  width: 40%;
}
</style>
