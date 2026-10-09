'use client'
import dynamic from 'next/dynamic'

// ssr:false must live in a client component; this keeps page.jsx a server component
const HelixCanvas = dynamic(() => import('./HelixCanvas'), { ssr: false })

export default function Scene() {
  return <div className="scene" aria-hidden="true"><HelixCanvas /></div>
}
