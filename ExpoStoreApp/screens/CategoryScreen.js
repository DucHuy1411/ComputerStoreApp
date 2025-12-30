import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import { apiCategoriesTree } from "../services/endpoints";

import styles, { COLORS } from "../styles/CategoryStyle";

const ICON_MAP = {
  laptop: "laptop-outline",
  pc: "desktop-outline",
  monitor: "tv-outline",
  keyboard: "keypad-outline",
  mouse: "mouse-outline",
  audio: "headset-outline",
  storage: "server-outline",
  network: "wifi-outline",
  chair: "cube-outline",
};

const guessIcon = (cat) => {
  const s = `${cat?.slug || ""} ${cat?.code || ""} ${cat?.name || ""}`.toLowerCase();
  if (s.includes("laptop")) return "laptop-outline";
  if (s.includes("pc") || s.includes("linh kiện") || s.includes("component")) return "desktop-outline";
  if (s.includes("màn hình") || s.includes("monitor")) return "tv-outline";
  if (s.includes("bàn phím") || s.includes("keyboard")) return "keypad-outline";
  if (s.includes("chuột") || s.includes("mouse")) return "mouse-outline";
  if (s.includes("tai nghe") || s.includes("audio") || s.includes("headset")) return "headset-outline";
  if (s.includes("ssd") || s.includes("hdd") || s.includes("lưu trữ") || s.includes("storage")) return "server-outline";
  if (s.includes("wifi") || s.includes("router") || s.includes("mạng") || s.includes("network")) return "wifi-outline";
  if (s.includes("ghế") || s.includes("chair")) return "cube-outline";
  return "grid-outline";
};

const toHint = (cat) => cat?.shortDesc || cat?.description || "";

const normalizeTree = (res) => {
  const list = res?.categories || res?.items || res || [];
  return Array.isArray(list) ? list : [];
};

const buildSections = (tree) => {
  const roots = tree.filter((c) => c.parentId == null);

  const getChildren = (node) => {
    if (Array.isArray(node.children)) return node.children;
    return tree.filter((x) => String(x.parentId) === String(node.id));
  };

  return roots.map((root) => {
    const children = getChildren(root);
    const items = (children || []).map((c) => ({
      id: String(c.id),
      label: c.name || "Danh mục",
      icon: ICON_MAP[c.slug] || guessIcon(c),
      hint: toHint(c),
      raw: c,
    }));

    return {
      title: root.name || "Danh mục",
      rootId: String(root.id),
      items,
      raw: root,
    };
  });
};

export default function CategoryScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState([]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await apiCategoriesTree();
      const tree = normalizeTree(res);

      const secs = buildSections(tree);

      if (!secs.length && tree.length) {
        setSections([
          {
            title: "Danh mục",
            rootId: "all",
            items: tree.map((c) => ({
              id: String(c.id),
              label: c.name || "Danh mục",
              icon: ICON_MAP[c.slug] || guessIcon(c),
              hint: toHint(c),
              raw: c,
            })),
          },
        ]);
      } else {
        setSections(secs);
      }
    } catch (e) {
      Alert.alert("Lỗi", e?.message || "Không tải được danh mục");
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [])
  );

  const openCategory = (item) => {
    navigation.navigate("CategoryDetail", { categoryId: item.id, title: item.label });
  };

  const content = useMemo(() => {
    if (loading) {
      return (
        <View style={styles.loadingBox}>
          <Text style={styles.loadingText}>Đang tải danh mục...</Text>
        </View>
      );
    }

    if (!sections.length) {
      return (
        <View style={styles.empty}>
          <Ionicons name="grid-outline" size={42} color={COLORS.MUTED} />
          <Text style={styles.emptyTitle}>Chưa có danh mục</Text>
          <Text style={styles.emptySub}>Thử tải lại sau</Text>
        </View>
      );
    }

    return sections.map((sec) => (
      <View key={sec.title} style={styles.section}>
        <Text style={styles.sectionTitle}>{sec.title}</Text>

        <View style={styles.list}>
          {sec.items.map((it, idx) => (
            <Pressable
              key={it.id}
              style={[styles.row, idx === 0 && styles.rowFirst, idx === sec.items.length - 1 && styles.rowLast]}
              onPress={() => openCategory(it)}
            >
              <View style={styles.left}>
                <View style={styles.iconBox}>
                  <Ionicons name={it.icon} size={20} color={COLORS.BLUE} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label} numberOfLines={1}>
                    {it.label}
                  </Text>
                  {!!it.hint && (
                    <Text style={styles.hint} numberOfLines={1}>
                      {it.hint}
                    </Text>
                  )}
                </View>
              </View>

              <Ionicons name="chevron-forward" size={18} color={COLORS.MUTED} />
            </Pressable>
          ))}
        </View>
      </View>
    ));
  }, [loading, sections]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>Danh mục</Text>
        <Text style={styles.h2}>Chọn chuyên mục để xem sản phẩm</Text>

        {content}

        <View style={{ height: 14 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
