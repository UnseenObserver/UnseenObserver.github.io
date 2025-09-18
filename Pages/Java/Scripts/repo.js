/* Lightweight repo card script.
  Usage: <div class="gh-repo-card" data-owner="OWNER" data-repo="REPO"></div>
*/
(async function(){
  const cards = document.querySelectorAll('.gh-repo-card');
  if (!cards.length) return;
  for (const card of cards) {
    const owner = card.dataset.owner;
    const repo = card.dataset.repo;
    if (!owner || !repo) {
      card.textContent = 'Repository not specified';
      continue;
    }
    // Render loading skeleton
    card.innerHTML = '<div class=\"header\"><div style=\"width:44px;height:44px;border-radius:6px;background:#333\"></div><div style=\"flex:1\"><div class=\"skeleton\" style=\"width:90%\"></div><div class=\"skeleton\" style=\"width:50%;margin-top:8px\"></div></div></div>';
    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      if (!res.ok) {
        if (res.status === 404) {
          card.innerHTML = '<div style=\"color:#f88\">Repository not found</div>';
        } else if (res.status === 403) {
          card.innerHTML = '<div style=\"color:#f88\">API rate limit exceeded (client-side). Use server caching or an auth token.</div>';
        } else {
          card.innerHTML = `<div style=\"color:#f88\">Error fetching repository: ${res.status}</div>`;
        }
        continue;
      }
      const data = await res.json();
      const lang = data.language || '—';
      const stars = (data.stargazers_count || 0).toLocaleString();
      const forks = (data.forks || 0).toLocaleString();
      const desc = data.description ? escapeHtml(data.description) : '';
      const ownerLogin = data.owner && data.owner.login ? data.owner.login : owner;

      card.innerHTML = `
        <div class="header">
          <img src="${data.owner.avatar_url}&s=96" alt="${ownerLogin}" width="44" height="44" style="border-radius:8px;object-fit:cover;border:1px solid rgba(255,255,255,0.04)">
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;justify-content:space-between">
              <div>
                <div class="repo-name" title="${escapeHtml(data.name)}" aria-label="${escapeHtml(data.name)}">${escapeHtml(data.name)}</div>
                <div class="owner">${escapeHtml(ownerLogin)}</div>
              </div>
            </div>
            <div class="desc">${desc}</div>
          </div>
        </div>
        <div class="meta">
          <div class="lang"><span class="dot" style="background:${languageColor(lang)}"></span>${escapeHtml(lang)}</div>
          <div title="Stars">★ ${stars}</div>
          <div title="Forks">⑂ ${forks}</div>
        </div>
      `;
      // Make the entire card clickable and keyboard-accessible
      (function makeCardClickable(c, url){
        c.setAttribute('role','link');
        c.setAttribute('tabindex','0');
        c.addEventListener('click', ()=> window.open(url, '_blank'));
        c.addEventListener('keydown', (e)=>{
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.open(url, '_blank'); }
        });
      })(card, data.html_url);
    } catch (err) {
      card.innerHTML = '<div style="color:#f88">Network error</div>';
      console.error(err);
    }
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  }
  function timeAgo(d){
    const seconds = Math.floor((Date.now() - d.getTime())/1000);
    if (seconds < 60) return seconds + 's';
    const minutes = Math.floor(seconds/60);
    if (minutes < 60) return minutes + 'm';
    const hours = Math.floor(minutes/60);
    if (hours < 24) return hours + 'h';
    const days = Math.floor(hours/24);
    if (days < 30) return days + 'd';
    return Math.floor(days/30) + 'mo';
  }
  function languageColor(lang){
    // tiny palette for common languages — expand as needed
    const map = {
      'JavaScript':'#f1e05a','TypeScript':'#2b7489','HTML':'#e34c26','CSS':'#563d7c',
      'Python':'#3572A5','Java':'#b07219','C++':'#f34b7d','Shell':'#89e051'
    };
    return map[lang] || '#9ca3af';
  }
})();