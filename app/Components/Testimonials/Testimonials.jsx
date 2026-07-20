import styles from "./Testimonials.module.css";

const testimonials = [
    {
        name: "Sarah Johnson",
        location: "Atlanta, GA",
        review:
            "The installation was fast and the speeds are exactly what was promised. Finally a provider that delivers.",
    },
    {
        name: "Michael Brown",
        location: "Dallas, TX",
        review:
            "We've tried multiple providers over the years. Culture Wireless has been the most reliable by far.",
    },
    {
        name: "Jessica Lee",
        location: "Charlotte, NC",
        review:
            "Great customer service and no surprise charges. The whole process was smooth from start to finish.",
    },
];

export default function Testimonials() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.sectionEyebrow}>
                    Testimonials
                </div>

                <h2 className={styles.sectionTitle}>
                    Loved by families and businesses.
                </h2>

                <div className={styles.testimonialGrid}>
                    {testimonials.map((item) => (
                        <div
                            key={item.name}
                            className={styles.testimonialCard}
                        >
                            <div className={styles.stars}>
                                ★★★★★
                            </div>

                            <p className={styles.review}>
                                "{item.review}"
                            </p>

                            <div className={styles.userInfo}>
                                <h4 className={styles.userName}>
                                    {item.name}
                                </h4>

                                <span className={styles.location}>
                                    {item.location}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}