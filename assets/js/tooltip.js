(function () {
  // Checks if mouse is in bounds of an element.
  // onElement(elem: Element, event: mouseEvent) -> Boolean
  function onElement(elem, event) {
    rect = elem.getBoundingClientRect();
    return (
      rect.left <= event.clientX &&
      rect.right >= event.clientX &&
      rect.top <= event.clientY &&
      rect.bottom >= event.clientY
    );
  }

  const refStack = [];
  const tooltipStack = [];

  // Remove tooltips that are not needed.
  function clearStack(event) {
    while (
      tooltipStack.length &&
      !onElement(tooltipStack.at(-1), event) &&
      !onElement(refStack.at(-1), event)
    ) {
      const tooltip = tooltipStack.pop();
      tooltip.classList.remove('display');

      // Set this to the fade out duration.
      // We cannot set this for longer, since the element would exist still with opacity 0.
      setTimeout(() => tooltip.remove(), 200);

      refStack.pop();
    }
  }

  const body = document.getElementById('body');

  function setupReference(ref) {
    const href = ref.attributes.href.nodeValue;
    if (href.startsWith('#')) {
      const html = document.getElementById(href.slice(1)).innerHTML;

      ref.onmouseover = function () {
        if (refStack.includes(ref)) {
          return;
        }

        const tooltip = document.createElement('div');

        tooltip.classList.add('tooltip');
        tooltip.innerHTML = html;
        tooltip.onmouseleave = clearStack;

        document.body.append(tooltip);

        const bodyRect = body.getBoundingClientRect();
        const refRect = ref.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        const targetLeft =
          window.scrollX +
          refRect.left +
          (refRect.width - tooltipRect.width) / 2;

        tooltip.style.left =
          Math.min(
            Math.max(targetLeft, bodyRect.left),
            bodyRect.right - tooltipRect.width
          ) + 'px';

        tooltip.style.top =
          window.scrollY + refRect.top + refRect.height + 'px';

        tooltip.classList.add('display');

        refStack.push(ref);
        tooltipStack.push(tooltip);

        [...tooltip.getElementsByTagName('a')].forEach(setupReference);
      };

      ref.onmouseleave = clearStack;
    }
  }

  [...document.getElementsByTagName('a')].forEach(setupReference);
})();
