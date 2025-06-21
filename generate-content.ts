---
// API route for generating blog content using Gemini AI
export async function POST({ request }) {
  try {
    const { topic, category } = await request.json();
    
    if (!topic || !category) {
      return new Response(JSON.stringify({ error: 'Topic and category are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get API keys from environment
    const geminiApiKey = import.meta.env.GEMINI_API_KEY;
    const pexelsApiKey = import.meta.env.PEXELS_API_KEY;

    if (!geminiApiKey || !pexelsApiKey) {
      return new Response(JSON.stringify({ error: 'API keys not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate content with Gemini AI
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Write a comprehensive blog post about "${topic}" in the ${category} category. The blog should be written in the style of Wright Aloba, focusing on practical advice and financial literacy. Include:
            
            1. An engaging title (max 60 characters)
            2. A compelling excerpt/summary (max 160 characters)
            3. The main content (800-1200 words)
            4. 3-5 key takeaways
            5. SEO-friendly meta description
            
            Format the response as JSON with the following structure:
            {
              "title": "Blog post title",
              "excerpt": "Brief summary",
              "content": "Full blog post content in markdown format",
              "takeaways": ["takeaway1", "takeaway2", "takeaway3"],
              "metaDescription": "SEO meta description",
              "tags": ["tag1", "tag2", "tag3"]
            }`
          }]
        }]
      })
    });

    if (!geminiResponse.ok) {
      throw new Error('Failed to generate content with Gemini AI');
    }

    const geminiData = await geminiResponse.json();
    const generatedText = geminiData.candidates[0].content.parts[0].text;
    
    // Parse the JSON response from Gemini
    let blogContent;
    try {
      // Extract JSON from the response (Gemini might wrap it in markdown code blocks)
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        blogContent = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in Gemini response');
      }
    } catch (parseError) {
      // Fallback: create structured content from the raw text
      blogContent = {
        title: topic,
        excerpt: `Insights and practical advice about ${topic}`,
        content: generatedText,
        takeaways: [`Key insights about ${topic}`, `Practical applications`, `Future considerations`],
        metaDescription: `Learn about ${topic} with expert insights and practical advice`,
        tags: [category.toLowerCase(), 'finance', 'education']
      };
    }

    // Search for relevant images using Pexels API
    const imageQuery = topic.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    const pexelsResponse = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(imageQuery)}&per_page=5&orientation=landscape`, {
      headers: {
        'Authorization': pexelsApiKey
      }
    });

    let featuredImage = '/placeholder-blog-default.jpg';
    if (pexelsResponse.ok) {
      const pexelsData = await pexelsResponse.json();
      if (pexelsData.photos && pexelsData.photos.length > 0) {
        featuredImage = pexelsData.photos[0].src.medium;
      }
    }

    // Combine content with image
    const finalBlogPost = {
      ...blogContent,
      featuredImage,
      author: 'Wright Aloba',
      category,
      publishDate: new Date().toISOString(),
      slug: blogContent.title.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50)
    };

    return new Response(JSON.stringify(finalBlogPost), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error generating blog content:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate blog content' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ message: 'AI Content Generator API - Use POST to generate content' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

