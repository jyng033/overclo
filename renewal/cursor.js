(() => {
  const isDesktopPointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const cursor = document.querySelector(".custom-cursor");

  if (!isDesktopPointer || !cursor || window.__overcloCursorStretch__) return;
  window.__overcloCursorStretch__ = true;

  const config = {
    offsetX: 18,
    offsetY: 14,
    clickScale: 0.82
  };

  let x = innerWidth / 2;
  let y = innerHeight / 2;
  let clickScale = 1;
  let isVisible = false;

  const show = () => {
    isVisible = true;
    cursor.style.opacity = "1";
  };

  const hide = () => {
    isVisible = false;
    cursor.style.opacity = "0";
    cursor.style.transform = "translate3d(-9999px, -9999px, 0) scale(1)";
  };

  const moveTo = (clientX, clientY) => {
    x = clientX;
    y = clientY;
  };

  const onPointerMove = (event) => {
    show();
    moveTo(event.clientX, event.clientY);
  };

  const onDocumentMouseOut = (event) => {
    if (!event.relatedTarget && !event.toElement) {
      hide();
    }
  };

  const onPointerDown = (event) => {
    moveTo(event.clientX, event.clientY);
    clickScale = config.clickScale;
  };

  const onPointerUp = () => {
    clickScale = 1;
  };

  const render = () => {
    if (isVisible) {
      cursor.style.transform =
        `translate3d(${x + config.offsetX}px, ${y + config.offsetY}px, 0) scale(${clickScale})`;
    }

    requestAnimationFrame(render);
  };

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerdown", onPointerDown, { passive: true });
  window.addEventListener("pointerup", onPointerUp, { passive: true });
  document.documentElement.addEventListener("mouseenter", show, { passive: true });
  document.documentElement.addEventListener("mouseleave", hide, { passive: true });
  document.addEventListener("mouseout", onDocumentMouseOut, { passive: true });
  window.addEventListener("blur", hide, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) hide();
  }, { passive: true });
  window.addEventListener("pageshow", show, { passive: true });

  requestAnimationFrame(render);
})();
