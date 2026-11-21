// draw.js — turns a scene's element list into live SVG, and stamps the
// markers that show what the player has found (or just missed).
//
// The two panels share one coordinate system (viewBox 0 0 640 480) so a
// difference sits at the same x, y on both sides. The right panel is built
// from a copy of the element list with the scene's mutations applied.

import { VIEW_W, VIEW_H } from './scenes.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

// Deep-copy the plain element data so mutations never touch the source.
function cloneElements(elements) {
  return elements.map((node) => {
    const copy = { tag: node.tag, attrs: { ...node.attrs } };
    if (node.text !== undefined) copy.text = node.text;
    if (node.children) copy.children = cloneElements(node.children);
    return copy;
  });
}

// Find an element by id anywhere in the (possibly nested) list.
function findById(elements, id) {
  for (const node of elements) {
    if (node.attrs && node.attrs.id === id) return node;
    if (node.children) {
      const hit = findById(node.children, id);
      if (hit) return hit;
    }
  }
  return null;
}

// Apply one difference's mutation to a copied element list.
export function applyMutation(elements, difference) {
  const m = difference.mutate;
  if (m.remove) {
    const target = findById(elements, m.target);
    if (target) target.attrs.display = 'none';
    return;
  }
  if (m.set) {
    const target = findById(elements, m.target);
    if (target) Object.assign(target.attrs, m.set);
    return;
  }
  if (m.move) {
    const target = findById(elements, m.target);
    if (target) {
      for (const [key, delta] of Object.entries(m.move)) {
        const attr = key === 'dx' ? 'cx' : key === 'dy' ? 'cy' : key;
        if (target.attrs[attr] !== undefined) {
          target.attrs[attr] = String(Number(target.attrs[attr]) + delta);
        }
      }
    }
    return;
  }
  if (m.add) elements.push(m.add);
}

// Build one SVG element (recursively) from its data node.
function buildNode(node) {
  const el = document.createElementNS(SVG_NS, node.tag);
  for (const [key, value] of Object.entries(node.attrs)) {
    el.setAttribute(key, String(value));
  }
  if (node.text !== undefined) el.textContent = node.text;
  for (const child of node.children || []) el.appendChild(buildNode(child));
  return el;
}

// Paint a scene into an <svg> element. side is 'left' (as listed) or
// 'right' (with every difference's mutation applied).
export function paintScene(svg, scene, side) {
  svg.setAttribute('viewBox', `0 0 ${VIEW_W} ${VIEW_H}`);
  svg.replaceChildren();
  const elements = cloneElements(scene.elements);
  if (side === 'right') {
    for (const difference of scene.differences) applyMutation(elements, difference);
  }
  for (const node of elements) svg.appendChild(buildNode(node));
  const markers = document.createElementNS(SVG_NS, 'g');
  markers.setAttribute('class', 'markers');
  svg.appendChild(markers);
  return markers;
}

// A green ring + tick where a difference was found.
export function stampFound(markers, difference) {
  const g = document.createElementNS(SVG_NS, 'g');
  g.setAttribute('class', 'mark-found');
  const ring = document.createElementNS(SVG_NS, 'circle');
  ring.setAttribute('cx', difference.x);
  ring.setAttribute('cy', difference.y);
  ring.setAttribute('r', difference.r + 6);
  ring.setAttribute('fill', 'rgba(46, 196, 182, 0.18)');
  ring.setAttribute('stroke', '#2ec4b6');
  ring.setAttribute('stroke-width', '4');
  const tick = document.createElementNS(SVG_NS, 'path');
  const s = difference.r * 0.45;
  tick.setAttribute(
    'd',
    `M ${difference.x - s} ${difference.y} l ${s * 0.6} ${s * 0.7} l ${s * 1.1} ${-s * 1.1}`,
  );
  tick.setAttribute('stroke', '#2ec4b6');
  tick.setAttribute('stroke-width', '5');
  tick.setAttribute('fill', 'none');
  tick.setAttribute('stroke-linecap', 'round');
  tick.setAttribute('stroke-linejoin', 'round');
  g.appendChild(ring);
  g.appendChild(tick);
  markers.appendChild(g);
}

// A red cross where the player clicked and found nothing, fading away.
export function stampMiss(markers, x, y) {
  const g = document.createElementNS(SVG_NS, 'g');
  g.setAttribute('class', 'mark-miss');
  const a = 11;
  for (const [dx, dy] of [[-a, -a, a, a], [-a, a, a, -a]]) {
    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', x + dx);
    line.setAttribute('y1', y + dy);
    line.setAttribute('x2', x - dx);
    line.setAttribute('y2', y - dy);
    line.setAttribute('stroke', '#ff5a4e');
    line.setAttribute('stroke-width', '5');
    line.setAttribute('stroke-linecap', 'round');
    g.appendChild(line);
  }
  markers.appendChild(g);
  window.setTimeout(() => g.remove(), 700);
}

// A pulsing ring at a difference's spot, used by the hint button.
export function stampHint(markers, difference) {
  const ring = document.createElementNS(SVG_NS, 'circle');
  ring.setAttribute('class', 'mark-hint');
  ring.setAttribute('cx', difference.x);
  ring.setAttribute('cy', difference.y);
  ring.setAttribute('r', difference.r + 8);
  ring.setAttribute('fill', 'none');
  ring.setAttribute('stroke', '#ffd166');
  ring.setAttribute('stroke-width', '4');
  markers.appendChild(ring);
  window.setTimeout(() => ring.remove(), 2200);
}

// Translate a mouse event on an <svg> into viewBox coordinates.
export function eventToViewBox(svg, event) {
  const rect = svg.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * VIEW_W,
    y: ((event.clientY - rect.top) / rect.height) * VIEW_H,
  };
}
