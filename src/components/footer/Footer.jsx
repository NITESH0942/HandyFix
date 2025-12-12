import React from 'react';
import { Link } from 'react-router-dom';
import styles from './footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.container} id='contact'>
      <div className={styles.content}>
        <div className={styles.contentA}>
          <ul className={styles.contentAul}>
              <li><h3>The HandyFix happiness Guarantee</h3></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/press">Press</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/help">Help</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li></li>
              <li></li>
              <li><Link to="/become-professional">Be a Professional</Link></li>
              <li><Link to="/retail-partnerships">Retail Partnerships</Link></li>
          </ul>
        </div>
        <div className={styles.contentB}> 
          <ul className={styles.contentBul}>
             <li><h3>LOCATIONS</h3></li>
             <li><Link to="/locations/hyderabad">Hyderabad</Link></li>
             <li><Link to="/locations/bangaluru">Bangaluru</Link></li>
             <li><Link to="/locations/mumbai">Mumbai</Link></li>
             <li><Link to="/locations/jaipur">Jaipur</Link></li>
             <li><Link to="/locations/pune">Pune</Link></li>
             <li><Link to="/locations/delhi">Delhi</Link></li>
             <li><Link to="/locations/gurgaon">Gurgaon</Link></li>
             <li><Link to="/locations/chennai">Chennai</Link></li>
             <li><Link to="/locations/lucknow">Lucknow</Link></li>
          </ul>
        </div>
        <div>
          <ul>
             <li><h3>POPULAR SERVICES</h3></li>
             <li><Link to="/services/cleaning">Cleaning</Link></li>
             <li><Link to="/services/plumbing">Plumbing</Link></li>
             <li><Link to="/services/electrical">Electrical</Link></li>
             <li><Link to="/services/handyman">HandyMan</Link></li>
             <li><Link to="/services/moving">Moving help</Link></li>
             <li><Link to="/services/painting">Painting</Link></li>
             <li><Link to="/services/furniture-assembly">Furniture Assembly</Link></li>
             <li><Link to="/services/tv-mounting">Tv mounting</Link></li>
             <li><Link to="/services/hanging">Hanging</Link></li>
          </ul>
        </div>
      </div>
      <div className={styles.contentone}>
        <div className={styles.contentoneimgOne}>
        <img src="./footer/appdownload.png" alt="" />
        </div>
        <div className={styles.contentoneimg}>
          <img  src="./footer/twitter.png" title='Twitter' alt="twitter" />
          <img  src="./footer/fb.png" title='facebook' alt="facebook" />
          <img  src="./footer/insta.png" title='instagram' alt="instagram" />
          <img  src="./footer/linkdin.png" title='linkdin' alt="linkdin" />
          <img  src="./footer/wikiped.png" title='wikipedia' alt="wikipedia" />
        </div>
      </div>
      <hr  className={styles.hr}/>
      <div className={styles.contenttwo}>
        <div className={styles.contenthead}>
            <h3>Other HandyFix services</h3>
          </div>
        <div className={styles.contentother}>
          <div>
            <ul>
              <li>Best maid services in HYD</li>
              <li>Hyderabad cleaning services</li>
              <li>Cleaning services in Banglore</li>
            </ul>
          </div>
          <div>
            <ul>
              <li>Office cleaning services </li>
              <li>House Cleaning service near me</li>
              <li>House cleaning service tempa</li>
            </ul>
          </div>
          <div>
            <ul>
              <li>housekeeping</li>
              <li>move out cleaning service</li>
              <li>Hyd office cleaning services</li>
            </ul>
          </div>
        </div>
      </div> 
      <hr  className={styles.hr}/>
        <div className={styles.contentthree}>
        <ul className={styles.contentthreeul}>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/privacy">Privacy</Link></li>
          <li><Link to="/ca-pre-collection">CA Pre-collection Notice</Link></li>
          <li><Link to="/privacy#dont-sell">Don't Sell or share my personal Information</Link></li>
          <li><Link to="/cookies">Cookies</Link></li>
          <li><Link to="/terms">Terms</Link></li>
          <li><Link to="/cancellation-policy">Cancellation Policy</Link></li>
          <li>2025 HandyFix All Rights Reserved</li>
        </ul>
      </div>
      <div className={styles.contentfour}>
        <p>
          HandyFix by NITESH
        </p>
      </div>
    </footer>
  )
}

export default Footer

