/* v8 ignore start */
<template>
  <div>
    <UModal :model-value="isOpen">
      <div class="p-4 text-center">
        {{ content }}
      </div>
      <div class="flex justify-center p-4">
        <UButton @click="() => $emit('cancel')"> Cancel </UButton>
        <UButton class="ml-2" @click="() => $emit('confirm')">
          Confirm
        </UButton>
      </div>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
})

defineEmits(['cancel', 'confirm'])
</script>
