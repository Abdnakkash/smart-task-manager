"use strict";

const titleId = document.getElementById("title");
const dateId = document.getElementById("date");
const descriptionId = document.getElementById("description");
const form = document.querySelector(".form");
const taskList = document.querySelector(".task-list");
const empty = document.querySelector(".empty-state");
const taskCon = document.querySelector(".task-con");
const clear = document.querySelector(".task-clear");
const submit = document.querySelector(".btn-task");
const filterBtn = document.querySelectorAll(".filter-btn");
const input = document.getElementById("searchs");

const task = {
  tasks: [],
};

let editingTaskId = null;

//  hidden function
const hidden = function () {
  if (task.tasks.length === 0) {
    empty.classList.remove("hidden");
  } else {
    empty.classList.add("hidden");
  }
};

// render task Function
const renderTask = function (value = task.tasks) {
  taskCon.innerHTML = "";
  hidden();
  value.forEach((i) => {
    const markup = `
    <div class="task-card ${i.completed ? "completed" : ""}" data-id="${i.id}">
                  <div class="task-left">
                    <button class="task-check">
                      <i class="fa-solid fa-check"></i>
                    </button>
                    <div class="task-info">
                      <h3>${i.title}</h3>
                      <p>
                        ${i.description}
                      </p>
                    </div>
                  </div>

                  <div class="task-meta">
                    <span>
                      <i class="fa-regular fa-calendar"></i>
                     ${i.date}
                    </span>

                    <span class="task-priority priority-${i.priority}">${i.priority}</span>
                  </div>
                  <div class="task-actions">
                    <button class="edit-btn">
                      <i class="fa-solid fa-pen"></i>
                    </button>

                    <button class="delete-btn">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
     </div>
    `;
    taskCon.insertAdjacentHTML("beforeend", markup);
  });
  updateCount();
};

// event for the form to get the data
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const priority = document.querySelector(
    'input[name="priority"]:checked',
  ).value;

  const title = titleId.value;
  const date = dateId.value;
  const description = descriptionId.value;

  if (editingTaskId === null) {
    const newTask = {
      id: Date.now(),
      title: title,
      date: date,
      description: description,
      priority: priority,
      completed: false,
    };

    task.tasks.push(newTask);
  } else {
    task.tasks = task.tasks.map((taskItem) => {
      if (taskItem.id === editingTaskId) {
        return {
          ...taskItem,
          title: title,
          date: date,
          description: description,
          priority: priority,
        };
      }

      return taskItem;
    });

    editingTaskId = null;
    submit.innerHTML = `<i class="fa-solid fa-plus"></i> Add Task`;
  }

  saveTask();
  renderTask();
  form.reset();
});

//  event to delete the task
taskCon.addEventListener("click", function (e) {
  const deleteBtn = e.target.closest(".delete-btn");
  if (deleteBtn) {
    const card = e.target.closest(".task-card");
    const id = Number(card.dataset.id);
    task.tasks = task.tasks.filter((task) => task.id !== id);
    saveTask();
    renderTask();
  }
});

// event to check the task if it's completed
taskCon.addEventListener("click", function (e) {
  const btnCheck = e.target.closest(".task-check");
  const card = e.target.closest(".task-card");
  const id = Number(card.dataset.id);
  if (btnCheck) {
    task.tasks = task.tasks.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          completed: !task.completed,
        };
      }
      return task;
    });
  }
  saveTask();
  renderTask();
});

taskCon.addEventListener("click", function (e) {
  const btnEdit = e.target.closest(".edit-btn");
  const card = e.target.closest(".task-card");
  const id = Number(card.dataset.id);
  if (!btnEdit) return;
  const taskToEdit = task.tasks.find((taskItem) => taskItem.id === id);

  titleId.value = taskToEdit.title;
  dateId.value = taskToEdit.date;
  descriptionId.value = taskToEdit.description;

  document.querySelector(
    `input[name="priority"][value="${taskToEdit.priority}"]`,
  ).checked = true;

  editingTaskId = id;
  submit.textContent = "Update Task";
});

// update function to read the num of the task
const updateCount = function () {
  const allTask = document.querySelectorAll(".all-task-span");
  const pending = document.querySelectorAll(".span-pending");
  const completeT = document.querySelectorAll(".span-complete");

  const total = task.tasks.length;

  const pendingT = task.tasks.filter((task) => {
    return task.completed === false;
  }).length;

  const complete = task.tasks.filter((task) => {
    return task.completed === true;
  }).length;

  allTask.forEach((span) => (span.textContent = total));
  pending.forEach((span) => (span.textContent = pendingT));
  completeT.forEach((span) => (span.textContent = complete));
};

//  render task num  in the overview and the nav
const filterBtns = document.querySelectorAll(".filter-btn");

filterBtns.forEach(function (btn) {
  btn.addEventListener("click", function () {
    const filter = btn.dataset.filter;

    let filteredTasks;

    if (filter === "all") {
      filteredTasks = task.tasks;
    }

    if (filter === "pending") {
      filteredTasks = task.tasks.filter(
        (taskItem) => taskItem.completed === false,
      );
    }

    if (filter === "complete") {
      filteredTasks = task.tasks.filter(
        (taskItem) => taskItem.completed === true,
      );
    }

    if (filter === "high" || filter === "medium" || filter === "low") {
      filteredTasks = task.tasks.filter(
        (taskItem) => taskItem.priority.toLowerCase() === filter,
      );
    }
    if (!filteredTasks) return;
    renderTask(filteredTasks);
  });
});
// search
input.addEventListener("input", function (e) {
  const searchValue = e.target.value.toLowerCase();
  const filterTask = task.tasks.filter((value) => {
    return (
      value.title.toLowerCase().includes(searchValue) ||
      value.description.toLowerCase().includes(searchValue)
    );
  });
  renderTask(filterTask);
});

// save the task in localStorage
const saveTask = function () {
  localStorage.setItem("task", JSON.stringify(task.tasks));
};

// read the data
const loadTasks = function () {
  const data = JSON.parse(localStorage.getItem("task"));

  if (!data) return;

  task.tasks = data;
  renderTask();
};

loadTasks();

// clear all
clear.addEventListener("click", function () {
  task.tasks = [];
  saveTask();
  renderTask();
});
