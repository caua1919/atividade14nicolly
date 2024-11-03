document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const notifications = document.getElementById('notifications');
    const filterStatusBtn = document.getElementById('filter-status');
    const filterPriorityBtn = document.getElementById('filter-priority');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let filterStatus = 'all'; 
    let sortPriority = false;

    loadTasks();
    showNotifications();

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskName = document.getElementById('task-name').value;
        const dueDate = document.getElementById('due-date').value;
        const priority = document.getElementById('priority').value;
        const newTask = { name: taskName, dueDate, priority, completed: false };

        tasks.push(newTask);
        saveTasks();
        loadTasks();
        taskForm.reset();
    });

    function loadTasks() {
        taskList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            if (filterStatus === 'completed') return task.completed;
            if (filterStatus === 'pending') return !task.completed;
            return true; 
        });
        
        const sortedTasks = sortPriority ? 
            filteredTasks.sort((a, b) => ['alta', 'média', 'baixa'].indexOf(a.priority) - ['alta', 'média', 'baixa'].indexOf(b.priority)) : 
            filteredTasks;

        sortedTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="${task.dueDate < new Date().toISOString().split('T')[0] ? 'urgent' : ''}">
                    ${task.name} - ${task.dueDate} - Prioridade: ${task.priority}
                </span>
                <button onclick="toggleCompletion(${index})">${task.completed ? 'Marcar como Pendente' : 'Concluir'}</button>
                <button onclick="editTask(${index})">Editar</button>
                <button onclick="deleteTask(${index})">Excluir</button>
            `;
            taskList.appendChild(li);
        });
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    window.toggleCompletion = (index) => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        loadTasks();
    };

    window.editTask = (index) => {
        const task = tasks[index];
        document.getElementById('task-name').value = task.name;
        document.getElementById('due-date').value = task.dueDate;
        document.getElementById('priority').value = task.priority;
        deleteTask(index);
    };

    window.deleteTask = (index) => {
        tasks.splice(index, 1);
        saveTasks();
        loadTasks();
    };

    function showNotifications() {
        notifications.innerHTML = '';
        tasks.forEach(task => {
            if (new Date(task.dueDate) - new Date() < 2 * 24 * 60 * 60 * 1000 && !task.completed) {
                const notification = document.createElement('div');
                notification.innerText = `Atenção: A tarefa "${task.name}" está próxima do prazo!`;
                notifications.appendChild(notification);
            }
        });
    }

    filterStatusBtn.addEventListener('click', () => {
        filterStatus = filterStatus === 'all' ? 'completed' : filterStatus === 'completed' ? 'pending' : 'all';
        filterStatusBtn.innerText = `Filtrar por Status: ${filterStatus === 'all' ? 'Concluídas' : filterStatus === 'completed' ? 'Pendentes' : 'Todas'}`;
        loadTasks();
    });

    filterPriorityBtn.addEventListener('click', () => {
        sortPriority = !sortPriority;
        filterPriorityBtn.innerText = `Filtrar por Prioridade: ${sortPriority ? 'Desligado' : 'Ligado'}`;
        loadTasks();
    });
});
