import React from 'react';
import { Navbar } from '../navbar/Navabar';
import { Footer } from '../footer/Footer';
import styles from './pageLayout.module.css';

const PageLayout = ({ title, subtitle, children }) => {
  return (
    <>
      <Navbar />
      <div className={styles.pageContainer}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>{title}</h1>
          {subtitle && <p className={styles.pageSubtitle}>{subtitle}</p>}
        </div>
        <div className={styles.pageContent}>
          {children}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PageLayout;

