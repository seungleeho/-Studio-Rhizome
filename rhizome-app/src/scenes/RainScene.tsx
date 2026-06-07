import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Canvas, Circle, Line, vec } from '@shopify/react-native-skia';
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { dropImpact } from '../haptics/patterns';
import { createDrop, stepDrop, RainDrop } from '../physics/RainParticle';

const { width: W, height: H } = Dimensions.get('window');
const DROP_COUNT = 280;

function initDrops(): RainDrop[] {
  return Array.from({ length: DROP_COUNT }, (_, i) => {
    const d = createDrop(i, W);
    return { ...d, y: Math.random() * H };
  });
}

export default function RainScene() {
  const dropsRef = useRef<RainDrop[]>(initDrops());
  const touchesRef = useRef<Array<{ x: number; y: number }>>([]);
  const lastHapticRef = useRef(0);
  const [, setFrame] = useState(0);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const tick = useCallback((time: number) => {
    const dt = lastTimeRef.current
      ? Math.min((time - lastTimeRef.current) / 16.67, 3)
      : 1;
    lastTimeRef.current = time;

    const touches = touchesRef.current;
    dropsRef.current = dropsRef.current.map(drop =>
      stepDrop(drop, W, H, touches, dt)
    );

    const now = Date.now();
    if (now - lastHapticRef.current > 80) {
      const justRippled = dropsRef.current.some(
        d => d.rippling && d.rippleProgress < 0.05
      );
      if (justRippled) {
        lastHapticRef.current = now;
        dropImpact();
      }
    }

    setFrame(f => f + 1);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .onBegin(e => {
      touchesRef.current = [{ x: e.x, y: e.y }];
    })
    .onUpdate(e => {
      touchesRef.current = [{ x: e.x, y: e.y }];
    })
    .onEnd(() => {
      touchesRef.current = [];
    })
    .onFinalize(() => {
      touchesRef.current = [];
    });

  const drops = dropsRef.current;

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.root}>
        <GestureDetector gesture={panGesture}>
          <Canvas style={styles.canvas}>
            {drops.map(drop => {
              if (drop.rippling) {
                return (
                  <Circle
                    key={drop.id}
                    cx={drop.touchX}
                    cy={drop.touchY}
                    r={Math.max(drop.radius, 0.1)}
                    color="transparent"
                    style="stroke"
                    strokeWidth={1.2}
                    opacity={Math.max(1 - drop.rippleProgress, 0)}
                  />
                );
              }
              return (
                <Line
                  key={drop.id}
                  p1={vec(drop.x, drop.y)}
                  p2={vec(drop.x + drop.vx * 2, drop.y + drop.length)}
                  color={`rgba(168, 200, 240, ${drop.opacity.toFixed(2)})`}
                  style="stroke"
                  strokeWidth={0.8}
                />
              );
            })}
          </Canvas>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a0f1e' },
  canvas: { flex: 1 },
});
