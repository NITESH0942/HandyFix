import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../navbar/Navabar';
import { Footer } from '../footer/Footer';
import styles from './blog.module.css';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: '10 Essential Home Maintenance Tips for Every Homeowner',
      excerpt: 'Learn the most important home maintenance tasks that every homeowner should know to keep their property in top condition.',
      date: 'January 15, 2025',
      category: 'Home Maintenance',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
    },
    {
      id: 2,
      title: 'How to Choose the Right Professional for Your Home Service Needs',
      excerpt: 'A comprehensive guide to selecting the best service professionals for your home improvement and repair projects.',
      date: 'January 10, 2025',
      category: 'Tips & Guides',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
    },
    {
      id: 3,
      title: 'The Benefits of Regular Home Cleaning Services',
      excerpt: 'Discover why regular professional cleaning services can save you time, money, and improve your quality of life.',
      date: 'January 5, 2025',
      category: 'Cleaning',
      image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800',
    },
    {
      id: 4,
      title: 'Electrical Safety: What Every Homeowner Should Know',
      excerpt: 'Important electrical safety tips and when to call a professional electrician for your home electrical needs.',
      date: 'December 28, 2024',
      category: 'Electrical',
      image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800',
    },
    {
      id: 5,
      title: 'Plumbing Problems: DIY vs Professional Help',
      excerpt: 'Learn which plumbing issues you can handle yourself and when it\'s time to call in a professional plumber.',
      date: 'December 20, 2024',
      category: 'Plumbing',
      image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800',
    },
    {
      id: 6,
      title: 'Seasonal Home Maintenance Checklist',
      excerpt: 'A complete seasonal maintenance checklist to keep your home in perfect condition throughout the year.',
      date: 'December 15, 2024',
      category: 'Home Maintenance',
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    },
  ];

  return (
    <>
      <Navbar />
      <div className={styles.blogContainer}>
        <div className={styles.blogHeader}>
          <h1 className={styles.blogTitle}>HandyFix Blog</h1>
          <p className={styles.blogSubtitle}>
            Tips, guides, and insights for maintaining your home
          </p>
        </div>

        <div className={styles.blogContent}>
          <div className={styles.blogGrid}>
            {blogPosts.map((post) => (
              <article key={post.id} className={styles.blogCard}>
                <div className={styles.blogImage}>
                  <img src={post.image} alt={post.title} />
                </div>
                <div className={styles.blogCardContent}>
                  <span className={styles.blogCategory}>{post.category}</span>
                  <h2 className={styles.blogCardTitle}>{post.title}</h2>
                  <p className={styles.blogExcerpt}>{post.excerpt}</p>
                  <div className={styles.blogMeta}>
                    <span className={styles.blogDate}>{post.date}</span>
                    <Link to={`/blog/${post.id}`} className={styles.readMore}>
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Blog;

