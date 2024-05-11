import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import boardData from "~/data/board.json";
import { v4 as uuid } from "uuid";

export const useBoardStore = defineStore("boardStore", () => {
  // #region STATE
  const board = useStorage("board", boardData);

  // #region TASKS
  const getTask = computed(() => {
    return (taskId: string) => {
      for (const column of board.value.columns) {
        const task = column.tasks.find((task) => task.id === taskId);
        if (task) return task;
      }
    };
  });

  const addTask = (taskName: string, columnIndex: number) => {
    board.value.columns[columnIndex].tasks.push({
      id: uuid(),
      name: taskName,
      description: "",
    });
  };

  const moveTask = ({
    fromTaskIndex,
    toTaskIndex,
    fromColumnIndex,
    toColumnIndex,
  }: {
    fromTaskIndex: string;
    toTaskIndex?: number;
    fromColumnIndex: string;
    toColumnIndex: number;
  }) => {
    const task = board.value.columns[Number(fromColumnIndex)].tasks.splice(
      Number(fromTaskIndex),
      1
    )[0];

    board.value.columns[toColumnIndex].tasks.splice(toTaskIndex!, 0, task);
  };

  const deleteTask = (taskId: string) => {
    for (const column of board.value.columns) {
      const taskIndex = column.tasks.findIndex((task) => task.id === taskId);

      if (taskIndex !== -1) {
        column.tasks.splice(taskIndex, 1);
        return;
      }
    }
  };

  // #region COLUMNS
  const addColumn = (columnName: string) => {
    board.value.columns.push({
      id: uuid(),
      name: columnName,
      tasks: [],
    });
  };

  const moveColumn = ({
    fromColumnIndex,
    toColumnIndex,
  }: {
    fromColumnIndex: string;
    toColumnIndex: number;
  }) => {
    const column = board.value.columns.splice(Number(fromColumnIndex), 1)[0];

    board.value.columns.splice(toColumnIndex, 0, column);
  };

  const deleteColumn = (columnIndex: number) => {
    board.value.columns.splice(columnIndex, 1);
  };

  return {
    //? STATE
    board,
    //? GETTERS
    getTask,
    //? ACTIONS
    addTask,
    moveTask,
    deleteTask,
    addColumn,
    moveColumn,
    deleteColumn,
  };
});
