// Team Management Logic for Draft Pick Application
let teams = [];
let editingIndex = null;

const teamForm = document.getElementById('team-form');
const teamNameInput = document.getElementById('team-name');
const teamList = document.getElementById('team-list');
const teamError = document.getElementById('team-error');
const startDraftBtn = document.getElementById('start-draft');

function fadeInElement(el) {
	el.classList.add('fade-in');
	setTimeout(() => el.classList.remove('fade-in'), 500);
}

function renderTeams() {
	teamList.innerHTML = '';
	teams.forEach((team, idx) => {
		const li = document.createElement('li');
		if (editingIndex === idx) {
			// Edit mode
			const input = document.createElement('input');
			input.type = 'text';
			input.value = team;
			input.className = 'edit-input';
			input.autofocus = true;
			input.setAttribute('aria-label', 'Edit team name');
			input.addEventListener('keydown', (e) => {
				if (e.key === 'Enter') saveEdit(idx, input.value);
				if (e.key === 'Escape') { editingIndex = null; renderTeams(); }
			});

			const saveBtn = document.createElement('button');
			saveBtn.textContent = 'Save';
			saveBtn.onclick = () => saveEdit(idx, input.value);

			const cancelBtn = document.createElement('button');
			cancelBtn.textContent = 'Cancel';
			cancelBtn.onclick = () => { editingIndex = null; renderTeams(); };

			li.appendChild(input);
			li.appendChild(saveBtn);
			li.appendChild(cancelBtn);
		} else {
			// Display mode
			const nameSpan = document.createElement('span');
			nameSpan.textContent = team;
			nameSpan.style.fontWeight = '500';
			nameSpan.style.letterSpacing = '0.5px';
			li.appendChild(nameSpan);

			const actions = document.createElement('span');
			actions.className = 'team-actions';

			const editBtn = document.createElement('button');
			editBtn.textContent = 'Edit';
			editBtn.title = 'Edit team name';
			editBtn.onclick = () => { editingIndex = idx; renderTeams(); };

			const deleteBtn = document.createElement('button');
			deleteBtn.textContent = 'Delete';
			deleteBtn.title = 'Delete team';
			deleteBtn.onclick = () => deleteTeam(idx);

			actions.appendChild(editBtn);
			actions.appendChild(deleteBtn);
			li.appendChild(actions);
		}
		fadeInElement(li);
		teamList.appendChild(li);
	});

	// Enable/disable Start Draft button
	startDraftBtn.disabled = teams.length < 2;
	if (teams.length < 2) {
		startDraftBtn.title = 'Add at least 2 teams to start the draft.';
	} else {
		startDraftBtn.title = '';
	}
}

function showError(msg) {
	teamError.textContent = msg;
	teamError.classList.add('fade-in');
	setTimeout(() => teamError.classList.remove('fade-in'), 500);
}

function clearError() {
	teamError.textContent = '';
}

teamForm.onsubmit = function(e) {
	e.preventDefault();
	const name = teamNameInput.value.trim();
	if (!name) {
		showError('Team name cannot be empty.');
		teamNameInput.focus();
		return;
	}
	if (teams.map(t => t.toLowerCase()).includes(name.toLowerCase())) {
		showError('Team name must be unique.');
		teamNameInput.focus();
		return;
	}
	teams.push(name);
	teamNameInput.value = '';
	clearError();
	renderTeams();
	// Animate the last item
	if (teamList.lastChild) fadeInElement(teamList.lastChild);
};

function deleteTeam(idx) {
	// Animate removal
	const li = teamList.children[idx];
	if (li) {
		li.style.transition = 'opacity 0.3s';
		li.style.opacity = '0';
		setTimeout(() => {
			teams.splice(idx, 1);
			if (editingIndex === idx) editingIndex = null;
			renderTeams();
		}, 250);
	} else {
		teams.splice(idx, 1);
		if (editingIndex === idx) editingIndex = null;
		renderTeams();
	}
}

function saveEdit(idx, newName) {
	newName = newName.trim();
	if (!newName) {
		showError('Team name cannot be empty.');
		return;
	}
	if (teams.map((t, i) => i !== idx ? t.toLowerCase() : null).includes(newName.toLowerCase())) {
		showError('Team name must be unique.');
		return;
	}
	teams[idx] = newName;
	editingIndex = null;
	clearError();
	renderTeams();
}

// Keyboard accessibility: focus input on page load
window.onload = () => {
	teamNameInput.focus();
};

// Initial render
renderTeams();
