export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://codx-ashy.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();
  const auth = req.headers['authorization'];
  if (!auth?.startsWith('Bearer nvapi-')) return res.status(401).json({ error: 'Invalid key' });
  try {
    const r = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': auth },
      body: JSON.stringify(req.body)
    });
    const d = await r.json();
    return res.status(r.ok ? 200 : r.status).json(d);
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
