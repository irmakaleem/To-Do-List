const addtaskinput = document.getElementById("addtaskinput");
const addBtn = document.getElementById("addBtn");
const editBtn = document.getElementById("editBtn");
const localstoragetasks = localStorage.getItem("tasks");
const parsedLocalStorageTasks = localstoragetasks
  ? JSON.parse(localstoragetasks)
  : [];
const tasks = parsedLocalStorageTasks.length > 0 ? parsedLocalStorageTasks : [];
const tasksContainer = document.getElementById("tasks-container");

document.addEventListener("DOMContentLoaded", async function () {
  addBtn.addEventListener("click", addTasks);
  await addTaskInHtml();
  //adding event listener to already added tasks
  addingEventListeners();
});

function addingEventListeners() {
  //edit tasks
  const editBtnArray = document.querySelectorAll(".edit");
  editBtnArray.forEach((edit) => {
    edit.addEventListener("click", editTasks);
  });
  //delete Tasks
  const deleteBtnArray = document.querySelectorAll(".deleteBtn img");
  deleteBtnArray.forEach((del) => {
    del.addEventListener("click", deleteTasks);
  });
  //done tasks
  const checkboxArray = document.querySelectorAll("input[type=checkbox]");
  checkboxArray.forEach((checkbox) => {
    checkbox.addEventListener("change", doneTasks);
  });
}

//ADDING TASKS
async function addTasks() {
  const value = addtaskinput.value;
  if (value !== "") {
    tasks.push(value);
    const stringified = JSON.stringify(tasks);
    localStorage.setItem("tasks", stringified);
    await addTaskInHtml();
    //adding event listener to new tasks
    addingEventListeners();
    addtaskinput.value = "";
  } else {
    alert("please enter some text");
  }
}
//ADDING TASKS IN HTML

async function addTaskInHtml() {
  tasksContainer.innerHTML = "";
  if (tasks.length > 0) {
    tasks.forEach((task, index) => {
      tasksContainer.innerHTML += `
              <div id="addedtask-${
                index + 1
              }" class="flex items-center pt-2 justify-between w-full">
              <label for="taskbox" class="flex items-center gap-3 relative">
                  <input type="checkbox" name="taskbox" id="taskbox">
                 ${task}
              </label>
              <div id="btnContainer" class="flex gap-2">
                  <button class="edit">
                  <img src="/images/icons/edit.png" alt="" class="size-5">
                  </button>
                  <button class="deleteBtn">
                  <img src="/images/icons/delete.png" alt="" class="size-5">
                  </button>
              </div>
          </div>
              `;
    });
  }
}

//DELETING TASKS
function deleteTasks(e) {
  // selecting addedtask div
  const addedTaskContainer = e.target.parentElement.parentElement.parentElement;
  // select id attribute through getAttribute
  const idAttribute = addedTaskContainer.getAttribute("id");
  //includes is string method so if addedtask exist it returns addedtask string
  if (idAttribute.includes("addedtask")) {
    //select label through queryselector addedTaskContainer is a row where we want to select label
    const selectLabel = addedTaskContainer.querySelector("label");
    // here i select text content of selected label
    const selectLabelText = selectLabel.textContent.trim();
    // foe each loop to check iteration select task and index (just numbering 0,1,2)
    tasks.forEach((task, index) => {
      // if task text and selected label text is same then
      if (task === selectLabelText) {
        // through splice we can remove the text from array (index is which element we want to remove and 1 is how many element want to remove)
        tasks.splice(index, 1);
        //just remove the addedtask row (html of the clicked row)
        addedTaskContainer.remove();
        //stringify method so that array can save in local storage in the form of string
        localStorage.setItem("tasks", JSON.stringify(tasks));
      }
    });
  } else {
    alert("click again");
  }
}

//EDITING TASKS
function editTasks(e) {
  // selecting addedtask div
  const addedTaskContainer = e.target.parentElement.parentElement.parentElement;
  //highlighting the edit task line
  addedTaskContainer.style.background = "red";
  // select id attribute through getAttribute
  const idAttribute = addedTaskContainer.getAttribute("id");
  //includes is string method so if addedtask exist it returns addedtask string
  if (idAttribute.includes("addedtask")) {
    //select label through queryselector addedTaskContainer is a row where we want to select label
    const selectLabel = addedTaskContainer.querySelector("label");
    // here i select text content of selected label
    const selectLabelText = selectLabel.textContent.trim();

    addtaskinput.value = selectLabelText;
    addBtn.classList.add("hidden");
    editBtn.classList.remove("hidden");

    editBtn.addEventListener("click", function (e) {
      const newValue = addtaskinput.value;
      // foe each loop to check iteration select task and index (just numbering 0,1,2)
      tasks.forEach((task, index) => {
        // if task text and selected label text is same then
        if (task === selectLabelText) {
          // through splice we can remove the text from array (index is which element we want to remove and 1 is how many element want to remove)
          tasks.splice(index, 1, newValue);
          addTaskInHtml();
          //stringify method so that array can save in local storage in the form of string
          localStorage.setItem("tasks", JSON.stringify(tasks));

          //after successfuklly eediting
          addtaskinput.value = "";
          addBtn.classList.remove("hidden");
          editBtn.classList.add("hidden");
        }
      });
    });
  } else {
    alert("click again");
  }
}

function doneTasks(e) {
  const selectLabel = e.target.parentElement;

  if (this.checked) {
    selectLabel.classList.add("active");
  } else {
    selectLabel.classList.remove("active");
  }
}
