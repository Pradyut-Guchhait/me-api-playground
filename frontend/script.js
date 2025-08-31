
const api = location.origin;

const $ = sel => document.querySelector(sel);
const text = (el, s) => { el.textContent = s; };

function formatProfile(p) {
  if (!p) return 'No profile found.';
  const skills = (p.skills||[]).map(s => `${s.name}${s.level ? ` (${s.level})` : ''}`).join(', ');
  const projects = (p.projects||[]).map((pr, i) => `${i+1}. ${pr.title} — ${pr.description || ''} [skills: ${(pr.skills||[]).join(', ')}]`).join('\n');
  const work = (p.work||[]).map(w => `- ${w.role} @ ${w.org} (${w.start}–${w.end}) ${w.summary||''}`).join('\n');
  return [
    `Name: ${p.name}`,
    `Email: ${p.email}`,
    p.headline ? `Headline: ${p.headline}` : '',
    p.summary ? `Summary: ${p.summary}` : '',
    skills ? `Skills: ${skills}` : '',
    projects ? `Projects:\n${projects}` : '',
    work ? `Work:\n${work}` : ''
  ].filter(Boolean).join('\n');
}

function formatProjectsPage(res) {
  if (!res || !Array.isArray(res.items)) {
    const arr = Array.isArray(res) ? res : [];
    if (!arr.length) return 'No projects found.';
    return arr.map((pr, i) => `${i+1}. ${pr.title} — ${pr.description || ''} [skills: ${(pr.skills||[]).join(', ')}]`).join('\n');
  }
  const { total=0, page=1, limit=10, items=[] } = res;
  const lines = items.map((pr, i) => `${(page-1)*limit + i + 1}. ${pr.title} — ${pr.description || ''} [skills: ${(pr.skills||[]).join(', ')}]`);
  return `Total: ${total}  |  Page: ${page}  |  Page size: ${limit}\n` + (lines.length ? lines.join('\n') : 'No projects on this page.');
}

function formatSkills(skills) {
  if (!Array.isArray(skills) || !skills.length) return 'No skills to show.';
  return skills.map((s, i) => `${i+1}. ${s.name}${s.level ? ` (${s.level})` : ''}`).join('\n');
}

function formatSearch(hits) {
  if (!Array.isArray(hits) || !hits.length) return 'No results.';
  const label = (h) => h.type === 'project' ? h.data.title
                : h.type === 'skill' ? h.data.name
                : h.type === 'work' ? `${h.data.role} @ ${h.data.org}`
                : h.type === 'profile' ? `${h.data.name} <${h.data.email}>`
                : JSON.stringify(h.data);
  return hits.map((h, i) => `${i+1}. [${h.type}] ${label(h)}`).join('\n');
}

$('#loadProfile').addEventListener('click', async () => {
  const res = await fetch(`${api}/api/profile`);
  text($('#profileOut'), formatProfile(await res.json()));
});

$('#searchBySkill').addEventListener('click', async () => {
  const skill = $('#skill').value.trim();
  const url = new URL(`${api}/api/projects`);
  if (skill) url.searchParams.set('skill', skill);
  const res = await fetch(url);
  text($('#searchOut'), formatProjectsPage(await res.json()));
});

$('#searchAll').addEventListener('click', async () => {
  const q = $('#q').value.trim();
  const url = new URL(`${api}/api/search`);
  if (q) url.searchParams.set('q', q);
  const res = await fetch(url);
  text($('#searchOut'), formatSearch(await res.json()));
});

$('#topSkills').addEventListener('click', async () => {
  const res = await fetch(`${api}/api/skills/top?limit=5`);
  text($('#skillsOut'), formatSkills(await res.json()));
});
