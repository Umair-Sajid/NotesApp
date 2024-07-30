document.addEventListener('DOMContentLoaded', () => {
    // Waits until the DOM is fully loaded before executing the following code

    const themeToggle = document.getElementById('theme-toggle');
    // Gets the theme toggle button element

    const noteTitle = document.getElementById('note-title');
    // Gets the note title input field

    const noteContent = document.getElementById('note-content');
    // Gets the note content textarea

    const noteColor = document.getElementById('note-color');
    // Gets the note color input field

    const saveNoteButton = document.getElementById('save-note');
    // Gets the save note button

    const deleteNoteButton = document.getElementById('delete-note');
    // Gets the delete note button

    const searchNotesInput = document.getElementById('search-notes');
    // Gets the search input field

    const notesList = document.getElementById('notes'); 
    // Gets the unordered list element where notes will be displayed

    const alertContainer = document.getElementById('alert-container');
    // Gets the container where alert messages will be shown

    const emojiButton = document.getElementById('emoji-button');
    // Gets the emoji picker button

    const emojiPicker = document.getElementById('emoji-picker');
    // Gets the container for emoji options
    

    // Load theme preference from local storage
    const loadTheme = () => {
        const theme = localStorage.getItem('theme');
        // Retrieves the saved theme from local storage
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            // Adds dark-theme class to body if the saved theme is 'dark'
        }
    };

    // Toggle between dark and light themes
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        // Toggles the 'dark-theme' class on the body
        const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        // Determines the current theme based on the presence of 'dark-theme' class
        localStorage.setItem('theme', theme);
        // Saves the current theme to local storage
    });
    
    // Show alert message
    const showAlert = (message, type) => {
        const alert = document.createElement('div');
        // Creates a new div element for the alert
        alert.className = `alert alert-${type}`;
        // Sets the class of the alert based on its type (e.g., 'alert-success' or 'alert-danger')
        alert.role = 'alert';
        // Sets the role attribute for accessibility
        alert.textContent = message;
        // Sets the text content of the alert
        alertContainer.innerHTML = ''; // Clear any existing alert
        // Clears any previously displayed alert
        alertContainer.appendChild(alert);
        // Adds the new alert to the alert container
        setTimeout(() => alert.remove(), 2000);
        // Removes the alert after 2 seconds
    };

    // Save a new note or update an existing note
    saveNoteButton.addEventListener('click', () => {
        const title = noteTitle.value.trim();
        // Gets the title of the note, trimmed of any extra spaces
        const content = noteContent.value.trim();
        // Gets the content of the note, trimmed of any extra spaces
        const color = noteColor.value;
        // Gets the selected color for the note
        if (title && content) {
            let notes = JSON.parse(localStorage.getItem('notes')) || [];
            // Retrieves and parses notes from local storage, or initializes as an empty array if none exist
            const existingNoteIndex = notes.findIndex(note => note.title === title);
            // Finds the index of the existing note with the same title
            if (existingNoteIndex !== -1) {
                notes[existingNoteIndex] = {
                    ...notes[existingNoteIndex],
                    content,
                    color,
                    modifiedDate: new Date().toISOString()
                };

                
                // Updates the existing note with new content, color, and modified date
            } else {
                notes.push({
                    title,
                    content,
                    color,
                    createdDate: new Date().toISOString(),
                    modifiedDate: new Date().toISOString()
                });
                // Adds a new note with the title, content, color, created date, and modified date
            }
            localStorage.setItem('notes', JSON.stringify(notes));
            // Saves the updated notes array to local storage
            loadNotes();
            // Reloads the notes to display the updated list
            clearNoteEditor();
            // Clears the note editor fields
            showAlert('Note saved!', 'success');
            // Shows a success alert message
        } else {
            showAlert('Note title or content is empty.', 'danger');
            // Shows an error alert message if title or content is empty
        }
    });

    // Delete a note
    deleteNoteButton.addEventListener('click', () => {
        const title = noteTitle.value.trim();
        // Gets the title of the note to delete
        if (title) {
            let notes = JSON.parse(localStorage.getItem('notes')) || [];
            // Retrieves and parses notes from local storage, or initializes as an empty array if none exist
            notes = notes.filter(note => note.title !== title);
            // Filters out the note with the matching title
            localStorage.setItem('notes', JSON.stringify(notes));
            // Saves the updated notes array to local storage
            loadNotes();
            // Reloads the notes to display the updated list
            clearNoteEditor();
            // Clears the note editor fields
            showAlert('Note deleted!', 'success');
            // Shows a success alert message
        } else {
            showAlert('Note title is empty.', 'warning');
            // Shows an error alert message if the title is empty
        }
    });

    // Load notes
    const loadNotes = () => {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        // Retrieves and parses notes from local storage, or initializes as an empty array if none exist
        notesList.innerHTML = ''; // Clear existing notes
        // Clears the current list of notes
        notes.forEach(note => {
            const li = document.createElement('li');
            // Creates a new list item for each note
            li.className = 'list-group-item';
            // Sets the class for styling
            li.style.backgroundColor = note.color;
            // Sets the background color of the list item based on the note color

            const noteContentContainer = document.createElement('div');
            // Creates a container for the note content
            noteContentContainer.className = 'd-flex flex-column';
            // Sets the class for styling the content container

            const titleSpan = document.createElement('span');
            // Creates a span for the note title
            titleSpan.textContent = note.title;
            // Sets the text content of the span to the note title
            titleSpan.className = 'note-title font-weight-bold';
            // Sets the class for styling the title

            const contentSpan = document.createElement('span');
            // Creates a span for the note content
            contentSpan.textContent = note.content;
            // Sets the text content of the span to the note content
            contentSpan.className = 'note-content mt-2';
            // Sets the class for styling the content 

            const dateSpan = document.createElement('span');
            // Creates a span for the note creation date
            dateSpan.textContent = `Created: ${new Date(note.createdDate).toLocaleDateString()}`;
            // Sets the text content of the span to the creation date
            dateSpan.className = 'note-date text-muted';
            // Sets the class for styling the date

            noteContentContainer.appendChild(titleSpan);
            noteContentContainer.appendChild(contentSpan);
            noteContentContainer.appendChild(dateSpan);
            // Appends the title, content, and date spans to the content container

            li.appendChild(noteContentContainer);
            // Appends the content container to the list item

            li.addEventListener('click', () => {
                noteTitle.value = note.title;
                noteContent.value = note.content;
                noteColor.value = note.color;
                // Fills the note editor with the selected note's details
            });
            notesList.appendChild(li);
            // Appends the list item to the notes list
        });
    };

    // Clear note editor
    const clearNoteEditor = () => {
        noteTitle.value = '';
        noteContent.value = '';
        noteColor.value = '#CF9FFF';
        // Clears the note editor fields (title, content, color)
    };

    // Search notes
    searchNotesInput.addEventListener('input', () => {
        const query = searchNotesInput.value.toLowerCase();
        // Gets the search query and converts it to lowercase
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        // Retrieves and parses notes from local storage, or initializes as an empty array if none exist
        const filteredNotes = notes.filter(note =>
            note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query)
        );
        // Filters notes based on the search query

        notesList.innerHTML = '';
        // Clears the current list of notes
        filteredNotes.forEach(note => {
            const li = document.createElement('li');            
            // Creates a new list item for each filtered note
            li.className = 'list-group-item';
            // Sets the class for styling
            li.style.backgroundColor = note.color;
            // Sets the background color of the list item based on the note color

            const noteContentContainer = document.createElement('div');
            // Creates a container for the note content
            noteContentContainer.className = 'd-flex flex-column';
            // Sets the class for styling the content container

            const titleSpan = document.createElement('span');
            // Creates a span for the note title
            titleSpan.textContent = note.title;
            // Sets the text content of the span to the note title
            titleSpan.className = 'note-title font-weight-bold';
            // Sets the class for styling the title

            const contentSpan = document.createElement('span');
            // Creates a span for the note content
            contentSpan.textContent = note.content;
            // Sets the text content of the span to the note content
            contentSpan.className = 'note-content mt-2';
            // Sets the class for styling the content

            const dateSpan = document.createElement('span');
            // Creates a span for the note creation date
            dateSpan.textContent = `Created: ${new Date(note.createdDate).toLocaleDateString()}`;
            // Sets the text content of the span to the creation date
            dateSpan.className = 'note-date text-muted';
            // Sets the class for styling the date

            noteContentContainer.appendChild(titleSpan);
            noteContentContainer.appendChild(contentSpan);
            noteContentContainer.appendChild(dateSpan);
            // Appends the title, content, and date spans to the content container

            li.appendChild(noteContentContainer);
            // Appends the content container to the list item8

            li.addEventListener('click', () => {
                noteTitle.value = note.title;
                noteContent.value = note.content;
                noteColor.value = note.color;
                // Fills the note editor with the selected note's details
            });
            notesList.appendChild(li);
            // Appends the list item to the notes list
        });
    });

    // Toggle emoji picker
    emojiButton.addEventListener('click', () => {
        emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'block' : 'none';
        // Toggles the visibility of the emoji picker
    });

    // Add emoji to note content
    emojiPicker.addEventListener('click', (event) => {
        if (event.target.tagName === 'SPAN') {
            noteContent.value += event.target.textContent;
            // Appends the selected emoji to the note content
            emojiPicker.style.display = 'none'; 
            // Hides the emoji picker
        }
    });


    loadTheme();
    // Loads the saved theme when the page loads

    loadNotes();
    // Loads and displays the notes when the page loads
});
