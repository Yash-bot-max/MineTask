const task = document.querySelector(".task")
const add = document.querySelector(".add")
const input = document.querySelector(".add-task")
const showPending = document.querySelector("#showPending");
const deleteAllTask = document.querySelector(".deleteAllTask")
const firstTask = document.querySelector(".first-task")
const search = document.querySelector(".search")
const no = document.querySelector(".no")
const totalTask = document.querySelector(".total-task")
const unfinishedTask = document.querySelector(".unfinished-task")
const finishedTask = document.querySelector(".finished-task")
const dueDate = document.querySelector(".due-date")
const darkModeBtn = document.querySelector("#darkModeBtn");
const progressFill = document.querySelector(".progress-fill");
const progressText = document.querySelector(".progress-text");
const ratio = document.querySelector(".ratio")
const progressContainer = document.querySelector(".progress-container")
const footer = document.querySelector(".footer")
let showOnlyPending = false;
let editIndex = null;


// first store all the inserted task
let arrOfText = []
// Load tasks from LocalStorage on startup
arrOfText = JSON.parse(localStorage.getItem('arrOfTask')) || [];

function updateUI() {
    saveTask();
    renderTask();
}
function updateProgress() {

    const completedTasks = arrOfText.filter(task => task.completed).length;

    const totalTasks = arrOfText.length;

    let percentage = 0;

    if (totalTasks > 0) {

        percentage = Math.round(
            (completedTasks / totalTasks) * 100
        );

    }

    progressFill.style.width = percentage + "%";

    progressText.innerHTML = `${percentage}%`;

    ratio.innerHTML = `${completedTasks}/${totalTasks} Completed`

}
function updateStats() {
    const completedTasks = arrOfText.filter(task => task.completed).length;
    finishedTask.innerHTML = `Finished: ${completedTasks}`;
    const pendingTasks = arrOfText.filter(task => !task.completed).length;
    unfinishedTask.innerHTML = `Pending: ${pendingTasks}`;
    totalTask.innerHTML = `Total Task: ${arrOfText.length}`

}
function addText() {
    const Text = input.value.trim()
    const taskDate = dueDate.value;

    if (Text === "") {
        alert("Please enter the task first")
        return;
    }
    if (editIndex !== null) {
        //Help in replace the text as same index 
        arrOfText[editIndex].text = Text
        arrOfText[editIndex].dueDate = taskDate
        editIndex = null
    }
    else {
        //it stores input.value.trim(Text) as text and also stores the value of completed 
        arrOfText.push({ text: Text, completed: false, dueDate: taskDate })

    }
    input.value = ""
    dueDate.value = "";

}
function none() {
    unfinishedTask.style.display = "none"
    finishedTask.style.display = "none"
    totalTask.style.display = "none"
    deleteAllTask.style.display = "none"
    showPending.parentElement.style.display = "none";
    progressContainer.style.display = "none"
}

function block() {
    unfinishedTask.style.display = "block"
    finishedTask.style.display = "block"
    totalTask.style.display = "block"
    deleteAllTask.style.display = "block"
    showPending.parentElement.style.display = "block";
    progressContainer.style.display = "block"
}
function renderTask() {
    updateStats()
    updateProgress();
    if (arrOfText.length === 0) {
        none()
        firstTask.style.display = "block"


    } else {
        block()
        firstTask.style.display = "none"

    }
    let html = "";
    const searchValue = search.value.toLowerCase()
    let found = false;

    arrOfText.forEach((element, index) => {
        //this is the logic for add status according to your entered task date
        let isOverdue = false;
        let status = "";
        let statusClass = "";
        let formattedDate = "No Due Date";
        if (element.dueDate) {
            formattedDate = new Date(element.dueDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric"
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let diff = 0
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const due = new Date(element.dueDate);

        if (!isNaN(due)) {

            due.setHours(0, 0, 0, 0);
            isOverdue =
                !element.completed &&
                due < today;

        }
        if (!element.dueDate) {
            status = "No Due Date";
            statusClass = "no-date-status";
            if (element.completed) {
                status = "✅ Completed";
                statusClass = "completed-status";
            }

        }
        else if (element.completed) {
            status = "✅ Completed";
            statusClass = "completed-status";
        }
        else if (isOverdue) {
            status = "🔴 Overdue";
            statusClass = "overdue-status";
        }
        else if (due.getTime() === today.getTime()) {
            status = "🟡 Today";
            statusClass = "today-status";
        }

        else if (due.getTime() === tomorrow.getTime()) {
            status = "🟢 Tomorrow";
            statusClass = "tomorrow-status";
        }
        else {
            diff = Math.ceil(
                (due - today) / (1000 * 60 * 60 * 24)
            );
            if (diff > 10) {
                status = "Upcoming";
                statusClass = "future-status";
            }
            else {
                status = `${diff} Days Left`;
                statusClass = "future-status";
            }
        }


        if (showOnlyPending && element.completed) {
            return;
        }
        if (
            searchValue !== "" &&
            !element.text.toLowerCase().includes(searchValue)
        ) {

            return;

        }

        found = true;
        html += `<ul>
                <li> <input type="checkbox" class= "check"  data-index=${index}   ${element.completed ? "checked" : ""} name="" id="task">
                    <div class="text ${element.completed ? "completed" : ""}">${element.text}</div>
                    
               <div class="action">
               <div class="due-date ${isOverdue ? "overdue" : ""}">
                          📅 ${formattedDate}
                         <div class="status  ${statusClass}">
                                      ${status}
                                      </div>
                    <button class="edit" data-index=${index}><span class="material-symbols-outlined">
                    edit
                    </span></button>
                    <button class="delete" data-index=${index}><span class="material-symbols-outlined">
                    delete
                    </span></button>
                    </div>
                 </div>
                    </li>
                   </ul>`

    });

    if (!found) {
        if (searchValue) {
            no.textContent = "No Matched Task";
            deleteAllTask.style.display="none"
            progressContainer.style.display="none"
    
            
        }
    } else {
        no.textContent = "";
        deleteAllTask.style.display="block"
        progressContainer.style.display="block"
        
        
        
    }
    task.innerHTML = html;

}


function saveTask() {
    // Syntax: localStorage.setItem('keyName', 'stringValue');
    localStorage.setItem("arrOfTask", JSON.stringify(arrOfText));

}


task.addEventListener("click", e => {
    const deleteBtn = e.target.closest(".delete")
    const editBtn = e.target.closest(".edit")
    const check = e.target.closest(".check")
    if (deleteBtn) {
        const indexValue = deleteBtn.getAttribute("data-index");
        //array.splice(start, deleteCount, item1, item2, ..., itemN)
        arrOfText.splice(Number(indexValue), 1);
        updateUI()
    }

    if (editBtn) {
        const indexValue = editBtn.getAttribute("data-index");
        input.value = arrOfText[indexValue].text;
        dueDate.value = arrOfText[indexValue].dueDate;
        editIndex = Number(indexValue);
        input.focus();

    }

    if (check) {
        const indexValue = check.getAttribute("data-index");
        arrOfText[indexValue].completed = check.checked;
        updateUI()

    }


})
function handleAdd() {
    addText();
    updateUI();
    input.focus();

}


input.addEventListener("keydown", (e) => {
    if (input.value.trim() === "") {
        return;
    }
    if (e.key !== "Enter") return;
    if (e.key === "Enter") {

        e.preventDefault();

        dueDate.focus();

    }
});
dueDate.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        handleAdd();
    }
})

add.addEventListener("click", handleAdd);


showPending.addEventListener("change", () => {
    showOnlyPending = showPending.checked;
    renderTask()
});

deleteAllTask.addEventListener("click", () => {
    arrOfText = []
    updateUI()
})

//This is the logic for how to live filter of a task
search.addEventListener("input", () => {
    renderTask()
})

if (localStorage.getItem("theme") === "true") {

    document.body.classList.add("dark");
    darkModeBtn.textContent = "☀️";

}

// Button click
darkModeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        darkModeBtn.textContent = "☀️";

    } else {

        darkModeBtn.textContent = "🌙";

    }


    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark")
    );

});

renderTask()
