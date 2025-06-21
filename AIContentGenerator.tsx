import React, { useState } from 'react';

interface GeneratedPost {
  title: string;
  excerpt: string;
  content: string;
  takeaways: string[];
  metaDescription: string;
  tags: string[];
  featuredImage: string;
  author: string;
  category: string;
  publishDate: string;
  slug: string;
}

const AIContentGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null);
  const [formData, setFormData] = useState({
    topic: '',
    category: 'Finance'
  });

  const categories = [
    'Finance',
    'Investment',
    'Education',
    'Personal Development',
    'Business',
    'Self-Help'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateContent = async () => {
    if (!formData.topic.trim()) {
      alert('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    setGeneratedPost(null);

    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      setGeneratedPost(data);
    } catch (error) {
      console.error('Error generating content:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const savePost = async () => {
    if (!generatedPost) return;

    // In a real implementation, this would save to Strapi or your CMS
    // For now, we'll just show a success message
    alert('Post saved successfully! (Demo mode - would save to CMS in production)');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">AI Content Generator</h2>
        
        {/* Generation Form */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                Blog Topic
              </label>
              <input
                type="text"
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                placeholder="e.g., How to build an emergency fund"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          
          <button
            onClick={generateContent}
            disabled={isGenerating || !formData.topic.trim()}
            className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Content...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                Generate Blog Post
              </>
            )}
          </button>
        </div>

        {/* Generated Content Preview */}
        {generatedPost && (
          <div className="border-t pt-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Generated Content</h3>
              <button
                onClick={savePost}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Save Post
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Featured Image */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Featured Image</h4>
                <img
                  src={generatedPost.featuredImage}
                  alt={generatedPost.title}
                  className="w-full max-w-md h-48 object-cover rounded-lg"
                />
              </div>
              
              {/* Title and Meta */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Title</h4>
                <p className="text-xl font-bold text-gray-800">{generatedPost.title}</p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Excerpt</h4>
                <p className="text-gray-600">{generatedPost.excerpt}</p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Meta Description</h4>
                <p className="text-sm text-gray-600">{generatedPost.metaDescription}</p>
              </div>
              
              {/* Tags */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {generatedPost.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Content Preview */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Content Preview</h4>
                <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700">
                    {generatedPost.content.substring(0, 500)}...
                  </pre>
                </div>
              </div>
              
              {/* Key Takeaways */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Takeaways</h4>
                <ul className="list-disc list-inside space-y-1">
                  {generatedPost.takeaways.map((takeaway, index) => (
                    <li key={index} className="text-gray-700">{takeaway}</li>
                  ))}
                </ul>
              </div>
              
              {/* Post Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <span className="text-sm font-medium text-gray-500">Author:</span>
                  <p className="text-gray-900">{generatedPost.author}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Category:</span>
                  <p className="text-gray-900">{generatedPost.category}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Slug:</span>
                  <p className="text-gray-900">{generatedPost.slug}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIContentGenerator;

