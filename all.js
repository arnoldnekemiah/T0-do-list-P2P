# index.js code
import './style.css';
import {
  addTask, loadTasks, renderTasks,
} from './modules/todo.js';

loadTasks();
// Call renderTasks to initially render tasks
renderTasks();

// Get the input from user
const input = document.getElementById('todo');
const button = document.querySelector('.enter');

// Add event listeners for adding a task
button.addEventListener('click', () => {
  const description = input.value;
  if (description.trim() !== '') {
    addTask(description);
    input.value = '';
  }
});

input.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    const description = input.value;
    if (description.trim() !== '') {
      addTask(description);
      input.value = '';
    }
  }
});


# todo.js-code
let tasks = [];

// Function to update the indexes of tasks
const updateIndexes = () => {
  tasks.forEach((task, index) => {
    task.index = index + 1;
  });
};

// Function to save tasks in local storage
const saveTasks = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Function to load tasks from local storage
const loadTasks = () => {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }
  return tasks;
};

// Function to delete a task
const deleteTask = (index) => {
  tasks.splice(index, 1);
  updateIndexes();
  saveTasks();
};

// Function to render tasks
const renderTasks = () => {
  const taskList = document.getElementById('task-container');
  taskList.innerHTML = '';

  // Function to edit a task
  const editTask = (index, newDescription) => {
    tasks[index].description = newDescription;
    saveTasks();
    renderTasks();
  };
  tasks.sort((a, b) => a.index - b.index);

  tasks.forEach((task, index) => {
    task.index = index + 1;
    const li = document.createElement('li');
    li.classList = 'listItems';

    // Create checkbox
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = task.completed;
    check.addEventListener('change', () => {
      task.completed = check.checked;
      saveTasks();
      renderTasks();
    });
    check.classList.add('checker');

    // Create div for task description and icons
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task-info');

    if (task.completed) {
      // Task is checked, replace ellipsis with trash icon
      const trash = document.createElement('i');
      trash.classList.add('fas', 'fa-trash');
      trash.addEventListener('click', () => {
        deleteTask(index);
        saveTasks();
        renderTasks();
      });

      taskDiv.appendChild(trash);
    } else {
      // Task is not checked, show ellipsis icon
      const ellipsis = document.createElement('i');
      ellipsis.classList.add('fas', 'fa-ellipsis-v');
      ellipsis.setAttribute('aria-hidden', 'true');

      taskDiv.appendChild(ellipsis);
    }

    // Create task description span
    const span = document.createElement('span');
    span.textContent = task.description;

    // Create input field for editing
    const input = document.createElement('input');
    input.type = 'text';
    input.value = task.description;
    input.style.display = 'none';

    input.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default behavior of the Enter key
        const newDescription = input.value.trim();
        if (newDescription !== '') {
          editTask(index, newDescription);
          span.textContent = newDescription;
          input.style.display = 'none';
          span.style.display = 'block';// Replace span with input
        }
      }
    });

    span.addEventListener('click', () => {
      if (task.completed) {
        return; // to skip editing if task is checked
      }
      input.style.display = 'block';
      span.style.display = 'none';

      input.focus();
    });

    li.appendChild(check);
    li.appendChild(taskDiv);
    li.appendChild(span);
    li.appendChild(input);

    taskList.appendChild(li);
  });
};

const clearCompletedButton = document.querySelector('.complete');
clearCompletedButton.addEventListener('click', () => {
  tasks = tasks.filter((task) => !task.completed);
  updateIndexes();
  saveTasks();
  renderTasks();
});

// Function to add a new task
const addTask = (description) => {
  const newTask = {
    description,
    completed: false,
    index: tasks.length + 1,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
};

export {
  addTask,
  deleteTask,
  loadTasks,
  renderTasks,
};
