import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getArticleById } from '../services/api';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, LinkedinIcon, WhatsappIcon } from 'react-share';
import { Helmet } from 'react-helmet';

interface Article {
  id: number;
  title: string;
  description: string;
  body_markdown: string;
  cover_image?: string;
  readable_publish_date: string;
  url: string;
  tag_list: string | string[];
  user: {
    name: string;
    username: string;
    profile_image: string;
  };
}

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  const baseURL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getArticleById(Number(id));
        setArticle(data);
      } catch (error) {
        console.error('Error fetching article details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading article...</p>;
  }

  if (!article) {
    return <p className="text-center text-red-500">Article not found.</p>;
  }

  const tags = Array.isArray(article.tag_list)
    ? article.tag_list
    : article.tag_list.split(',').map((tag) => tag.trim());

  const pageTitle = article.title;
  const pageDescription = article.description;
  const pageImage = article.cover_image || "default-image-url";
  const pageSlug = encodeURIComponent(article.title.toLowerCase().replace(/ /g, "-"));
  const pageUrl = `${baseURL}/article/${pageSlug}`;

  return (
    <div className="max-w-4xl mx-auto p-5 sm:p-8 space-y-8">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{pageTitle} - Deals Articles</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="React, Web Development, SEO, Articles, Tech" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={pageImage} />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
      </Helmet>

      {/* Article Title */}
      <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800">{pageTitle}</h1>

      {/* Article meta */}
      <div className="flex items-center space-x-4 mb-6">
        <img
          src={article.user.profile_image}
          alt={article.user.name}
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-gray-300"
        />
        <div>
          <p className="text-gray-700">
            <span className="font-semibold">{article.user.name}</span> (@{article.user.username})
          </p>
          <p className="text-gray-500">Published on {article.readable_publish_date}</p>
        </div>
      </div>

      {/* Cover Image */}
      {article.cover_image && (
        <img
          src={article.cover_image}
          alt={pageTitle}
          className="w-full h-auto mb-6 rounded-lg shadow-md"
        />
      )}

      {/* Article Body (Markdown Content) */}
      <div className="prose prose-lg sm:prose-xl text-gray-700 mb-6">
        <ReactMarkdown>{article.body_markdown}</ReactMarkdown>
      </div>

      {/* Tags */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Social Media Share Buttons */}
      <div className="flex flex-wrap gap-2">
      <strong className="text-gray-700">Share: </strong>
        {/* Facebook */}
        <FacebookShareButton url={pageUrl} title={pageTitle} className="flex items-center">
          <FacebookIcon size={32} round />
        </FacebookShareButton>

        {/* Twitter */}
        <TwitterShareButton url={pageUrl} title={pageTitle} className="flex items-center">
          <TwitterIcon size={32} round />
        </TwitterShareButton>

        {/* LinkedIn */}
        <LinkedinShareButton url={pageUrl} title={pageTitle} summary={article.description} className="flex items-center">
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>

        {/* WhatsApp */}
        <WhatsappShareButton url={pageUrl} title={pageTitle} className="flex items-center">
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      </div>
    </div>
  );
};

export default ArticleDetail;
