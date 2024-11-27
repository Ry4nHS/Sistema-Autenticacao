import { api } from '../utils/api.js';

export function initUsers(container) {
    const template = `
        <div class="users-page">
            <h1>Users Management</h1>
            <button class="add-button" id="openModal">+ Add New User</button>
            <table id="usersTable">
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Login</th>
                        <th>Active</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>

        <!-- Modal -->
        <div class="modal" id="userModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Add New User</h2>
                    <button class="close-modal" id="closeModal">&times;</button>
                </div>
                <form id="userForm">
                    <div class="form-group">
                        <label for="usucodigo">User Code</label>
                        <input type="number" id="usucodigo" required>
                    </div>
                    <div class="form-group">
                        <label for="usunome">Name</label>
                        <input type="text" id="usunome" required>
                    </div>
                    <div class="form-group">
                        <label for="usulogin">Login</label>
                        <input type="text" id="usulogin" required>
                    </div>
                    <div class="form-group">
                        <label for="ususenha">Password</label>
                        <input type="password" id="ususenha" required>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="usuativo">
                            Active
                        </label>
                    </div>
                    <div class="button-container">
                        <button type="button" id="cancelButton">Cancel</button>
                        <button type="submit" class="add-button">Save User</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    container.innerHTML = template;

    const modal = document.getElementById('userModal');
    const openModalBtn = document.getElementById('openModal');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelButton');
    const form = document.getElementById('userForm');
    const table = document.getElementById('usersTable').querySelector('tbody');

    function openModal() {
        modal.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
        form.reset();
    }

    async function loadUsers() {
        try {
            const users = await api.getUsers();
            table.innerHTML = users.map(user => `
                <tr>
                    <td>${user.usucodigo}</td>
                    <td>${user.usunome}</td>
                    <td>${user.usulogin}</td>
                    <td>${user.usuativo ? 'Yes' : 'No'}</td>
                    <td>
                        <button onclick="deleteUser(${user.usucodigo})">Delete</button>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error loading users:', error);
            alert('Error loading users. Please try again.');
        }
    }

    window.deleteUser = async function(code) {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                await api.deleteUser(code);
                loadUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Error deleting user. Please try again.');
            }
        }
    };

    openModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const newUser = {
            usucodigo: parseInt(document.getElementById('usucodigo').value),
            usunome: document.getElementById('usunome').value,
            usulogin: document.getElementById('usulogin').value,
            ususenha: document.getElementById('ususenha').value,
            usuativo: document.getElementById('usuativo').checked
        };

        try {
            // Check if user code already exists
            const users = await api.getUsers();
            if (users.some(u => u.usucodigo === newUser.usucodigo)) {
                alert('User code already exists. Please use a different code.');
                return;
            }

            // Check if login already exists
            if (users.some(u => u.usulogin === newUser.usulogin)) {
                alert('Login already exists. Please choose a different login.');
                return;
            }

            await api.createUser(newUser);
            closeModal();
            loadUsers();
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Error creating user. Please try again.');
        }
    });

    loadUsers();
}