let notesData = [];

async function loadNotesData() {
  try {
    const response = await fetch('data/notes.json');
    const data = await response.json();
    notesData = data.notes;
    return notesData;
  } catch (error) {
    console.error('加载笔记数据失败:', error);
    return [];
  }
}

function getNoteById(id) {
  return notesData.find(note => note.id === id);
}

function getNotesByDynasty(dynasty) {
  if (!dynasty || dynasty === 'all') {
    return notesData;
  }
  return notesData.filter(note => note.dynasty === dynasty);
}

function getFeaturedNotes(count = 4) {
  return notesData.slice(0, count);
}

function getRelatedNotes(relatedIds) {
  return relatedIds.map(id => getNoteById(id)).filter(Boolean);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}年${month}月${day}日`;
}

function getDynastyFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('dynasty') || 'all';
}

function getNoteIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function initNavigation() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function createNoteCard(note, onclickHandler) {
  const card = document.createElement('div');
  card.className = 'note-card animate-slide-up';
  card.style.opacity = '0';

  card.innerHTML = `
    <h3 class="note-card-title">${note.title}</h3>
    <p class="note-card-abstract">${note.abstract}</p>
    <div class="note-card-meta">
      <span class="note-card-tag">${note.dynasty}</span>
      <span class="note-card-date">${formatDate(note.date)}</span>
    </div>
  `;

  card.addEventListener('click', () => onclickHandler(note));

  return card;
}

function createRelatedCard(note) {
  const card = document.createElement('div');
  card.className = 'related-card';

  card.innerHTML = `
    <h4 class="related-card-title">${note.title}</h4>
    <span class="related-card-dynasty">${note.dynasty}</span>
  `;

  card.addEventListener('click', () => {
    window.location.href = `detail.html?id=${note.id}`;
  });

  return card;
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadNotesData();
  initNavigation();
});

window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});
