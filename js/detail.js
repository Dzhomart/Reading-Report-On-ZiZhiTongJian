function renderNoteDetail(note) {
  const titleEl = document.getElementById('note-title');
  const dynastyEl = document.getElementById('note-dynasty');
  const dateEl = document.getElementById('note-date');
  const categoryEl = document.getElementById('note-category');
  const originalTextSection = document.getElementById('original-text-section');
  const originalTextEl = document.getElementById('original-text-content');
  const contentEl = document.getElementById('note-content');
  const tagsContainer = document.getElementById('tags-container');
  const backLink = document.getElementById('back-link');

  if (!titleEl) return;

  document.title = `${note.title} - 资治通鉴读书笔记`;
  titleEl.textContent = note.title;
  dynastyEl.textContent = note.dynasty;
  dateEl.textContent = formatDate(note.date);
  categoryEl.textContent = note.category;
  
  if (note.originalText && note.originalText.trim()) {
    originalTextSection.style.display = 'block';
    originalTextEl.textContent = note.originalText;
  } else {
    originalTextSection.style.display = 'none';
  }
  
  const insightSection = contentEl;
  const paragraphs = note.content.split('\n').filter(p => p.trim());
  const formattedContent = paragraphs.map(p => `<p>${p}</p>`).join('');
  insightSection.innerHTML = '<div class="insight-label">读史心得</div>' + formattedContent;
  
  backLink.href = `list.html?dynasty=${note.dynasty}`;
  
  if (tagsContainer) {
    tagsContainer.innerHTML = `
      <a href="list.html?dynasty=${note.dynasty}" class="tag-item tag-dynasty">
        ${note.dynasty}
      </a>
      <a href="list.html?category=${note.category}" class="tag-item tag-category">
        ${note.category}
      </a>
    `;
  }
}

function renderRelatedNotes(relatedIds) {
  const section = document.getElementById('related-section');
  const container = document.getElementById('related-notes');

  if (!section || !container) return;

  const relatedNotes = getRelatedNotes(relatedIds);

  if (relatedNotes.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';

  relatedNotes.forEach(note => {
    const card = createRelatedCard(note);
    container.appendChild(card);
  });
}

function updateBreadcrumb(note) {
  const breadcrumb = document.getElementById('breadcrumb');
  if (!breadcrumb) return;

  const urlDynasty = getDynastyFromURL();

  if (urlDynasty && urlDynasty !== 'all') {
    breadcrumb.innerHTML = `
      <a href="index.html">首页</a>
      <span>/</span>
      <a href="list.html">笔记列表</a>
      <span>/</span>
      <a href="list.html?dynasty=${urlDynasty}">${note.dynasty}</a>
      <span>/</span>
      <span>${note.title}</span>
    `;
  } else {
    breadcrumb.innerHTML = `
      <a href="index.html">首页</a>
      <span>/</span>
      <a href="list.html">笔记列表</a>
      <span>/</span>
      <span>${note.title}</span>
    `;
  }
}

function loadNoteFromURL() {
  const noteId = getNoteIdFromURL();

  if (!noteId) {
    window.location.href = 'list.html';
    return;
  }

  const note = getNoteById(noteId);

  if (!note) {
    window.location.href = 'list.html';
    return;
  }

  renderNoteDetail(note);

  if (note.relatedNotes && note.relatedNotes.length > 0) {
    renderRelatedNotes(note.relatedNotes);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (notesData.length === 0) {
    loadNotesData().then(() => {
      loadNoteFromURL();
    });
  } else {
    loadNoteFromURL();
  }
});
