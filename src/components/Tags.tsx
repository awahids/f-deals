import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTags } from '../services/api';

interface Tag {
  id: number;
  name: string;
  bg_color_hex: string;
  text_color_hex: string;
}

const Tags: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await getTags();
        setTags(data);
      } catch (error) {
        console.error('Error fetching tags:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const handleTagClick = (tag: string) => {
    navigate(`/articles?tag=${tag}`);
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading tags...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-5 sm:p-8">
      <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-6">Tags</h1>

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {tags.map((tag) => (
            <button
              key={tag.id}
              style={{
                backgroundColor: tag.bg_color_hex,
                color: tag.text_color_hex,
              }}
              className="px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg focus:outline-none"
              onClick={() => handleTagClick(tag.name)}
            >
              #{tag.name}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No tags available.</p>
      )}
    </div>
  );
};

export default Tags;
