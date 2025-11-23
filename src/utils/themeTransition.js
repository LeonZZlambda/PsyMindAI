export async function animateThemeTransition(e, callback, reducedMotion) {
  const isAppearanceTransition = 
    document.startViewTransition && 
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    !reducedMotion;

  if (!isAppearanceTransition) {
    callback();
    return;
  }

  const x = e?.clientX ?? window.innerWidth / 2;
  const y = e?.clientY ?? window.innerHeight / 2;

  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  const transition = document.startViewTransition(callback);
  await transition.ready;

  document.documentElement.animate(
    {
      clipPath: [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ],
    },
    {
      duration: 500,
      easing: "ease-in-out",
      pseudoElement: "::view-transition-new(root)",
    }
  );
}
