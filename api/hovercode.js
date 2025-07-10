// File: api/hovercode.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const HOVERCODE_API_KEY = '08698c6a641da2aa7047140c43356a9dceccc060';

  const {
    url,                    // required
    workspace,              // required
    display_name,           // optional
    dynamic = true,         // optional
    primary_color = '#000000',
    background_color,
    frame,
    pattern
  } = req.body || {};

  if (!url || !workspace) {
    return res.status(400).json({ error: 'Missing required fields: url or workspace' });
  }

  try {
    const hcResponse = await fetch('https://hovercode.com/api/v2/hovercode/create/', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${HOVERCODE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        qr_data: url,
        workspace,
        display_name,
        dynamic,
        generate_png: true,
        primary_color,
        background_color,
        pattern,
        frame
      })
    });

    const data = await hcResponse.json();

    if (!hcResponse.ok) {
      return res.status(500).json({ error: 'Hovercode API failed', detail: data });
    }

    return res.status(200).json({
      id: data.id,
      shortlink: data.shortlink_url,
      png: data.png,
      svg: data.svg_file
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
}
