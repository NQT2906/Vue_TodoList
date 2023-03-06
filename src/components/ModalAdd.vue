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
    >
      Add job
    </Button>

    <Modal
      :visible="state.isOpenModal"
      title="Add new Todo task"
      @ok="
        () => {
          handleOk();
        }
      "
      @cancel="
        () => {
          handleCloseModal();
        }
      "
    >
      <Form class="modal-form" :model="formState">
        <Form.Item name="inputValue" label="Content">
          <Input v-model:value="formState.inputValue" />
        </Form.Item>
        <Form.Item name="selectedValue" label="Process">
          <Select
            :options="props.todoListLabel"
            v-model:value="formState.selectedValue"
            class="modal-select"
          />
        </Form.Item>
      </Form>
    </Modal>
  </div>
</template>

<script setup>
import { reactive, defineProps, ref } from "vue";
import { Modal, Input, Button, Select, Form } from "ant-design-vue";

const props = defineProps({
  addJobs: {
    type: Function,
    required: false,
  },
  todoListLabel: {
    type: Array,
    required: false,
  },
});

const state = reactive({
  isOpenModal: false,
});

const formState = reactive({
  inputValue: "",
  selectedValue: undefined,
});

const handleOpenModal = () => {
  state.isOpenModal = true;
};

const handleCloseModal = () => {
  state.isOpenModal = false;
};

const handleOk = () => {
  props.addJobs(formState.inputValue, formState.selectedValue);
  state.isOpenModal = false;
  formState.inputValue = "";
  formState.selectedValue = "";
};
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
}

.button-modal span {
  font-weight: 700;
}

.modal-form {
  width: 100%;
}

.modal-select {
  width: 40%;
  margin-top: 1rem !important;
}
</style>
