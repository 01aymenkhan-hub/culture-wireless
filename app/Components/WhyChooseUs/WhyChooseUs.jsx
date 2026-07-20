import styles from "./WhyChooseUs.module.css";

const features = [
    {
        title: "Connect",
        text: "Reliable fiber and 5G where the big carriers won't go.",
        icon: "📡",
    },
    {
        title: "Empower",
        text: "Local jobs, local techs, local accountability.",
        icon: "👥",
    },
    {
        title: "Expand",
        text: "Bringing high-speed internet to every block we touch.",
        icon: "🌎",
    },
    {
        title: "No Contracts",
        text: "Cancel any time. Stay because you want to.",
        icon: "🛡️",
    },
];

export default function WhyChooseUs() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.twoCol}>
                    <div className={styles.content}>
                        <div className={styles.sectionEyebrow}>
                            About us
                        </div>

                        <h2 className={styles.sectionTitle}>
                            A telecom for the communities we serve.
                        </h2>

                        <p className={styles.description}>
                            We're not a big-box carrier. We're operators,
                            builders, and neighbors closing the digital divide
                            one block at a time. Our trucks are local. Our
                            techs live where you live. And every line we run is
                            one less family stuck on dial-up speeds.
                        </p>

                        <p className={styles.description}>
                            Culture Wireless was founded in 2019 by Atlanta
                            natives who'd watched too many neighborhoods get
                            passed over by national carriers. We started with
                            one fiber pull on the East Side. We're now in
                            1200+ communities across the nation.
                        </p>

                        <button className={styles.primaryBtn}>
                            Our Story →
                        </button>
                    </div>

                    <div className={styles.cardGrid}>
                        {features.map((item) => (
                            <div
                                key={item.title}
                                className={styles.featureCard}
                            >
                                <div className={styles.iconBox}>
                                    {item.icon}
                                </div>

                                <h3 className={styles.cardTitle}>
                                    {item.title}
                                </h3>

                                <p className={styles.cardText}>
                                    {item.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}