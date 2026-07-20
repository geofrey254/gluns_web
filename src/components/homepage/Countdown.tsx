/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './Countdown.module.css'

function getNextEventDate() {
  const now = new Date()
  const year = now.getFullYear()
  const targetMonth = 7 // August
  const targetDay = 12
  let target = new Date(year, targetMonth, targetDay, 9, 0, 0)
  if (now > target) target = new Date(year + 1, targetMonth, targetDay, 9, 0, 0)
  return target
}

function msToParts(ms: any) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

function Flap({ value, label }: any) {
  const [display, setDisplay] = useState(value)
  const [flip, setFlip] = useState(false)

  useEffect(() => {
    if (value === display) return
    setFlip(true)
    const t = setTimeout(() => {
      setDisplay(value)
      setFlip(false)
    }, 220)
    return () => clearTimeout(t)
  }, [value, display])

  return (
    <div className={styles['flap-unit']}>
      <div className={`${styles['flap-card']} ${flip ? styles['flap-turn'] : ''}`}>
        <span className={styles['flap-digit']}>{String(display).padStart(2, '0')}</span>
        <div className={styles['flap-seam']} />
      </div>
      <div className={styles['flap-label']}>{label}</div>
    </div>
  )
}

export default function Countdown() {
  const [now, setNow] = useState(() => new Date())
  const [target] = useState(() => getNextEventDate())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const diff = target.getTime() - now.getTime()
  const { days, hours, minutes, seconds } = msToParts(diff)
  const isPast = diff <= 0

  return (
    <section
      className={`${styles.hero} ${styles.vars}`}
      aria-label="Countdown to GLUNS Nairobi Summer Workshop"
    >
      <div className={styles['hero-inner']}>
        <div className={styles['eyebrow-row']}>
          <span className={styles['status-dot']} aria-hidden="true" />
          <span className={styles.eyebrow}>GLUNS · Nairobi Summer Workshop</span>
        </div>

        <h2 className="text-4xl md:text-5xl 2xl:text-8xl font-bold text-white leading-tight">
          GLUNS NAIROBI SUMMER WORKSHOP<span className={styles.accent}>.</span>
        </h2>

        <p className="mt-4 text-lg md:text-xl 2xl:text-3xl text-white/70 leading-relaxed">
          A three-day MUN training (Aug 12–14, 2026) at Light Academy, Nairobi — practical
          simulations and sessions to build diplomacy, negotiation, public speaking, and leadership
          skills for delegates at all levels.
        </p>

        <div className={styles['board-wrap']}>
          <div className={styles['board-header']}>
            <span>Workshop countdown</span>
            <span>Aug 12–14, 2026</span>
          </div>
          <div className={styles['flap-row']}>
            <Flap value={days} label="Days" />
            <Flap value={hours} label="Hours" />
            <Flap value={minutes} label="Minutes" />
            <Flap value={seconds} label="Seconds" />
          </div>
        </div>

        <div className={styles['foot-row']}>
          <p className={styles['status-text']}>
            {isPast ? (
              <strong>The workshop is happening now.</strong>
            ) : (
              <>
                Light Academy, Nairobi, Kenya · <strong>August 12–14, 2026</strong>
              </>
            )}
          </p>
          <div className={styles['cta-group']}>
            <Link href="/registration" className={`${styles.btn} ${styles['btn-primary']}`}>
              Register
            </Link>
            <Link href="/events" className={`${styles.btn} ${styles['btn-ghost']}`}>
              View events
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
