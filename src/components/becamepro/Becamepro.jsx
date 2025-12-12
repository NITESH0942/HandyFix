import React from 'react'
import { Link } from 'react-router-dom';
import styles from './Becamepro.module.css';
export const Becamepro = () => {
  return (
    <section className={styles.container}>
        <div className={styles.content}>
            <h2>Are You a Five Star Pro?</h2>
            <p>From cleaners to handyman to smart home installers,
                HandyFix is always looking for a service professionals
                who are experts in their trade and provide great
                service to their customers.The best home service
                professsionals use HandyFix to find jobs with no lead 
                fees and flexible scheduling 
            </p>
            <button className={styles.button}><Link to="/become-professional">Become a Pro</Link></button>
        </div>
        <div className={styles.image}>
            <img src="./Becamepro/pro.png" alt="" />
        </div>
    </section>
  )
}

export default Becamepro
