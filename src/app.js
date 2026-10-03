// API base is injected at runtime via window.__API_BASE__ (set in nginx config)
// or falls back to same-origin (which won't work cross-pod without ingress routing).
const API_BASE = (window.__API_BASE__ || '/api').replace(/\/$/, '');

const $ = (id) => document.getElementById(id);

async function callApi(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${body}`);
  }
  return res.json();
}

function setStatus(msg, isError = false) {
  const el = $('status');
  el.textContent = msg;
  el.className = isError ? 'status error' : 'status ok';
}

function renderFeedback(items) {
  const list = $('feedbackList');
  list.innerHTML = '';
  if (!items.length) {
    list.innerHTML = '<li class="empty">No feedback yet.</li>';
    return;
  }
  for (const item of items) {
    const li = document.createElement('li');
    li.className = 'feedback-item';
    const stars = '★'.repeat(item.rating) + '☆'.repeat(5 - item.rating);
    li.innerHTML = `
      <div class="feedback-head">
        <strong>${escapeHtml(item.name)}</strong>
        <span class="stars">${stars}</span>
      </div>
      ${item.comment ? `<p>${escapeHtml(item.comment)}</p>` : ''}
      <small>${item.created_at}</small>
    `;
    list.appendChild(li);
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

async function loadInfo() {
  try {
    const info = await callApi('/info');
    $('apiInfo').textContent = `${info.service} v${info.version} (${info.env})`;
  } catch (e) {
    $('apiInfo').textContent = 'unreachable';
  }
}

async function loadFeedback() {
  try {
    const items = await callApi('/feedback');
    renderFeedback(items);
  } catch (e) {
    renderFeedback([]);
    setStatus(`Could not load feedback: ${e.message}`, true);
  }
}

$('submitBtn').addEventListener('click', async () => {
  const name = $('nameInput').value.trim();
  const rating = Number($('ratingInput').value);
  const comment = $('commentInput').value.trim();
  if (!name) {
    setStatus('Please enter a name.', true);
    return;
  }
  try {
    await callApi('/feedback', {
      method: 'POST',
      body: JSON.stringify({ name, rating, comment }),
    });
    setStatus('Thanks for the feedback!', false);
    $('commentInput').value = '';
    await loadFeedback();
  } catch (e) {
    setStatus(`Submit failed: ${e.message}`, true);
  }
});

$('refreshBtn').addEventListener('click', loadFeedback);

loadInfo();
loadFeedback();
