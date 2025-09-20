// photoMeta.js - Simple photo gallery support
// This file is kept as a placeholder for future photo metadata features
// Currently it only manages basic photo gallery functionality

document.addEventListener('DOMContentLoaded', () => {
  // Basic image error handling
  document.querySelectorAll('.photo-card__image img').forEach(img => {
    img.onerror = () => {
      img.src = 'assests/Images/placeholder.jpg';
      img.alt = 'Image failed to load';
    };
  });

  // convert any existing location text to links (keep the 'Location:' label)
  document.querySelectorAll('.photo-location').forEach(el => {
    const txt = el.textContent || '';
    const marker = 'Location:';
    if (txt.includes(marker)) {
      const loc = txt.split(marker)[1].trim();
      if (loc) {
        const anchor = createLocationLink(loc);
        // clear element and append label + link
        el.textContent = '';
        const strong = document.createElement('strong');
        strong.textContent = marker;
        el.appendChild(strong);
        el.appendChild(document.createTextNode(' '));
        el.appendChild(anchor);
      }
    }
  });
});

function setFilenameEl(filenameEl, name) {
  if (!filenameEl) return;
  filenameEl.innerHTML = filenameEl.innerHTML.replace(/<strong>.*?<\/strong>\s*/i, '<strong>File:</strong> ' + name);
}

async function extractForCard(card, options={reverse:false, force:false}){
  const img = card.querySelector('img');
  if (!img) return null;
  const src = img.getAttribute('src') || img.src || '';
  const key = CONFIG.cacheKeyPrefix + src;

  // check cache
  let cached = storageGet(key);
  if (cached && !options.force) {
    applyMetadataToCard(card, cached);
    return cached;
  }

  // load exifr
  let exifr;
  try { exifr = await loadExifr(); } catch(e){ console.warn('exifr load failed', e); return null }

  let parsed = null;
  try {
    // Try parsing from URL — many hosts may block this without CORS
    parsed = await exifr.parse(src, { tiff:true, exif:true, gps:true });
  } catch(err) {
    try { parsed = await exifr.parse(img); } catch(e2){ parsed = null }
  }

  const out = { src };

  if (parsed) {
    // time
    const dt = parsed.DateTimeOriginal || parsed.CreateDate || parsed.ModifyDate || null;
    out.time = dt ? (dt instanceof Date ? dt.toISOString() : new Date(dt).toISOString()) : null;
    // gps
    if (parsed.latitude && parsed.longitude) {
      out.lat = parsed.latitude;
      out.lon = parsed.longitude;
    }
    // store a few nice-to-have fields
    if (parsed.Make) out.cameraMake = parsed.Make;
    if (parsed.Model) out.cameraModel = parsed.Model;
  }

  // reverse geocode optionally
  if (options.reverse && out.lat && out.lon) {
    const addr = await reverseGeocode(out.lat, out.lon);
    if (addr) out.address = addr;
  }

  storageSet(key, out);
  applyMetadataToCard(card, out);
  return out;
}

function applyMetadataToCard(card, meta) {
  if (!meta) return;
  const filenameEl = card.querySelector('.photo-filename');
  const locationEl = card.querySelector('.photo-location');
  const titleEl = card.querySelector('.photo-title');
  let timeEl = card.querySelector('.photo-time');

  // filename
  try { const name = (meta.src||'').split('/').pop() || meta.src; setFilenameEl(filenameEl, name); } catch(e){}

  // time
  if (meta.time) {
    if (!timeEl) {
      timeEl = document.createElement('p');
      timeEl.className = 'photo-time';
      const metaContainer = card.querySelector('.photo-card__meta');
      if (metaContainer) metaContainer.insertBefore(timeEl, metaContainer.firstChild.nextSibling);
    }
    timeEl.innerHTML = '<strong>Time:</strong> ' + formatTime(new Date(meta.time));
  }

  // location
  if (meta.address) {
    if (locationEl) locationEl.innerHTML = '<strong>Location:</strong> ' + meta.address;
  } else if (meta.lat && meta.lon) {
    if (locationEl) locationEl.innerHTML = '<strong>Location:</strong> ' + meta.lat.toFixed(6) + ', ' + meta.lon.toFixed(6);
  }

  // camera info (optional)
  if (meta.cameraMake || meta.cameraModel) {
    let camEl = card.querySelector('.photo-camera');
    if (!camEl) {
      camEl = document.createElement('p'); camEl.className = 'photo-camera';
      card.querySelector('.photo-card__meta').appendChild(camEl);
    }
    camEl.textContent = ((meta.cameraMake||'') + ' ' + (meta.cameraModel||'')).trim();
  }

  // convert location text to link
  const locEl = card.querySelector('.photo-location');
  if (locEl) {
    const txt = locEl.textContent || '';
    if (txt.includes('Location:')) {
      const loc = txt.split('Location:')[1].trim();
      if (loc) locEl.replaceWith(createLocationLink(loc));
    }
  }
}

function createLocationLink(location) {
  const a = document.createElement('a');
  a.href = '#'; // placeholder; will be handled on click
  a.textContent = location;
  a.className = 'photo-location-link';
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const loc = e.currentTarget.textContent || '';
    const latLng = loc.split(',').map(Number);
    if (latLng.length === 2 && !isNaN(latLng[0]) && !isNaN(latLng[1])) {
      window.open(`https://www.google.com/maps?q=${latLng[0]},${latLng[1]}`, '_blank');
    } else {
      // geocode the address
      geocodeAddress(loc).then(coords => {
        if (coords && coords.length === 2) {
          window.open(`https://www.google.com/maps?q=${coords[0]},${coords[1]}`, '_blank');
        } else {
          alert('Unable to find location on map: ' + loc);
        }
      }).catch(err => { console.error('geocode failed', err); alert('Unable to find location on map: ' + loc); });
    }
  });
  return a;
}

// Simple forward geocode using Nominatim (lightweight, rate-limited)
async function geocodeAddress(query) {
  try {
    const params = new URLSearchParams({ q: query, format: 'jsonv2', limit: 1 });
    const url = `https://nominatim.openstreetmap.org/search?${params}`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !data.length) return null;
    const first = data[0];
    return [parseFloat(first.lat), parseFloat(first.lon)];
  } catch (err) {
    return null;
  }
}

function addCardControls(card) {
  // add small control row inside meta area: [Fetch metadata] [Copy filename]
  const meta = card.querySelector('.photo-card__meta');
  if (!meta) return;
  let row = card.querySelector('.photo-controls');
  if (row) return; // already added
  row = document.createElement('div');
  row.className = 'photo-controls';

  const fetchBtn = document.createElement('button');
  fetchBtn.textContent = 'Fetch metadata';
  fetchBtn.className = 'btn';
  fetchBtn.addEventListener('click', async () => {
    fetchBtn.disabled = true; fetchBtn.textContent = 'Fetching...';
    await extractForCard(card, { reverse: CONFIG.reverseGeocode, force:true });
    fetchBtn.disabled = false; fetchBtn.textContent = 'Fetch metadata';
  });

  const copyBtn = document.createElement('button');
  copyBtn.textContent = 'Copy filename';
  copyBtn.className = 'btn';
  copyBtn.addEventListener('click', () => {
    const img = card.querySelector('img');
    if (!img) return;
    const name = (img.src||'').split('/').pop() || img.src;
    navigator.clipboard?.writeText(name).then(()=>{
      copyBtn.textContent = 'Copied!'; setTimeout(()=> copyBtn.textContent='Copy filename', 1200);
    }).catch(()=>{ copyBtn.textContent = 'Copy failed'; setTimeout(()=> copyBtn.textContent='Copy filename', 1200); });
  });

  row.appendChild(fetchBtn);
  row.appendChild(copyBtn);
  meta.appendChild(row);
}

(async function init() {
  if (document.readyState === 'loading') await new Promise(r => document.addEventListener('DOMContentLoaded', r));
  const gallery = document.querySelector('.photo-gallery');
  if (!gallery) return;

  const autoCheckbox = document.getElementById('meta-auto');
  const reverseCheckbox = document.getElementById('meta-reverse');
  const refreshAllBtn = document.getElementById('meta-refresh-all');
  const statusEl = document.getElementById('meta-status');

  // persist user's reverse geocode preference in memory
  CONFIG.reverseGeocode = !!reverseCheckbox?.checked;
  if (reverseCheckbox) reverseCheckbox.addEventListener('change', (e)=> { CONFIG.reverseGeocode = !!e.target.checked });

  const cards = Array.from(gallery.querySelectorAll('.photo-card'));
  cards.forEach(addCardControls);

  async function processAll(force=false) {
    if (statusEl) statusEl.textContent = 'Processing...';
    for (const c of cards) {
      try { await extractForCard(c, { reverse: CONFIG.reverseGeocode, force }); } catch(e){ console.warn('card extract failed', e); }
    }
    if (statusEl) statusEl.textContent = 'Done';
    setTimeout(()=> { if (statusEl?.textContent === 'Done') statusEl.textContent = ''; }, 2000);
  }

  if (refreshAllBtn) refreshAllBtn.addEventListener('click', ()=> processAll(true));

  if (autoCheckbox && autoCheckbox.checked) {
    // run once on load
    await processAll(false);
  }
})();
