export async function generateCompletionCard(completedAt: string): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, 1080, 1080);

  // Grid pattern overlay
  ctx.strokeStyle = 'rgba(232, 228, 220, 0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= 1080; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1080);
    ctx.stroke();
  }
  for (let y = 0; y <= 1080; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1080, y);
    ctx.stroke();
  }

  // Border
  ctx.strokeStyle = 'rgba(200, 168, 130, 0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(40, 40, 1000, 1000);
  ctx.strokeRect(48, 48, 984, 984);

  // Top label
  ctx.fillStyle = '#c8a882';
  ctx.font = '500 14px "DM Mono", monospace';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '0.2em';
  ctx.fillText('2026 KAIST ID GRADUATE EXHIBITION', 540, 130);

  // Title
  ctx.fillStyle = '#e8e4dc';
  ctx.font = '300 88px "Cormorant Garamond", serif';
  ctx.fillText('14 Works', 540, 460);

  ctx.font = '300 42px "Cormorant Garamond", serif';
  ctx.fillText('Complete', 540, 530);

  // Divider
  ctx.strokeStyle = 'rgba(200, 168, 130, 0.5)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(340, 580);
  ctx.lineTo(740, 580);
  ctx.stroke();

  // Stamp count circles
  const cols = 7;
  const rows = 2;
  const circleR = 22;
  const startX = 540 - ((cols - 1) * 60) / 2;
  const startY = 660;

  for (let i = 0; i < 14; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = startX + col * 60;
    const y = startY + row * 60;

    ctx.beginPath();
    ctx.arc(x, y, circleR, 0, Math.PI * 2);
    ctx.fillStyle = '#c8a882';
    ctx.fill();

    ctx.fillStyle = '#0a0a0a';
    ctx.font = '500 12px "DM Mono", monospace';
    ctx.fillText(String(i + 1).padStart(2, '0'), x, y + 4);
  }

  // Date
  ctx.fillStyle = 'rgba(232, 228, 220, 0.35)';
  ctx.font = '400 15px "DM Mono", monospace';
  ctx.fillText(`${completedAt} · SEJI GALLERY · SEOUL`, 540, 900);

  ctx.fillStyle = 'rgba(232, 228, 220, 0.15)';
  ctx.font = '400 12px "DM Mono", monospace';
  ctx.fillText('kaistid-grad.siwon.site', 540, 940);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/png');
  });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
