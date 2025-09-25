"use client";
import Hyperspeed from './Hyperspeed';

const HyperspeedBackground = () => {
  return (
    <div className="absolute inset-0 w-full h-full -top-50">
      <Hyperspeed
        effectOptions={{
            onSpeedUp: () => {},
            onSlowDown: () => {},
            distortion: 'mountainDistortion',
            length: 400,
            roadWidth: 9,
            islandWidth: 2,
            lanesPerRoad: 3,
            fov: 90,
            fovSpeedUp: 150,
            speedUp: 1,
            carLightsFade: 0.4,
            totalSideLightSticks: 50,
            lightPairsPerRoadWay: 50,
            shoulderLinesWidthPercentage: 0.05,
            brokenLinesWidthPercentage: 0.1,
            brokenLinesLengthPercentage: 0.5,
            lightStickWidth: [0.12, 0.5],
            lightStickHeight: [1.3, 1.7],
        
             movingAwaySpeed: [10, 15],
             movingCloserSpeed: [-20, -30],
            carLightsLength: [400 * 0.05, 400 * 0.15],
            carLightsRadius: [0.05, 0.14],
            carWidthPercentage: [0.3, 0.5],
            carShiftX: [-0.2, 0.2],
            carFloorSeparation: [0.05, 1],
            colors: {
              roadColor: 0x000000,
              islandColor: 0x000000,
              background: 0x6a5acd,
              shoulderLines: 0xe2e8f0,
              brokenLines: 0xcbd5e1,
              leftCars: [0xff0000, 0xdc2626, 0xb91c1c],
              rightCars: [0x0000ff, 0x2563eb, 0x1d4ed8],
              sticks: 0x64748b
          }
        }}
      />
    </div>
  );
};

export default HyperspeedBackground;
