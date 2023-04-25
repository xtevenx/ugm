(function () {
  // Checks if mouse is in bounds of an element.
  // onElement(elem: Element, event: mouseEvent) -> Boolean
  function onElement(elem, event) {
    rect = elem.getBoundingClientRect();
    return (
      Math.floor(rect.left) <= event.clientX &&
      Math.floor(rect.right) > event.clientX &&
      Math.floor(rect.top) <= event.clientY &&
      Math.floor(rect.bottom) > event.clientY
    );
  }

  const refStack = [];
  const tooltipStack = [];

  // Remove tooltips that are not needed.
  // clearStack(event: MouseEvent) -> undefined
  function clearStack(event) {
    while (
      tooltipStack.length &&
      !onElement(tooltipStack.at(-1), event) &&
      !onElement(refStack.at(-1), event)
    ) {
      const tooltip = tooltipStack.pop();
      tooltip.classList.remove('display');

      // Set this to the fade out duration.
      // We cannot set this for longer, since the element would exist still
      // with opacity 0, and that may screw things over.
      setTimeout(() => tooltip.remove(), 200);

      refStack.pop();
    }
  }

  const body = document.getElementById('body');

  // Display a tooltip box containing `html`, positioned relative to `ref`.
  // displayTooltip(ref: Element, html: String) -> undefined
  function displayTooltip(ref, html) {
    if (refStack.includes(ref)) {
      return;
    }

    const tooltip = document.createElement('div');

    tooltip.addEventListener('mouseleave', clearStack);
    tooltip.classList.add('tooltip');
    tooltip.innerHTML = html;

    document.body.append(tooltip);

    const bodyRect = body.getBoundingClientRect();
    const refRect = ref.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    const targetLeft =
      window.scrollX + refRect.left + (refRect.width - tooltipRect.width) / 2;

    tooltip.style.left =
      Math.min(
        Math.max(targetLeft, bodyRect.left),
        bodyRect.right - tooltipRect.width
      ) + 'px';

    tooltip.style.top = window.scrollY + refRect.top + refRect.height + 'px';

    tooltip.classList.add('display');

    refStack.push(ref);
    tooltipStack.push(tooltip);

    [...tooltip.getElementsByTagName('a')].forEach(setupReference);
  }

  let tooltipTimeout = null;

  // Setup tooltip callback handlers on an element.
  // setupReference(ref: Element) -> undefined
  function setupReference(ref) {
    const href = ref.attributes.href.nodeValue;
    if (href.startsWith('#')) {
      ref.addEventListener('mouseleave', clearStack);

      // This setTimeout only works if 'mouseleave' is always triggered before
      // 'mouseenter', which seems to be the case on Firefox. Otherwise, there
      // could be a tooltipTimeout that is overwritten, hence not cancelled.
      const html = document.getElementById(href.slice(1)).innerHTML;
      ref.addEventListener(
        'mouseenter',
        () => (tooltipTimeout = setTimeout(displayTooltip, 200, ref, html))
      );
      ref.addEventListener(
        'mouseleave',
        () => (tooltipTimeout = clearTimeout(tooltipTimeout))
      );
    }
  }

  [...document.getElementsByTagName('a')].forEach(setupReference);
})();
