import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {usePluginData} from '@docusaurus/useGlobalData';
import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            开始精读论文 📚
          </Link>
        </div>
      </div>
    </header>
  );
}

// 修改博客列表组件
function BlogList() {
  // 使用 try-catch 来安全地获取博客数据
  let recentPosts = [];
  try {
    const data = usePluginData('docusaurus-plugin-content-blog');
    if (data && data.posts) {
      recentPosts = data.posts.slice(0, 5); // 获取最新的5篇文章
    }
  } catch (e) {
    console.warn('Failed to load blog posts:', e);
  }

  if (recentPosts.length === 0) {
    return null; // 如果没有文章，不显示这个部分
  }

  return (
    <div className={styles.blogList}>
      <Heading as="h2">最新博客</Heading>
      <ul className={styles.blogItems}>
        {recentPosts.map((post) => (
          <li key={post.id}>
            <Link to={post.permalink}>
              {post.title}
            </Link>
            <span className={styles.blogDate}>
              {new Date(post.metadata.date).toLocaleDateString('zh-CN')}
            </span>
          </li>
        ))}
      </ul>
      <div className={styles.blogMore}>
        <Link
          className="button button--secondary button--sm"
          to="/blog">
          查看更多博客 →
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`欢迎来到 ${siteConfig.title}`}
      description="个人技术博客">
      <HomepageHeader />
      <main className={styles.main}>
        <div className="container">
          <BlogList />
          <HomepageFeatures />
        </div>
      </main>
    </Layout>
  );
}
