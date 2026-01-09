import React from 'react'
import styles from './mid2.module.css';
export const Mid2 = () => {
  return (
    <section className={styles.container} id='about'>
        <div className={styles.content}>
            <img src="./mid2/handyfix.png" alt="" />
            <h2 className={styles.title}>Your Happiness, <br/>Guaranteed</h2>
            <p className={styles.para}>Your Happiness is our goal. if you are not happy, we'll work to make it
               right.Our friendly customer service agents are available 24 hours a day,
               7 days a week.The HandyFix happiness gurentee applies when you book and
               pay for a service directly through The HandyFix Platform
            </p>
        </div>
        <div className={styles.image}>
            <img src="./mid2/happy.jpg" alt="" />
        </div>
    </section>
  )
}
 export default Mid2
