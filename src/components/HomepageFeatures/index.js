import React from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

// 导入所有博客文章
const blogFiles = require.context('../../../blog/', true, /\.mdx?$/);
const blogPosts = blogFiles.keys()
  .map(path => {
    try {
      const post = blogFiles(path);
      const fileName = path.replace(/^.*[\\/]/, '').replace(/\.[^/.]+$/, '');
      // 从文件名中提取日期和标题
      const match = fileName.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/);
      if (match) {
        const [, date, slug] = match;
        return {
          id: path,
          title: post.metadata?.title || post.default?.title || slug.replace(/-/g, ' '),
          date: post.metadata?.date || date,
          description: post.metadata?.description || post.default?.description,
          permalink: `/blog/${slug}`
        };
      }
      return null;
    } catch (e) {
      console.warn(`Failed to load blog post for ${path}:`, e);
      return null;
    }
  })
  .filter(Boolean);

export default function HomepageFeatures() {
  // 按日期排序，最新的在前面
  const sortedPosts = React.useMemo(() => 
    [...blogPosts]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6)
  , []);

  if (sortedPosts.length === 0) {
    return null;
  }

  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.blogSection}>
          <Heading as="h2" className={styles.blogTitle}>
            最新文章
          </Heading>
          <div className={styles.blogList}>
            {sortedPosts.map((post) => (
              <div key={post.id} className={styles.blogCard}>
                <div className={styles.blogContent}>
                  <div className={styles.blogInfo}>
                    <h3 className={styles.blogPostTitle}>
                      <Link to={post.permalink}>
                        {post.title}
                      </Link>
                    </h3>
                    {post.description && (
                      <p className={styles.blogDescription}>
                        {post.description}
                      </p>
                    )}
                  </div>
                  <div className={styles.blogMeta}>
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('zh-CN')}
                    </time>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.blogMore}>
            <Link
              className="button button--secondary button--lg"
              to="/blog">
              查看所有文章 →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
