import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Pressable, Text, View } from "react-native";

const formatCountdown = (endAtMs, nowMs) => {
  const diff = Math.max(0, endAtMs - nowMs);
  const totalSec = Math.floor(diff / 1000);
  const hh = Math.floor(totalSec / 3600);
  const mm = Math.floor((totalSec % 3600) / 60);
  const ss = totalSec % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
};

const parseMs = (value) => {
  if (!value) return null;
  const ms = new Date(value).getTime();
  return Number.isNaN(ms) ? null : ms;
};

export default function FlashSaleTicker({ flashSales, nowMs, onPressItem, textStyle }) {
  const anim = useRef(new Animated.Value(0)).current;
  const animRef = useRef(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);

  const loopData = useMemo(() => {
    const list = Array.isArray(flashSales) ? flashSales : [];
    return [...list, ...list];
  }, [flashSales]);

  const oneCycleWidth = trackWidth ? trackWidth / 2 : 0;

  useEffect(() => {
    if (animRef.current) {
      animRef.current.stop();
      animRef.current = null;
    }
    anim.setValue(0);

    if (!oneCycleWidth || !viewportWidth) return;
    if (oneCycleWidth <= viewportWidth) return;

    const duration = Math.max(8000, oneCycleWidth * 20);
    animRef.current = Animated.loop(
      Animated.timing(anim, {
        toValue: -oneCycleWidth,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animRef.current.start();

    return () => {
      if (animRef.current) {
        animRef.current.stop();
        animRef.current = null;
      }
    };
  }, [oneCycleWidth, viewportWidth, anim]);

  if (!loopData.length) return null;

  return (
    <View onLayout={(e) => setViewportWidth(e.nativeEvent.layout.width)} style={{ overflow: "hidden" }}>
      <Animated.View
        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "flex-start",
          flexShrink: 0,
          transform: [{ translateX: anim }],
        }}
      >
        {loopData.map((event, idx) => {
          const endMs = parseMs(event?.endAt);
          const countdown = endMs ? formatCountdown(endMs, nowMs) : "--:--:--";
          const title = event?.title || event?.name || `Flash Sale #${event?.id || idx}`;
          const text = `${title} • ${countdown}`;
          return (
            <Pressable
              key={`${event?.id || "fs"}-${idx}`}
              onPress={() => onPressItem?.(event)}
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: 8,
                flexShrink: 0,
                paddingHorizontal: 8,
                paddingVertical: 2,
                marginRight: 8,
              }}
            >
              <Text numberOfLines={1} style={textStyle}>
                {text}
              </Text>
            </Pressable>
          );
        })}
      </Animated.View>
    </View>
  );
}
