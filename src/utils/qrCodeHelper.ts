import QRCode from 'qrcode';

const BASE_URL = import.meta.env.VITE_APP_URL || 'https://kaistid-grad.siwon.site';

export function getQRCodeUrl(artistCode: string): string {
  return `${BASE_URL}/stamp/scan?code=${artistCode}`;
}

export async function generateQRCodeDataURL(
  artistCode: string,
  options?: { size?: number; dark?: string; light?: string }
): Promise<string> {
  const url = getQRCodeUrl(artistCode);
  const { size = 512, dark = '#e8e4dc', light = '#0a0a0a' } = options || {};

  return QRCode.toDataURL(url, {
    width: size,
    margin: 4,
    color: { dark, light },
    errorCorrectionLevel: 'M',
  });
}

export async function generateAllQRCodes(
  artists: { qrCode: { code: string }; name: { ko: string } }[]
): Promise<{ code: string; name: string; dataUrl: string }[]> {
  const results = await Promise.all(
    artists.map(async (artist) => {
      const dataUrl = await generateQRCodeDataURL(artist.qrCode.code);
      return {
        code: artist.qrCode.code,
        name: artist.name.ko,
        dataUrl,
      };
    })
  );
  return results;
}

export function downloadQRCode(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `${filename}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
