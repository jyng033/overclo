(() => {
  const isDesktopPointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const cursor = document.querySelector(".custom-cursor");

  if (!isDesktopPointer || !cursor || window.__overcloCursorStretch__) return;
  window.__overcloCursorStretch__ = true;

  const config = {
    stretchK: 0.018,
    maxStretch: 1.55,
    relax: 0.18,
    clickScale: 0.62
  };

  let x = innerWidth / 2;
  let y = innerHeight / 2;
  let prevX = x;
  let prevY = y;
  let angle = 0;
  let stretchX = 1;
  let stretchY = 1;
  let clickScale = 1;

  const show = () => {
    cursor.style.opacity = "1";
  };

  const hide = () => {
    cursor.style.opacity = "0";
  };

  const moveTo = (clientX, clientY) => {
    x = clientX;
    y = clientY;
  };

  const onPointerMove = (event) => {
    show();
    moveTo(event.clientX, event.clientY);
  };

  const onPointerDown = (event) => {
    moveTo(event.clientX, event.clientY);
    clickScale = config.clickScale;
  };

  const onPointerUp = () => {
    clickScale = 1;
  };

  const render = () => {
    const velocityX = x - prevX;
    const velocityY = y - prevY;
    const speed = Math.hypot(velocityX, velocityY);

    if (speed > 0.001) {
      angle = Math.atan2(velocityY, velocityX);
    }

    const targetStretch = Math.min(1 + speed * config.stretchK, config.maxStretch);

    if (speed > 0.1) {
      stretchX += (targetStretch - stretchX) * 0.5;
    } else {
      stretchX += (1 - stretchX) * config.relax;
    }

    stretchY = 1 / stretchX;
    cursor.style.transform =
      `translate3d(${x}px, ${y}px, 0) rotate(${angle}rad) scale(${stretchX * clickScale}, ${stretchY * clickScale})`;

    prevX = x;
    prevY = y;
    requestAnimationFrame(render);
  };

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerdown", onPointerDown, { passive: true });
  window.addEventListener("pointerup", onPointerUp, { passive: true });
  window.addEventListener("mouseenter", show, { passive: true });
  window.addEventListener("mouseleave", hide, { passive: true });
  window.addEventListener("pageshow", show, { passive: true });

  show();
  requestAnimationFrame(render);
})();
