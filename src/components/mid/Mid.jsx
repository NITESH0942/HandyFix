import React from 'react'
import styles from './mid.module.css';
export const Mid = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <img className={styles.logo} src="./mid/cyber3.png" alt="" />
        <h2 className={styles.title}>Vetted,Screened Professionals</h2>
      </div>
      <p>Cleaning and handyman tasks booked and paid for through HandyFix are performed by experienced,veted providers who are highly rated by customers like you </p>
     <div className={styles.learn}>
         <a href="">Learn more</a>
     </div>
    </div>
  )
}

export default Mid
