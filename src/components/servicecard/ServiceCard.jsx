import React from 'react'
import {getImageUrl} from "../../util";
import styles from "./serviceCard.module.css";
export const ServiceCard = ({service, onServiceClick}) => {
  const {title, imageSrc, description, price} = service;
  
  const handleClick = () => {
    if (onServiceClick) {
      onServiceClick(service);
    }
  };

  return (
    <>
    <div className={styles.container} onClick={handleClick}>
      <img className={styles.imgservice} src={getImageUrl(imageSrc)} alt={`title of ${title}`}/>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <p className={styles.price}>{price}</p>
      {/* <p className={styles.category}></p> */}
    </div>
    </>
  )
}

export default ServiceCard
