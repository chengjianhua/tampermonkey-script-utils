import onetime from "onetime";

const ANIMATION_NAME = "rgh-selector-observer";
const getListener = (seenMark, selector, callback, signal) => (event) => {
  const target = event.target;
  // The target can match a selector even if the animation actually happened on a ::before pseudo-element, so it needs an explicit exclusion here
  if (target.classList.contains(seenMark) || !target.matches(selector)) {
    return;
  }

  // Removes this specific selector’s animation once it was seen
  target.classList.add(seenMark);

  callback(target, { signal });
};

const registerAnimation = onetime(() => {
  const s = document.createElement("style");
  s.textContent = `@keyframes ${ANIMATION_NAME} {}`;
  document.head.append(s);
});

export function observe(selectors, listener, { signal, callerId }) {
  if (signal?.aborted) {
    return;
  }

  const selector = String(selectors); // Array#toString() creates a comma-separated string
  const seenMark = "rgh-seen-" + callerId;

  registerAnimation();

  const rule = document.createElement("style");

  rule.textContent = `
        :where(${String(selector)}):not(.${seenMark}) {
          animation: 1ms ${ANIMATION_NAME};
        }
      `;
  document.body.prepend(rule);
  signal?.addEventListener("abort", () => {
    rule.remove();
  });
  window.addEventListener(
    "animationstart",
    getListener(seenMark, selector, listener, signal),
    { signal }
  );
}
