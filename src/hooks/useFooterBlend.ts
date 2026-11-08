import { useEffect, useState, type RefObject } from 'react';

export function useFooterBlend(header: RefObject<HTMLElement | null>) {
  const [blendFooter, setBlendFooter] = useState(false);

  useEffect(() => {
    const element = header.current;
    const footer = document.querySelector('footer');
    const ridge = footer?.querySelector('[data-ridge-divider]');
    if (!element || !footer || !ridge) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const bounds = ridge.getBoundingClientRect();
      // Reveal the ridge, while keeping footer text behind a solid surface.
      setBlendFooter(
        bounds.top <= element.offsetHeight &&
          bounds.bottom >= element.offsetHeight
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const resize = new ResizeObserver(schedule);
    resize.observe(element);
    resize.observe(footer);
    resize.observe(ridge);
    if (footer.parentElement) resize.observe(footer.parentElement);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [header]);

  return blendFooter;
}
