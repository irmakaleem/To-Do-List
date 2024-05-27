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
  const value = addtaskinput.value.trim();
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
              }" class="flex transition-all duration-700 items-center p-2 justify-between w-full">
              <label for="taskbox" class="flex items-center gap-3 relative">
                  <input type="checkbox" name="taskbox" id="taskbox">
                 <span>${task}</span>
              </label>
              <div id="btnContainer" class="flex gap-2">
                  <button class="edit">
                  <img src="/images/icons/edit.png" alt="" class="size-5">
                  
                  </button>
                  <button class="cross hidden">
                  <img src="/images/icons/cross.png" alt="" class="size-5">
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
  // selecting image icon
  const editIcon = e.target;
  //selecting next element through parent element(button) which is cross button
  const crossBtn = editIcon.parentElement.nextElementSibling;
  //removing editicon
  editIcon.classList.add("hidden");
  //adding cross icon
  crossBtn.classList.remove("hidden");
  //selecting addtask div
  const addedTaskContainer = editIcon.parentElement.parentElement.parentElement;
  //highlighting the edit task line
  addedTaskContainer.classList.add("border", "border-slate-300");
  // select id attribute through getAttribute
  const idAttribute = addedTaskContainer.getAttribute("id");
  //includes is string method so if addedtask exist it returns addedtask string
  if (idAttribute.includes("addedtask")) {
    //select label through queryselector addedTaskContainer is a row where we want to select label -> span
    const selectLabel = addedTaskContainer.querySelector("label span");
    // here i select text content of selected label
    const selectLabelText = selectLabel.textContent.trim();
    //assigning addtaskinput field a value (selectlabeltext)
    addtaskinput.value = selectLabelText;
    //removing addbtn
    addBtn.classList.add("hidden");
    //showing editbtn
    editBtn.classList.remove("hidden");

    //crossbtn event listener
    crossBtn.addEventListener("click", function () {
      //showing edit icon
      editIcon.classList.remove("hidden");
      //removing cross btn
      crossBtn.classList.add("hidden");
      //showing addbtn
      addBtn.classList.remove("hidden");
      //removing editbtn
      editBtn.classList.add("hidden");
      //removing border when cross btn clicked
      addedTaskContainer.classList.remove("border", "border-slate-300");
      //showing empty input field when crossbtn clicked
      addtaskinput.value = "";
    });
    editBtn.addEventListener("click", () => {
      editedEventListener(
        selectLabel,
        selectLabelText,
        addedTaskContainer,
        editIcon,
        crossBtn
      );
    });
  } else {
    alert("click again");
  }
}

// edited eventListener
function editedEventListener(
  selectLabel,
  selectLabelText,
  addedTaskContainer,
  editIcon,
  crossBtn
) {
  //assigning addtaskinput field value to newValue
  const newValue = addtaskinput.value.trim();
  // foe each loop to check iteration select task and index (just numbering 0,1,2)
  tasks.forEach((task, index) => {
    // if task text and selected label text is same then
    if (task === selectLabelText) {
      // through splice we can remove the text from array (index is which element we want to remove and 1 is how many element want to remove)
      tasks.splice(index, 1, newValue);
      selectLabel.textContent = newValue;
      //stringify method so that array can save in local storage in the form of string
      localStorage.setItem("tasks", JSON.stringify(tasks));

      //after successfuklly eediting
      addtaskinput.value = "";
      //showing edit icon
      editIcon.classList.remove("hidden");
      //removing cross btn
      crossBtn.classList.add("hidden");

      addedTaskContainer.classList.remove("border", "border-slate-300");

      addBtn.classList.remove("hidden");
      editBtn.classList.add("hidden");
    }
  });
}

function doneTasks(e) {
  const selectLabel = e.target.parentElement;

  if (this.checked) {
    selectLabel.classList.add("active");
  } else {
    selectLabel.classList.remove("active");
  }
}
