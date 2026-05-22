import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./page.module.scss";
import PricingTabs from "@/components/PricingTabs";
import iconWifi from "../../public/icon-wifi.svg";
import iconApple from "../../public/icon-apple.svg";
import iconPeople from "../../public/icon-people.svg";
import iconChair from "../../public/icon-chair.svg";
import iconDog from "../../public/icon-dog.svg";
import iconCup from "../../public/icon-cup.svg";
import iconPrinter from "../../public/icon-printer.svg";
import heroImage from "../../public/hero.webp";

export default function PricingPage() {
  return (
    <div className={styles.page}>
      <Navbar color="black" />
      <section className={styles.pricing}>
        <div className={styles.pricingInner}>
          <h1 className={styles.pricingTitle}>CHOOSE YOUR WAY TO WORK</h1>
          <p className={styles.pricingSubtitle}>
            Start with a free day. Stay as long as you need.
          </p>

          <PricingTabs />
        </div>
      </section>
      <section className={styles.gridBackground}>
        <div className={styles.grid}>
          <h2 className={styles.gridTitle}>Included in All Plans</h2>
          <p className={styles.gridText}>
            Everything you need to stay productive is already included
          </p>

          <div className={styles.gridWrapper}>
            <div className={styles.gridWrapperItem}>
              <img src={iconWifi.src} alt="" />
              <h3 className={styles.gridWrapperItemTitle}>High-speed Wi-Fi</h3>
              <p className={styles.gridWrapperItemText}>
                Reliable connection for video calls & remote work
              </p>
            </div>

            <div className={styles.gridWrapperItem}>
              <img src={iconApple.src} alt="" />
              <h3 className={styles.gridWrapperItemTitle}>Kitchen access</h3>
              <p className={styles.gridWrapperItemText}>
                Fridge, microwave, and shared dining space
              </p>
            </div>

            <div className={styles.gridWrapperItem}>
              <img src={iconPeople.src} alt="" />
              <h3 className={styles.gridWrapperItemTitle}>Community events</h3>
              <p className={styles.gridWrapperItemText}>
                Connect with fellow creators and entrepreneurs
              </p>
            </div>

            <div className={styles.gridWrapperItem}>
              <img src={iconChair.src} alt="" />
              <h3 className={styles.gridWrapperItemTitle}>Lounge areas</h3>
              <p className={styles.gridWrapperItemText}>
                Relax, recharge, or network between tasks
              </p>
            </div>

            <div className={styles.gridWrapperItem}>
              <img src={iconDog.src} alt="" />
              <h3 className={styles.gridWrapperItemTitle}>Pet-friendly</h3>
              <p className={styles.gridWrapperItemText}>
                Bring your furry friend along
              </p>
            </div>

            <div className={styles.gridWrapperItem}>
              <img src={iconCup.src} alt="" />
              <h3 className={styles.gridWrapperItemTitle}>Free coffee & tea</h3>
              <p className={styles.gridWrapperItemText}>
                Stay energized throughout the day
              </p>
            </div>

            <div className={styles.gridWrapperItem}>
              <img src={iconPrinter.src} alt="" />
              <h3 className={styles.gridWrapperItemTitle}>Printer & scanner</h3>
              <p className={styles.gridWrapperItemText}>
                For quick document needs
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className={styles.cta}>
        <img src={heroImage.src} alt="" className={styles.ctaImage} />
        <div className={styles.ctaOverlay}></div>
        <div className={styles.ctaInner}>
          <p className={styles.ctaTitle}>
            Still not sure? <br />
            Book your free day first - no strings attached
          </p>
          <Link href="/book" className={`button-primary ${styles.ctaBtn}`}>
            Try for Free
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
