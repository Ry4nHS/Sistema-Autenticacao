import { api } from '../utils/api.js';

export function initProfiles(container) {
    const template = `
        <div class="profiles-page">
            <h1>Profile Management</h1>
            <button class="add-button" id="openModal">+ Add New Profile</button>
            <table id="profilesTable">
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>System</th>
                        <th>Permissions</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>

        <!-- Modal -->
        <div class="modal" id="profileModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Add New Profile</h2>
                    <button class="close-modal" id="closeModal">&times;</button>
                </div>
                <form id="profileForm">
                    <div class="form-group">
                        <label for="codigo">Profile Code</label>
                        <input type="number" id="codigo" required>
                    </div>
                    <div class="form-group">
                        <label for="nome">Profile Name</label>
                        <input type="text" id="nome" required>
                    </div>
                    <div class="form-group">
                        <label for="siscodigo">System</label>
                        <select id="siscodigo" required></select>
                    </div>
                    <div class="form-group permissions-group">
                        <h3>Permissions</h3>
                        <label>
                            <input type="checkbox" id="index">
                            Index
                        </label>
                        <label>
                            <input type="checkbox" id="update">
                            Update
                        </label>
                        <label>
                            <input type="checkbox" id="insert">
                            Insert
                        </label>
                        <label>
                            <input type="checkbox" id="delete">
                            Delete
                        </label>
                    </div>
                    <div class="button-container">
                        <button type="button" id="cancelButton">Cancel</button>
                        <button type="submit" class="add-button">Save Profile</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    container.innerHTML = template;

    const modal = document.getElementById('profileModal');
    const openModalBtn = document.getElementById('openModal');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelButton');
    const form = document.getElementById('profileForm');
    const table = document.getElementById('profilesTable').querySelector('tbody');
    const systemSelect = document.getElementById('siscodigo');

    async function loadSystems() {
        try {
            const systems = await api.getSystems();
            systemSelect.innerHTML = systems
                .filter(system => system.sisativo)
                .map(system => `
                    <option value="${system.siscodigo}">${system.sisnome}</option>
                `).join('');
        } catch (error) {
            console.error('Error loading systems:', error);
            alert('Error loading systems. Please try again.');
        }
    }

    function openModal() {
        modal.classList.add('active');
        loadSystems();
    }

    function closeModal() {
        modal.classList.remove('active');
        form.reset();
    }

    async function loadProfiles() {
        try {
            const [profiles, systems] = await Promise.all([
                api.getProfiles(),
                api.getSystems()
            ]);

            table.innerHTML = profiles.map(profile => {
                const system = systems.find(s => s.siscodigo === profile.siscodigo);
                return `
                    <tr>
                        <td>${profile.codigo}</td>
                        <td>${profile.nome}</td>
                        <td>${system ? system.sisnome : 'Unknown'}</td>
                        <td>
                            Index: ${profile.permissions.index ? '✓' : '✗'}<br>
                            Update: ${profile.permissions.update ? '✓' : '✗'}<br>
                            Insert: ${profile.permissions.insert ? '✓' : '✗'}<br>
                            Delete: ${profile.permissions.delete ? '✓' : '✗'}
                        </td>
                        <td>
                            <button onclick="deleteProfile(${profile.codigo})">Delete</button>
                        </td>
                    </tr>
                `;
            }).join('');
        } catch (error) {
            console.error('Error loading profiles:', error);
            alert('Error loading profiles. Please try again.');
        }
    }

    window.deleteProfile = async function(code) {
        if (confirm('Are you sure you want to delete this profile?')) {
            try {
                await api.deleteProfile(code);
                loadProfiles();
            } catch (error) {
                console.error('Error deleting profile:', error);
                alert('Error deleting profile. Please try again.');
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
        
        const newProfile = {
            codigo: parseInt(document.getElementById('codigo').value),
            nome: document.getElementById('nome').value,
            siscodigo: parseInt(document.getElementById('siscodigo').value),
            permissions: {
                index: document.getElementById('index').checked,
                update: document.getElementById('update').checked,
                insert: document.getElementById('insert').checked,
                delete: document.getElementById('delete').checked
            }
        };

        try {
            // Check if profile code already exists
            const profiles = await api.getProfiles();
            if (profiles.some(p => p.codigo === newProfile.codigo)) {
                alert('Profile code already exists. Please use a different code.');
                return;
            }

            await api.createProfile(newProfile);
            closeModal();
            loadProfiles();
        } catch (error) {
            console.error('Error creating profile:', error);
            alert('Error creating profile. Please try again.');
        }
    });

    loadProfiles();
}