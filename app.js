// c0lornote - Interactive note application
// Store notes in localStorage for persistence
const STORAGE_KEY = 'c0lornote_notes';

// State
let selectedColor = '#F7DC6F';
let notes = [];

// DOM Elements
const authorInput = document.getElementById('author-name');
const contentInput = document.getElementById('note-content');
const postButton = document.getElementById('post-note');
const notesContainer = document.getElementById('notes-container');
const colorButtons = document.querySelectorAll('.color-btn');

// Initialize app
function init() {
    loadNotes();
    renderNotes();
    attachEventListeners();
    
    // Add some sample notes if empty
    if (notes.length === 0) {
        addSampleNotes();
    }
}

// Load notes from localStorage
function loadNotes() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        notes = JSON.parse(stored);
    }
}

// Save notes to localStorage
function saveNotes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// Add sample notes for demonstration
function addSampleNotes() {
    const sampleNotes = [
        {
            id: Date.now() - 3000,
            author: 'Alice',
            content: 'Love this new way to share thoughts! The colors make it so much more expressive! 🎨',
            color: '#FF6B6B',
            timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
            id: Date.now() - 2000,
            author: 'Bob',
            content: 'Finally, a social platform that feels fresh and creative. Great job team!',
            color: '#4ECDC4',
            timestamp: new Date(Date.now() - 7200000).toISOString()
        },
        {
            id: Date.now() - 1000,
            author: 'Charlie',
            content: 'The color selection is brilliant. It really helps convey emotions better than plain text.',
            color: '#BB8FCE',
            timestamp: new Date(Date.now() - 10800000).toISOString()
        }
    ];
    
    notes = sampleNotes;
    saveNotes();
}

// Attach event listeners
function attachEventListeners() {
    // Color selection
    colorButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            colorButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedColor = this.dataset.color;
        });
    });
    
    // Post note
    postButton.addEventListener('click', postNote);
    
    // Allow Enter key to post (Ctrl/Cmd + Enter)
    contentInput.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            postNote();
        }
    });
}

// Post a new note
function postNote() {
    const author = authorInput.value.trim() || 'Anonymous';
    const content = contentInput.value.trim();
    
    if (!content) {
        alert('Please write something in your note!');
        return;
    }
    
    const note = {
        id: Date.now(),
        author: author,
        content: content,
        color: selectedColor,
        timestamp: new Date().toISOString()
    };
    
    notes.unshift(note);
    saveNotes();
    renderNotes();
    
    // Clear form
    contentInput.value = '';
    
    // Show success feedback
    postButton.textContent = 'Posted! ✓';
    setTimeout(() => {
        postButton.textContent = 'Post Note';
    }, 2000);
}

// Render all notes
function renderNotes() {
    if (notes.length === 0) {
        notesContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No notes yet. Be the first to share!</p>';
        return;
    }
    
    notesContainer.innerHTML = notes.map(note => createNoteHTML(note)).join('');
}

// Create HTML for a single note
function createNoteHTML(note) {
    const timeAgo = getTimeAgo(note.timestamp);
    
    return `
        <div class="note-card" style="background-color: ${note.color};">
            <div class="note-content">${escapeHtml(note.content)}</div>
            <div class="note-meta">
                <span class="note-author">@${escapeHtml(note.author)}</span>
                <span class="note-time">${timeAgo}</span>
            </div>
        </div>
    `;
}

// Get relative time (e.g., "2 hours ago")
function getTimeAgo(timestamp) {
    const now = new Date();
    const noteTime = new Date(timestamp);
    const diffMs = now - noteTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return noteTime.toLocaleDateString();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Start the app
init();
