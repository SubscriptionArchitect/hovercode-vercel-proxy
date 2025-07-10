export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const {
    url,
    workspace,
    display_name,
    primary_color,
    background_color,
    pattern,
    frame
  } = req.body;

  if (!url || !workspace) {
    return res.status(400).json({ error: 'Missing URL or workspace ID' });
  }

  try {
    const payload = {
      workspace,
      qr_data: url,
      display_name: display_name || '',
      dynamic: true,
      generate_png: true
    };

    if (primary_color) payload.primary_color = primary_color;
    if (background_color) payload.background_color = background_color;
    if (pattern) payload.pattern = pattern;
    if (frame) payload.frame = frame;

    const response = await fetch('https://hovercode.com/api/v2/hovercode/create/', {
      method: 'POST',
      headers: {
        'Authorization': 'Token 08698c6a641da2aa7047140c43356a9dceccc060',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(500).json({ error: 'Hovercode failed', detail: errorText });
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
