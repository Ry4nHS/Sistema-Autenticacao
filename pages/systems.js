import { api } from '../utils/api.js';

export function initSystems(container) {
    const template = `
        <div class="systems-page">
            <h1>Systems Management</h1>
            <button class="add-button" id="openModal">Add New System</button>
            <table id="systemsTable">
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Active</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>

        <!-- Modal -->
        <div class="modal" id="systemModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Add New System</h2>
                    <button class="close-modal" id="closeModal">&times;</button>
                </div>
                <form id="systemForm">
                    <div class="form-group">
                        <label for="siscodigo">System Code</label>
                        <input type="number" id="siscodigo" required>
                    </div>
                    <div class="form-group">
                        <label for="sisnome">System Name</label>
                        <input type="text" id="sisnome" required>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="sisativo">
                            Active
                        </label>
                    </div>
                    <div class="button-container">
                        <button type="button" id="cancelButton">Cancel</button>
                        <button type="submit" class="add-button">Save System</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    container.innerHTML = template;

    const modal = document.getElementById('systemModal');
    const openModalBtn = document.getElementById('openModal');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelButton');
    const form = document.getElementById('systemForm');
    const table = document.getElementById('systemsTable').querySelector('tbody');

    function openModal() {
        modal.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
        form.reset();
    }

    async function loadSystems() {
        try {
            const systems = await api.getSystems();
            table.innerHTML = `
                <style>
                    .coluna1 {
                        display:flex;
                        justify-content-center;
                        width:100%;
                        align-itens:center;
                        background-color:red;
                    }
                </style>
            `;
            table.innerHTML += systems.map(system => `
                <tr>
                    <td class="coluna">${system.id}</td>
                    <td>${system.sisnome}</td>
                    <td>${system.sisativo ? 'Yes' : 'No'}</td>
                    <td>
                        <button onclick="deleteSystem(${system.id})">Delete</button>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error loading systems:', error);
            alert('Error loading systems. Please try again.');
        }
    }

    window.deleteSystem = async function(code) {
        if (confirm('Are you sure you want to delete this system?')) {
            try {
                await api.deleteSystem(code);
                loadSystems();
            } catch (error) {
                console.error('Error deleting system:', error);
                alert('Error deleting system. Please try again.');
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
        
        const newSystem = {
            siscodigo: parseInt(document.getElementById('siscodigo').value),
            sisnome: document.getElementById('sisnome').value,
            sisativo: document.getElementById('sisativo').checked
        };

        try {
            // Check if system code already exists
            const systems = await api.getSystems();
            if (systems.some(s => s.siscodigo === newSystem.siscodigo)) {
                alert('System code already exists. Please use a different code.');
                return;
            }

            await api.createSystem(newSystem);
            closeModal();
            loadSystems();
        } catch (error) {
            console.error('Error creating system:', error);
            alert('Error creating system. Please try again.');
        }
    });

    loadSystems();
}