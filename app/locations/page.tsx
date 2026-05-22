import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.scss';

const locations = [
  {
    key: 'PODIL',
    name: 'Spark Podil',
    address: 'Naberezhno-Khreshchatytska St, 15, Kyiv',
    desc: "Cozy space in the historic Podil district with a creative atmosphere and riverside views. Designed for both focused work and collaboration, this location blends modern comfort with the charm of Kyiv's cultural quarter.",
    hours: 'Open daily, 9:00–20:00',
    icon: '🏛️',
    features: ['High-speed Wi-Fi', 'Meeting rooms', 'Kitchen access', 'Lounge areas', 'Pet-friendly', 'Free coffee & tea', 'Community events', 'Free underground parking'],
  },
  {
    key: 'PECHERSK',
    name: 'Spark Pechersk',
    address: 'Lesi Ukrainky Blvd, 26, Kyiv',
    desc: 'Modern coworking in the city center, close to business hubs and metro. Ideal for professionals and entrepreneurs who need a productive environment close to everything.',
    hours: 'Open daily, 9:00–20:00',
    icon: '🏙️',
    features: ['High-speed Wi-Fi', 'Meeting rooms', 'Kitchen access', 'Lounge areas', 'Pet-friendly', 'Free coffee & tea', 'Community events'],
  },
  {
    key: 'OSOKORKY',
    name: 'Spark Osokorky',
    address: 'Dniprovska Embankment, 20, Kyiv',
    desc: 'Bright workspace near the lake, perfect for focus and relaxation. Enjoy natural surroundings while staying productive in a calm and inspiring environment.',
    hours: 'Open daily, 9:00–20:00',
    icon: '🌊',
    features: ['High-speed Wi-Fi', 'Meeting rooms', 'Kitchen access', 'Lounge areas', 'Pet-friendly', 'Free coffee & tea', 'Community events'],
  },
];

export default function LocationsPage() {
  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.title}>OUR LOCATIONS</h1>
        <p className={styles.subtitle}>Three locations. One standard of comfort.</p>

        <div className={styles.list}>
          {locations.map((loc, i) => (
            <div key={loc.key} className={`${styles.card} ${i % 2 === 1 ? styles.cardReverse : ''}`}>
              <div className={styles.cardImage}>
                <span>{loc.icon}</span>
              </div>
              <div className={styles.cardBody}>
                <h2 className={styles.cardTitle}>{loc.name}</h2>
                <p className={styles.cardAddress}>📍 {loc.address}</p>
                <p className={styles.cardHours}>🕐 {loc.hours}</p>
                <p className={styles.cardDesc}>{loc.desc}</p>
                <div className={styles.tags}>
                  {loc.features.map((f) => (
                    <span key={f} className={styles.tag}>{f}</span>
                  ))}
                </div>
                <Link href={`/book?location=${loc.key}`} className={styles.cardBtn}>
                  BOOK HERE
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
