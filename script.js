const taskInput = document.querySelector('.task-input input');
const filters = document.querySelectorAll('.filters span');
const taskBox = document.querySelector('.task-box');

let editId;
let isEditedTask = false;

let todos = JSON.parse(localStorage.getItem('todo-list'));

filters.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('span.active')?.classList.remove("active");
    btn.classList.add('active');
    showTodo(btn.id);
  })
})

function showTodo(filter = 'all') {
  let li = "";
  if(todos) {
    todos.forEach((todo, id) => {
      let isCompleted = todo.status == 'completed' ? 'checked' : '';
      if(filter == todo.status || filter == 'all') {
        li += `
        <li class="task">
          <label for="${id}">
            <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted && 'checked'}>
            <p class="${isCompleted}">${todo.name}</p>
          </label>
          <div class="settings">
            <i onclick="showMenu(this)" id="${id}" class="uil uil-ellipsis-h"></i>
            <ul class="task-menu">
              <li onclick="editTask(${id}, '${todo.name}')"><i class="uil uil-pen"></i>Edit</li>
              <li onclick="deleteTask(${id})"><i class="uil uil-trash"></i>Delete</li>
            </ul>
          </div>
        </li>
        `
      }
    });
  }

  taskBox.innerHTML = li;
}

showTodo();

function showMenu(selectedTask) {
  let taskMenu = selectedTask.parentElement.lastElementChild;
  taskMenu.classList.add('show');
  document.addEventListener('click', e => {
    if(e.target.tagName != 'I' || e.target != selectedTask) {
      taskMenu.classList.remove('show'); 
    }
  })
}

function editTask(taskId, taskName) {
  isEditedTask = true
  editId = taskId;
  taskInput.value = taskName;

}

function updateStatus(selectedTask) {
  let taskName = selectedTask.parentElement.lastElementChild;
  if(selectedTask.checked) {
    taskName.classList.add('checked');
    todos[selectedTask.id].status = "completed";
  } else {
    taskName.classList.remove('checked');
    todos[selectedTask.id].status = "pending";
  }
  localStorage.setItem('todo-list', JSON.stringify(todos));
}

function deleteTask(deleteId) {
  todos.splice(deleteId, 1);
  localStorage.setItem('todo-list', JSON.stringify(todos));
  showTodo();
}

taskInput.addEventListener('keyup', (e) => {
  let userTask = taskInput.value.trim();

  if(e.key == "Enter" && userTask) {
    if(!isEditedTask) {
      if(!todos) {
        todos = []
      }
      let taskInfo = {name: userTask, status: "pending"};
      todos.push(taskInfo);
    } else {
      todos[editId].name = userTask;
      isEditedTask = false;
    }
    
    e.target.value = '';
    localStorage.setItem('todo-list', JSON.stringify(todos));
    showTodo()
  }
})