import styles from './ourpartners.module.css';
export const Ourpartners = () => {
  return (
    <section className={styles.container}>
        <div className={styles.content}>
            <h1 className={styles.heading}>Our Partners</h1>
            <p className={styles.description}>
                HandyFix work with partners who want to provide thier customers tenants, or employees easy access  to quality home services at affordable prices.
            </p>
        </div>
        <div className={styles.partners}>
            <div className={styles.partnerone}>
               <img src="./ourpartners/wayfair.png" alt="" />
               <img src="./ourpartners/walmart.png" alt="" />
               <img src="./ourpartners/googlehome.png" alt="" />
            </div>
            <div className={styles.partnertwo}>
                <img className={styles.nl} src="./ourpartners/nest.png" alt="" />
                <img className={styles.eq} src="./ourpartners/eq.png" alt="" />
                <img className={styles.nl} src="./ourpartners/leesa.png" alt="" />
            </div>
        </div>
    </section>
  )
}

export default Ourpartners
