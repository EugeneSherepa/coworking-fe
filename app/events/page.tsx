"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import imagesGridSecond from "../../public/images-grid-second.svg";
import may28 from "../../public/may-28.webp";
import may31 from "../../public/may31.webp";
import june05 from "../../public/june05.webp";
import june07 from "../../public/june07.webp";
import june12 from "../../public/june12.webp";
import june18 from "../../public/june18.webp";
import june22 from "../../public/june22.webp";
import june122 from "../../public/june122.webp";
import eventSecond from "../../public/event-first.webp";
import styles from "./page.module.scss";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function EventsPage() {
  return (
    <div className={styles.page}>
      <Navbar />
      <section className={styles.locations}>
        <div className={styles.locationsInner}>
          <div className={styles.locationsInnerContent}>
            <h1 className={styles.locationsTitleSecond}>
              More than just a workspace
            </h1>
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
      <section className={styles.event}>
        <h2 className={styles.eventTitle}>Next up · this week</h2>
        <div className={styles.eventWrapper}>
          <div className={styles.eventWrapperLeft}>
            <img src={eventSecond.src} alt="" />
          </div>
          <div className={styles.eventWrapperRight}>
            <div className={styles.eventWrapperRightBadge}>Speaker Series</div>
            <div className={styles.eventWrapperRightSubtitle}>
              MAY 23 · FRIDAY · 19:00 — 21:00
            </div>
            <div className={styles.eventWrapperRightTitle}>
              Building a design team from zero (and keeping them).
            </div>
            <div className={styles.eventWrapperRightCaption}>
              <b>Pavlo Shmarko —</b> Head of Design at Reface
            </div>
            <div className={styles.eventWrapperRightText}>
              Six years in, a 1→14 design team, two re-orgs, and one product
              pivot later — Pavlo shares the hiring criteria, rituals, and
              uncomfortable conversations that kept the team intact through it
              all.
            </div>
            <div className={styles.eventWrapperRightLine}></div>
            <div className={styles.eventWrapperRightGrid}>
              <div className={styles.eventWrapperRightGridItem}>
                <b>Where</b>  · Spark Podil · 4th floor lounge
              </div>
              <div className={styles.eventWrapperRightGridItem}>
                <b>Seats</b>   · 60
              </div>
              <div className={styles.eventWrapperRightGridItem}>
                <b>Language</b>   · UA · ENG slides
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.events}>
        <div className={styles.eventsHeader}>
          <div className={styles.eventsHeaderMonth}>MAY</div>
          <div className={styles.eventsHeaderYear}>2026</div>
        </div>

        <div className={styles.eventsGrid}>
          <div className={styles.eventsGridItem}>
            <img src={may28.src} alt="" />
            <div className={styles.eventsGridItemDate}>
              <div className={styles.eventsGridItemDateDay}>28</div> MAY · WED ·
              15:00 — 18:00
            </div>
            <div className={styles.eventsGridItemTitle}>
              Type design fundamentals
            </div>
            <div className={styles.eventsGridItemAuthor}>
              with <b>Vladyslav Boyko</b>, type designer · TypeKyiv
            </div>
            <div className={styles.eventsGridItemText}>
              A hands-on 3-hour primer on letter construction, spacing, and the
              math of optical illusions. Bring a laptop with Glyphs or FontLab
              installed.
            </div>
            <div className={styles.eventsGridItemBottom}>
              <div
                className={`${styles.eventsGridItemBottomBadge} ${styles.eventsGridItemBottomBadgeGreen}`}
              >
                WORKSHOP
              </div>
              <div className={styles.eventsGridItemBottomLocation}>
                · Spark Pechersk
              </div>
            </div>
          </div>

          <div className={styles.eventsGridItem}>
            <img src={may31.src} alt="" />
            <div className={styles.eventsGridItemDate}>
              <div className={styles.eventsGridItemDateDay}>31</div>MAY · SAT ·
              09:00 — 11:00
            </div>
            <div className={styles.eventsGridItemTitle}>Founders breakfast</div>
            <div className={styles.eventsGridItemAuthor}>
              an open table · come hungry
            </div>
            <div className={styles.eventsGridItemText}>
              Pancakes, oat lattes, and a long table for everyone running their
              own thing. Just breakfast and the people you keep meaning to call.
            </div>
            <div className={styles.eventsGridItemBottom}>
              <div
                className={`${styles.eventsGridItemBottomBadge} ${styles.eventsGridItemBottomBadgeGray}`}
              >
                Community
              </div>
              <div className={styles.eventsGridItemBottomLocation}>
                · Spark Podil
              </div>
            </div>
          </div>

          <div className={styles.eventsGridItem}>
            <img src={eventSecond.src} alt="" />
            <div className={styles.eventsGridItemDate}>
              <div className={styles.eventsGridItemDateDay}>23</div>MAY · FRI ·
              19:00 — 21:00
            </div>
            <div className={styles.eventsGridItemTitle}>
              Building a design team from zero
            </div>
            <div className={styles.eventsGridItemAuthor}>
              with <b>Pavlo Shmarko</b>, Head of Design · Reface
            </div>
            <div className={styles.eventsGridItemText}>
              Hiring criteria, rituals, and uncomfortable conversations that
              kept a 14-person design team intact through two re-orgs.
            </div>
            <div className={styles.eventsGridItemBottom}>
              <div
                className={`${styles.eventsGridItemBottomBadge} ${styles.eventsGridItemBottomBadgeBlack}`}
              >
                TALK
              </div>
              <div className={styles.eventsGridItemBottomLocation}>
                · Spark Podil
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.events}>
        <div className={styles.eventsHeader}>
          <div className={styles.eventsHeaderMonth}>JUNE</div>
          <div className={styles.eventsHeaderYear}>2026</div>
        </div>
        <div className={styles.eventsGrid}>
          <div className={styles.eventsGridItem}>
            <img src={june05.src} alt="" />
            <div className={styles.eventsGridItemDate}>
              <div className={styles.eventsGridItemDateDay}>05</div>JUNE · THU ·
              18:30 — 21:00
            </div>
            <div className={styles.eventsGridItemTitle}>
              Series A · what nobody tells you
            </div>
            <div className={styles.eventsGridItemAuthor}>
              panel · 3 founders post-raise
            </div>
            <div className={styles.eventsGridItemText}>
              An off-the-record conversation with three Ukrainian founders who
              closed Series A in the last 12 months. Term sheets, dilution, the
              boring stuff that matters.
            </div>
            <div className={styles.eventsGridItemBottom}>
              <div
                className={`${styles.eventsGridItemBottomBadge} ${styles.eventsGridItemBottomBadgeBorder}`}
              >
                MEETUP
              </div>
              <div className={styles.eventsGridItemBottomLocation}>
                · Spark Pechersk
              </div>
            </div>
          </div>
          <div className={styles.eventsGridItem}>
            <img src={june07.src} alt="" />
            <div className={styles.eventsGridItemDate}>
              <div className={styles.eventsGridItemDateDay}>07</div>JUNE · SAT ·
              19:00 — 22:00
            </div>
            <div className={styles.eventsGridItemTitle}>Wine & wireframes</div>
            <div className={styles.eventsGridItemAuthor}>
              an after-work for designers, devs & pm's
            </div>
            <div className={styles.eventsGridItemText}>
              A relaxed Saturday evening to show what you're working on, get
              unsolicited feedback on it, and meet the people you've only seen
              on Dribbble.
            </div>
            <div className={styles.eventsGridItemBottom}>
              <div
                className={`${styles.eventsGridItemBottomBadge} ${styles.eventsGridItemBottomBadgeGray}`}
              >
                Community
              </div>
              <div className={styles.eventsGridItemBottomLocation}>
                · Spark OSOKORKY
              </div>
            </div>
          </div>
          <div className={styles.eventsGridItem}>
            <img src={june12.src} alt="" />
            <div className={styles.eventsGridItemDate}>
              <div className={styles.eventsGridItemDateDay}>12</div>JUNE · THU ·
              18:00 — 20:00
            </div>
            <div className={styles.eventsGridItemTitle}>
              AI for indie hackers
            </div>
            <div className={styles.eventsGridItemAuthor}>
              with Olena Pavlenko, builder · 4 products in public
            </div>
            <div className={styles.eventsGridItemText}>
              A practical look at how a one-person studio uses AI day-to-day:
              what's worth the API bill, what's snake oil, and where the
              leverage actually is.
            </div>
            <div className={styles.eventsGridItemBottom}>
              <div
                className={`${styles.eventsGridItemBottomBadge} ${styles.eventsGridItemBottomBadgeBlack}`}
              >
                TALK
              </div>
              <div className={styles.eventsGridItemBottomLocation}>
                · Spark Podil
              </div>
            </div>
          </div>
          <div className={styles.eventsGridItem}>
            <img src={june18.src} alt="" />
            <div className={styles.eventsGridItemDate}>
              <div className={styles.eventsGridItemDateDay}>18</div>JUNE · WED ·
              14:00 — 17:00
            </div>
            <div className={styles.eventsGridItemTitle}>Notion for teams</div>
            <div className={styles.eventsGridItemAuthor}>
              with <b>Iryna Lytvyn</b>, ops · certified Notion consultant
            </div>
            <div className={styles.eventsGridItemText}>
              A 3-hour live build of a working ops space — wiki, OKRs, weekly
              review — leaving with a duplicatable template you can take to
              Monday morning.
            </div>
            <div className={styles.eventsGridItemBottom}>
              <div
                className={`${styles.eventsGridItemBottomBadge} ${styles.eventsGridItemBottomBadgeGreen}`}
              >
                WORKSHOP
              </div>
              <div className={styles.eventsGridItemBottomLocation}>
                · Spark Pechersk
              </div>
            </div>
          </div>
          <div className={styles.eventsGridItem}>
            <img src={june22.src} alt="" />
            <div className={styles.eventsGridItemDate}>
              <div className={styles.eventsGridItemDateDay}>22</div>JUNE · SUN ·
              11:00 — 14:00
            </div>
            <div className={styles.eventsGridItemTitle}>
              Sunday community brunch
            </div>
            <div className={styles.eventsGridItemAuthor}>
              we cook, you bring the gossip
            </div>
            <div className={styles.eventsGridItemText}>
              Frittata, focaccia, three kinds of jam, and a long courtyard table
              at Podil. Bring a +1, a deck of cards, or your dog (the friendly
              kind).
            </div>
            <div className={styles.eventsGridItemBottom}>
              <div
                className={`${styles.eventsGridItemBottomBadge} ${styles.eventsGridItemBottomBadgeGray}`}
              >
                Community
              </div>
              <div className={styles.eventsGridItemBottomLocation}>
                · Spark Podil
              </div>
            </div>
          </div>
          <div className={styles.eventsGridItem}>
            <img src={june122.src} alt="" />
            <div className={styles.eventsGridItemDate}>
              <div className={styles.eventsGridItemDateDay}>12</div>JUNE · THU ·
              18:00 — 20:00
            </div>
            <div className={styles.eventsGridItemTitle}>
              Pitch night · summer edition
            </div>
            <div className={styles.eventsGridItemAuthor}>
              6 founders · 3 minutes each · 1 free pizza
            </div>
            <div className={styles.eventsGridItemText}>
              Six early-stage Spark founders pitch on stage to a friendly room
              of operators, angels, and three actual investors. Audience votes;
              winner gets a month on us.
            </div>
            <div className={styles.eventsGridItemBottom}>
              <div
                className={`${styles.eventsGridItemBottomBadge} ${styles.eventsGridItemBottomBadgeBorder}`}
              >
                MEETUP
              </div>
              <div className={styles.eventsGridItemBottomLocation}>
                · Spark Pechersk
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
