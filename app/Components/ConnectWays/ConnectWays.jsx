import React from "react";
import styles from "./ConnectWays.module.css";

const ConnectWays = ({ onCheckAvail, navigate }) => {
    const services = [
        {
            icon: "wifi",
            title: "Home Fiber",
            price: "$49",
            unit: "/mo",
            text: "Fiber to the home. 100 Mbps to 1 Gig. No contracts, no caps, no nonsense.",
            cta: "Check Availability",
            action: onCheckAvail,
        },
        {
            icon: "smartphone",
            title: "Mobile",
            price: "from $15",
            unit: "/mo",
            text: "Bring your phone, keep your number. Unlimited 5G on the nation's most reliable network.",
            cta: "See Mobile Plans",
            action: () => navigate("/mobile"),
        },
        {
            icon: "router",
            title: "Business Fiber",
            price: "Custom",
            unit: "pricing",
            text: "SLA-backed dedicated fiber for teams. Static IPs, four-hour response window.",
            cta: "Get a Quote",
            action: () => navigate("/support"),
        },
    ];

    return (
        <section className={styles.connectWaysSection}>
            <div className={styles.inner}>
                <div className={styles.eyebrow}>Pick your service</div>
                <h2 className={styles.heading}>Three ways to connect.</h2>
                <div className={styles.cardGrid}>
                    {services.map((service) => (
                        <div key={service.title} className={styles.card}>
                            <div className={`${styles.iconBox} ${styles.large}`}>
                                <i className={`icon-${service.icon}`} />
                            </div>
                            <div className={styles.title}>{service.title}</div>
                            <div className={styles.price}>
                                {service.price}
                                <span className={styles.unit}>{service.unit}</span>
                            </div>
                            <p className={styles.description}>{service.text}</p>
                            <button
                                className={`${styles.button} btn btn-primary btn-sm`}
                                onClick={service.action}>
                                {service.cta} <i className="icon-arrow-right" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ConnectWays;