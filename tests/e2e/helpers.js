/** Returns the screen point of a value on the playground number line. */
export async function pointForValue(page, value) {
  await page.locator('.dotplot').evaluate((svg) => svg.scrollIntoView({ block: 'center', behavior: 'instant' }));
  return page.locator('.dotplot').evaluate((svg, v) => {
    const vb = svg.viewBox.baseVal;
    const x = 30 + (v / 20) * (vb.width - 60);
    const p = new DOMPoint(x, 165).matrixTransform(svg.getScreenCTM());
    return { x: p.x, y: p.y };
  }, value);
}

export async function dotValues(page) {
  return page.locator('.dotplot .dot-group').evaluateAll((els) =>
    els.map((el) => Number(el.dataset.value)).sort((a, b) => a - b));
}
