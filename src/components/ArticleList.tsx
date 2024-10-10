import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getArticles, getTags } from '../services/api';
import ArticleListByTag from './ArticleListByTag';

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

const ArticleList: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  // Retrieve the query parameter from the URL
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const selectedTag = searchParams.get('tag') || '';

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const data = await getArticles({
          page: page,
          per_page: perPage,
          tag: selectedTag,
        });
        setArticles(data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [page, selectedTag, perPage]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await getTags();
        setTags(data);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  const handleTagClick = (tag: string) => {
    navigate(`/articles?tag=${tag}`);
  };

  return (
    <div className="flex flex-wrap justify-between gap-4 p-5 max-w-7xl mx-auto">
      {/* Left Section: Article List */}
      <div className="flex-1 w-full sm:w-2/3">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Articles</h1>

        {/* Pagination Settings */}
        <div className="mb-4">
          <label className="mr-2 text-gray-700">Articles per page: </label>
          <select
            onChange={(e) => setPerPage(Number(e.target.value))}
            value={perPage}
            className="border border-gray-300 p-2 rounded-md"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>

        {/* Article List */}
        {loading ? (
          <p className="text-gray-500">Loading articles...</p>
        ) : (
          <ul className="space-y-4">
            {articles.length > 0 ? (
              articles.map((article) => (
                <li
                  key={article.id}
                  className="border border-gray-300 rounded-md overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <Link
                    to={`/article/${article.id}`}
                    className="flex flex-col sm:flex-row items-center p-4 text-gray-800 hover:text-yellow-500"
                  >
                    {article.cover_image && (
                      <img
                        src={article.cover_image}
                        alt={article.title}
                        className="w-full sm:w-36 h-36 object-cover rounded-md mr-4"
                      />
                    )}
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                      <p className="text-gray-600 mb-2">{article.description}</p>
                      <p className="text-sm text-gray-400">Published: {article.readable_publish_date}</p>
                      <p className="text-xs text-gray-500">Tags: {article.tag_list.join(', ')}</p>
                    </div>
                  </Link>
                </li>
              ))
            ) : (
              <p className="text-gray-500">No articles found for the selected tag.</p>
            )}
          </ul>
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-300 rounded-md cursor-pointer disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700">Page {page}</span>
          <button
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-300 rounded-md cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>

      {/* Right Section: Tags */}
      <div className="w-full sm:w-1/3 bg-gray-100 p-4 border-l border-gray-300">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Filter by Tags</h2>
        <div className="flex flex-wrap gap-2">
          {/* All Articles Button */}
          <button
            className={`p-2 rounded-md ${
              !selectedTag ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
            }`}
            onClick={() => handleTagClick('')}
          >
            All Articles
          </button>

          {/* Dynamic Tag Buttons */}
          {tags.map((tag) => (
            <button
              key={tag.id}
              className={`p-2 rounded-md ${
                selectedTag === tag.name ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
              }`}
              onClick={() => handleTagClick(tag.name)}
            >
              #{tag.name}
            </button>
          ))}
        </div>

        {/* Article List by Tag */}
        <ArticleListByTag  />
      </div>
    </div>
  );
};

export default ArticleList;
