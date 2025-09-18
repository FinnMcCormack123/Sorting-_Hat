// Team and Participant Management Logic for Draft Pick Application
let teams = [];
let editingIndex = null;

let participants = [];
let editingParticipantIndex = null;

const teamForm = document.getElementById('team-form');
const teamNameInput = document.getElementById('team-name');
const teamList = document.getElementById('team-list');
const teamError = document.getElementById('team-error');
const startDraftBtn = document.getElementById('start-draft');

const participantForm = document.getElementById('participant-form');
const participantNameInput = document.getElementById('participant-name');
const participantList = document.getElementById('participant-list');
const participantError = document.getElementById('participant-error');

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
	startDraftBtn.disabled = teams.length < 2 || participants.length < 2;
	if (teams.length < 2 || participants.length < 2) {
		startDraftBtn.title = 'Add at least 2 teams and 2 participants to start the draft.';
	} else {
		startDraftBtn.title = '';
	}
}

function showError(msg, errorDiv) {
	errorDiv.textContent = msg;
	errorDiv.classList.add('fade-in');
	setTimeout(() => errorDiv.classList.remove('fade-in'), 500);
}

function clearError(errorDiv) {
	errorDiv.textContent = '';
}

teamForm.onsubmit = function(e) {
	e.preventDefault();
	const name = teamNameInput.value.trim();
	if (!name) {
		showError('Team name cannot be empty.', teamError);
		teamNameInput.focus();
		return;
	}
	if (teams.map(t => t.toLowerCase()).includes(name.toLowerCase())) {
		showError('Team name must be unique.', teamError);
		teamNameInput.focus();
		return;
	}
	teams.push(name);
	teamNameInput.value = '';
	clearError(teamError);
	renderTeams();
	if (teamList.lastChild) fadeInElement(teamList.lastChild);
};

function deleteTeam(idx) {
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
		showError('Team name cannot be empty.', teamError);
		return;
	}
	if (teams.map((t, i) => i !== idx ? t.toLowerCase() : null).includes(newName.toLowerCase())) {
		showError('Team name must be unique.', teamError);
		return;
	}
	teams[idx] = newName;
	editingIndex = null;
	clearError(teamError);
	renderTeams();
}

// Participants logic
function renderParticipants() {
	participantList.innerHTML = '';
	participants.forEach((name, idx) => {
		const li = document.createElement('li');
		if (editingParticipantIndex === idx) {
			// Edit mode
			const input = document.createElement('input');
			input.type = 'text';
			input.value = name;
			input.className = 'edit-input';
			input.autofocus = true;
			input.setAttribute('aria-label', 'Edit participant name');
			input.addEventListener('keydown', (e) => {
				if (e.key === 'Enter') saveParticipantEdit(idx, input.value);
				if (e.key === 'Escape') { editingParticipantIndex = null; renderParticipants(); }
			});

			const saveBtn = document.createElement('button');
			saveBtn.textContent = 'Save';
			saveBtn.onclick = () => saveParticipantEdit(idx, input.value);

			const cancelBtn = document.createElement('button');
			cancelBtn.textContent = 'Cancel';
			cancelBtn.onclick = () => { editingParticipantIndex = null; renderParticipants(); };

			li.appendChild(input);
			li.appendChild(saveBtn);
			li.appendChild(cancelBtn);
		} else {
			// Display mode
			const nameSpan = document.createElement('span');
			nameSpan.textContent = name;
			nameSpan.style.fontWeight = '500';
			nameSpan.style.letterSpacing = '0.5px';
			li.appendChild(nameSpan);

			const actions = document.createElement('span');
			actions.className = 'team-actions';

			const editBtn = document.createElement('button');
			editBtn.textContent = 'Edit';
			editBtn.title = 'Edit participant name';
			editBtn.onclick = () => { editingParticipantIndex = idx; renderParticipants(); };

			const delBtn = document.createElement('button');
			delBtn.textContent = 'Delete';
			delBtn.title = 'Delete participant';
			delBtn.onclick = () => deleteParticipant(idx);

			actions.appendChild(editBtn);
			actions.appendChild(delBtn);
			li.appendChild(actions);
		}
		fadeInElement(li);
		participantList.appendChild(li);
	});
	renderTeams(); // update startDraftBtn state
}
// Save participant edit
function saveParticipantEdit(idx, newName) {
	newName = newName.trim();
	if (!newName) {
		showError('Participant name cannot be empty.', participantError);
		return;
	}
	if (participants.map((t, i) => i !== idx ? t.toLowerCase() : null).includes(newName.toLowerCase())) {
		showError('Participant name must be unique.', participantError);
		return;
	}
	participants[idx] = newName;
	editingParticipantIndex = null;
	clearError(participantError);
	renderParticipants();
}

participantForm.onsubmit = function(e) {
	e.preventDefault();
	const name = participantNameInput.value.trim();
	if (!name) {
		showError('Participant name cannot be empty.', participantError);
		participantNameInput.focus();
		return;
	}
	if (participants.map(t => t.toLowerCase()).includes(name.toLowerCase())) {
		showError('Participant name must be unique.', participantError);
		participantNameInput.focus();
		return;
	}
	participants.push(name);
	participantNameInput.value = '';
	clearError(participantError);
	renderParticipants();
	if (participantList.lastChild) fadeInElement(participantList.lastChild);
};

function deleteParticipant(idx) {
	const li = participantList.children[idx];
	if (li) {
		li.style.transition = 'opacity 0.3s';
		li.style.opacity = '0';
		setTimeout(() => {
			participants.splice(idx, 1);
			renderParticipants();
		}, 250);
	} else {
		participants.splice(idx, 1);
		renderParticipants();
	}
}

// Keyboard accessibility: focus input on page load
window.onload = () => {
	teamNameInput.focus();
};

// Randomly assign participants to teams and display results
function assignParticipantsToTeams() {
	// Shuffle participants
	const shuffled = [...participants];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	// Assign to teams in round-robin
	const teamAssignments = {};
	teams.forEach(team => teamAssignments[team] = []);
	shuffled.forEach((p, i) => {
		const team = teams[i % teams.length];
		teamAssignments[team].push(p);
	});
	return teamAssignments;
}

function showDraftResults(assignments) {
	// Replace the team management box (container)
	const container = document.querySelector('.container');
	if (!container) return;

	const resultsDiv = document.createElement('div');
	resultsDiv.id = 'draft-results';

	const title = document.createElement('h2');
	title.textContent = 'Draft Results';
	resultsDiv.appendChild(title);

	Object.entries(assignments).forEach(([team, members]) => {
		const teamTitle = document.createElement('h3');
		teamTitle.textContent = team;
		resultsDiv.appendChild(teamTitle);
		const ul = document.createElement('ul');
		members.forEach(member => {
			const li = document.createElement('li');
			li.textContent = member;
			ul.appendChild(li);
		});
		resultsDiv.appendChild(ul);
	});

	// Add a restart button
	const restartBtn = document.createElement('button');
	restartBtn.textContent = 'Restart Draft';
	restartBtn.className = 'restart-btn';
	restartBtn.onclick = () => window.location.reload();
	resultsDiv.appendChild(restartBtn);

	container.replaceWith(resultsDiv);
	resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

startDraftBtn.addEventListener('click', function() {
	if (teams.length < 2 || participants.length < 2) return;
	const assignments = assignParticipantsToTeams();
	showDraftResults(assignments);
});

// Initial render
renderTeams();
renderParticipants();
