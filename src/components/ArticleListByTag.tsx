import React, { useEffect, useState } from 'react';
import { getArticles, getTags } from '../services/api';
import { Link } from 'react-router-dom';

interface Article {
  id: number;
  title: string;
  description: string;
  readable_publish_date: string;
  cover_image?: string;
  url: string;
  tag_list: string[];
}

interface Tag {
  id: number;
  name: string;
  bg_color_hex: string;
  text_color_hex: string;
}

const ArticleListByTag: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [articlesByTag, setArticlesByTag] = useState<Record<string, Article[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await getTags();
        const randomTags = getRandomTags(data, 3);
        setTags(randomTags);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  const getRandomTags = (tagsArray: Tag[], numTags: number) => {
    const shuffled = [...tagsArray].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numTags);
  };

  useEffect(() => {
    const fetchArticlesForTags = async () => {
      setLoading(true);
      try {
        const fetchedArticles: Record<string, Article[]> = {};
        for (const tag of tags) {
          const data = await getArticles({
            tag: tag.name,
            per_page: 5,
          });
          fetchedArticles[tag.name] = data || [];
        }
        setArticlesByTag(fetchedArticles);
      } catch (error) {
        console.error('Error fetching articles for tags:', error);
      } finally {
        setLoading(false);
      }
    };

    if (tags.length > 0) {
      fetchArticlesForTags();
    }
  }, [tags]);

  return (
    <div className="mt-8">
      {loading ? (
        <p className="text-gray-500">Loading articles...</p>
      ) : Object.keys(articlesByTag).length > 0 ? (
        tags.map((tag) => (
          <div key={tag.id} className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Articles for Tag: {tag.name}</h2>

            {/* Display articles for the current tag */}
            {articlesByTag[tag.name] && articlesByTag[tag.name].length > 0 ? (
              <ul className="space-y-4">
                {articlesByTag[tag.name].map((article) => (
                  <li
                    key={article.id}
                    className="border border-gray-300 rounded-md overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <Link
                      to={`/article/${article.id}`}
                      className="flex items-center p-4 text-gray-800 hover:text-yellow-500"
                    >
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                        <p className="text-gray-600 mb-2">{article.description}</p>
                        <p className="text-xs text-gray-500">Tags: {article.tag_list.join(', ')}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No articles found for this tag.</p>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No tags found.</p>
      )}
    </div>
  );
};

export default ArticleListByTag;
