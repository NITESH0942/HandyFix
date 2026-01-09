import React,{useState} from 'react'
import { getImageUrl } from '../../util';
import styles from './navbar.module.css';
import { Login } from '../login/Login';
// import { useState } from 'react';
export const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div>
        <nav className={styles.navbar}>
            <a className={styles.title} href="/">ʜᴀɴᴅʏꜰɪx</a>
            <div className={styles.menu}>
                <img onClick={()=>setMenuOpen(!menuOpen)} className={styles.menuBtn} src={menuOpen ? getImageUrl("navbar/close.png"): getImageUrl("navbar/menu.png")} alt="" />
                <ul className={`${styles.menuitems} ${menuOpen && styles.menuOpen}`} onClick={()=>setMenuOpen(false)}>
                    <li><a className={styles.it} href="#home">Home</a></li>
                    <li><a className={styles.it} href="#services">Services</a></li>
                    <li><a className={styles.it} href="#about">Why HandyFix</a></li>
                    <li><a className={styles.it} href="#contact">Contact</a></li>
                    <li className={styles.bt}><Login/></li>
                </ul>
                
            </div>

        </nav>
    </div>
  )
}