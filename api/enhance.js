export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { image } = req.body || {};
  if (!image) {
    res.status(400).json({ error: 'Image is required' });
    return;
  }

  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    res.status(500).json({ error: 'Missing REPLICATE_API_TOKEN' });
    return;
  }

  try {
    const startResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: 'f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa',
        input: {
          image,
          scale: 4,
          face_enhance: false
        }
      })
    });

    if (!startResponse.ok) {
      const err = await startResponse.json().catch(() => ({}));
      res.status(startResponse.status).json({ error: err.detail || 'Failed to start enhancement' });
      return;
    }

    let prediction = await startResponse.json();

    while (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: { Authorization: `Token ${token}` }
      });

      if (!statusResponse.ok) {
        const err = await statusResponse.json().catch(() => ({}));
        res.status(statusResponse.status).json({ error: err.detail || 'Failed to check status' });
        return;
      }

      prediction = await statusResponse.json();
    }

    if (prediction.status === 'succeeded' && prediction.output) {
      const outputImage = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
      res.status(200).json({ output: outputImage });
      return;
    }

    res.status(500).json({ error: 'Enhancement failed' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
}
