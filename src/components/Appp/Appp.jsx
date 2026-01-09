import React from 'react'
import styles from './appp.module.css'; // Assuming you have a CSS module for styling
export const Appp = () => {
  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <h2>Get the HandyFix App</h2>
        <p>Book and manage appointments,message your pro, 
          view pro profiles and Ratings,see realtime location 
          of your pro and so much more
        </p>
        <div className={styles.images}>
          <img src="./appp/appdownload.png" alt="" />
        </div>
      </div>
      <div className={styles.mobile}>
        <img src="./appp/mobile.png" alt="" />
      </div>
    </section>
  )
}


