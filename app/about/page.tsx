"use client";
import Link from "next/link";
import hero from "../../public/about-hero.webp";
import heroSecond from "../../public/hero-second.webp";
import imagesGrid from "../../public/images-grid-first.svg";
import styles from "./page.module.scss";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <Navbar color="black" />

      <section className={styles.aboutHero}>
        <div className={styles.aboutHeroLeft}>
          <h1 className={styles.aboutHeroLeftTitle}>
            Built for
            people
            who build
            things.
          </h1>
          <p className={styles.aboutHeroLeftText}>
            Spark started in 2019 as a single shared table in Podil.
            <br /> Six years later we run three locations across Kyiv — but the
            idea has not changed. Make space that does its job, then get out of
            the way.
          </p>
        </div>
        <div className={styles.aboutHeroRight}>
          <img src={hero.src} alt="" />
        </div>
      </section>

      <section className={styles.numbers}>
        <h3 className={styles.numbersTitle}>Spark in numbers</h3>
        <div className={styles.numbersGrid}>
          <div className={styles.numbersGridItem}>
            <div className={styles.numbersGridItemTitle}>3</div>
            <div className={styles.numbersGridItemText}>Locations in Kyiv</div>
          </div>
          <div className={styles.numbersGridItem}>
            <div className={styles.numbersGridItemTitle}>
              1,200<span className={styles.numbersGridItemTitlePlus}>+</span>
            </div>
            <div className={styles.numbersGridItemText}>Members & visitors</div>
          </div>
          <div className={styles.numbersGridItem}>
            <div className={styles.numbersGridItemTitle}>
              94
            </div>
            <div className={styles.numbersGridItemText}>Events hosted</div>
          </div>
          <div className={styles.numbersGridItem}>
            <div className={styles.numbersGridItemTitle}>
              2019
            </div>
            <div className={styles.numbersGridItemText}>The year we started</div>
          </div>
        </div>
      </section>

      <section className={styles.aboutHero}>
        <div className={styles.aboutHeroRight}>
          <img src={heroSecond.src} alt="" />
        </div>
        <div className={styles.aboutHeroLeft}>
          <p className={styles.aboutHeroLeftCaption}>
            OUR STORY
          </p>
          <h1 className={styles.aboutHeroLeftTitle}>
            It started with one table in Podil.
          </h1>
          <p className={styles.aboutHeroLeftTextSmall}>
            We were three friends sharing an apartment, an inconsistent Wi-Fi router, and a stubborn belief that "office" did not have to mean fluorescent ceilings and complimentary anxiety. We rented a corner above a bakery, bought a long oak table, and invited people we liked to work next to us.
            <br />
            <br />
            Within a year the table was a floor. The floor became a building. Today Spark is three locations and a small team obsessed with the same problem: how do we make a room where work feels lighter the moment you walk in?
          </p>
        </div>
      </section>

      <section className={styles.aboutGrid}>
        <h2 className={styles.aboutGridTitle}>
          What we care about, in four short sentences.
        </h2>
        <div className={styles.aboutGridWrapper}>
          <div className={styles.aboutGridWrapperItem}>
            <div className={styles.aboutGridWrapperItemNumber}>01</div>
            <div className={styles.aboutGridWrapperItemBottom}>
              <div className={styles.aboutGridWrapperItemBottomTitle}>
                People first
              </div>
              <div className={styles.aboutGridWrapperItemBottomText}>
                A coworking space is a room full of strangers. Our job is to
                make that not feel like one.
              </div>
            </div>
          </div>
          
          <div className={styles.aboutGridWrapperItem}>
            <div className={styles.aboutGridWrapperItemNumber}>02</div>
            <div className={styles.aboutGridWrapperItemBottom}>
              <div className={styles.aboutGridWrapperItemBottomTitle}>
                Honest pricing
              </div>
              <div className={styles.aboutGridWrapperItemBottomText}>
                No setup fees. No "premium air". The price you see covers the desk, the Wi-Fi, and the coffee — full stop.
              </div>
            </div>
          </div>

          <div className={styles.aboutGridWrapperItem}>
            <div className={styles.aboutGridWrapperItemNumber}>03</div>
            <div className={styles.aboutGridWrapperItemBottom}>
              <div className={styles.aboutGridWrapperItemBottomTitle}>
                Design matters
              </div>
              <div className={styles.aboutGridWrapperItemBottomText}>
                Lighting, acoustics, chair height. The details no one writes a review about — but everyone feels.
              </div>
            </div>
          </div>

          <div className={styles.aboutGridWrapperItem}>
            <div className={styles.aboutGridWrapperItemNumber}>04</div>
            <div className={styles.aboutGridWrapperItemBottom}>
              <div className={styles.aboutGridWrapperItemBottomTitle}>
                Owned locally
              </div>
              <div className={styles.aboutGridWrapperItemBottomText}>
                We live, work, and pay taxes in Kyiv. Spark is small, and it stays that way on purpose.
              </div>
            </div>
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

      <Footer />
    </div>
  );
}
