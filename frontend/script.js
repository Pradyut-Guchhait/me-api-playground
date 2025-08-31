
const api = location.origin;

const $ = sel => document.querySelector(sel);
const out = (el, data) => el.textContent = JSON.stringify(data, null, 2);

$('#loadProfile').addEventListener('click', async () => {
  const res = await fetch(`${api}/api/profile`);
  out($('#profileOut'), await res.json());
});

$('#searchBySkill').addEventListener('click', async () => {
  const skill = $('#skill').value.trim();
  const url = new URL(`${api}/api/projects`);
  if (skill) url.searchParams.set('skill', skill);
  const res = await fetch(url);
  out($('#searchOut'), await res.json());
});

$('#searchAll').addEventListener('click', async () => {
  const q = $('#q').value.trim();
  const url = new URL(`${api}/api/search`);
  if (q) url.searchParams.set('q', q);
  const res = await fetch(url);
  out($('#searchOut'), await res.json());
});

$('#topSkills').addEventListener('click', async () => {
  const res = await fetch(`${api}/api/skills/top?limit=5`);
  out($('#skillsOut'), await res.json());
});
