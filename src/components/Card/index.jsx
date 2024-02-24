import styles from "./Card.module.scss";

function Card({
  title,
  info1,
  info2,
  titleIcon,
  icon1 = "",
  icon2 = "",
  titleIconType = "",
  icon1Type = "",
  icon2Type = "",
  hasIcon = true,
}) {
  return (
    <>
      <div className="d-flex flex-wrap">
        <div className={styles.weatherCard}>
          <span className={styles.cardTitle}>
            {" "}
            <box-icon type={titleIconType} name={titleIcon}></box-icon> {title}
          </span>
          <p className="d-flex align-center mb-20">
            {hasIcon ? (
              <>
                {" "}
                <box-icon type={icon1Type} name={icon1}></box-icon> {info1}
              </>
            ) : (
              info1
            )}
          </p>
          <p className="d-flex align-center mb-20">
            {hasIcon ? (
              <>
                {" "}
                <box-icon type={icon2Type} name={icon2}></box-icon> {info2}
              </>
            ) : (
              info2
            )}
          </p>
        </div>
      </div>
    </>
  );
}

export default Card;
