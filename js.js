let tasks = [];

const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

const loadTasks = () => {
    const stored = localStorage.getItem("tasks");
    tasks = stored ? JSON.parse(stored) : [];
};


const fakeApi = {
    getTasks: () => {
        return new Promise(resolve => {
            setTimeout(() => resolve(tasks), 400);
        });
    },

    addTask: (task) => {
        return new Promise(resolve => {
            setTimeout(() => {
                tasks.push(task);
                saveTasks();
                resolve(task);
            }, 400);
        });
    }
};


const updateTasksList = () => {
    const tasklist = document.getElementById('tasklist');
    tasklist.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");

        li.innerHTML = `
            <div class="taskItem">
                <div class="task ${task.completed ? "completed" : ""}">
                    <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""}>
                    <p>${task.text}</p>
                </div>
                <div class="icons">
                    <img src="img/edit.png" onclick="editTask(${index})">
                    <img src="img/bin.png" onclick="deleteTask(${index})">
                </div>
            </div>
        `;

        li.querySelector(".checkbox").addEventListener("change", () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            updateTasksList();
            updateStats();
        });

        tasklist.appendChild(li);
    });
};

const updateStats = () => {
    const done = tasks.filter(t => t.completed).length;
    const total = tasks.length;

    document.getElementById("numbers").textContent = `${done}/${total}`;

    const percent = total > 0 ? (done / total) * 100 : 0;
    document.getElementById("progress").style.width = percent + "%";
};

const deleteTask = (i) => {
    tasks.splice(i, 1);
    saveTasks();
    updateTasksList();
    updateStats();
};

const editTask = (i) => {
    const newText = prompt("Edytuj zadanie:", tasks[i].text);
    if (newText && newText.trim()) {
        tasks[i].text = newText.trim();
        saveTasks();
        updateTasksList();
        updateStats();
    }
};


const addTask = async () => {
    const input = document.getElementById("taskInput");
    const text = input.value.trim();
    if (!text) return;

    const task = { text, completed: false };

    await fakeApi.addTask(task); 

    updateTasksList();
    updateStats();
    input.value = "";
};


const router = () => {
    const hash = window.location.hash;

    const stats = document.getElementById("statsView");
    const form = document.getElementById("taskForm");
    const list = document.getElementById("tasklist");

    if (hash === "#/stats") {
        stats.style.display = "flex";
        form.style.display = "none";
        list.style.display = "none";
    } else {
        stats.style.display = "flex";
        form.style.display = "flex";
        list.style.display = "block";
    }
};

window.addEventListener("hashchange", router);


const init = async () => {
    loadTasks();
    await fakeApi.getTasks();
    updateTasksList();
    updateStats();
    router();
};

document.getElementById("newtask").addEventListener("click", e => {
    e.preventDefault();
    addTask();
});

init();
