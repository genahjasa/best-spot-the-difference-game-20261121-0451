// scenes.js — the three original scenes of Twin Lanterns.
//
// Every picture is drawn from data, not from an image file: each scene is a
// list of SVG elements plus the seven differences that hide in it. The left
// panel draws the elements as listed; the right panel draws them after the
// differences' mutations are applied. A difference knows where it lives
// (x, y, r in the 640x480 viewBox) so a click on either panel can find it.
//
// Element shape: { tag, attrs, text?, children? }
// Difference shape:
//   { id, x, y, r, label, mutate }
//   mutate is one of:
//     { target, set: { attr: value, ... } }   recolour / retext a part
//     { target, remove: true }                take a part away
//     { target, move: { dx, dy } }            shift a part
//     { add: <element> }                      put an extra part in

function el(tag, attrs, text, children) {
  const node = { tag, attrs: attrs || {} };
  if (text !== undefined) node.text = text;
  if (children) node.children = children;
  return node;
}

function stop(offset, color) {
  return el('stop', { offset, 'stop-color': color });
}

// ---------------------------------------------------------------- scene 1
// Lantern Night Market: a festival stall under a dusk sky.

function sceneMarket() {
  const elements = [
    el('defs', {}, undefined, [
      el('linearGradient', { id: 'sky1', x1: '0', y1: '0', x2: '0', y2: '1' }, undefined, [
        stop('0%', '#241b3a'), stop('55%', '#6b3a6e'), stop('100%', '#c65f5a'),
      ]),
    ]),
    el('rect', { x: '0', y: '0', width: '640', height: '480', fill: 'url(#sky1)' }),
    // stars
    el('circle', { id: 'star1', cx: '60', cy: '50', r: '3', fill: '#fff8d6' }),
    el('circle', { id: 'star2', cx: '180', cy: '36', r: '2.5', fill: '#fff8d6' }),
    el('circle', { id: 'star3', cx: '300', cy: '70', r: '2', fill: '#fff8d6' }),
    el('circle', { id: 'star4', cx: '120', cy: '96', r: '3', fill: '#fff8d6' }),
    el('circle', { id: 'star5', cx: '430', cy: '40', r: '2', fill: '#fff8d6' }),
    el('path', { id: 'spark', d: 'M470 84 l0 -10 M465 79 l10 0', stroke: '#fff8d6', 'stroke-width': '2' }),
    // moon
    el('circle', { id: 'moon', cx: '540', cy: '64', r: '32', fill: '#ffe9a8' }),
    el('circle', { id: 'crater1', cx: '528', cy: '56', r: '5', fill: '#f0c96a' }),
    // distant rooftops
    el('polygon', { points: '0,340 90,272 180,340', fill: '#3a2b5c' }),
    el('polygon', { points: '150,340 265,248 380,340', fill: '#322452' }),
    el('polygon', { points: '400,340 520,276 640,340', fill: '#3a2b5c' }),
    el('rect', { x: '238', y: '292', width: '12', height: '14', fill: '#ffd166' }),
    el('rect', { x: '292', y: '292', width: '12', height: '14', fill: '#ffd166' }),
    // ground
    el('rect', { x: '0', y: '340', width: '640', height: '140', fill: '#4a2f4d' }),
    // stall posts and counter
    el('rect', { x: '82', y: '252', width: '12', height: '128', fill: '#5d3a1a' }),
    el('rect', { x: '546', y: '252', width: '12', height: '128', fill: '#5d3a1a' }),
    el('rect', { x: '76', y: '368', width: '488', height: '86', fill: '#7a4a2b' }),
    el('rect', { x: '76', y: '368', width: '488', height: '10', fill: '#8d5a35' }),
    // striped awning
    el('rect', { x: '66', y: '238', width: '508', height: '34', fill: '#c0392b' }),
    el('rect', { id: 'stripe1', x: '66', y: '238', width: '64', height: '34', fill: '#f5e6c8' }),
    el('rect', { id: 'stripe2', x: '194', y: '238', width: '64', height: '34', fill: '#f5e6c8' }),
    el('rect', { id: 'stripe3', x: '322', y: '238', width: '64', height: '34', fill: '#f5e6c8' }),
    el('rect', { id: 'stripe4', x: '450', y: '238', width: '64', height: '34', fill: '#f5e6c8' }),
    // hanging lanterns (string, body, cap, tassel), each grouped so a
    // difference can take a whole lantern away at once
    el('g', { id: 'lan1' }, undefined, [
      el('line', { x1: '180', y1: '272', x2: '180', y2: '296', stroke: '#3a2b5c', 'stroke-width': '2' }),
      el('circle', { cx: '180', cy: '316', r: '21', fill: '#ff5a4e' }),
      el('rect', { x: '174', y: '292', width: '12', height: '6', fill: '#ffd166' }),
      el('line', { x1: '180', y1: '337', x2: '180', y2: '352', stroke: '#ffd166', 'stroke-width': '3' }),
    ]),
    el('g', { id: 'lan2' }, undefined, [
      el('line', { x1: '320', y1: '272', x2: '320', y2: '296', stroke: '#3a2b5c', 'stroke-width': '2' }),
      el('circle', { cx: '320', cy: '316', r: '21', fill: '#ffb347' }),
      el('rect', { x: '314', y: '292', width: '12', height: '6', fill: '#ffd166' }),
      el('line', { x1: '320', y1: '337', x2: '320', y2: '352', stroke: '#ffd166', 'stroke-width': '3' }),
    ]),
    el('g', { id: 'lan3' }, undefined, [
      el('line', { x1: '460', y1: '272', x2: '460', y2: '296', stroke: '#3a2b5c', 'stroke-width': '2' }),
      el('circle', { cx: '460', cy: '316', r: '21', fill: '#ff5a4e' }),
      el('rect', { x: '454', y: '292', width: '12', height: '6', fill: '#ffd166' }),
      el('line', { x1: '460', y1: '337', x2: '460', y2: '352', stroke: '#ffd166', 'stroke-width': '3' }),
    ]),
    // sign board
    el('rect', { x: '246', y: '272', width: '148', height: '30', rx: '4', fill: '#f5e6c8' }),
    el('text', { id: 'signtext', x: '320', y: '293', 'text-anchor': 'middle', 'font-size': '19', 'font-family': 'Georgia, serif', 'font-weight': 'bold', fill: '#7a2e2e' }, 'LANTERNS'),
    // sweet jar on the counter
    el('rect', { x: '128', y: '330', width: '46', height: '38', rx: '6', fill: '#cfe8ef', opacity: '0.9' }),
    el('circle', { id: 'sweet1', cx: '141', cy: '352', r: '7', fill: '#ff5a4e' }),
    el('circle', { id: 'sweet2', cx: '157', cy: '346', r: '7', fill: '#2ec4b6' }),
    el('circle', { id: 'sweet3', cx: '164', cy: '359', r: '7', fill: '#ffb347' }),
    // paper fan
    el('path', { id: 'fan', d: 'M500 368 A26 26 0 0 1 552 368 L526 368 Z', fill: '#e76f51' }),
    el('line', { x1: '526', y1: '368', x2: '512', y2: '346', stroke: '#7a2e2e', 'stroke-width': '1.5' }),
    el('line', { x1: '526', y1: '368', x2: '526', y2: '342', stroke: '#7a2e2e', 'stroke-width': '1.5' }),
    el('line', { x1: '526', y1: '368', x2: '540', y2: '346', stroke: '#7a2e2e', 'stroke-width': '1.5' }),
    // the stall cat, asleep on the counter
    el('ellipse', { id: 'catbody', cx: '420', cy: '356', rx: '26', ry: '14', fill: '#3d3d5c' }),
    el('circle', { id: 'cathead', cx: '444', cy: '344', r: '12', fill: '#3d3d5c' }),
    el('polygon', { points: '436,334 440,322 446,333', fill: '#3d3d5c' }),
    el('polygon', { points: '448,333 454,322 456,334', fill: '#3d3d5c' }),
    el('path', { id: 'cattail', d: 'M396 356 q-16 -2 -14 -18', stroke: '#3d3d5c', 'stroke-width': '6', fill: 'none', 'stroke-linecap': 'round' }),
    // string lights along the awning
    el('path', { d: 'M90 276 q115 26 230 0 q115 26 220 0', stroke: '#3a2b5c', 'stroke-width': '1.5', fill: 'none' }),
    el('circle', { cx: '150', cy: '284', r: '4', fill: '#ffd166' }),
    el('circle', { cx: '260', cy: '280', r: '4', fill: '#ff5a4e' }),
    el('circle', { cx: '380', cy: '280', r: '4', fill: '#2ec4b6' }),
    el('circle', { cx: '490', cy: '284', r: '4', fill: '#ffd166' }),
  ];

  const differences = [
    { id: 'moon-crater', x: 552, y: 56, r: 12, label: 'A second crater on the moon',
      mutate: { add: el('circle', { cx: '554', cy: '74', r: '5', fill: '#f0c96a' }) } },
    { id: 'middle-lantern', x: 320, y: 316, r: 26, label: 'The amber lantern is gone',
      mutate: { target: 'lan2', remove: true } },
    { id: 'cat-tail', x: 388, y: 344, r: 16, label: 'The cat lost its tail',
      mutate: { target: 'cattail', remove: true } },
    { id: 'star', x: 120, y: 96, r: 12, label: 'A star went out',
      mutate: { target: 'star4', remove: true } },
    { id: 'awning-stripe', x: 354, y: 255, r: 18, label: 'An awning stripe turned teal',
      mutate: { target: 'stripe3', set: { fill: '#2ec4b6' } } },
    { id: 'sweet', x: 157, y: 346, r: 12, label: 'A sweet vanished from the jar',
      mutate: { target: 'sweet2', remove: true } },
    { id: 'fan-colour', x: 526, y: 352, r: 20, label: 'The paper fan changed colour',
      mutate: { target: 'fan', set: { fill: '#7fb069' } } },
  ];
  return { name: 'Lantern Night Market', sub: 'A festival stall under a dusk sky', elements, differences };
}

// ---------------------------------------------------------------- scene 2
// Koi Garden Pond: a quiet garden pond at midday.

function scenePond() {
  const elements = [
    el('defs', {}, undefined, [
      el('linearGradient', { id: 'sky2', x1: '0', y1: '0', x2: '0', y2: '1' }, undefined, [
        stop('0%', '#bfe3f0'), stop('100%', '#e8f5d8'),
      ]),
    ]),
    el('rect', { x: '0', y: '0', width: '640', height: '480', fill: 'url(#sky2)' }),
    el('circle', { id: 'sun', cx: '92', cy: '70', r: '30', fill: '#ffd166' }),
    el('ellipse', { id: 'cloud1', cx: '300', cy: '58', rx: '52', ry: '18', fill: '#ffffff', opacity: '0.9' }),
    el('ellipse', { id: 'cloud2', cx: '478', cy: '92', rx: '44', ry: '15', fill: '#ffffff', opacity: '0.9' }),
    // hills and grass
    el('ellipse', { cx: '140', cy: '330', rx: '220', ry: '70', fill: '#7fb069' }),
    el('ellipse', { cx: '540', cy: '340', rx: '200', ry: '64', fill: '#6a9e58' }),
    // bamboo at the left
    el('rect', { id: 'bamboo1', x: '34', y: '120', width: '10', height: '210', fill: '#4e9b47' }),
    el('rect', { id: 'bamboo2', x: '56', y: '150', width: '10', height: '180', fill: '#57ab4e' }),
    el('g', { id: 'bamboo3' }, undefined, [
      el('rect', { x: '78', y: '100', width: '10', height: '230', fill: '#4e9b47' }),
      el('line', { x1: '78', y1: '170', x2: '88', y2: '170', stroke: '#2f6b2a', 'stroke-width': '2' }),
    ]),
    el('line', { x1: '34', y1: '190', x2: '44', y2: '190', stroke: '#2f6b2a', 'stroke-width': '2' }),
    el('line', { x1: '56', y1: '220', x2: '66', y2: '220', stroke: '#2f6b2a', 'stroke-width': '2' }),
    // stone lantern on the right bank
    el('rect', { x: '548', y: '268', width: '26', height: '10', fill: '#8d8d8d' }),
    el('rect', { x: '552', y: '238', width: '18', height: '30', fill: '#a8a8a8' }),
    el('rect', { id: 'lanternLight', x: '556', y: '244', width: '10', height: '14', fill: '#ffd166' }),
    el('polygon', { points: '544,238 578,238 561,222', fill: '#8d8d8d' }),
    el('rect', { x: '556', y: '278', width: '10', height: '34', fill: '#a8a8a8' }),
    // the pond
    el('ellipse', { cx: '320', cy: '372', rx: '282', ry: '96', fill: '#3d8fa3' }),
    el('ellipse', { cx: '320', cy: '372', rx: '240', ry: '76', fill: '#4aa3b8' }),
    el('path', { id: 'ripple1', d: 'M180 360 q30 10 60 0', stroke: '#bfe3f0', 'stroke-width': '2', fill: 'none' }),
    el('path', { id: 'ripple2', d: 'M400 396 q30 10 60 0', stroke: '#bfe3f0', 'stroke-width': '2', fill: 'none' }),
    // lily pads and flowers
    el('ellipse', { id: 'pad1', cx: '180', cy: '336', rx: '42', ry: '14', fill: '#2e7d32' }),
    el('g', { id: 'flower1' }, undefined, [
      el('circle', { cx: '180', cy: '330', r: '8', fill: '#f48fb1' }),
      el('circle', { cx: '180', cy: '330', r: '3', fill: '#ffd166' }),
    ]),
    el('ellipse', { id: 'pad2', cx: '382', cy: '392', rx: '46', ry: '15', fill: '#2e7d32' }),
    el('ellipse', { id: 'pad3', cx: '486', cy: '330', rx: '38', ry: '13', fill: '#357a38' }),
    el('circle', { id: 'flower2', cx: '486', cy: '324', r: '7', fill: '#f48fb1' }),
    // koi fish (body, tail, fin)
    el('ellipse', { id: 'koi1', cx: '246', cy: '356', rx: '26', ry: '10', fill: '#ff8c42' }),
    el('polygon', { points: '220,356 202,346 202,366', fill: '#ff8c42' }),
    el('circle', { cx: '262', cy: '353', r: '2.5', fill: '#1d3557' }),
    el('ellipse', { id: 'koi2', cx: '402', cy: '338', rx: '26', ry: '10', fill: '#ff8c42' }),
    el('polygon', { points: '428,338 446,328 446,348', fill: '#ff8c42' }),
    el('circle', { cx: '386', cy: '335', r: '2.5', fill: '#1d3557' }),
    el('ellipse', { id: 'koi3', cx: '330', cy: '414', rx: '24', ry: '9', fill: '#f5f0e6' }),
    el('polygon', { points: '306,414 290,405 290,423', fill: '#f5f0e6' }),
    el('circle', { cx: '346', cy: '411', r: '2.5', fill: '#1d3557' }),
    // the frog on pad2
    el('g', { id: 'frog' }, undefined, [
      el('circle', { cx: '382', cy: '382', r: '11', fill: '#57ab4e' }),
      el('circle', { cx: '377', cy: '373', r: '4', fill: '#57ab4e' }),
      el('circle', { cx: '387', cy: '373', r: '4', fill: '#57ab4e' }),
      el('circle', { cx: '377', cy: '373', r: '1.5', fill: '#1d3557' }),
      el('circle', { cx: '387', cy: '373', r: '1.5', fill: '#1d3557' }),
    ]),
    // pebbles on the bank
    el('circle', { id: 'pebble1', cx: '120', cy: '300', r: '6', fill: '#9c9c9c' }),
    el('circle', { cx: '140', cy: '308', r: '5', fill: '#8d8d8d' }),
    el('circle', { cx: '520', cy: '306', r: '6', fill: '#9c9c9c' }),
  ];

  const differences = [
    { id: 'koi-colour', x: 402, y: 338, r: 26, label: 'A koi turned white',
      mutate: { target: 'koi2', set: { fill: '#f5f0e6' } } },
    { id: 'frog', x: 382, y: 380, r: 18, label: 'The frog hopped away',
      mutate: { target: 'frog', remove: true } },
    { id: 'lily-flower', x: 180, y: 330, r: 14, label: 'A lily flower is gone',
      mutate: { target: 'flower1', remove: true } },
    { id: 'cloud', x: 478, y: 92, r: 24, label: 'A cloud drifted off',
      mutate: { target: 'cloud2', remove: true } },
    { id: 'lantern-light', x: 561, y: 251, r: 14, label: 'The stone lantern went dark',
      mutate: { target: 'lanternLight', set: { fill: '#9db8c4' } } },
    { id: 'bamboo', x: 83, y: 200, r: 18, label: 'A bamboo stalk is missing',
      mutate: { target: 'bamboo3', remove: true } },
    { id: 'ripple', x: 430, y: 396, r: 16, label: 'A ripple faded from the pond',
      mutate: { target: 'ripple2', remove: true } },
  ];
  return { name: 'Koi Garden Pond', sub: 'A quiet garden pond at midday', elements, differences };
}

// ---------------------------------------------------------------- scene 3
// Harbour at Dusk: boats, a lighthouse and gulls over a setting sun.

function sceneHarbour() {
  const elements = [
    el('defs', {}, undefined, [
      el('linearGradient', { id: 'sky3', x1: '0', y1: '0', x2: '0', y2: '1' }, undefined, [
        stop('0%', '#3b2d5c'), stop('55%', '#c65f5a'), stop('100%', '#ff9f43'),
      ]),
    ]),
    el('rect', { x: '0', y: '0', width: '640', height: '480', fill: 'url(#sky3)' }),
    // setting sun and its reflection
    el('circle', { id: 'sun', cx: '320', cy: '292', r: '40', fill: '#ff9f43' }),
    el('rect', { x: '300', y: '330', width: '40', height: '6', fill: '#ffb347', opacity: '0.8' }),
    el('rect', { x: '288', y: '352', width: '64', height: '5', fill: '#ffb347', opacity: '0.6' }),
    // gulls
    el('path', { id: 'gull1', d: 'M196 118 q8 -8 16 0 q8 -8 16 0', stroke: '#2b2b3a', 'stroke-width': '2.5', fill: 'none' }),
    el('path', { id: 'gull2', d: 'M272 88 q8 -8 16 0 q8 -8 16 0', stroke: '#2b2b3a', 'stroke-width': '2.5', fill: 'none' }),
    el('path', { id: 'gull3', d: 'M424 138 q8 -8 16 0 q8 -8 16 0', stroke: '#2b2b3a', 'stroke-width': '2.5', fill: 'none' }),
    // lighthouse
    el('polygon', { id: 'beam', points: '118,150 210,120 210,180', fill: '#ffe9a8', opacity: '0.55' }),
    el('rect', { x: '96', y: '150', width: '44', height: '150', fill: '#f4f1de' }),
    el('rect', { id: 'stripeL', x: '96', y: '190', width: '44', height: '26', fill: '#e63946' }),
    el('rect', { x: '96', y: '246', width: '44', height: '26', fill: '#e63946' }),
    el('rect', { x: '100', y: '120', width: '36', height: '30', fill: '#2b2b3a' }),
    el('rect', { x: '106', y: '126', width: '24', height: '18', fill: '#ffd166' }),
    el('polygon', { points: '94,120 142,120 118,102', fill: '#e63946' }),
    el('rect', { x: '88', y: '300', width: '60', height: '14', fill: '#5d5d6e' }),
    // sea
    el('rect', { x: '0', y: '314', width: '640', height: '166', fill: '#1f4e79' }),
    el('path', { d: 'M0 340 q40 -12 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0', stroke: '#3d8fa3', 'stroke-width': '2.5', fill: 'none' }),
    el('path', { d: 'M0 420 q40 -10 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0', stroke: '#2a6b8a', 'stroke-width': '2.5', fill: 'none' }),
    // boat one (red sail)
    el('polygon', { id: 'sail1', points: '300,268 300,338 348,338', fill: '#e63946' }),
    el('polygon', { points: '296,272 296,338 258,338', fill: '#f4f1de' }),
    el('line', { x1: '300', y1: '262', x2: '300', y2: '340', stroke: '#5d3a1a', 'stroke-width': '3' }),
    el('polygon', { points: '246,338 360,338 340,362 266,362', fill: '#7a4a2b' }),
    // boat two (cream sail)
    el('polygon', { id: 'sail2', points: '478,300 478,360 516,360', fill: '#f4f1de' }),
    el('polygon', { points: '474,304 474,360 444,360', fill: '#ffd166' }),
    el('line', { x1: '478', y1: '294', x2: '478', y2: '362', stroke: '#5d3a1a', 'stroke-width': '3' }),
    el('polygon', { points: '436,360 528,360 512,380 452,380', fill: '#5d3a1a' }),
    // buoy
    el('g', { id: 'buoy' }, undefined, [
      el('circle', { cx: '212', cy: '420', r: '13', fill: '#ff6b35' }),
      el('rect', { x: '199', y: '416', width: '26', height: '7', fill: '#f4f1de' }),
      el('line', { x1: '212', y1: '407', x2: '212', y2: '400', stroke: '#2b2b3a', 'stroke-width': '2' }),
    ]),
    // dock and crates, bottom left
    el('rect', { x: '0', y: '440', width: '180', height: '40', fill: '#6b4a2f' }),
    el('rect', { id: 'crate1', x: '24', y: '408', width: '34', height: '32', fill: '#a8763e' }),
    el('rect', { id: 'crate2', x: '62', y: '408', width: '34', height: '32', fill: '#8d5a35' }),
    el('rect', { id: 'crate3', x: '43', y: '376', width: '34', height: '32', fill: '#a8763e' }),
    el('line', { x1: '24', y1: '424', x2: '58', y2: '424', stroke: '#5d3a1a', 'stroke-width': '2' }),
    el('line', { x1: '62', y1: '424', x2: '96', y2: '424', stroke: '#5d3a1a', 'stroke-width': '2' }),
    // rope coil on the dock
    el('circle', { id: 'rope', cx: '140', cy: '428', r: '12', fill: 'none', stroke: '#d9c9a3', 'stroke-width': '4' }),
    el('circle', { cx: '140', cy: '428', r: '6', fill: 'none', stroke: '#d9c9a3', 'stroke-width': '3' }),
  ];

  const differences = [
    { id: 'lighthouse-stripe', x: 118, y: 203, r: 18, label: 'A lighthouse stripe turned teal',
      mutate: { target: 'stripeL', set: { fill: '#2a9d8f' } } },
    { id: 'gull', x: 288, y: 88, r: 16, label: 'A gull flew away',
      mutate: { target: 'gull2', remove: true } },
    { id: 'sail-colour', x: 316, y: 306, r: 22, label: 'The red sail turned blue',
      mutate: { target: 'sail1', set: { fill: '#457b9d' } } },
    { id: 'buoy', x: 212, y: 418, r: 18, label: 'The buoy is gone',
      mutate: { target: 'buoy', remove: true } },
    { id: 'crate', x: 60, y: 392, r: 18, label: 'A crate is missing from the stack',
      mutate: { target: 'crate3', remove: true } },
    { id: 'sun-height', x: 320, y: 292, r: 26, label: 'The sun sank lower',
      mutate: { target: 'sun', move: { dx: 0, dy: 16 } } },
    { id: 'beam', x: 160, y: 150, r: 22, label: 'The lighthouse beam went dark',
      mutate: { target: 'beam', remove: true } },
  ];
  return { name: 'Harbour at Dusk', sub: 'Boats, a lighthouse and gulls', elements, differences };
}

export const SCENES = [sceneMarket, scenePond, sceneHarbour];
export const VIEW_W = 640;
export const VIEW_H = 480;
