import React, { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

const skills = ['React Native', 'Expo', 'React', 'Next.js', 'JavaScript']

const facts = [
    { label: 'Based in', value: 'India' },
    { label: 'Languages', value: 'Hindi (Native) · English (Intermediate)' },
    { label: 'Open to', value: 'Startup roles · Freelance' },
    { label: 'Main project', value: 'Recur — subscription tracker' },
]

const links = [
    { label: 'GitHub', href: 'https://github.com/vikasFTdeveloper' },
    { label: 'LinkedIn', href: 'https://in.linkedin.com/in/vikas-dhakad-657034275' },
    { label: 'Email', href: 'mailto:vikas721a@gmail.com' },
]

/* ------------------------------------------------------------------ */
/* Three.js: moving background (particles + two slow wireframe shapes) */
/* ------------------------------------------------------------------ */
function ThreeBackground() {
    const mountRef = useRef(null)

    useEffect(() => {
        const mount = mountRef.current
        if (!mount) return

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        let renderer
        try {
            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
        } catch (err) {
            // WebGL na ho to page bina background ke chalega
            return
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
        mount.appendChild(renderer.domElement)
        renderer.domElement.style.display = 'block'

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100)
        camera.position.z = 12

        // --- particles (gold dust) ---
        const COUNT = 700
        const positions = new Float32Array(COUNT * 3)
        for (let i = 0; i < COUNT; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 34
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20
        }
        const particleGeo = new THREE.BufferGeometry()
        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        const particleMat = new THREE.PointsMaterial({
            color: 0xf5b342,
            size: 0.06,
            transparent: true,
            opacity: 0.7,
            depthWrite: false,
        })
        const particles = new THREE.Points(particleGeo, particleMat)
        scene.add(particles)

        // --- wireframe shapes ---
        const icoGeo = new THREE.IcosahedronGeometry(2.6, 1)
        const icoMat = new THREE.MeshBasicMaterial({ color: 0xd20a11, wireframe: true, transparent: true, opacity: 0.55 })
        const ico = new THREE.Mesh(icoGeo, icoMat)
        ico.position.set(7, 1.5, -2)
        scene.add(ico)

        const octGeo = new THREE.OctahedronGeometry(1.4, 0)
        const octMat = new THREE.MeshBasicMaterial({ color: 0xf5b342, wireframe: true, transparent: true, opacity: 0.5 })
        const oct = new THREE.Mesh(octGeo, octMat)
        oct.position.set(-8, -3, -1)
        scene.add(oct)

        // --- sizing ---
        const resize = () => {
            const w = mount.clientWidth || 1
            const h = mount.clientHeight || 1
            renderer.setSize(w, h, false)
            renderer.domElement.style.width = '100%'
            renderer.domElement.style.height = '100%'
            camera.aspect = w / h
            camera.updateProjectionMatrix()
        }
        resize()
        const ro = new ResizeObserver(resize)
        ro.observe(mount)

        // --- mouse parallax ---
        const mouse = { x: 0, y: 0 }
        const onMove = (e) => {
            mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
            mouse.y = (e.clientY / window.innerHeight - 0.5) * 2
        }
        window.addEventListener('pointermove', onMove, { passive: true })

        // --- render loop (sirf tab chalta hai jab section screen par ho) ---
        let visible = true
        let raf = 0
        const clock = new THREE.Clock()

        const render = () => {
            const t = clock.getElapsedTime()
            if (!reduceMotion) {
                particles.rotation.y = t * 0.03
                particles.rotation.x = Math.sin(t * 0.1) * 0.08
                ico.rotation.x = t * 0.12
                ico.rotation.y = t * 0.18
                oct.rotation.x = -t * 0.2
                oct.rotation.y = t * 0.15
                ico.position.y = 1.5 + Math.sin(t * 0.5) * 0.4
                oct.position.y = -3 + Math.cos(t * 0.6) * 0.3
            }
            camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.04
            camera.position.y += (-mouse.y * 0.5 - camera.position.y) * 0.04
            camera.lookAt(0, 0, 0)
            renderer.render(scene, camera)
        }

        const loop = () => {
            if (!visible) return
            render()
            raf = requestAnimationFrame(loop)
        }

        const io = new IntersectionObserver(
            ([entry]) => {
                visible = entry.isIntersecting
                cancelAnimationFrame(raf)
                if (visible) loop()
            },
            { threshold: 0 }
        )
        io.observe(mount)
        loop()

        return () => {
            cancelAnimationFrame(raf)
            io.disconnect()
            ro.disconnect()
            window.removeEventListener('pointermove', onMove)
            particleGeo.dispose()
            particleMat.dispose()
            icoGeo.dispose()
            icoMat.dispose()
            octGeo.dispose()
            octMat.dispose()
            renderer.dispose()
            if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
        }
    }, [])

    return <div ref={mountRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0" />
}

/* ------------------------------------------------------------------ */
/* About                                                               */
/* ------------------------------------------------------------------ */
export default function About() {
    const root = useRef(null)

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                defaults: { ease: 'power3.out' },
                scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
            })

            // text upar se neeche aata hai (mask reveal)
            tl.from('.ab-eyebrow', { y: -40, opacity: 0, duration: 0.6 })
                .from('.ab-title-line', { yPercent: -120, opacity: 0, stagger: 0.15, duration: 0.9 }, '-=0.3')
                .from('.ab-text', { y: -40, opacity: 0, stagger: 0.12, duration: 0.7 }, '-=0.5')
                .from('.ab-photo', { scale: 0.88, opacity: 0, duration: 0.9 }, '-=0.9')
                .from('.ab-card', { y: -30, opacity: 0, stagger: 0.1, duration: 0.6 }, '-=0.5')
                .from('.ab-chip', { y: -20, opacity: 0, stagger: 0.07, duration: 0.5 }, '-=0.4')
                .from('.ab-link', { y: -20, opacity: 0, stagger: 0.1, duration: 0.5 }, '-=0.3')

            // avatar halka float
            gsap.to('.ab-photo-inner', { y: -8, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1 })
        }, root)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={root}
            className="relative isolate overflow-hidden bg-[#0A0C10] py-20 text-[#F0EDE6] sm:py-28"
        >
            <ThreeBackground />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-[1]"
                style={{ backgroundImage: 'radial-gradient(ellipse at 20% 100%, rgba(210,10,17,0.28), transparent 60%)' }}
            />

            <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12">
                <div className="flex flex-col items-center gap-12 md:flex-row md:gap-10 lg:gap-16">
                    {/* ---------- photo ---------- */}
                    <div className="ab-photo w-full max-w-sm shrink-0 md:w-5/12 lg:w-4/12">
                        <div className="ab-photo-inner relative">
                            <div
                                aria-hidden="true"
                                className="absolute -inset-6 rounded-full opacity-70 blur-2xl"
                                style={{ background: 'radial-gradient(circle at 50% 60%, rgba(210,10,17,0.55), transparent 70%)' }}
                            />
                            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm">
                                <span className="absolute inset-0 flex items-center justify-center text-7xl font-extrabold text-white/10">
                                    VN
                                </span>
                                <img
                                    src="/avatar.png"
                                    alt="Vikas Nagar"
                                    className="relative h-full w-full object-contain object-bottom"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none'
                                    }}
                                />
                            </div>
                            <div className="relative mt-4 bg-[#F0EDE6] px-3 py-2 text-center font-mono text-[10px] tracking-widest text-[#0E1117] sm:text-xs">
                                VIKAS NAGAR · REACT NATIVE DEVELOPER · INDIA
                            </div>
                        </div>
                    </div>

                    {/* ---------- content ---------- */}
                    <div className="w-full md:w-7/12 lg:w-8/12">
                        <p className="ab-eyebrow font-mono text-xs uppercase tracking-[0.25em] text-[#D20A11]">
                            04 · About me
                        </p>

                        <h2 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                            <span className="block overflow-hidden pb-1">
                                <span className="ab-title-line block">Hi, I&apos;m</span>
                            </span>
                            <span className="block overflow-hidden pb-1">
                                <span className="ab-title-line block text-[#F5B342]">Vikas Nagar.</span>
                            </span>
                            <span className="block overflow-hidden pb-1">
                                <span className="ab-title-line block">I build apps that ship.</span>
                            </span>
                        </h2>

                        <p className="ab-text mt-6 max-w-2xl text-base leading-relaxed text-[#F0EDE6]/75 sm:text-lg">
                            I&apos;m a self-taught React Native and Expo developer from India, building toward my first
                            developer role at a startup. I learn by shipping, and my main project,{' '}
                            <span className="font-semibold text-[#F5B342]">Recur</span>, a subscription tracker app built
                            with React Native and Expo, is the best proof of how I work.
                        </p>
                        <p className="ab-text mt-4 max-w-2xl text-base leading-relaxed text-[#F0EDE6]/75 sm:text-lg">
                            I also work with React and Next.js on the web, and I&apos;m open to freelance projects on
                            platforms like Upwork and Fiverr alongside full-time opportunities.
                        </p>
                        <p className="ab-text mt-4 max-w-2xl text-base leading-relaxed text-[#F0EDE6]/75 sm:text-lg">
                            My learning path started with the Chai aur Code courses (React / JavaScript, Next.js,
                            React Native and full web development), and then I kept building real projects.
                        </p>

                        {/* fact cards */}
                        <div className="mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
                            {facts.map((f) => (
                                <div
                                    key={f.label}
                                    className="ab-card rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm"
                                >
                                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#F0EDE6]/50">
                                        {f.label}
                                    </p>
                                    <p className="mt-1 text-sm font-semibold sm:text-base">{f.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* skills */}
                        <div className="mt-8 flex flex-wrap gap-2.5">
                            {skills.map((s) => (
                                <span
                                    key={s}
                                    className="ab-chip rounded-full border border-[#F5B342]/40 px-4 py-1.5 font-mono text-xs text-[#F5B342] sm:text-sm"
                                >
                                    {s}
                                </span>
                            ))}
                        </div>

                        {/* links */}
                        <div className="mt-8 flex flex-wrap gap-3">
                            {links.map((l) => (
                                <a
                                    key={l.label}
                                    href={l.href}
                                    target={l.href.startsWith('http') ? '_blank' : undefined}
                                    rel="noreferrer"
                                    className="ab-link inline-flex items-center rounded-lg bg-[#D20A11] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-80 sm:text-base"
                                >
                                    {l.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}