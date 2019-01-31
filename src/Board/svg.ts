const head = `
<svg id="root" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle fill="none" cx="12.52" cy="28.55" r="9.26"/>
    <path d="M0 100h100L56 55.39l44-39.89V.11L0 0zm12.52-80.71a9.26 9.26 0 1 1-9.26 9.26 9.26 9.26 0 0 1 9.26-9.26z"/>
</svg>
`;

const tail = `
<svg id="root" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 0H0v100h50l50-50L50 0z"/>
</svg>
`;

export const headSvg = makeDom(head);
export const tailSvg = makeDom(tail);

function makeDom(svgText: string) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = svgText.trim();
  return wrapper.firstChild;
}
