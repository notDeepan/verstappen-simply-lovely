/** The static page is the fallback. GSAP adds one desktop storytelling pin. */
export function createStoryMotion() {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  let context, match, pin;
  const journey = document.querySelector(".journey");
  const track = document.querySelector(".journey-track");
  const moments = [...document.querySelectorAll(".moment")];
  const years = [...document.querySelectorAll(".year-nav a")];
  const setYear = (index) =>
    years.forEach((link, i) =>
      i === index
        ? link.setAttribute("aria-current", "step")
        : link.removeAttribute("aria-current"),
    );
  function goMoment(index, behavior = "smooth") {
    if (!moments[index]) return;
    if (pin)
      window.scrollTo({
        top:
          pin.start +
          ((pin.end - pin.start) * index) / (moments.length - 1) +
          0.1,
        behavior,
      });
    else moments[index].scrollIntoView({ behavior, block: "start" });
    setYear(index);
  }
  function destroy() {
    match?.revert();
    context?.revert();
    match = context = pin = null;
    journey.classList.remove("is-pinned");
    moments.forEach((m) => m.style.removeProperty("transform"));
  }
  function configure(paused) {
    destroy();
    if (paused || !gsap || !ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    context = gsap.context(() => {
      gsap.fromTo(
        ".hero-copy",
        { y: 0 },
        {
          y: -65,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        },
      );
      gsap.to(".hero-video", {
        scale: 1.07,
        yPercent: 6,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
      gsap.from(".hero h1 span", {
        y: 35,
        opacity: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "opacity",
      });
      const velocity = gsap.quickTo("#speed-title", "skewY", {
        duration: 0.5,
        ease: "power3.out",
      });
      const settle = gsap.delayedCall(0.12, () => velocity(0)).pause();
      ScrollTrigger.create({
        trigger: ".speed",
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          velocity(gsap.utils.clamp(-2.2, 2.2, self.getVelocity() / 1800));
          settle.restart(true);
        },
        onLeave: () => velocity(0),
        onLeaveBack: () => velocity(0),
      });
      gsap.fromTo(
        "#speed-title",
        { y: 65 },
        {
          y: -50,
          ease: "none",
          scrollTrigger: {
            trigger: ".speed",
            start: "top bottom",
            end: "bottom top",
            scrub: 0.7,
          },
        },
      );
      document.querySelectorAll(".image-reveal").forEach((frame) => {
        gsap.from(frame, {
          clipPath: "inset(5% 0 5% 0)",
          duration: 1.3,
          ease: "power3.out",
          scrollTrigger: { trigger: frame, start: "top 88%", once: true },
          clearProps: "clipPath",
        });
      });
      gsap.fromTo(
        ".helmet-beauty",
        { y: 25, scale: 0.97 },
        {
          y: -18,
          scale: 1.02,
          ease: "none",
          scrollTrigger: {
            trigger: ".helmet-stage",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );
    });
    match = gsap.matchMedia();
    match.add(
      "(min-width: 1101px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)",
      () => {
        journey.classList.add("is-pinned");
        const distance = () =>
          track.scrollWidth -
          document.querySelector(".journey-window").clientWidth;
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".journey-pin",
            start: "top top",
            end: () => `+=${distance() * 0.75}`,
            pin: true,
            scrub: 0.65,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) =>
              setYear(Math.round(self.progress * (moments.length - 1))),
          },
        });
        pin = tween.scrollTrigger;
        return () => {
          pin = null;
          journey.classList.remove("is-pinned");
        };
      },
    );
    ScrollTrigger.refresh();
  }
  const events = new AbortController();
  years.forEach((link, index) =>
    link.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        history.pushState(null, "", link.hash);
        goMoment(
          index,
          document.documentElement.dataset.motion === "off"
            ? "instant"
            : "smooth",
        );
      },
      { signal: events.signal },
    ),
  );
  moments.forEach((moment, index) =>
    moment.addEventListener(
      "focusin",
      () => {
        if (pin) goMoment(index, "instant");
      },
      { signal: events.signal },
    ),
  );
  const hashNavigate = () => {
    const index = moments.findIndex((m) => `#${m.id}` === location.hash);
    if (index >= 0) goMoment(index, "instant");
  };
  window.addEventListener("popstate", hashNavigate, { signal: events.signal });
  const observer = new IntersectionObserver(
    (entries) => {
      if (pin) return;
      entries.forEach((entry) => {
        if (entry.isIntersecting) setYear(moments.indexOf(entry.target));
      });
    },
    { rootMargin: "-15% 0px -55% 0px" },
  );
  moments.forEach((m) => observer.observe(m));
  return {
    configure,
    hashNavigate,
    refresh: () => ScrollTrigger?.refresh(),
    dispose() {
      destroy();
      events.abort();
      observer.disconnect();
    },
  };
}

export function createChapterNavigation() {
  const sections = [...document.querySelectorAll("[data-chapter]")];
  const links = [...document.querySelectorAll("[data-chapter-link]")];
  const label = document.querySelector(".chapter-position span");
  const progress = document.querySelector(".read-progress i");
  const events = new AbortController();
  let scheduled = false;
  function update() {
    scheduled = false;
    let active;
    for (const section of sections)
      if (section.getBoundingClientRect().top <= innerHeight * 0.35)
        active = section;
    const finale =
      document.querySelector(".finale").getBoundingClientRect().top <=
      innerHeight * 0.35;
    const beyond =
      document.querySelector(".beyond").getBoundingClientRect().top <=
      innerHeight * 0.35;
    const speed =
      document.querySelector(".speed").getBoundingClientRect().top <=
      innerHeight * 0.35;
    label.textContent = finale
      ? "FINALE / SIMPLY LOVELY"
      : beyond
        ? "CONTINUE / KEEP CHASING"
        : (active?.dataset.chapter ??
          (speed ? "SPEED / ENTER THE STORY" : "INTRO / SIMPLY LOVELY"));
    if (beyond) active = null;
    links.forEach((link) =>
      link.dataset.chapterLink === active?.id
        ? link.setAttribute("aria-current", "location")
        : link.removeAttribute("aria-current"),
    );
    const extent = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${extent > 0 ? Math.min(1, Math.max(0, scrollY / extent)) : 0})`;
  }
  const schedule = () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener("scroll", schedule, {
    passive: true,
    signal: events.signal,
  });
  window.addEventListener("resize", schedule, { signal: events.signal });
  update();
  return { update, dispose: () => events.abort() };
}

export function createCursor() {
  const label = document.querySelector(".cursor-label");
  const fine = matchMedia("(pointer: fine) and (min-width: 701px)");
  const events = new AbortController();
  let frame,
    x = 0,
    y = 0;
  document.addEventListener(
    "pointermove",
    (event) => {
      if (!fine.matches || document.documentElement.dataset.motion === "off")
        return;
      const target = event.target.closest("[data-cursor]");
      label.classList.toggle("visible", !!target);
      if (!target) return;
      label.textContent = target.dataset.cursor;
      x = event.clientX + 18;
      y = event.clientY + 18;
      if (!frame)
        frame = requestAnimationFrame(() => {
          label.style.transform = `translate(${x}px,${y}px)`;
          frame = null;
        });
    },
    { passive: true, signal: events.signal },
  );
  document.addEventListener(
    "pointerleave",
    () => label.classList.remove("visible"),
    { signal: events.signal },
  );
  return () => {
    events.abort();
    cancelAnimationFrame(frame);
  };
}
