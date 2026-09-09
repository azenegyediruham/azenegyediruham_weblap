#!/usr/bin/env node
/**
 * Parametrikus, valós méretű póló GLB generátor (proof-of-concept 3D modell).
 *
 * - 1 unit = 1 m, Y felfelé, az eleje +Z felé néz. Magasság ~0,72 m.
 * - Külön mesh-ek: Torso, SleeveL (viselő bal = +X), SleeveR, Collar.
 * - cm-KALIBRÁLT UV: a textúra-chart szélessége = kerület cm-ben (torzó 108, ujj 36),
 *   magassága = a panel magassága cm-ben (torzó 72, ujj 22). glTF konvenció: v=0 a kép teteje.
 *   Torzó: u=0 a viselő JOBB oldali varrás (nézetből bal), u=0.25 elöl közép, u=0.5 a másik varrás,
 *   u=0.75 hátul közép. Ujj: u=0.5 az ujj teteje (ide kerül a logó).
 *
 * A Blenderből érkező éles modelleknek ugyanezt a chart-konvenciót kell követniük
 * (lásd docs/3D-CUSTOMIZER.md), így a 2D szerkesztő cm-koordinátái közvetlenül textúra-koordináták.
 *
 * Futtatás: npm run models:generate  ->  public/models/tshirt.glb
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Document, NodeIO } from "@gltf-transform/core";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(root, "public/models/tshirt.glb");

// ---------------------------------------------------------------- paraméterek (méter)
const TORSO_HEIGHT = 0.72; // chart magasság 72 cm
const TORSO_CHART_WIDTH = 1.08; // chart szélesség 108 cm (kerület)
const SHOULDER_Y = 0.7; // vállvonal
const TAPER_START = 0.61; // innen keskenyedik a váll (lekerekített vállvonal)
const NECK_RX = 0.085;
const NECK_RZ = 0.06;
let BODY_RX = 0.235;
let BODY_RZ = 0.078;
const SUPER_N = 2.6; // szuperellipszis kitevő: laposabb elő/hátlap
const FRONT_DIP = 0.06; // nyakkivágás elöl
const BACK_DIP = 0.012;

const SLEEVE_LENGTH = 0.22; // chart magasság 22 cm
const SLEEVE_CHART_WIDTH = 0.36; // kerület 36 cm
const SLEEVE_R0 = SLEEVE_CHART_WIDTH / (2 * Math.PI); // 0.0573
const SLEEVE_R1 = SLEEVE_R0 * 0.93;
const SLEEVE_DROP_DEG = 22; // ujj lejtése a vízszinteshez képest
const SLEEVE_ROOT = { x: 0.16, y: 0.635, z: 0.0 }; // gyökér a torzón belül
const SLEEVE_ROOT_INSET = 0.05; // ennyivel indul a torzó belsejében

const RING_SEGMENTS = 80;
const TORSO_ROWS = 56;
const SLEEVE_ROWS = 14;

// ---------------------------------------------------------------- segédek
const smoothstep = (t) => {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
};
const lerp = (a, b, t) => a + (b - a) * t;

function ringRadii(y) {
  // hem enyhe bővülés, enyhe derék, majd lekerekített váll a nyakig (negyed-ellipszis profil)
  if (y < TAPER_START) {
    const flare = 1 + 0.02 * (1 - y / TAPER_START);
    const waist = 1 - 0.015 * Math.sin((y / TAPER_START) * Math.PI);
    return { rx: BODY_RX * flare * waist, rz: BODY_RZ * flare * waist };
  }
  const s = Math.min(1, (y - TAPER_START) / (SHOULDER_Y - TAPER_START));
  const k = Math.sqrt(Math.max(0, 1 - s * s));
  return { rx: NECK_RX + (BODY_RX - NECK_RX) * k, rz: NECK_RZ + (BODY_RZ - NECK_RZ) * k };
}

/** Szuperellipszis pont (laposabb elő/hátlap, lekerekített oldalak). */
function superPoint(rx, rz, theta) {
  const c = Math.cos(theta);
  const sn = Math.sin(theta);
  const e = 2 / SUPER_N;
  return {
    x: -rx * Math.sign(c) * Math.pow(Math.abs(c), e),
    z: rz * Math.sign(sn) * Math.pow(Math.abs(sn), e),
  };
}

/** Kalibráció: a test kerülete pontosan a chart szélessége (108 cm) legyen. */
(function calibrate() {
  let per = 0;
  let prev = superPoint(BODY_RX, BODY_RZ, 0);
  for (let i = 1; i <= 720; i++) {
    const p = superPoint(BODY_RX, BODY_RZ, (i / 720) * Math.PI * 2);
    per += Math.hypot(p.x - prev.x, p.z - prev.z);
    prev = p;
  }
  const k = TORSO_CHART_WIDTH / per;
  BODY_RX *= k;
  BODY_RZ *= k;
})();

function neckDip(theta, y) {
  // theta: 0 = -X varrás, 90° = +Z (elöl), 180° = +X, 270° = -Z (hátul)
  const w = smoothstep((y - 0.6) / (SHOULDER_Y - 0.6));
  const front = Math.max(0, Math.sin(theta)); // 1 elöl középen
  const back = Math.max(0, -Math.sin(theta));
  return w * (FRONT_DIP * Math.pow(front, 1.6) + BACK_DIP * Math.pow(back, 2));
}

/** Egy gyűrű pontjai + ívhossz-alapú u koordináták (cm-kalibrált). */
function torsoRing(y) {
  const { rx, rz } = ringRadii(y);
  const pts = [];
  for (let i = 0; i <= RING_SEGMENTS; i++) {
    const theta = (i / RING_SEGMENTS) * Math.PI * 2;
    const { x, z } = superPoint(rx, rz, theta);
    pts.push({ x, y: y - neckDip(theta, y), z, theta });
  }
  // ívhossz (a dip nélküli ellipszisen, vízszintes kerület)
  const arc = [0];
  for (let i = 1; i <= RING_SEGMENTS; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    arc.push(arc[i - 1] + Math.hypot(b.x - a.x, b.z - a.z));
  }
  const quarter = RING_SEGMENTS / 4;
  const arcFront = arc[quarter]; // theta = 90°
  const arcBack = arc[3 * quarter]; // theta = 270°
  const half = RING_SEGMENTS / 2;
  for (let i = 0; i <= RING_SEGMENTS; i++) {
    const u =
      i <= half
        ? 0.25 + (arc[i] - arcFront) / TORSO_CHART_WIDTH
        : 0.75 + (arc[i] - arcBack) / TORSO_CHART_WIDTH;
    pts[i].u = u;
    pts[i].v = (TORSO_HEIGHT - pts[i].y) / TORSO_HEIGHT; // glTF: v=0 a kép teteje
  }
  return pts;
}

function buildTorso() {
  const positions = [];
  const uvs = [];
  const indices = [];
  const rings = [];
  for (let j = 0; j <= TORSO_ROWS; j++) {
    const y = (j / TORSO_ROWS) * SHOULDER_Y;
    rings.push(torsoRing(y));
  }
  const stride = RING_SEGMENTS + 1;
  for (const ring of rings) {
    for (const p of ring) {
      positions.push(p.x, p.y, p.z);
      uvs.push(p.u, p.v);
    }
  }
  for (let j = 0; j < TORSO_ROWS; j++) {
    for (let i = 0; i < RING_SEGMENTS; i++) {
      const a = j * stride + i;
      const b = a + 1;
      const c = a + stride;
      const d = c + 1;
      // kifelé néző (CCW kívülről): dθ × dy = kifelé
      indices.push(a, b, d, a, d, c);
    }
  }
  return { positions, uvs, indices, topRing: rings[rings.length - 1] };
}

function buildCollar(topRing) {
  // vékony gallérszalag a nyakkivágás mentén (kifelé + felfelé kiemelve)
  const positions = [];
  const uvs = [];
  const indices = [];
  const bandH = 0.016;
  const bandOut = 0.008;
  const n = topRing.length;
  for (let i = 0; i < n; i++) {
    const p = topRing[i];
    const len = Math.hypot(p.x, p.z) || 1;
    const nx = p.x / len;
    const nz = p.z / len;
    // alsó él (a torzó tetején), külső perem
    positions.push(p.x + nx * bandOut, p.y - 0.004, p.z + nz * bandOut);
    uvs.push(p.u, 1);
    // felső él, kicsit befelé
    positions.push(p.x - nx * 0.004, p.y + bandH, p.z - nz * 0.004);
    uvs.push(p.u, 0);
  }
  for (let i = 0; i < n - 1; i++) {
    const a = i * 2;
    const b = a + 1;
    const c = a + 2;
    const d = a + 3;
    indices.push(a, c, d, a, d, b);
  }
  return { positions, uvs, indices };
}

function buildSleeve(side /* +1 bal (+X), -1 jobb (-X) */) {
  const positions = [];
  const uvs = [];
  const indices = [];
  const drop = (SLEEVE_DROP_DEG * Math.PI) / 180;
  // tengely: kifelé és lefelé
  const dir = { x: side * Math.cos(drop), y: -Math.sin(drop), z: 0 };
  // "fel" irány a tengelyre merőlegesen (a chart u=0.5 ide kerül)
  const up = { x: side * Math.sin(drop), y: Math.cos(drop), z: 0 };
  // előre irány = dir × up (jobbkezes rendszerben +Z felé kell mutatnia)
  let fwd = {
    x: dir.y * up.z - dir.z * up.y,
    y: dir.z * up.x - dir.x * up.z,
    z: dir.x * up.y - dir.y * up.x,
  };
  if (fwd.z < 0) fwd = { x: -fwd.x, y: -fwd.y, z: -fwd.z };

  const start = {
    x: side * SLEEVE_ROOT.x - dir.x * SLEEVE_ROOT_INSET,
    y: SLEEVE_ROOT.y - dir.y * SLEEVE_ROOT_INSET,
    z: SLEEVE_ROOT.z,
  };
  const total = SLEEVE_LENGTH + SLEEVE_ROOT_INSET;
  const stride = RING_SEGMENTS + 1;
  for (let j = 0; j <= SLEEVE_ROWS; j++) {
    const t = j / SLEEVE_ROWS;
    const along = t * total;
    const r = lerp(SLEEVE_R0, SLEEVE_R1, t);
    const cx = start.x + dir.x * along;
    const cy = start.y + dir.y * along;
    const cz = start.z + dir.z * along;
    for (let i = 0; i <= RING_SEGMENTS; i++) {
      // phi=0 -> u=0 (alul), phi=π -> u=0.5 (fent)
      const phi = (i / RING_SEGMENTS) * Math.PI * 2;
      const cu = -Math.cos(phi); // -1 alul, +1 fent
      const cf = Math.sin(phi) * (side > 0 ? 1 : -1); // előre irány (nézetből balról jobbra haladjon az u)
      const px = cx + r * (up.x * cu + fwd.x * cf);
      const py = cy + r * (up.y * cu + fwd.y * cf);
      const pz = cz + r * (up.z * cu + fwd.z * cf);
      positions.push(px, py, pz);
      // u: ívhossz cm-ben a chart szélességhez (36 cm) viszonyítva, középre igazítva
      const arcFromTop = (phi - Math.PI) * r; // -πr..πr
      const u = 0.5 + arcFromTop / SLEEVE_CHART_WIDTH;
      // v: gyökér = 0 (chart teteje), mandzsetta = 1
      const v = Math.max(0, (along - SLEEVE_ROOT_INSET) / SLEEVE_LENGTH);
      uvs.push(u, v);
    }
  }
  for (let j = 0; j < SLEEVE_ROWS; j++) {
    for (let i = 0; i < RING_SEGMENTS; i++) {
      const a = j * stride + i;
      const b = a + 1;
      const c = a + stride;
      const d = c + 1;
      indices.push(a, b, d, a, d, c);
    }
  }
  return { positions, uvs, indices, center: start, dir };
}

/** Kifelé néző háromszög-sorrend biztosítása (a mesh súlypontjából számolt irányhoz képest). */
function orientOutward(geo, centroidFn) {
  const { positions, indices } = geo;
  let agree = 0;
  let disagree = 0;
  for (let k = 0; k < indices.length; k += 3) {
    const [i0, i1, i2] = [indices[k], indices[k + 1], indices[k + 2]];
    const p0 = [positions[i0 * 3], positions[i0 * 3 + 1], positions[i0 * 3 + 2]];
    const p1 = [positions[i1 * 3], positions[i1 * 3 + 1], positions[i1 * 3 + 2]];
    const p2 = [positions[i2 * 3], positions[i2 * 3 + 1], positions[i2 * 3 + 2]];
    const e1 = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]];
    const e2 = [p2[0] - p0[0], p2[1] - p0[1], p2[2] - p0[2]];
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const c = centroidFn(p0);
    const out = [p0[0] - c[0], p0[1] - c[1], p0[2] - c[2]];
    const dot = n[0] * out[0] + n[1] * out[1] + n[2] * out[2];
    if (dot >= 0) agree++;
    else disagree++;
  }
  if (disagree > agree) {
    for (let k = 0; k < indices.length; k += 3) {
      const tmp = indices[k + 1];
      indices[k + 1] = indices[k + 2];
      indices[k + 2] = tmp;
    }
  }
}

function computeNormals(geo) {
  const { positions, indices } = geo;
  const normals = new Float32Array(positions.length);
  for (let k = 0; k < indices.length; k += 3) {
    const i0 = indices[k] * 3;
    const i1 = indices[k + 1] * 3;
    const i2 = indices[k + 2] * 3;
    const ax = positions[i1] - positions[i0];
    const ay = positions[i1 + 1] - positions[i0 + 1];
    const az = positions[i1 + 2] - positions[i0 + 2];
    const bx = positions[i2] - positions[i0];
    const by = positions[i2 + 1] - positions[i0 + 1];
    const bz = positions[i2 + 2] - positions[i0 + 2];
    const nx = ay * bz - az * by;
    const ny = az * bx - ax * bz;
    const nz = ax * by - ay * bx;
    for (const i of [i0, i1, i2]) {
      normals[i] += nx;
      normals[i + 1] += ny;
      normals[i + 2] += nz;
    }
  }
  for (let i = 0; i < normals.length; i += 3) {
    const l = Math.hypot(normals[i], normals[i + 1], normals[i + 2]) || 1;
    normals[i] /= l;
    normals[i + 1] /= l;
    normals[i + 2] /= l;
  }
  // a varrás (u=0 / u=1) duplikált csúcsainak normálját összefésüljük, hogy ne legyen él
  return normals;
}

function weldSeamNormals(geo, normals, stride) {
  const rows = geo.positions.length / 3 / stride;
  for (let j = 0; j < rows; j++) {
    const a = (j * stride) * 3;
    const b = (j * stride + stride - 1) * 3;
    const nx = normals[a] + normals[b];
    const ny = normals[a + 1] + normals[b + 1];
    const nz = normals[a + 2] + normals[b + 2];
    const l = Math.hypot(nx, ny, nz) || 1;
    for (const i of [a, b]) {
      normals[i] = nx / l;
      normals[i + 1] = ny / l;
      normals[i + 2] = nz / l;
    }
  }
}

// ---------------------------------------------------------------- glTF összeállítás
const doc = new Document();
doc.createBuffer("buffer");
const scene = doc.createScene("Scene");
doc.getRoot().setDefaultScene(scene);
doc.getRoot().getAsset().generator = "azenegyediruham tshirt generator";

function addMesh(name, geo, color) {
  const buffer = doc.getRoot().listBuffers()[0];
  const normals = geo.normals;
  const position = doc.createAccessor(`${name}_pos`).setType("VEC3").setArray(new Float32Array(geo.positions)).setBuffer(buffer);
  const normal = doc.createAccessor(`${name}_nor`).setType("VEC3").setArray(normals).setBuffer(buffer);
  const uv = doc.createAccessor(`${name}_uv`).setType("VEC2").setArray(new Float32Array(geo.uvs)).setBuffer(buffer);
  const IndexArray = geo.positions.length / 3 > 65535 ? Uint32Array : Uint16Array;
  const indices = doc.createAccessor(`${name}_idx`).setType("SCALAR").setArray(new IndexArray(geo.indices)).setBuffer(buffer);
  const material = doc
    .createMaterial(`${name}Material`)
    .setBaseColorFactor([...color, 1])
    .setMetallicFactor(0)
    .setRoughnessFactor(0.92)
    .setDoubleSided(true);
  const prim = doc
    .createPrimitive()
    .setAttribute("POSITION", position)
    .setAttribute("NORMAL", normal)
    .setAttribute("TEXCOORD_0", uv)
    .setIndices(indices)
    .setMaterial(material);
  const mesh = doc.createMesh(name).addPrimitive(prim);
  const node = doc.createNode(name).setMesh(mesh);
  scene.addChild(node);
  return geo.positions.length / 3;
}

const torso = buildTorso();
orientOutward(torso, (p) => [0, p[1], 0]);
torso.normals = computeNormals(torso);
weldSeamNormals(torso, torso.normals, RING_SEGMENTS + 1);

const collar = buildCollar(torso.topRing);
orientOutward(collar, (p) => [0, p[1] - 0.05, 0]);
collar.normals = computeNormals(collar);

const sleeveL = buildSleeve(+1);
orientOutward(sleeveL, (p) => {
  // tengelyre vetített középpont
  const d = sleeveL.dir;
  const s = sleeveL.center;
  const t = (p[0] - s.x) * d.x + (p[1] - s.y) * d.y + (p[2] - s.z) * d.z;
  return [s.x + d.x * t, s.y + d.y * t, s.z + d.z * t];
});
sleeveL.normals = computeNormals(sleeveL);
weldSeamNormals(sleeveL, sleeveL.normals, RING_SEGMENTS + 1);

const sleeveR = buildSleeve(-1);
orientOutward(sleeveR, (p) => {
  const d = sleeveR.dir;
  const s = sleeveR.center;
  const t = (p[0] - s.x) * d.x + (p[1] - s.y) * d.y + (p[2] - s.z) * d.z;
  return [s.x + d.x * t, s.y + d.y * t, s.z + d.z * t];
});
sleeveR.normals = computeNormals(sleeveR);
weldSeamNormals(sleeveR, sleeveR.normals, RING_SEGMENTS + 1);

const fabric = [0.93, 0.92, 0.89];
const counts = {
  Torso: addMesh("Torso", torso, fabric),
  SleeveL: addMesh("SleeveL", sleeveL, fabric),
  SleeveR: addMesh("SleeveR", sleeveR, fabric),
  Collar: addMesh("Collar", collar, [0.85, 0.84, 0.81]),
};

const io = new NodeIO();
const glb = await io.writeBinary(doc);
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, glb);
console.log(`OK ${OUT} (${(glb.byteLength / 1024).toFixed(1)} kB)`, counts);
