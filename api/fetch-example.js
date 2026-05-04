export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { filename } = req.body;

  if (!filename) {
    return res.status(400).json({ error: 'Missing filename' });
  }

  const headers = {
    'User-Agent': 'SuspiciousLandscapes/1.0 (https://mooksimpson.com; hello@mooksimpson.com)',
  };

  try {
    // Use the Wikimedia API to get a proper thumbnail URL
    const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiurlwidth=960&iiprop=url&format=json`;
    const apiRes = await fetch(apiUrl, { headers });
    const apiData = await apiRes.json();
    const pages = apiData.query?.pages;
    const page = Object.values(pages)[0];
    const imageUrl = page?.imageinfo?.[0]?.thumburl || page?.imageinfo?.[0]?.url;

    if (!imageUrl) throw new Error('No image URL found');

    // Fetch the actual image
    const imgRes = await fetch(imageUrl, { headers });
    if (!imgRes.ok) throw new Error(`Image fetch failed: ${imgRes.status}`);

    const buffer = await imgRes.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const contentType = imgRes.headers.get('content-type') || 'image/jpeg';

    return res.status(200).json({
      data: base64,
      media_type: contentType,
    });
  } catch (err) {
    console.error('Fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch image' });
  }
}
