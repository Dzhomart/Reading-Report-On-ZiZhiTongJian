function truncateAbstract(text, maxLength = 50) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}

const ancientGoldenQuotes = [
  "「履霜，坚冰至」",
  "「男子不能流芳百世，亦当遗臭万年」",
  "「本是同根生，相煎何太急」",
  "「煮豆燃豆萁」",
  "「出师未捷身先死」",
  "「最是仓皇辞庙日」",
  "「当断不断，反受其乱」",
  "「慈不掌兵」",
  "「折戟沉沙铁未销，自将磨洗认前朝」",
  "「秦人不暇自哀，而后人哀之」",
  "「黄沙百战穿金甲，不破楼兰终不还」",
  "「先为不可胜，以待敌之可胜」"
];

function extractGoldenQuotes() {
  const quotes = [];
  notesData.forEach(note => {
    if (note.abstract) {
      const parts = note.abstract.split(/[。！？；\n]/).filter(p => p.trim().length > 10);
      if (parts.length > 0) {
        quotes.push({
          text: '「' + parts[0].trim() + '」',
          noteId: note.id,
          dynasty: note.dynasty
        });
      }
    }
    if (note.originalText) {
      const origQuotes = note.originalText.split(/[。！？；\n]/).filter(p => p.trim().length > 8);
      if (origQuotes.length > 0) {
        quotes.push({
          text: '『' + origQuotes[0].trim() + '』',
          noteId: note.id,
          dynasty: note.dynasty,
          isOriginal: true
        });
      }
    }
  });
  return quotes;
}

function renderGoldenQuotes() {
  const track = document.getElementById('quotes-track');
  if (!track) return;

  const quotes = extractGoldenQuotes();
  let html = '';

  const useAncientQuotes = true;
  const quotesToShow = useAncientQuotes ? ancientGoldenQuotes : quotes;

  quotesToShow.concat(quotesToShow).forEach((quote, index) => {
    const text = typeof quote === 'string' ? quote : quote.text;
    const dynasty = typeof quote === 'string' ? '资治通鉴' : quote.dynasty;
    const noteId = typeof quote === 'string' ? '' : quote.noteId;
    
    html += `
      <div class="quote-item" ${noteId ? `data-note-id="${noteId}"` : ''}>
        <span class="quote-text">${text}</span>
        <span class="quote-tag">${dynasty}</span>
      </div>
    `;
  });

  track.innerHTML = html;

  track.querySelectorAll('.quote-item[data-note-id]').forEach(item => {
    item.addEventListener('click', () => {
      const noteId = item.dataset.noteId;
      window.location.href = `detail.html?id=${noteId}`;
    });
  });
}

function getDateCountMap() {
  const dateMap = {};
  notesData.forEach(note => {
    const dateKey = note.date;
    const wordCount = note.content.length;
    if (dateMap[dateKey]) {
      dateMap[dateKey] += wordCount;
    } else {
      dateMap[dateKey] = wordCount;
    }
  });
  return dateMap;
}

function getIntensityColor(count) {
  if (count === 0) return '#F2EFE9';
  if (count < 200) return '#C8966E';
  if (count < 300) return '#A8764E';
  return '#8A5A3E';
}

function renderCalendarHeatmap() {
  const heatmapContainer = document.getElementById('calendar-heatmap');
  const monthsContainer = document.getElementById('calendar-months');
  const infoContainer = document.getElementById('footprint-info');

  if (!heatmapContainer || !monthsContainer || !infoContainer) return;

  const dateMap = getDateCountMap();
  
  const startDay = 7;
  const endDay = 29;
  const totalDays = endDay - startDay + 1;

  const totalNotes = notesData.length;
  const readingDays = Object.keys(dateMap).length;
  const maxStreak = 21;

  infoContainer.innerHTML = `
    <div class="footprint-stat">
      <span class="stat-number">${totalNotes}</span>
      <span class="stat-label">篇笔记</span>
    </div>
    <div class="footprint-stat">
      <span class="stat-number">${totalDays}</span>
      <span class="stat-label">天阅读</span>
    </div>
    <div class="footprint-stat">
      <span class="stat-number">${maxStreak}</span>
      <span class="stat-label">天连续</span>
    </div>
  `;

  let html = '<div class="days-row">';
  for (let day = startDay; day <= endDay; day++) {
    const dateStr = `2026-05-${String(day).padStart(2, '0')}`;
    const count = dateMap[dateStr] || 0;
    const color = getIntensityColor(count);
    
    const title = count > 0 ? `${dateStr} - ${count}字` : `${dateStr} - 无笔记`;

    html += `<div class="day-cell"
                 style="background-color: ${color}"
                 data-date="${dateStr}"
                 data-count="${count}"
                 title="${title}">
               <span class="day-number">${day}</span>
             </div>`;
  }
  html += '</div>';

  heatmapContainer.innerHTML = html;

  monthsContainer.innerHTML = '<span class="month-label">五月 2026</span>';
}

function calculateMaxStreak(dates) {
  if (dates.length === 0) return 0;

  dates.sort();
  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < dates.length; i++) {
    const prevDate = new Date(dates[i - 1]);
    const currDate = new Date(dates[i]);
    const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return maxStreak;
}

function navigateToNote(note) {
  window.location.href = `detail.html?id=${note.id}`;
}

function createAncientCard(note, index) {
  const card = document.createElement('article');
  card.className = 'ancient-card';
  card.style.animationDelay = `${index * 50}ms`;

  // 不再设置随机旋转和偏移，保持卡片端正
  card.style.setProperty('--rotation', '0deg');
  card.style.setProperty('--vertical-offset', '0px');

  const truncatedAbstract = truncateAbstract(note.abstract, 50);

  card.innerHTML = `
    <div class="ancient-card-inner">
      <div class="ancient-card-header">
        <span class="ancient-card-dynasty">${note.dynasty}</span>
        <span class="ancient-card-date">${note.date}</span>
      </div>
      <h3 class="ancient-card-title">${note.title}</h3>
      <p class="ancient-card-abstract">${truncatedAbstract}</p>
      <div class="ancient-card-footer">
        <span class="ancient-card-category">${note.category}</span>
        <span class="ancient-card-arrow">→</span>
      </div>
    </div>
  `;

  card.addEventListener('click', () => navigateToNote(note));

  return card;
}

function renderAllNotes() {
  const container = document.getElementById('notes-shelf');
  if (!container) return;

  container.innerHTML = '';

  notesData.forEach((note, index) => {
    const card = createAncientCard(note, index);
    container.appendChild(card);
  });

  setTimeout(() => {
    const cards = container.querySelectorAll('.ancient-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('visible');
      }, index * 50);
    });
  }, 100);
}

document.addEventListener('DOMContentLoaded', () => {
  if (notesData.length === 0) {
    loadNotesData().then(() => {
      renderGoldenQuotes();
      renderCalendarHeatmap();
      renderAllNotes();
    });
  } else {
    renderGoldenQuotes();
    renderCalendarHeatmap();
    renderAllNotes();
  }
});
