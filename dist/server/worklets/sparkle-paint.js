class SparklePaint {
  static get inputProperties() {
    return ["--sparkle-hue", "--sparkle-alpha"];
  }

  paint(ctx, geom, properties) {
    const { width, height } = geom;
    const hue = Number(properties.get("--sparkle-hue").toString()) || 220;
    const alpha = Number(properties.get("--sparkle-alpha").toString()) || 0.35;
    const gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      Math.min(width, height) * 0.1,
      width / 2,
      height / 2,
      Math.max(width, height) * 0.6
    );
    gradient.addColorStop(0, `hsla(${hue}, 95%, 65%, ${alpha})`);
    gradient.addColorStop(0.6, `hsla(${(hue + 40) % 360}, 85%, 60%, ${alpha * 0.45})`);
    gradient.addColorStop(1, `hsla(${(hue + 80) % 360}, 80%, 55%, 0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const sparkles = Math.max(12, Math.round(Math.min(width, height) / 24));
    for (let i = 0; i < sparkles; i += 1) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() * 2 + 0.5;
      const brightness = 0.7 + Math.random() * 0.3;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${(hue + Math.random() * 20) % 360}, 95%, ${80 * brightness}%, ${
        alpha * 0.75
      })`;
      ctx.fill();
    }
  }
}

registerPaint("sparkle", SparklePaint);