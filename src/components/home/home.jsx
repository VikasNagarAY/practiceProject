import React, { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const headlines = ['TWO de.', 'ONE DEVELOPER.', 'I BUILD BOTH SIDES.']
const skills = ['React Native', 'Expo', 'React', 'Next.js', 'JavaScript']

// Terminal content: cmd = type hota hai, out = ek saath aata hai
const terminalLines = [
    { type: 'cmd', text: 'npx expo start' },
    { type: 'out', text: '› Metro waiting on exp://192.168.1.5:8081', color: 'text-gray-400' },
    { type: 'out', text: '✔ Bundled 1247 modules', color: 'text-[#28C840]' },
    { type: 'cmd', text: 'eas build -p android' },
    { type: 'out', text: '✔ Build finished. Shipped 🚀', color: 'text-[#28C840]' },
]

const avatarMask = {
    WebkitMaskImage: 'url(/avatar.png)',
    maskImage: 'url(/avatar.png)',
    WebkitMaskSize: '100% 100%',
    maskSize: '100% 100%',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
}

function Prompt() {
    return (
        <span className="select-none">
            <span className="text-[#28C840]">vikas</span>
            <span className="text-gray-500"> in </span>
            <span className="text-[#5AC8FA]">~/portfolio</span>
            <span className="text-[#F5B342]"> ❯ </span>
        </span>
    )
}

export default function Home() {
    const root = useRef(null)
    const scene = useRef(null)
    const lineEls = useRef([])
    const textEls = useRef([])
    const cursorRef = useRef(null)

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // ---------- terminal typing helper ----------
            const weights = terminalLines.map((l) => (l.type === 'cmd' ? l.text.length : 1))
            const total = weights.reduce((a, b) => a + b, 0)
            const typeTo = (n) => {
                let rem = n
                let active = null
                terminalLines.forEach((l, i) => {
                    const el = lineEls.current[i]
                    const txt = textEls.current[i]
                    if (!el || !txt) return
                    if (rem <= 0) {
                        el.style.display = 'none'
                        txt.textContent = ''
                        return
                    }
                    el.style.display = 'block'
                    if (l.type === 'cmd') {
                        txt.textContent = l.text.slice(0, Math.min(rem, l.text.length))
                        rem -= weights[i]
                    } else {
                        txt.textContent = l.text
                        rem -= 1
                    }
                    active = el
                })
                if (active && cursorRef.current) active.appendChild(cursorRef.current)
            }
            typeTo(0)

            // ---------- initial states ----------
            gsap.set('.avatar-line', { scaleY: 0, transformOrigin: 'top center' })
            gsap.set('.avatar-wire', { clipPath: 'inset(0 0 0 100%)' })

            // ---------- PINNED SPLIT SCENE ----------
            const typer = { n: 0 }
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: scene.current,
                    start: 'top top',
                    end: '+=4200',
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1,
                },
            })

            tl.fromTo('.h-0', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1 })
              .to('.h-0', { autoAlpha: 0, y: -30, duration: 1 }, '+=0.6')
              .addLabel('split')
              .to('.panel-left', { xPercent: -55, duration: 3, ease: 'power2.inOut' }, 'split')
              .to('.panel-right', { xPercent: 55, duration: 3, ease: 'power2.inOut' }, 'split')
              // avatar neeche se upar + red glow
              .fromTo('.avatar-wrap', { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 3, ease: 'power2.out' }, 'split+=0.5')
              .fromTo('.avatar-glow', { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 3, ease: 'power2.out' }, 'split+=0.5')
              .fromTo('.h-1', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1 }, 'split+=1')
              .to('.h-1', { autoAlpha: 0, y: -30, duration: 1 }, 'split+=3.4')
              // avatar ka split: dashed line draw + right half gold wireframe wipe
              .to('.avatar-line', { scaleY: 1, duration: 1, ease: 'none' }, 'split+=3.5')
              .to('.avatar-wire', { clipPath: 'inset(0 0 0 50%)', duration: 1.6, ease: 'power2.inOut' }, 'split+=3.8')
              // mac terminal aata hai aur type hota hai
              .fromTo('.code-window', { autoAlpha: 0, scale: 0.9, x: 40 }, { autoAlpha: 1, scale: 1, x: 0, duration: 1.2 }, 'split+=4')
              .to(typer, {
                  n: total,
                  duration: 4,
                  ease: 'none',
                  onUpdate: () => typeTo(Math.round(typer.n)),
              }, 'split+=4.6')
              .fromTo('.name-tag', { yPercent: 150, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1 }, 'split+=4.6')
              .fromTo('.h-2', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1 }, 'split+=6.6')
              .to({}, { duration: 1.5 })

            gsap.to('.art-cursor', { opacity: 0, duration: 0.5, repeat: -1, yoyo: true, ease: 'steps(1)' })

            // ---------- LEFT PANEL: video jaisa UI animation (time based, loop) ----------
            gsap.from('.ui-win', { y: 30, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.2 })
            gsap.from('.ui-sw', { scale: 0, stagger: 0.1, duration: 0.4, ease: 'back.out(2)', delay: 0.9 })
            gsap.from('.ui-extra', { y: 20, opacity: 0, stagger: 0.15, duration: 0.6, ease: 'power3.out', delay: 0.7 })

            const ui = gsap.timeline({ repeat: -1, repeatDelay: 1.2, delay: 1.6 })
            ui.fromTo('.ui-cursor', { x: -90, y: -60, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 1, ease: 'power2.inOut' })
              .to('.ui-btn', { scale: 0.92, duration: 0.1, yoyo: true, repeat: 1 })
              .to('.ui-knob', { x: -32, duration: 0.35, ease: 'power2.inOut' }, '+=0.2')
              .to('.ui-toggle', { backgroundColor: '#9E9A8E', duration: 0.35 }, '<')
              .to('.ui-knob', { x: 0, duration: 0.35, ease: 'power2.inOut' }, '+=1')
              .to('.ui-toggle', { backgroundColor: '#D20A11', duration: 0.35 }, '<')
              .to('.ui-cursor', { opacity: 0, duration: 0.4 }, '+=0.2')

            // ---------- HERO (scene ke baad) ----------
            const hero = gsap.timeline({
                defaults: { ease: 'power3.out' },
                scrollTrigger: { trigger: '.hero-section', start: 'top 75%', once: true },
            })
            hero.from('.hero-label', { y: 20, opacity: 0, duration: 0.6 })
                .from('.hero-title', { y: 60, opacity: 0, duration: 0.9 }, '-=0.3')
                .from('.hero-text', { y: 30, opacity: 0, duration: 0.7 }, '-=0.5')
                .from('.hero-btn', { y: 30, opacity: 0, scale: 0.9, stagger: 0.12, duration: 0.6 }, '-=0.4')
                .from('.art-code', { x: 80, opacity: 0, duration: 0.9 }, '-=1')
                .from('.art-phone', { y: 80, opacity: 0, duration: 0.9 }, '-=0.7')
                .from('.art-tile', { scale: 0.6, opacity: 0, transformOrigin: '50% 50%', stagger: 0.15, duration: 0.6 }, '-=0.5')
                .from('.hero-chip', { y: 20, opacity: 0, stagger: 0.08, duration: 0.5 }, '-=0.4')

            gsap.to('.art-phone', { y: -10, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
            gsap.to('.art-code', { y: 10, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 })
        }, root)

        return () => ctx.revert()
    }, [])

    return (
        <div ref={root}>
            {/* ================= PINNED SPLIT SCENE ================= */}
            <section
                ref={scene}
                className="relative h-screen w-full overflow-hidden bg-[#0A0C10] text-white"
                style={{ backgroundImage: 'radial-gradient(ellipse at 50% 100%, rgba(210,10,17,0.35), transparent 60%)' }}
            >
                {/* headlines */}
                <div className="pointer-events-none absolute inset-x-0 top-[12%] z-30 text-center">
                    <h2 className="h-0 absolute inset-x-0 text-3xl font-extrabold tracking-tight sm:text-6xl">{headlines[0]}</h2>
                    <h2 className="h-1 absolute inset-x-0 text-3xl font-extrabold tracking-tight opacity-0 sm:text-6xl">{headlines[1]}</h2>
                    <h2 className="h-2 absolute inset-x-0 text-3xl font-extrabold tracking-tight opacity-0 sm:text-6xl">
                        {headlines[2].split(' ').slice(0, -2).join(' ')}{' '}
                        <span className="text-[#F5B342]">{headlines[2].split(' ').slice(-2).join(' ')}</span>
                    </h2>
                </div>

                {/* AVATAR (public/avatar.png) */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center">
                    <div className="avatar-wrap relative flex h-[70vh] items-end opacity-0">
                        <div
                            className="avatar-glow absolute -inset-x-[40%] inset-y-0 opacity-0"
                            style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(210,10,17,0.6), transparent 65%)' }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-7xl font-extrabold text-white/10">VN</span>

                        <div className="relative h-full">
                            {/* base: full color */}
                            <img
                                src="/avatar.png"
                                alt="Vikas"
                                className="block h-full w-auto"
                                onError={(e) => { e.currentTarget.style.display = 'none' }}
                            />
                            {/* right half: gold wireframe (wipe hota hai) */}
                            <div className="avatar-wire absolute inset-0">
                                <img
                                    src="/avatar.png"
                                    alt=""
                                    className="block h-full w-auto"
                                    style={{ filter: 'grayscale(1) sepia(1) saturate(3) hue-rotate(-8deg) brightness(0.85) contrast(1.3)' }}
                                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                                />
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        background: 'repeating-linear-gradient(0deg, rgba(14,17,23,0.55) 0 2px, transparent 2px 7px)',
                                        ...avatarMask,
                                    }}
                                />
                            </div>
                            {/* center dashed line */}
                            <div className="avatar-line absolute inset-y-0 left-1/2 border-l border-dashed border-white/50" />
                        </div>
                    </div>
                </div>

                {/* name tag */}
                <div className="pointer-events-none absolute inset-x-0 bottom-6 z-30 flex justify-center">
                    <div className="name-tag bg-[#F0EDE6] px-4 py-2 font-mono text-[10px] tracking-widest text-[#0E1117] opacity-0 sm:text-xs">
                        VIKAS NAGAR · REACT NATIVE DEVELOPER · INDIA
                    </div>
                </div>

                {/* MAC TERMINAL */}
                <div className="code-window absolute right-[4%] top-[30%] z-30 hidden w-[30%] min-w-[300px] rounded-xl bg-[#1E1E1E]/90 opacity-0 shadow-[0_30px_80px_rgba(0,0,0,0.6)] ring-1 ring-white/10 backdrop-blur md:block">
                    <div className="relative flex h-9 items-center rounded-t-xl border-b border-black/40 bg-gradient-to-b from-[#3A3A3C] to-[#2B2B2D] px-3">
                        <div className="flex gap-2">
                            <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                            <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                            <span className="h-3 w-3 rounded-full bg-[#28C840]" />
                        </div>
                        <div className="pointer-events-none absolute inset-x-0 text-center font-sans text-[11px] text-gray-300">
                            vikas — zsh — 80×24
                        </div>
                    </div>
                    <div className="min-h-[190px] p-4 font-mono text-[13px] leading-6">
                        {terminalLines.map((l, i) => (
                            <div key={i} ref={(el) => (lineEls.current[i] = el)} style={{ display: 'none' }}>
                                {l.type === 'cmd' && <Prompt />}
                                <span
                                    ref={(el) => (textEls.current[i] = el)}
                                    className={l.type === 'cmd' ? 'text-gray-100' : l.color}
                                />
                            </div>
                        ))}
                        <span ref={cursorRef} className="art-cursor ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-gray-200" />
                    </div>
                </div>

                {/* LEFT PANEL: design side (video jaisa) */}
                <div
                    className="panel-left absolute inset-y-0 left-0 z-10 flex w-1/2 items-center justify-end overflow-hidden bg-[#F0EDE6] pr-3 text-[#0E1117] sm:pr-10"
                    style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(14,17,23,0.05) 0 1px, transparent 1px 90px)' }}
                >
                    <div className="relative w-[92%] max-w-[520px] pb-24">
                        {/* browser window */}
                        <div className="ui-win overflow-hidden rounded-md bg-[#E8E4DA] shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
                            <div className="flex h-6 items-center gap-1.5 bg-[#D20A11] px-3">
                                <span className="h-2 w-2 rounded-full bg-white" />
                                <span className="h-2 w-2 rounded-full bg-white" />
                                <span className="h-2 w-2 rounded-full bg-white" />
                            </div>
                            <div className="grid grid-cols-[1fr_auto] gap-4 p-5">
                                <div className="space-y-2.5">
                                    <div className="h-4 w-3/4 bg-[#0E1117]" />
                                    <div className="h-1.5 w-full bg-[#C9C4B6]" />
                                    <div className="h-1.5 w-11/12 bg-[#C9C4B6]" />
                                    <div className="h-1.5 w-2/3 bg-[#C9C4B6]" />

                                    <div className="relative pt-3">
                                        <div className="ui-btn h-8 w-28 rounded-full bg-[#D20A11]" />
                                        {/* cursor + figma icon */}
                                        <div className="ui-cursor absolute left-[92px] top-[26px] flex items-end">
                                            <svg width="22" height="26" viewBox="0 0 22 26" fill="none">
                                                <path d="M2 2 L2 21 L7 16.5 L10.5 24 L13.5 22.6 L10 15.4 L17 15 Z" fill="#0E1117" stroke="#F0EDE6" strokeWidth="1.2" strokeLinejoin="round" />
                                            </svg>
                                            <svg width="12" height="16" viewBox="0 0 12 16" className="-ml-0.5 mb-0.5" fill="none" stroke="#0E1117" strokeWidth="1.4">
                                                <rect x="1" y="1" width="5" height="4.5" rx="2.2" />
                                                <rect x="6" y="1" width="5" height="4.5" rx="2.2" />
                                                <rect x="1" y="5.5" width="5" height="4.5" rx="2.2" />
                                                <circle cx="8.5" cy="7.7" r="2.2" />
                                                <rect x="1" y="10" width="5" height="4.5" rx="2.2" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="flex gap-1.5 pt-2">
                                        <span className="ui-sw h-3.5 w-3.5 bg-[#D20A11]" />
                                        <span className="ui-sw h-3.5 w-3.5 bg-[#0E1117]" />
                                        <span className="ui-sw h-3.5 w-3.5 bg-[#E0607E]" />
                                        <span className="ui-sw h-3.5 w-3.5 bg-[#C9C4B6]" />
                                    </div>
                                </div>

                                {/* image placeholder: mountain + red sun */}
                                <div className="relative h-24 w-28 bg-[#C9C4B6]">
                                    <div className="absolute right-3 top-3 h-4 w-4 rounded-full bg-[#D20A11]" />
                                    <svg className="absolute inset-x-0 bottom-0" viewBox="0 0 112 60" fill="#0E1117">
                                        <path d="M0 60 L38 14 L62 40 L80 24 L112 60 Z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Aa tile + toggle */}
                        <div className="mt-5 flex items-center gap-5">
                            <div className="ui-extra grid h-20 w-20 place-items-center rounded-lg bg-[#E8E4DA] text-4xl font-extrabold">Aa</div>
                            <div className="ui-extra">
                                <div className="ui-toggle relative h-8 w-16 rounded-full bg-[#D20A11]">
                                    <span className="ui-knob absolute right-1 top-1 h-6 w-6 rounded-full bg-white" />
                                </div>
                            </div>
                        </div>

                        {/* phone */}
                        <div className="ui-extra absolute bottom-0 right-4 h-44 w-24 overflow-hidden rounded-[22px] border-[6px] border-[#0E1117] bg-white">
                            <div className="h-12 bg-[#D20A11]" />
                            <div className="space-y-2 p-2">
                                <div className="h-6 rounded bg-[#E8E4DA]" />
                                <div className="h-6 rounded bg-[#E8E4DA]" />
                                <div className="h-1.5 w-1/2 rounded bg-[#C9C4B6]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL: code side */}
                <div className="panel-right absolute inset-y-0 right-0 z-10 flex w-1/2 items-center justify-start overflow-hidden bg-[#131925] pl-3 sm:pl-8">
                    <div className="w-[92%] max-w-md space-y-4">
                        <div className="overflow-hidden rounded-lg bg-[#1E1E1E] ring-1 ring-white/10">
                            <div className="flex h-7 items-center gap-1.5 bg-gradient-to-b from-[#3A3A3C] to-[#2B2B2D] px-3">
                                <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                                <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                                <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                            </div>
                            <div className="p-4 font-mono text-xs leading-6 text-gray-400 sm:text-sm">
                                <div><span className="text-[#F5B342]">❯ </span>npm run build</div>
                                <div className="text-[#28C840]">✔ build passed</div>
                                <div><span className="text-[#F5B342]">❯ </span>git push origin main</div>
                            </div>
                        </div>
                        <div className="flex items-end gap-4">
                            <div className="w-24 space-y-1.5 rounded-md bg-[#232B3B] p-2">
                                <div className="h-3 rounded bg-[#161B26]" />
                                <div className="h-3 rounded bg-[#161B26]" />
                                <div className="h-3 rounded bg-[#161B26]" />
                            </div>
                            <div className="relative h-20 w-20 rounded-b-2xl bg-[#232B3B]">
                                <div className="absolute -top-3 h-6 w-20 rounded-full bg-[#2E384C]" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= HERO ================= */}
            <div className="mx-auto w-full max-w-7xl px-2 pt-10 sm:px-6">
                <section className="hero-section overflow-hidden rounded-2xl bg-[#F0EDE6] text-[#0E1117]">
                    <div className="grid items-center gap-10 px-6 py-14 sm:px-12 sm:py-20 md:grid-cols-2">
                        <div className="space-y-6 text-center md:text-left">
                            <p className="hero-label font-mono text-xs uppercase tracking-widest text-[#D20A11]">
                                Mobile &amp; Web Developer
                            </p>
                            <h1 className="hero-title text-4xl font-extrabold leading-tight sm:text-6xl">
                                I build apps
                                <br />
                                that <span className="text-[#D20A11]">ship.</span>
                            </h1>
                            <p className="hero-text mx-auto max-w-md text-base text-[#0E1117]/70 sm:text-lg md:mx-0">
                                Self-taught React Native developer. Clean screens, smooth animations and code that works.
                            </p>
                            <div className="flex flex-wrap justify-center gap-3 md:justify-start">
                                <Link to="/github" className="hero-btn inline-flex items-center rounded-lg bg-[#D20A11] px-6 py-3 font-medium text-white hover:opacity-80">
                                    View my work
                                </Link>
                                <Link to="/contact" className="hero-btn inline-flex items-center rounded-lg border-2 border-[#0E1117] px-6 py-3 font-medium hover:bg-[#0E1117] hover:text-white">
                                    Contact me
                                </Link>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <svg viewBox="0 0 520 420" className="h-auto w-full max-w-lg" role="img" aria-label="Phone app and code window illustration">
                                <g className="art-code">
                                    <rect x="200" y="40" width="300" height="200" rx="14" fill="#161B26" />
                                    <rect x="200" y="40" width="300" height="32" rx="14" fill="#232B3B" />
                                    <rect x="200" y="58" width="300" height="14" fill="#232B3B" />
                                    <circle cx="222" cy="56" r="5" fill="#D20A11" />
                                    <circle cx="240" cy="56" r="5" fill="#F5B342" />
                                    <circle cx="258" cy="56" r="5" fill="#6B7280" />
                                    <text x="222" y="108" fill="#9CA3AF" fontFamily="monospace" fontSize="14">$ npx expo start</text>
                                    <text x="222" y="136" fill="#F5B342" fontFamily="monospace" fontSize="14">Metro ready</text>
                                    <text x="222" y="170" fill="#9CA3AF" fontFamily="monospace" fontSize="14">$ eas build -p android</text>
                                </g>
                                <g className="art-phone">
                                    <rect x="70" y="110" width="150" height="290" rx="28" fill="#FFFFFF" stroke="#0E1117" strokeWidth="8" />
                                    <rect x="78" y="118" width="134" height="44" rx="20" fill="#D20A11" />
                                    <rect x="78" y="140" width="134" height="22" fill="#D20A11" />
                                    <rect x="92" y="182" width="106" height="44" rx="8" fill="#E8E4DA" />
                                    <rect x="92" y="236" width="106" height="44" rx="8" fill="#E8E4DA" />
                                    <rect x="92" y="290" width="106" height="44" rx="8" fill="#E8E4DA" />
                                    <rect x="92" y="368" width="60" height="8" rx="4" fill="#C9C4B6" />
                                </g>
                                <g className="art-tile">
                                    <rect x="400" y="262" width="90" height="90" rx="14" fill="#E8E4DA" />
                                    <text x="445" y="320" textAnchor="middle" fontFamily="sans-serif" fontWeight="800" fontSize="40" fill="#0E1117">Aa</text>
                                </g>
                                <g className="art-tile">
                                    <rect x="260" y="300" width="70" height="36" rx="18" fill="#D20A11" />
                                    <circle cx="312" cy="318" r="13" fill="#FFFFFF" />
                                </g>
                            </svg>
                        </div>
                    </div>
                </section>

                <div className="flex flex-wrap justify-center gap-3 py-10">
                    {skills.map((s) => (
                        <span key={s} className="hero-chip rounded-full border border-[#0E1117]/30 px-4 py-2 font-mono text-sm">
                            {s}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}