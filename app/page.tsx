import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingTabs from "@/components/PricingTabs";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import styles from "./page.module.scss";
import heroImage from "../public/hero.webp";
import openSpace from "../public/open-space.webp";
import meetingRooms from "../public/meeting-rooms.webp";
import kitchenRooms from "../public/kitchen.webp";
import petFriendly from "../public/pet-friendly.webp";
import imagesGrid from "../public/images-grid-first.svg";
import imagesGridSecond from "../public/images-grid-second.svg";
import iconCaret from "../public/icon-caret.svg";

const features = [
  {
    icon: "📶",
    title: "HIGH-SPEED WI-FI",
    desc: "Reliable connection for video calls & remote work",
  },
  {
    icon: "🍎",
    title: "KITCHEN ACCESS",
    desc: "Fridge, microwave, and shared dining space",
  },
  { icon: "🖨️", title: "PRINTER & SCANNER", desc: "For quick document needs" },
  {
    icon: "🛋️",
    title: "LOUNGE AREAS",
    desc: "Relax, recharge, or network between tasks",
  },
  { icon: "🐾", title: "PET-FRIENDLY", desc: "Bring your furry friend along" },
  {
    icon: "👥",
    title: "COMMUNITY EVENTS",
    desc: "Connect with fellow creators and entrepreneurs",
  },
  {
    icon: "☕",
    title: "FREE COFFEE & TEA",
    desc: "Stay energized throughout the day",
  },
];

const faqs = [
  {
    q: "Is my first day really free?",
    a: "Yes! Your first day at Spark is completely free. Just register online or come to any location and let our team know you’re new.",
  },
  {
    q: "Do I need to book a desk in advance?",
    a: "For Open Space, you can just walk in and pick any available spot. However, Fixed Desks and Meeting Rooms must be reserved ahead of time through our website to ensure availability.",
  },
  {
    q: "Are meeting rooms included in my plan?",
    a: "Meeting rooms are not included in standard memberships and are reserved separately. You can easily book one whenever you need it.",
  },
  {
    q: "Can I bring guests or have calls?",
    a: "Of course. Guests are welcome for short visits, and phone or video calls are perfectly okay in common areas or dedicated call zones.",
  },
  {
    q: "Can I bring my pet to Spark?",
    a: "We love furry coworkers! Spark is pet-friendly, provided your pet is well-behaved and doesn't disturb other members.",
  },
];

export default function HomePage() {
  return (
    <div className={styles.page}>
      <Navbar />

      <section className={styles.hero}>
        <img src={heroImage.src} alt="Коворкінг" className={styles.heroImage} />
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>More than just a desk</h1>
          <p className={styles.heroSubtitle}>
            A place where you can do your best work — and a community that
            inspires you
          </p>
          <Link href="/book" className="button-primary">
            BOOK A SEAT
          </Link>
        </div>
      </section>

      <section className={styles.amenities}>
        <div className={styles.amenitiesInner}>
          <h3 className={styles.sectionLabel}>
            EVERYTHING YOU NEED TO GET WORK DONE
          </h3>
          <div className={styles.amenitiesGrid}>
            {[
              {
                n: "01",
                image: openSpace,
                title: "Open space desks",
                text: "flexible seating for deep work & daily flow",
              },
              {
                n: "02",
                image: meetingRooms,
                title: "Meeting rooms",
                text: "bookable hourly for calls & team syncs",
              },
              {
                n: "03",
                image: kitchenRooms,
                title: "Kitchen & coffee",
                text: "fuel your focus with espresso & fresh snacks",
              },
              {
                n: "04",
                image: petFriendly,
                title: "Pet-friendly",
                text: "bring your furry co-worker, we've got space for two",
              },
            ].map((item) => (
              <div key={item.n} className={styles.amenityCard}>
                <img
                  src={item.image?.src}
                  alt={item.title}
                  className={styles.amenityCardImage}
                />
                <div className={styles.amenityCardOverlay}></div>
                <div className={styles.amenityNum}>{item.n}</div>
                <div className={styles.amenityCardContent}>
                  <h5 className={styles.amenityLabel}>{item.title}</h5>
                  <p className={styles.amenityText}>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.locations}>
        <div className={styles.locationsInner}>
          <div className={styles.locationsInnerContent}>
            <h2 className={styles.locationsTitle}>
              THREE LOCATIONS.
              <br />
              ONE STANDARD OF COMFORT.
            </h2>
            <p className={styles.locationsSubtitle}>
              Wherever you are in Kyiv - Spark is close.
              <br />
              <br />
              Each of our three coworking spaces is designed to give you
              everything you need to focus, collaborate, and feel at home.
              <br />
              <br />
              From open work zones to quiet meeting rooms, each location has its
              own character - but the same attention to detail.
            </p>
            <Link href="/locations" className="button-primary-outline">
              EXPLORE SPACES
            </Link>
          </div>
          <img className={styles.locationsImage} src={imagesGrid.src} alt="" />
        </div>
      </section>

      <section className={styles.pricing}>
        <div className={styles.pricingInner}>
          <h2 className={styles.pricingTitle}>CHOOSE YOUR WAY TO WORK</h2>
          <p className={styles.pricingSubtitle}>
            Start with a free day. Stay as long as you need.
          </p>

          <PricingTabs />
        </div>
      </section>

      <section className={styles.locations}>
        <div className={styles.locationsInner}>
          <div className={styles.locationsInnerContent}>
            <h2 className={styles.locationsTitleSecond}>
              More than just a workspace
            </h2>
            <p className={styles.locationsText}>
              At Spark, you don’t just rent a desk - you join a community of
              creators, doers, and
              <br />
              innovators.
            </p>
            <p className={styles.locationsSubtitleSecond}>
              Spark hosts regular events: from skill‑sharing sessions and
              startup meetups to community breakfasts and after‑work hangouts.
              <br />
              <br />
              It’s the perfect way to learn, network, and feel inspired while
              working on what matters to you.
            </p>
            <Link href="/locations" className="button-primary-outline">
              Join the Spark community
            </Link>
          </div>
          <img
            className={styles.locationsImageSecond}
            src={imagesGridSecond.src}
            alt=""
          />
        </div>
      </section>

      <section className={styles.faq}>
        <div className={styles.faqInner}>
          <h2 className={styles.faqTitle}>FAQ</h2>
          <div className={styles.faqContainer}>
            {faqs.map((f, i) => (
              <details key={i} className={styles.faqItem}>
                <summary>
                  {f.q}
                  <span className={styles.faqArrow}>
                    <img src={iconCaret.src} alt="" />
                  </span>
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsCarousel />

      <section className={styles.cta}>
        <img src={heroImage.src} alt="" className={styles.ctaImage} />
        <div className={styles.ctaOverlay}></div>
        <div className={styles.ctaInner}>
          <p className={styles.ctaTitle}>
            Ready to work differently? <br />
            Book your seat at Spark today.
          </p>
          <Link href="/book" className={`button-primary ${styles.ctaBtn}`}>
            BOOK A SEAT
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
