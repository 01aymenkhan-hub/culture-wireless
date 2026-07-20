import React from "react";
import styles from "./CoverageSection.module.css";
import CoverageMap from "../CoverageMap/CoverageMap";

const CoverageSection = () => {
    return (
        <section className={styles.coverageSection}>
            <div className={styles.content}>
                <h2 className={styles.title}>Nationwide Coverage</h2>
                <p className={styles.description}>
                    Stay connected wherever you go with our reliable and fast network
                    coverage. Whether you're at home or on the move, we've got you
                    covered.
                </p>
            </div>
            <div className={styles.map}>
                <CoverageMap />
            </div>
        </section>
    );
};

export default CoverageSection;