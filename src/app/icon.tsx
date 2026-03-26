import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#CC1414',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          fontSize: 13,
          fontWeight: 900,
          fontFamily: 'sans-serif',
          letterSpacing: '-0.5px',
        }}
      >
        KP
      </div>
    ),
    { ...size }
  );
}
