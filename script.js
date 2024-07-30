document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const noteTitle = document.getElementById('note-title');
    const noteContent = document.getElementById('note-content');
    const noteColor = document.getElementById('note-color');
    const saveNoteButton = document.getElementById('save-note');
    const deleteNoteButton = document.getElementById('delete-note');
    const searchNotesInput = document.getElementById('search-notes');
    const notesList = document.getElementById('notes');
    const alertContainer = document.getElementById('alert-container');
    const emojiButton = document.getElementById('emoji-button');
    const emojiPicker = document.getElementById('emoji-picker');
    // get elemts

    // Load theme preference
    

    const loadTheme = () => {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    };

    // Toggle the theme
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('theme', theme); 
        // save the theme
    });

    // Show alert message
    const showAlert = (message, type) => {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.role = 'alert';
        alert.textContent = message;
        alertContainer.innerHTML = '';
        alertContainer.appendChild(alert);
        setTimeout(() => alert.remove(), 2000); 
    };

    // Save a new note or update an existing note
    saveNoteButton.addEventListener('click', () => {
        const title = noteTitle.value.trim();
        const content = noteContent.value.trim();
        const color = noteColor.value;
        if (title && content) {
            let notes = JSON.parse(localStorage.getItem('notes')) || [];
            const existingNoteIndex = notes.findIndex(note => note.title === title);
            if (existingNoteIndex !== -1) {
                notes[existingNoteIndex] = {
                    ...notes[existingNoteIndex],
                    content,
                    color,
                    modifiedDate: new Date().toISOString()
                };
            } else {
                notes.push({
                    title,
                    content,
                    color,
                    createdDate: new Date().toISOString(),
                    modifiedDate: new Date().toISOString()
                });
            }
            localStorage.setItem('notes', JSON.stringify(notes));
            loadNotes();
            clearNoteEditor();
            showAlert('Note saved!', 'success');
        } else {
            showAlert('Note title or content is empty.', 'warning');
        }
    });

    // Delete a note
    deleteNoteButton.addEventListener('click', () => {
        const title = noteTitle.value.trim();
        if (title) {
            let notes = JSON.parse(localStorage.getItem('notes')) || [];
            notes = notes.filter(note => note.title !== title);
            localStorage.setItem('notes', JSON.stringify(notes));
            loadNotes();
            clearNoteEditor();
            showAlert('Note deleted!', 'success');
        } else {
            showAlert('Note title is empty.', 'danger');
        }
    });

    // Load notes
    const loadNotes = () => {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        notesList.innerHTML = '';
         // Clear existing notes
        notes.forEach(note => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.style.backgroundColor = note.color;

            // Create a container for the note title, content, and date
            const noteContentContainer = document.createElement('div');
            noteContentContainer.className = 'd-flex flex-column';

            // Create a span for the note title
            const titleSpan = document.createElement('span');
            titleSpan.textContent = note.title;
            titleSpan.className = 'note-title font-weight-bold';

            // Create a span for the note content
            const contentSpan = document.createElement('span');
            contentSpan.textContent = note.content;
            contentSpan.className = 'note-content mt-2';

            // Create a span for the creation date
            const dateSpan = document.createElement('span');
            dateSpan.textContent = `Created: ${new Date(note.createdDate).toLocaleDateString()}`;
            dateSpan.className = 'note-date text-muted';

            noteContentContainer.appendChild(titleSpan);
            noteContentContainer.appendChild(contentSpan);
            noteContentContainer.appendChild(dateSpan);

            li.appendChild(noteContentContainer);
            li.addEventListener('click', () => {
                noteTitle.value = note.title;
                noteContent.value = note.content;
                noteColor.value = note.color;
            });
            notesList.appendChild(li);
        });
    };

    // Clear note editor
    const clearNoteEditor = () => {
        noteTitle.value = '';
        noteContent.value = '';
        noteColor.value = '#2AAA8A';
    };

    // Search notes
    searchNotesInput.addEventListener('input', () => {
        const query = searchNotesInput.value.toLowerCase();
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        const filteredNotes = notes.filter(note =>
            note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query)
        );
        notesList.innerHTML = '';
        filteredNotes.forEach(note => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.style.backgroundColor = note.color;

            // Create a container for the note title and content
            const noteContentContainer = document.createElement('div');
            noteContentContainer.className = 'd-flex flex-column';


            // Create a span for the note title
            const titleSpan = document.createElement('span');
            titleSpan.textContent = note.title;
            titleSpan.className = 'note-title font-weight-bold';

            // Create a span for the note content
            const contentSpan = document.createElement('span');
            contentSpan.textContent = note.content;
            contentSpan.className = 'note-content mt-2';

            // Create a span for the creation date
            const dateSpan = document.createElement('span');
            dateSpan.textContent = `Created: ${new Date(note.createdDate).toLocaleDateString()}`;
            dateSpan.className = 'note-date text-muted';

            noteContentContainer.appendChild(titleSpan);
            noteContentContainer.appendChild(contentSpan);
            noteContentContainer.appendChild(dateSpan);

            li.appendChild(noteContentContainer);
            li.addEventListener('click', () => {
                noteTitle.value = note.title;
                noteContent.value = note.content;
                noteColor.value = note.color;
            });
            notesList.appendChild(li);
        });
    });

    // Toggle emoji picker
    emojiButton.addEventListener('click', () => {
        emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'block' : 'none';
    });

    // Add emoji to note content
    emojiPicker.addEventListener('click', (event) => {
        if (event.target.tagName === 'SPAN') {
            noteContent.value += event.target.textContent;
            emojiPicker.style.display = 'none'; 
        }
    });

    // Loads and displays when the page loads
    loadTheme();
    loadNotes();
});
