<script setup>
defineProps({
  message: {
    type: String,
    required: true,
  },
  rawHtml: {
    type: String,
    required: false,
  },
});
</script>

<template>
  <Button>{{ message }}</Button>
  <p>Using text interpolation: {{ rawHtml }}</p>
  <p>Using v-html directive: <span v-html="rawHtml"></span></p>
</template>
