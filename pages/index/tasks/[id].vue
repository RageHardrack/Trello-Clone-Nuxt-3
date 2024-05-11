<script setup lang="ts">
const boardStore = useBoardStore();
const route = useRoute();
const router = useRouter();
const toast = useToast();

const taskId = computed(() => {
  return route.params.id as string;
});

const task = computed(() => {
  return boardStore.getTask(taskId.value);
});

const deleteTask = () => {
  toast.add({
    title: "Task Deleted",
    description: "The task has been deleted.",
    icon: "i-heroicons-trash",
    color: "red",
  });
  boardStore.deleteTask(taskId.value);
  router.push("/");
};
</script>

<template>
  <div class="task-wrapper">
    <article class="task-view">
      <section v-if="task" class="w-full">
        <UFormGroup label="Name" class="w-full mb-4">
          <UInput type="text" v-model="task!.name" />
        </UFormGroup>

        <UFormGroup label="Description" class="w-full mb-4">
          <UTextarea v-model="task!.description!" />
        </UFormGroup>

        <UButton icon="i-heroicons-trash" color="red" @click="deleteTask">
          Delete Task
        </UButton>
      </section>

      <section v-else class="w-full">
        <p>Task not found.</p>
      </section>
    </article>
  </div>
</template>
