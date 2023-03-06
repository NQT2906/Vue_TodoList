<template>
  <span>{{ header }}</span>
</template>

<script>
export default {
  props: {
    header: String,
  },
};
</script>

<style scoped>
span {
  color: var(--vt-c-text-dark-2);
  text-transform: uppercase;
  font-weight: bold;
  font-size: 3rem;
}
</style>
