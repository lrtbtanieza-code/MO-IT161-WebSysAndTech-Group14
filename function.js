// ===============PASSWORD SHOW / HIDE================//

function togglePassword() {

    const password = document.getElementById("password");

    if (!password) {
        return;
    }

    if (password.type === "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }
}


// ===============PAGE SETUP================//


document.addEventListener("DOMContentLoaded", function () {

    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();


    const protectedPages = [
        "mainpage.html",
        "addnewtask.html",
        "userprofile.html"
    ];

    if (
        protectedPages.includes(currentPage) &&
        localStorage.getItem("loggedIn") !== "true"
    ) {
        window.location.replace("logIn.html");
        return;
    }

    setupLogin();
    setupAddTask();
    setupMainPage();
    setupLogout();
    setupMobileMenu();

});


// ===============LOGIN================//

function setupLogin() {

    const loginButton =
        document.querySelector(".login-button");

    if (!loginButton) {
        return;
    }


    function login() {

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        const correctUsername = "Jeera";
        const correctPassword = "12345";

        if (username === "" || password === "") {

            showMessage("Please enter your username and password.");

            return;
        }

        if (
            username === correctUsername &&
            password === correctPassword
        ) {

            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("username", username);

            window.location.href = "mainPage.html";

        } else {
        showMessage("Incorrect username or password.");
        }

    }


    loginButton.addEventListener("click", login);

    document.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {
            login();
        }

    });

}


// ===============TASK STORAGE================//

function getTasks() {

    const tasks = localStorage.getItem("tasks");

    if (tasks) {
        return JSON.parse(tasks);
    }

    return [];

}


function saveTasks(tasks) {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// ===============ADD NEW TASK================//


function setupAddTask() {
    const addButton = document.querySelector(".modal-buttons .add-button");

    if (!addButton) {
        return;
    }

    const quickTask = localStorage.getItem("newTask");

    if (quickTask) {
        const description = document.getElementById("task-description");

        if (description) {
            description.value = quickTask;
        }

        localStorage.removeItem("newTask");
    }

    addButton.addEventListener("click", async function () {
        const description = document.getElementById("task-description").value.trim();
        const dueDate = document.getElementById("task-due-date").value;
        const priority = document.getElementById("task-priority").value;
        const category = document.getElementById("task-category").value;
        const recurring = document.getElementById("task-recurring").value;
        const reminder = document.getElementById("task-reminder").checked;

        if (description === "") {
            showMessage("Please enter a task.");
            return;
        }

        const newTask = {
            id: Date.now(),
            description: description,
            dueDate: dueDate,
            priority: priority,
            category: category,
            recurring: recurring,
            reminder: reminder,
            completed: false
        };

        try {
            const response = await fetch("/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newTask)
            });

            if (!response.ok) {
                throw new Error("Task could not be saved.");
            }

            const tasks = getTasks();
            tasks.push(newTask);
            saveTasks(tasks);

            showMessage("Task saved successfully!");

            window.location.href = "mainPage.html";

        } catch (error) {
            console.error("Error saving task:", error);
            showMessage("Unable to save task. Please try again.");
        }
    });

    const cancelButton = document.querySelector(".cancel-button");

    if (cancelButton) {
        cancelButton.addEventListener("click", function () {
            window.location.href = "mainPage.html";
        });
    }

    const closeButton = document.querySelector(".close-button");

    if (closeButton) {
        closeButton.addEventListener("click", function () {
            window.location.href = "mainPage.html";
        });
    }
}



// ===============MAIN PAGE================//

function setupMainPage() {

    const app = document.querySelector(".app");

    if (!app) {
        return;
    }

    updateDate();


    const username = localStorage.getItem("username");
    const welcomeMessage = document.getElementById("welcome-message");


    if (welcomeMessage && username) {

        welcomeMessage.textContent =
            "Welcome back, " + username + "! 👋";

    }


    createDefaultTasks();
    displayTasks();
    fetchTasksFromBackend();
    setupMainButtons();
    setupFilters();
    setupCategories();
    setupSearch();
    setupHeaderButtons();
    setupOverdue();

}


// ===============DEFAULT TASKS================//

function createDefaultTasks() {

    if (localStorage.getItem("tasks")) {
        return;
    }


    const tasks = [

        {
            id: 1,
            description: "Finish IT Assignment",
            dueDate: "2026-09-14",
            priority: "high",
            category: "study",
            recurring: "none",
            reminder: false,
            completed: false
        },

        {
            id: 2,
            description: "Study for Exam",
            dueDate: "2026-09-15",
            priority: "high",
            category: "study",
            recurring: "none",
            reminder: false,
            completed: false
        }

    ];


    saveTasks(tasks);

}


// ===============DISPLAY TASKS================//

function displayTasks(taskList = null) {

    const tasksContainer = document.querySelector(".tasks");

    if (!tasksContainer) {
        return;
    }


    const tasks =
        taskList !== null
            ? taskList
            : getTasks();


    tasksContainer
        .querySelectorAll(".task")
        .forEach(function (task) {

            task.remove();

        });


    tasks.forEach(function (task) {

        const article =
            document.createElement("article");


        article.className = "task";


        if (task.completed) {

            article.classList.add(
                "completed-task"
            );

        }

        if (isOverdue(task)) {

            article.classList.add(
                "overdue-task"
            );

        }


        article.innerHTML = `

            <input
                type="checkbox"
                class="task-checkbox"
                ${task.completed ? "checked" : ""}
            >

            <div class="task-info">
                <strong class="task-description"></strong>

                <p class="due-date">
                    ${formatDate(task.dueDate)}
                </p>
            </div>

            <span class="category-badge ${task.category}">
                ${task.category.toUpperCase()}
            </span>

            <span class="priority-badge ${task.priority}">
                ${task.priority.toUpperCase()}
            </span>

            <div class="task-actions">

                <button
                    class="edit-btn"
                    aria-label="Edit task: ${task.description}"
                    onclick="editTask(${task.id})">
                    ✏️
                </button>

                <button
                    class="delete-btn"
                    aria-label="Delete task: ${task.description}"
                    onclick="deleteTask(${task.id})">
                    🗑️
                </button>
            </div>

        `;


        article
            .querySelector(".task-description").textContent =
            task.description;

            
        article
            .querySelector(".task-checkbox")
            .addEventListener("change", function () {
                toggleTask(task.id);
            });

            


        tasksContainer.appendChild(article);

    });


    updateSummary(getTasks());
    updateCounts();
    updateOverdueCount();

}


// ===============UPDATE COUNTS================//

function updateCounts() {

    const tasks = getTasks();


    const total = tasks.length;

    const completed =
        tasks.filter(function (task) {

            return task.completed;

        }).length;


    const pending = total - completed;


    document.querySelectorAll(".filter")
        .forEach(function (button) {

            const text =
                button.textContent
                    .trim()
                    .toLowerCase();

            const number =
                button.querySelector("span");


            if (!number) {
                return;
            }

            if (text.startsWith("all")) {
                number.textContent = total;

            } else if (text.startsWith("pending")) {
                number.textContent = pending;

            } else if (text.startsWith("completed")) {
                number.textContent = completed;

            }

        });


    document.querySelectorAll(".category")
        .forEach(function (button) {

            const spans = button.querySelectorAll("span");

            if (spans.length < 2) {
                return;
            }

            const categoryName =
                spans[0].textContent
                    .trim()
                    .toLowerCase();


            if (categoryName === "all") {
                spans[1].textContent = total;

            } else {

                const count =
                    tasks.filter(function (task) {

                        return task.category === categoryName;

                    }).length;


                spans[1].textContent = count;

            }

        });

}

// ===============CHECK OVERDUE================//

function isOverdue(task) {

    if (!task.dueDate || task.completed) {
        return false;
    }


    const today = new Date();
    today.setHours(0, 0, 0, 0);


    const dueDate =
        new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today;

}


// ===============UPDATE OVERDUE COUNT================//

function updateOverdueCount() {

    const button =
        document.querySelector(".overdue");


    if (!button) {
        return;
    }


    const count =
        getTasks().filter(function (task) {
            return isOverdue(task);

        }).length;


    if (count === 0) {
        button.style.display = "none";

    } else {
        button.style.display = "block";

        if (count === 1) {

            button.textContent =
                "⚠ 1 overdue task";

        } else {

            button.textContent =
                "⚠ " + count + " overdue tasks";

        }

    }

}


// ===============OVERDUE TASKS================//

function setupOverdue() {

    const overdueButton =
        document.querySelector(".overdue");


    if (!overdueButton) {
        return;
    }


    overdueButton.addEventListener("click", function () {

        const overdueTasks =
            getTasks().filter(function (task) {

                return isOverdue(task);

            });


        displayTasks(overdueTasks);

    });

}


// ===============ADD TASK BUTTON================//

function setupMainButtons() {

    const addButton =
        document.querySelector(".add-task .add-button");


    if (!addButton) {
        return;
    }

    addButton.addEventListener("click", function () {

        const input =
            document.querySelector(
                ".task-input input"
            );

        if (input && input.value.trim() !== "") {

            localStorage.setItem(
                "newTask",
                input.value.trim()
            );

        }

        window.location.href =
            "addNewtask.html";

    });

}


// ===============COMPLETE TASK================//


async function toggleTask(id) {
    const tasks = getTasks();

    const task = tasks.find(function (task) {
        return Number(task.id) === Number(id);
    });

    if (!task) {
        showMessage("Task not found.");
        return;
    }

    const updatedTask = {
        ...task,
        completed: !task.completed
    };

    try {
        const response = await fetch(`/api/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedTask)
        });

        if (!response.ok) {
            throw new Error("Unable to update task status.");
        }

        const updatedTasks = tasks.map(function (item) {
            return Number(item.id) === Number(id)
                ? updatedTask
                : item;
        });

        saveTasks(updatedTasks);
        displayTasks();

        showMessage(
            updatedTask.completed
                ? "Task marked as completed!"
                : "Task marked as pending!"
        );

    } catch (error) {
        console.error("Error updating task status:", error);
        showMessage("Unable to update task. Please try again.");
    }
}


// ===============DELETE TASK================//


async function deleteTask(id) {
    const tasks = getTasks();

    const task = tasks.find(function (task) {
        return Number(task.id) === Number(id);
    });

    if (!task) {
        showMessage("Task not found.");
        return;
    }

    const overlay = document.createElement("div");
    overlay.className = "edit-dialog-overlay";

    const dialog = document.createElement("div");
    dialog.className = "edit-dialog";

    dialog.innerHTML = `
        <h2>Delete Task?</h2>

        <p>
            Are you sure you want to delete
            "<strong></strong>"?
        </p>

        <div class="edit-dialog-buttons">
            <button type="button" id="cancel-delete">
                Cancel
            </button>

            <button type="button" id="confirm-delete">
                Delete
            </button>
        </div>
    `;

    dialog.querySelector("strong").textContent =
        task.description;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    function closeDialog() {
        overlay.remove();
    }

    dialog.querySelector("#cancel-delete")
        .addEventListener("click", closeDialog);

    dialog.querySelector("#confirm-delete")
        .addEventListener("click", async function () {

            try {
                const response = await fetch(`/api/tasks/${id}`, {
                    method: "DELETE"
                });

                if (!response.ok) {
                    throw new Error("Unable to delete task from backend.");
                }

                const updatedTasks = getTasks().filter(
                    function (task) {
                        return Number(task.id) !== Number(id);
                    }
                );

                saveTasks(updatedTasks);

                closeDialog();
                displayTasks();

                showMessage("Task deleted successfully!");

            } catch (error) {
                console.error("Error deleting task:", error);
                showMessage("Unable to delete task. Please try again.");
            }
        });

    overlay.addEventListener("click", function (event) {
        if (event.target === overlay) {
            closeDialog();
        }
    });
}



// ===============EDIT TASK================//


function editTask(id) {
    console.log("editTask function started. ID:", id);
    const tasks = getTasks();
    const task = tasks.find(
        task => Number(task.id) === Number(id)
    );

    if (!task) {
        showMessage("Task not found.");
        return;
    }

    // Create the edit dialog
    const overlay = document.createElement("div");
    overlay.className = "edit-dialog-overlay";

    const dialog = document.createElement("form");
    dialog.className = "edit-dialog";

    dialog.innerHTML = `
        <h2>Edit Task</h2>

        <label for="edit-description">Task Description</label>
        <input
            type="text"
            id="edit-description"
            required
            maxlength="200"
        >

        <label for="edit-due-date">Due Date</label>
        <input type="date" id="edit-due-date">

        <label for="edit-priority">Priority</label>
        <select id="edit-priority">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
        </select>

        <label for="edit-category">Category</label>
        <select id="edit-category">
            <option value="work">Work</option>
            <option value="study">Study</option>
            <option value="personal">Personal</option>
            <option value="shopping">Shopping</option>
            <option value="other">Other</option>
        </select>

        <label for="edit-recurring">Recurring</label>
        <select id="edit-recurring">
            <option value="none">None</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
        </select>

        <label class="edit-reminder">
            <input type="checkbox" id="edit-reminder">
            Set reminder for this task
        </label>

        <div class="edit-dialog-buttons">
            <button type="button" id="cancel-edit">Cancel</button>
            <button type="submit">Save Changes</button>
        </div>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    // Display the task's current values
    dialog.querySelector("#edit-description").value =
        task.description || "";

    dialog.querySelector("#edit-due-date").value =
        task.dueDate || "";

    dialog.querySelector("#edit-priority").value =
        task.priority || "medium";

    dialog.querySelector("#edit-category").value =
        task.category || "other";

    dialog.querySelector("#edit-recurring").value =
        task.recurring || "none";

    dialog.querySelector("#edit-reminder").checked =
        Boolean(task.reminder);

    // Close the dialog
    function closeDialog() {
        overlay.remove();
    }

    dialog.querySelector("#cancel-edit").addEventListener(
        "click",
        closeDialog
    );

    overlay.addEventListener("click", function (event) {
        if (event.target === overlay) {
            closeDialog();
        }
    });

    // Save the updated task
   
    dialog.addEventListener("submit", async function (event) {
    event.preventDefault();

    const updatedTask = {
        ...task,
        description: dialog.querySelector("#edit-description").value.trim(),
        dueDate: dialog.querySelector("#edit-due-date").value,
        priority: dialog.querySelector("#edit-priority").value,
        category: dialog.querySelector("#edit-category").value,
        recurring: dialog.querySelector("#edit-recurring").value,
        reminder: dialog.querySelector("#edit-reminder").checked
    };

    // Check if the task description is empty
    if (!updatedTask.description) {
        showMessage("Please enter a task description.");
        return;
    }

    try {
        // Send the updated task to the backend
        const response = await fetch(`/api/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedTask)
        });

        if (!response.ok) {
            throw new Error("Unable to update task in backend.");
        }

        // Update the task in localStorage
        const taskIndex = tasks.findIndex(
            item => Number(item.id) === Number(id)
        );

        if (taskIndex !== -1) {
            tasks[taskIndex] = updatedTask;
        }

        saveTasks(tasks);

        // Refresh the dashboard
        closeDialog();
        displayTasks();

        showMessage("Task updated successfully!");

       } catch (error) {
        console.error("Error updating task:", error);
        showMessage("Unable to update task. Please try again.");
    }
    }); // End of submit event

} // End of editTask()


// ===============TASK FILTERS================//

function setupFilters() {

    document.querySelectorAll(".filter")
        .forEach(function (button) {

            button.addEventListener("click", function () {

                document.querySelectorAll(".filter")
                    .forEach(function (item) {

                        item.classList.remove("active");

                    });


                button.classList.add("active");


                const text =
                    button.textContent
                        .trim()
                        .toLowerCase();


                const tasks =
                    getTasks();


                if (text.startsWith("pending")) {

                    displayTasks(
                        tasks.filter(function (task) {

                            return !task.completed;

                        })
                    );

                } else if (text.startsWith("completed")) {

                    displayTasks(
                        tasks.filter(function (task) {

                            return task.completed;

                        })
                    );

                } else {

                    displayTasks(tasks);

                }

            });

        });
}    




// ===============CATEGORIES================//

function setupCategories() {

    document.querySelectorAll(".category")
        .forEach(function (button) {

            button.addEventListener("click", function () {

                document.querySelectorAll(".category")
                    .forEach(function (item) {

                        item.classList.remove("active");

                    });


                button.classList.add("active");


                const categoryName =
                    button
                        .querySelector("span")
                        .textContent
                        .trim()
                        .toLowerCase();


                const tasks =
                    getTasks();


                if (categoryName === "all") {

                    displayTasks(tasks);

                } else {

                    displayTasks(
                        tasks.filter(function (task) {

                            return task.category === categoryName;

                        })
                    );

                }

            });

        });

}


// ===============SEARCH================//

function setupSearch() {

    const search =
        document.querySelector(
            '.header-actions input[type="search"]'
        );


    if (!search) {
        return;
    }


    search.addEventListener("input", function () {

        const searchText =
            search.value
                .trim()
                .toLowerCase();


        const results =
            getTasks().filter(function (task) {

                return task.description
                    .toLowerCase()
                    .includes(searchText);

            });


        displayTasks(results);

    });

}


// ===============SUMMARY================//

function updateSummary(tasks) {

    const total =
        tasks.length;


    const completed =
        tasks.filter(function (task) {

            return task.completed;

        }).length;


    const pending = total - completed;
    const totalNumber = document.querySelector(".blue-number");
    const completedNumber = document.querySelector(".green-number");
    const pendingNumber = document.querySelector(".yellow-number");


    if (totalNumber) {
        totalNumber.textContent = total;
    }


    if (completedNumber) {
        completedNumber.textContent = completed;
    }


    if (pendingNumber) {
        pendingNumber.textContent = pending;
    }


    const progress =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );


    const progressFill = document.querySelector(".progress-fill");
    const progressText = document.querySelector(".progress-header span");
    const progressDescription = document.querySelector(".progress-card p");


    if (progressFill) {

        progressFill.style.width =
            progress + "%";

    }

    if (progressText) {

        progressText.textContent =
            progress + "%";

    }

    if (progressDescription) {

        progressDescription.textContent =
            completed +
            " of " +
            total +
            " tasks completed";

    }

}


// ===============DATE FORMAT================//

function formatDate(date) {

    if (!date) {
        return "No due date";
    }


    const parts =
        date.split("-");


    if (parts.length !== 3) {
        return date;
    }


    const months = [

        "Jan", "Feb", "Mar", "Apr",
        "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"

    ];


    return (
        months[Number(parts[1]) - 1] +
        " " +
        Number(parts[2]) +
        ", " +
        parts[0]
    );

}


// ===============CURRENT DATE================//

function updateDate() {

    const dateElement =
        document.getElementById("current-date");


    if (!dateElement) {
        return;
    }


    const today = new Date();


    const date =
        today.toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );


    const day =
        today.toLocaleDateString(
            "en-US",
            {
                weekday: "long"
            }
        );


    dateElement.textContent =
        date + " · " + day;

}


// ===============PROFILE BUTTON================//

function setupHeaderButtons() {

    const notification = document.querySelector(".notification");
    const profile = document.querySelector(".profile");


    if (notification) {

        notification.addEventListener("click", function () {

            showMessage("You have no new notifications.");

        });

    }


    if (profile) {

        profile.addEventListener("click", function () {

            window.location.href =
                "userProfile.html";

        });

    }

}


// ===============LOG OUT================//


function setupLogout() {
    const logoutButton = document.getElementById("logout-button");

    if (!logoutButton) {
        return;
    }

    logoutButton.addEventListener("click", function () {
        const overlay = document.createElement("div");
        overlay.className = "edit-dialog-overlay";

        overlay.innerHTML = `
            <div class="edit-dialog" role="dialog" aria-modal="true" aria-labelledby="logout-title">
                <h2 id="logout-title">Confirm Logout</h2>
                <p>Are you sure you want to log out?</p>

                <div class="edit-dialog-buttons">
                    <button type="button" id="cancel-logout">Cancel</button>
                    <button type="button" id="confirm-logout">Log Out</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        document.getElementById("cancel-logout").addEventListener("click", function () {
            overlay.remove();
        });

        document.getElementById("confirm-logout").addEventListener("click", function () {
            localStorage.removeItem("loggedIn");
            localStorage.removeItem("username");

            window.location.href = "logIn.html";
        });
    });
}



// ===============FRIENDLY MESSAGE================//


function showMessage(message) {
    
    let status = document.getElementById("app-status");

    if (!status) {
        status = document.createElement("div");
        status.id = "app-status";
        status.setAttribute("role", "status");
        status.setAttribute("aria-live", "polite");

        const app = document.querySelector(".app") || document.body;
        app.prepend(status);
    }

    const lowerMessage = message.toLowerCase();

    let background = "#e8f5e9";
    let color = "#1b5e20";

    if (
        lowerMessage.includes("please") ||
        lowerMessage.includes("required")
    ) {
        background = "#fff3cd";
        color = "#856404";
    } else if (
        lowerMessage.includes("incorrect") ||
        lowerMessage.includes("failed") ||
        lowerMessage.includes("error")
    ) {
        background = "#f8d7da";
        color = "#842029";
    }

    status.textContent = message;
    status.style.padding = "10px";
    status.style.margin = "10px 0";
    status.style.background = background;
    status.style.color = color;
    status.style.borderRadius = "6px";
}


function setupMobileMenu() {
    const menuButton = document.getElementById("menu-toggle");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");

    // Stop if these elements are not on the current page.
    if (!menuButton || !sidebar || !overlay) {
        return;
    }

    function openMenu() {
        sidebar.classList.add("open");
        overlay.classList.add("active");

        menuButton.setAttribute("aria-expanded", "true");
        menuButton.setAttribute("aria-label", "Close navigation menu");
    }

    function closeMenu() {
        sidebar.classList.remove("open");
        overlay.classList.remove("active");

        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation menu");
    }

    menuButton.addEventListener("click", function () {
        if (sidebar.classList.contains("open")) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close when the user clicks the dark backdrop.
    overlay.addEventListener("click", closeMenu);

    // Close with the Escape key.
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    // Close after selecting a category.
    sidebar.addEventListener("click", function (event) {
        if (event.target.closest(".category")) {
            closeMenu();
        }
    });
}
// This function asks your new backend for the task list

    async function fetchTasksFromBackend() 
{
    try {
        const response = await fetch("/api/tasks");

        if (!response.ok) {
            throw new Error("Unable to retrieve tasks.");
        }

        const backendTasks = await response.json();

        const formattedTasks = backendTasks.map(task => ({
            ...task,
            description: task.description || task.title || "",
            dueDate: task.dueDate || "",
            priority: task.priority || "medium",
            category: task.category || "other",
            recurring: task.recurring || "none",
            reminder: Boolean(task.reminder),
            completed: Boolean(task.completed || task.status === "completed")
        }));

        saveTasks(formattedTasks);
        displayTasks();

        console.log("Tasks successfully loaded from backend!");

    } catch (error) {
        console.error("Backend loading error:", error);
        }
}
