<script setup lang="ts">
defineProps<{
  overlayStyle?: 'lines' | 'dots' | 'grid'
  visible?: boolean
}>()

// Hardcoded constellation data from design (Summer Triangle region)
// Coordinates in SVG viewBox 0-100
const constellations = [
  {
    name: 'Cygnus',
    labelPos: { x: 42, y: 22 },
    stars: [
      { name: 'Deneb',   x: 38, y: 15, mag: 1.25 },
      { name: '',         x: 42, y: 28, mag: 3.0 },
      { name: '',         x: 35, y: 35, mag: 2.9 },
      { name: '',         x: 48, y: 35, mag: 3.1 },
      { name: 'Sadr',     x: 42, y: 28, mag: 2.2 },
      { name: 'Albireo',  x: 42, y: 48, mag: 3.1 }
    ],
    lines: [
      [0, 4], [4, 5], // body
      [2, 4], [4, 3]  // wings
    ]
  },
  {
    name: 'Lyra',
    labelPos: { x: 60, y: 18 },
    stars: [
      { name: 'Vega', x: 62, y: 20, mag: 0.03 },
      { name: '',      x: 64, y: 26, mag: 3.5 },
      { name: '',      x: 60, y: 26, mag: 3.3 },
      { name: '',      x: 65, y: 32, mag: 3.5 },
      { name: '',      x: 59, y: 32, mag: 3.4 }
    ],
    lines: [
      [0, 1], [0, 2], [1, 3], [2, 4], [3, 4]
    ]
  },
  {
    name: 'Aquila',
    labelPos: { x: 55, y: 60 },
    stars: [
      { name: 'Altair',   x: 58, y: 62, mag: 0.77 },
      { name: 'Tarazed',  x: 56, y: 56, mag: 2.7 },
      { name: 'Alshain',  x: 60, y: 68, mag: 3.7 },
      { name: '',          x: 52, y: 52, mag: 3.4 },
      { name: '',          x: 64, y: 72, mag: 3.5 }
    ],
    lines: [
      [3, 1], [1, 0], [0, 2], [2, 4]
    ]
  }
]

const messier = [
  { name: 'M31', x: 18, y: 70, mag: 3.4 },
  { name: 'M57', x: 62, y: 29, mag: 8.8 },
  { name: 'M27', x: 48, y: 55, mag: 7.5 },
  { name: 'M13', x: 78, y: 45, mag: 5.8 }
]

function starRadius(mag: number): number {
  return Math.max(0.4, 2.0 - mag * 0.4)
}
</script>

<template>
  <svg
    v-if="visible"
    viewBox="0 0 100 100"
    class="absolute inset-0 w-full h-full z-[4] pointer-events-none"
    preserveAspectRatio="xMidYMid slice"
  >
    <!-- Constellation lines -->
    <template v-if="overlayStyle !== 'dots'">
      <template v-for="(c, ci) in constellations" :key="'c-' + ci">
        <line
          v-for="(line, li) in c.lines"
          :key="'l-' + ci + '-' + li"
          class="const-line"
          :x1="c.stars[line[0]].x"
          :y1="c.stars[line[0]].y"
          :x2="c.stars[line[1]].x"
          :y2="c.stars[line[1]].y"
        />
      </template>
    </template>

    <!-- Stars -->
    <template v-for="(c, ci) in constellations" :key="'s-' + ci">
      <circle
        v-for="(star, si) in c.stars"
        :key="'star-' + ci + '-' + si"
        :class="['const-star', star.mag < 2 && 'twinkle']"
        :style="star.mag < 2 ? { animationDelay: `${((ci * 5 + si) * 0.7) % 3.6}s` } : undefined"
        :cx="star.x"
        :cy="star.y"
        :r="starRadius(star.mag)"
      />
      <!-- Named star labels -->
      <text
        v-for="(star, si) in c.stars.filter(s => s.name)"
        :key="'slbl-' + ci + '-' + si"
        :x="star.x + 1.5"
        :y="star.y - 1"
        fill="var(--ink-2)"
        font-family="JetBrains Mono"
        font-size="1.8"
      >
        {{ star.name }}
      </text>
    </template>

    <!-- Constellation labels -->
    <text
      v-for="(c, ci) in constellations"
      :key="'clbl-' + ci"
      class="const-label"
      :x="c.labelPos.x"
      :y="c.labelPos.y"
    >
      {{ c.name }}
    </text>

    <!-- Messier objects -->
    <template v-for="(m, mi) in messier" :key="'m-' + mi">
      <circle
        :cx="m.x"
        :cy="m.y"
        :r="1.2"
        fill="none"
        stroke="var(--accent-3)"
        stroke-width="0.2"
        stroke-dasharray="0.5 0.3"
        opacity="0.5"
      />
      <text
        :x="m.x + 1.8"
        :y="m.y + 0.5"
        fill="var(--accent-3)"
        font-family="JetBrains Mono"
        font-size="1.6"
        opacity="0.6"
      >
        {{ m.name }}
      </text>
    </template>

    <!-- Alt/Az grid (grid style only) -->
    <template v-if="overlayStyle === 'grid'">
      <line
        v-for="i in 9"
        :key="'gh-' + i"
        :x1="0"
        :y1="i * 10"
        :x2="100"
        :y2="i * 10"
        stroke="var(--accent-2)"
        stroke-width="0.1"
        opacity="0.15"
      />
      <line
        v-for="i in 9"
        :key="'gv-' + i"
        :x1="i * 10"
        :y1="0"
        :x2="i * 10"
        :y2="100"
        stroke="var(--accent-2)"
        stroke-width="0.1"
        opacity="0.15"
      />
    </template>
  </svg>
</template>
