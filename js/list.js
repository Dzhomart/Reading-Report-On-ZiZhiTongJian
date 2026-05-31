let currentDynasty = 'all';
let currentTag = 'all';

function navigateToNote(note) {
  window.location.href = `detail.html?id=${note.id}`;
}

function getNotesByDynastyAndTag(dynasty, tag) {
  let filtered = notesData;
  
  if (dynasty !== 'all') {
    filtered = filtered.filter(note => note.dynasty === dynasty);
  }
  
  if (tag !== 'all') {
    filtered = filtered.filter(note => note.tags && note.tags.includes(tag));
  }
  
  return filtered;
}

function renderNotesList(notes) {
  const container = document.getElementById('notes-list');
  if (!container) return;

  container.innerHTML = '';

  if (notes.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary); grid-column: 1/-1;">暂无笔记</p>';
    return;
  }

  notes.forEach((note, index) => {
    const card = createNoteCard(note, navigateToNote);
    card.style.animationDelay = `${index * 100}ms`;
    container.appendChild(card);

    setTimeout(() => {
      card.style.opacity = '1';
    }, 50 + index * 100);
  });
}

function initFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const tagButtons = document.querySelectorAll('.tag-stamp');
  const urlDynasty = getDynastyFromURL();

  if (urlDynasty !== 'all') {
    currentDynasty = urlDynasty;
    filterButtons.forEach(btn => {
      if (btn.dataset.dynasty === currentDynasty) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const dynasty = btn.dataset.dynasty;

      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentDynasty = dynasty;

      const filteredNotes = getNotesByDynastyAndTag(currentDynasty, currentTag);
      renderNotesList(filteredNotes);

      const url = new URL(window.location);
      if (dynasty === 'all') {
        url.searchParams.delete('dynasty');
      } else {
        url.searchParams.set('dynasty', dynasty);
      }
      window.history.pushState({}, '', url);

      updateBreadcrumb(dynasty);
    });
  });

  tagButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.dataset.tag;

      tagButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentTag = tag;

      const filteredNotes = getNotesByDynastyAndTag(currentDynasty, currentTag);
      renderNotesList(filteredNotes);
    });
  });
}

function updateBreadcrumb(dynasty) {
  const breadcrumb = document.getElementById('breadcrumb');
  if (!breadcrumb) return;

  if (dynasty === 'all') {
    breadcrumb.innerHTML = `
      <a href="index.html">首页</a>
      <span>/</span>
      <span>笔记列表</span>
    `;
  } else {
    breadcrumb.innerHTML = `
      <a href="index.html">首页</a>
      <span>/</span>
      <a href="list.html">笔记列表</a>
      <span>/</span>
      <span>${dynasty}</span>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initFilters();

  if (notesData.length === 0) {
    loadNotesData().then(() => {
      const notes = getNotesByDynastyAndTag(currentDynasty, currentTag);
      renderNotesList(notes);
    });
  } else {
    const notes = getNotesByDynastyAndTag(currentDynasty, currentTag);
    renderNotesList(notes);
  }
});
