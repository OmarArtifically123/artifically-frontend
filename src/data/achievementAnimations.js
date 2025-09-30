export const celebrationAnimation = {
  v: "5.7.1",
  fr: 60,
  ip: 0,
  op: 90,
  w: 200,
  h: 200,
  nm: "achievement-celebration",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Star",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            {
              i: { x: [0.4, 0.4, 0.4], y: [1, 1, 1] },
              o: { x: [0.6, 0.6, 0.6], y: [0, 0, 0] },
              t: 0,
              s: [0, 0, 100]
            },
            { t: 30, s: [115, 115, 100] },
            { t: 60, s: [100, 100, 100] }
          ]
        }
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "st",
              c: { a: 0, k: [0.392, 0.616, 0.996, 1] },
              o: { a: 0, k: 0 },
              w: { a: 0, k: 0 },
              lc: 1,
              lj: 1
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.384, 0.145, 0.957, 1] },
              o: { a: 0, k: 100 }
            },
            {
              ty: "sr",
              sy: 1,
              d: 1,
              pt: { a: 0, k: 5 },
              p: { a: 0, k: [0, 0] },
              r: { a: 0, k: 0 },
              ir: { a: 0, k: 20 },
              is: { a: 0, k: 0 },
              or: { a: 0, k: 60 },
              os: { a: 0, k: 0 }
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
              sk: { a: 0, k: 0 },
              sa: { a: 0, k: 0 }
            }
          ],
          nm: "Star Group",
          np: 3,
          cix: 2,
          bm: 0
        }
      ],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Burst",
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 10, s: [0] },
            { t: 20, s: [100] },
            { t: 60, s: [0] }
          ]
        },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [10, 10, 100] },
            { t: 30, s: [120, 120, 100] },
            { t: 60, s: [140, 140, 100] }
          ]
        }
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "st",
              c: { a: 0, k: [1, 0.835, 0.29, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 6 },
              lc: 1,
              lj: 1
            },
            { ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [120, 120] } },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
              sk: { a: 0, k: 0 },
              sa: { a: 0, k: 0 }
            }
          ],
          nm: "Circle",
          np: 3,
          cix: 2,
          bm: 0
        }
      ],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0
    }
  ]
};

export default celebrationAnimation;