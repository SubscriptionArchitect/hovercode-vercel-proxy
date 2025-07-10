export default async function handler(req, res) {
  // Allow CORS for all domains (adjust if needed)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url, workspace, display_name } = req.body;
  if (!url || !workspace) {
    return res.status(400).json({ error: 'Missing url or workspace' });
  }

  try {
    const response = await fetch('https://hovercode.com/api/v2/hovercode/create/', {
      method: 'POST',
      headers: {
        'Authorization': 'Token 08698c6a641da2aa7047140c43356a9dceccc060',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        workspace,
        qr_data: url,
        display_name,
        dynamic: true,
        generate_png: true
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ error: 'Hovercode failed', detail: text });
    }

    const data = await response.json();
    return res.status(200).json({
      png: data.png,
      shortlink: data.shortlink_url,
      id: data.id
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', detail: err.message });
  }
}
