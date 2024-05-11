<script setup lang="ts">
// #region PROPS
interface Props {
  column: {
    id: string;
    name: string;
    tasks: {
      id: string;
      name: string;
      description: string;
    }[];
  };
  columnIndex: number;
}

enum DragType {
  COLUMN = "column",
  TASK = "task",
}

const props = defineProps<Props>();

const router = useRouter();
const boardStore = useBoardStore();

const editNameState = ref(false);
const newTaskName = ref("");

const addNewTask = () => {
  boardStore.addTask(newTaskName.value, props.columnIndex);
  newTaskName.value = "";
};

const goToTask = (taskId: string) => {
  router.push(`tasks/${taskId}`);
};

const deleteColumn = (columnIndex: number) => {
  boardStore.deleteColumn(columnIndex);
};

const pickUpTask = (
  e: DragEvent,
  {
    fromColumnIndex,
    fromTaskIndex,
  }: { fromColumnIndex: number; fromTaskIndex: number }
) => {
  e.dataTransfer!.effectAllowed = "move";
  e.dataTransfer!.dropEffect = "move";
  e.dataTransfer!.setData("type", DragType.TASK);
  e.dataTransfer!.setData("from-column-index", fromColumnIndex.toString());
  e.dataTransfer!.setData("from-task-index", fromTaskIndex.toString());
};

const pickUpColumn = (e: DragEvent, fromColumnIndex: number) => {
  e.dataTransfer!.effectAllowed = "move";
  e.dataTransfer!.dropEffect = "move";
  e.dataTransfer!.setData("type", DragType.COLUMN);
  e.dataTransfer!.setData("from-column-index", fromColumnIndex.toString());
};

const dropItem = (
  e: DragEvent,
  {
    toColumnIndex,
    toTaskIndex,
  }: { toColumnIndex: number; toTaskIndex?: number }
) => {
  const type = e.dataTransfer!.getData("type");
  const fromColumnIndex = e.dataTransfer!.getData("from-column-index");

  if (type === DragType.TASK) {
    const fromTaskIndex = e.dataTransfer!.getData("from-task-index");

    boardStore.moveTask({
      fromTaskIndex,
      toTaskIndex,
      fromColumnIndex,
      toColumnIndex,
    });
  } else if (type === DragType.COLUMN) {
    boardStore.moveColumn({
      fromColumnIndex,
      toColumnIndex,
    });
  }
};
</script>

<template>
  <UContainer
    class="column"
    draggable="true"
    @dragstart.self="pickUpColumn($event, columnIndex)"
    @dragenter.prevent
    @dragover.prevent
    @drop="dropItem($event, { toColumnIndex: columnIndex })"
  >
    <header class="column-header mb-4">
      <div>
        <UInput v-if="editNameState" type="text" v-model="props.column.name" />
        <h2 v-else>{{ props.column.name }}</h2>
      </div>

      <div>
        <UButton
          icon="i-heroicons-pencil-square"
          class="mr-2"
          @click="editNameState = !editNameState"
        />
        <UButton
          icon="i-heroicons-trash"
          color="red"
          @click="deleteColumn(columnIndex)"
        />
      </div>
    </header>

    <ul>
      <li v-for="(task, taskIndex) in column.tasks" :key="task.id">
        <UCard
          class="mb-4"
          @click="goToTask(task.id)"
          draggable="true"
          @dragstart="
            pickUpTask($event, {
              fromColumnIndex: columnIndex,
              fromTaskIndex: taskIndex,
            })
          "
          @drop.stop="
            dropItem($event, {
              toColumnIndex: columnIndex,
              toTaskIndex: taskIndex,
            })
          "
        >
          <strong>{{ task.name }}</strong>
          <p>{{ task.description }}</p>
        </UCard>
      </li>
    </ul>

    <UInput
      v-model="newTaskName"
      type="text"
      placeholder="Create new task"
      icon="i-heroicons-plus-circle-solid"
      @keyup.enter="addNewTask"
    />
  </UContainer>
</template>
