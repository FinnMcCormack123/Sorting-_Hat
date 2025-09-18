// Store draft history in memory
let draftHistory = [];
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
	if (teams.length >= 8) {
		showError('You can only have up to 8 teams.', teamError);
		return;
	}
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
	// Save to draft history
	draftHistory.push(JSON.parse(JSON.stringify(assignments)));
	// Replace the team management box (container) or loadingDiv
	let parentDiv = document.querySelector('.container') || document.getElementById('draft-loading');
	if (!parentDiv) return;

	const resultsDiv = document.createElement('div');
	resultsDiv.id = 'draft-results';

	const title = document.createElement('h2');
	title.textContent = 'Draft Results';
	resultsDiv.appendChild(title);

	Object.entries(assignments).forEach(([team, members], teamIdx) => {
		const teamTitle = document.createElement('h3');
		teamTitle.textContent = team;
		teamTitle.style.textAlign = 'center';
		resultsDiv.appendChild(teamTitle);

		// Show/hide button
		const showBtn = document.createElement('button');
		showBtn.textContent = 'Show';
		showBtn.className = 'restart-btn';
		showBtn.style.display = 'block';
		showBtn.style.margin = '0.7rem auto 1rem auto';
		showBtn.style.width = '100%';
		showBtn.style.fontSize = '1em';
		showBtn.style.padding = '0.7rem 0';

		// Team members list (hidden by default)
		const ul = document.createElement('ul');
		ul.style.display = 'none';
		members.forEach(member => {
			const li = document.createElement('li');
			li.textContent = member;
			ul.appendChild(li);
		});

		showBtn.onclick = function() {
			if (ul.style.display === 'none') {
				ul.style.display = 'block';
				showBtn.textContent = 'Hide';
			} else {
				ul.style.display = 'none';
				showBtn.textContent = 'Show';
			}
		};

		resultsDiv.appendChild(showBtn);
		resultsDiv.appendChild(ul);
	});

	// Add a restart button
	const restartBtn = document.createElement('button');
	restartBtn.textContent = 'Restart Draft';
	restartBtn.className = 'restart-btn';
	restartBtn.onclick = () => window.location.reload();
	resultsDiv.appendChild(restartBtn);

		parentDiv.replaceWith(resultsDiv);
		resultsDiv.scrollIntoView({ behavior: 'smooth' });

			// Draft history toggle button and section
			let historyBtn = document.createElement('button');
			historyBtn.textContent = 'Draft History';
			historyBtn.className = 'restart-btn';
			historyBtn.style.margin = '2.5rem auto 0 auto';
			historyBtn.style.display = 'block';

			let historyDiv = document.createElement('div');
			historyDiv.id = 'draft-history';
			historyDiv.style.display = 'none';
			historyDiv.style.marginTop = '1.2rem';
			historyDiv.style.background = '#fff';
			historyDiv.style.borderRadius = '10px';
			historyDiv.style.boxShadow = '0 2px 8px #0001';
			historyDiv.style.padding = '1.2rem';
			historyDiv.style.maxWidth = '480px';
			historyDiv.style.marginLeft = 'auto';
			historyDiv.style.marginRight = 'auto';

			const histTitle = document.createElement('h2');
			histTitle.textContent = 'Draft History';
			histTitle.style.fontSize = '1.3rem';
			histTitle.style.color = '#357ab8';
			histTitle.style.textAlign = 'center';
			historyDiv.appendChild(histTitle);

			draftHistory.forEach((draft, i) => {
				const draftBlock = document.createElement('div');
				draftBlock.style.marginBottom = '1.2rem';
				draftBlock.style.padding = '0.7rem 0.5rem';
				draftBlock.style.background = '#f7fafd';
				draftBlock.style.borderRadius = '7px';
				draftBlock.style.boxShadow = '0 1px 2px #0001';
				const roundTitle = document.createElement('div');
				roundTitle.textContent = `Draft #${i + 1}`;
				roundTitle.style.fontWeight = 'bold';
				roundTitle.style.marginBottom = '0.3rem';
				draftBlock.appendChild(roundTitle);
				Object.entries(draft).forEach(([team, members]) => {
					const teamTitle = document.createElement('div');
					teamTitle.textContent = team;
					teamTitle.style.color = '#4a90e2';
					teamTitle.style.fontWeight = '500';
					draftBlock.appendChild(teamTitle);
					const ul = document.createElement('ul');
					ul.style.marginBottom = '0.5rem';
					members.forEach(member => {
						const li = document.createElement('li');
						li.textContent = member;
						ul.appendChild(li);
					});
					draftBlock.appendChild(ul);
				});
				historyDiv.appendChild(draftBlock);
			});

			// Toggle history visibility
			historyBtn.onclick = () => {
				historyDiv.style.display = historyDiv.style.display === 'none' ? 'block' : 'none';
			};

			// Add button and history below results
			resultsDiv.parentNode.insertBefore(historyBtn, resultsDiv.nextSibling);
			resultsDiv.parentNode.insertBefore(historyDiv, historyBtn.nextSibling);
}

startDraftBtn.addEventListener('click', function() {
	if (teams.length < 2 || participants.length < 2) return;
	// Replace container with loading message
	const container = document.querySelector('.container');
	if (!container) return;
	const loadingDiv = document.createElement('div');
	loadingDiv.id = 'draft-loading';
	loadingDiv.style.background = '#f7fafd';
	loadingDiv.style.borderRadius = '14px';
	loadingDiv.style.boxShadow = '0 6px 32px #0002, 0 1.5px 4px #0001';
	loadingDiv.style.padding = '2rem 1.5rem 1.5rem 1.5rem';
	loadingDiv.style.maxWidth = '480px';
	loadingDiv.style.margin = '3rem auto';
	loadingDiv.style.textAlign = 'center';
	loadingDiv.innerHTML = '<h2 style="color:#357ab8;">Assigning Participants...</h2><p style="font-size:1.2rem;">Please wait <span id="timer">5</span> seconds</p>';
	container.replaceWith(loadingDiv);
	let seconds = 5;
	const timerSpan = loadingDiv.querySelector('#timer');
	const interval = setInterval(() => {
		seconds--;
		timerSpan.textContent = seconds;
		if (seconds <= 0) {
			clearInterval(interval);
			const assignments = assignParticipantsToTeams();
			showDraftResults(assignments);
		}
	}, 1000);
});

// Initial render
renderTeams();
renderParticipants();
