import { api } from '../utils/api.js';

export function initLogin(container) {
    const template = `
        <div class="login-container">
            <h1>Login</h1>
            <div id="error-message" class="error-message"></div>
            <form id="loginForm">
                <div class="form-group">
                    <label for="login">Username</label>
                    <input type="text" id="login" required value="gelvazio@gmail.com">
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" required value="uHcnxHbmyLatVHvBCxrM">
                </div>
                <div class="button-group">
                    <button type="submit">Login</button>
                    <button type="button" id="createUserBtn" class="secondary-button">Create User</button>
                </div>
            </form>
        </div>

        <!-- Modal -->
        <div class="modal" id="userModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Create New User</h2>
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
                            <input type="checkbox" id="usuativo" checked>
                            Active
                        </label>
                    </div>
                    <div class="button-container">
                        <button type="button" id="cancelButton">Cancel</button>
                        <button type="submit" class="add-button">Create User</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    container.innerHTML = template;

    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');
    const modal = document.getElementById('userModal');
    const createUserBtn = document.getElementById('createUserBtn');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelButton');
    const userForm = document.getElementById('userForm');

    function openModal() {
        modal.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
        userForm.reset();
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const login = document.getElementById('login').value;
        const password = document.getElementById('password').value;

        try {
            const user = await api.login(login, password);
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                window.location.reload();
            } else {
                errorMessage.textContent = 'Invalid username or password';
            }
        } catch (error) {
            alert("Usuario ou senha invalido!");
            // errorMessage.textContent = 'An error occurred. Please try again.';
            // console.error('Login error:', error);
        }
    });

    createUserBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    userForm.addEventListener('submit', async (e) => {
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
            alert('User created successfully! You can now login.');
        } catch (error) {
            alert('An error occurred while creating the user. Please try again.');
            console.error('Create user error:', error);
        }
    });
}
