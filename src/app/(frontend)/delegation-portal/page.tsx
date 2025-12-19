import React from 'react'
import Link from 'next/link'

export default function page() {
  return (
    <section className="min-h-screen">
      <div>
        <Link href="/signup">Sign Up</Link>
      </div>
    </section>
  )
}
