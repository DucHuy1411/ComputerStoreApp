import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
    StyleSheet,
    Text,
    View,
    Pressable,
    TextInput,
    ScrollView,
    FlatList,
    Image,
    ActivityIndicator,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { apiProducts, apiTrends, apiRecentSearch, apiAddRecentSearch, apiRemoveRecentSearch, apiClearRecentSearch } from "../services/endpoints";

import styles, { COLORS } from "../styles/SearchStyle";

const { BG, TEXT, SUB, BLUE, RED } = COLORS;

const Chip = ({ label, onPress, active }) => (
  <Pressable onPress={onPress} style={[styles.chip, active && styles.chipOn]}>
    <Text style={[styles.chipText, active && styles.chipTextOn]}>{label}</Text>
  </Pressable>
);

const formatVnd = (n) => {
    const s = Math.round(Number(n || 0)).toString();
    return `${s.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ`;
};

const parseJsonArray = (v, fallback = []) => {
    if (Array.isArray(v)) return v;
    if (typeof v !== "string") return fallback;
    try {
        const x = JSON.parse(v);
        return Array.isArray(x) ? x : fallback;
    } catch {
        return fallback;
    }
};

const pickFirstImage = (p) => {
    if (p.image) return p.image;
    if (p.thumbnail) return p.thumbnail;
    if (p.thumb) return p.thumb;

    const imgs = parseJsonArray(p.images, []);
    if (imgs.length > 0) return imgs[0];

    return "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80";
};

const normalizeProduct = (p) => ({
    id: String(p.id),
    name: p.name || "Sản phẩm",
    price: Number(p.price || 0),
    priceText: formatVnd(p.price),
    ratingAvg: Number(p.ratingAvg || 0),
    reviews: Number(p.reviewsCount || 0),
    isFreeship: !!p.isFreeship,
    isInstallment0: !!p.isInstallment0,
    discountPct: Number(p.discountPct || 0),
    img: pickFirstImage(p),
    raw: p,
});

const applyChipToQuery = (chip) => {
    // map chip -> params cho /products
    if (chip === "Dưới 15 triệu") return { maxPrice: 14999999 };
    if (chip === "Laptop gaming") return { q: "gaming" };
    if (chip === "Miễn phí ship") return { freeship: "1" };
    if (chip === "Trả góp 0%") return { installment0: "1" };
    return {};
};

export default function SearchScreen({ navigation }) {
    const [q, setQ] = useState("");
    const [activeChip, setActiveChip] = useState("");

    const chips = useMemo(() => ["Dưới 15 triệu", "Laptop gaming", "Miễn phí ship", "Trả góp 0%"], []);

    const [recent, setRecent] = useState([]); // [{id, term}]
    const [trends, setTrends] = useState([]); // string[]
    const [popularCats] = useState([
        { id: "laptop", label: "Laptop", count: 234, icon: "laptop-outline" },
        { id: "pc", label: "PC & Linh kiện", count: 189, icon: "desktop-outline" },
        { id: "monitor", label: "Màn hình", count: 156, icon: "tv-outline" },
        { id: "keyboard", label: "Bàn phím", count: 98, icon: "keypad-outline" },
    ]);

    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]); // normalized products
    const [mode, setMode] = useState("discovery"); // discovery | results

    const loadDiscovery = useCallback(async () => {
        try {
            const [r1, r2] = await Promise.allSettled([apiRecentSearch(), apiTrends()]);

            if (r1.status === "fulfilled") {
                const rows = r1.value?.items || r1.value?.recent || r1.value?.terms || [];
                // BE có thể trả: [{id, term}] hoặc ["abc"]
                const mapped = rows
                    .map((x) => {
                        if (typeof x === "string") return { id: x, term: x };
                        return { id: String(x.id ?? x.term ?? ""), term: String(x.term ?? "") };
                    })
                    .filter((x) => x.term);
                setRecent(mapped);
            } else {
                setRecent([{ id: "laptop gaming", term: "laptop gaming" }, { id: "chuột không dây", term: "chuột không dây" }, { id: "bàn phím cơ", term: "bàn phím cơ" }]);
            }

            if (r2.status === "fulfilled") {
                const t = r2.value?.items || r2.value?.trends || r2.value || [];
                const arr = Array.isArray(t) ? t : [];
                setTrends(arr.map((x) => (typeof x === "string" ? x : x?.term)).filter(Boolean));
            } else {
                setTrends(["MacBook Air M2", "RTX 4070 laptop", "Gaming gear", "Laptop văn phòng", "PC build 2024"]);
            }
        } catch {
            setRecent([{ id: "laptop gaming", term: "laptop gaming" }, { id: "chuột không dây", term: "chuột không dây" }, { id: "bàn phím cơ", term: "bàn phím cơ" }]);
            setTrends(["MacBook Air M2", "RTX 4070 laptop", "Gaming gear", "Laptop văn phòng", "PC build 2024"]);
        }
    }, []);

    useEffect(() => {
        loadDiscovery();
    }, [loadDiscovery]);

    const search = useCallback(
        async (text, chip) => {
            const keyword = String(text || "").trim();
            const chipParams = chip ? applyChipToQuery(chip) : {};

            if (!keyword && !chip) {
                setMode("discovery");
                setResults([]);
                return;
            }

            try {
                setLoading(true);
                setMode("results");

                const params = {
                    ...(keyword ? { q: keyword } : {}),
                    ...chipParams,
                    sort: "popular",
                    limit: 50,
                    offset: 0,
                };

                Object.keys(params).forEach((k) => params[k] === undefined && delete params[k]);

                const res = await apiProducts(params);
                const rows = (res?.products || []).map(normalizeProduct);
                setResults(rows);

                if (keyword) {
                    // best effort lưu recent, nếu BE lỗi thì vẫn update local
                    setRecent((prev) => {
                        const exists = prev.some((x) => x.term.toLowerCase() === keyword.toLowerCase());
                        if (exists) return prev;
                        return [{ id: keyword, term: keyword }, ...prev].slice(0, 12);
                    });
                    try {
                        await apiAddRecentSearch(keyword);
                    } catch { }
                }
            } catch (e) {
                setResults([]);
                Alert.alert("Lỗi", e?.message || "Không tìm được sản phẩm");
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const onSubmit = () => {
        search(q, activeChip);
    };

    const removeRecent = async (idOrTerm) => {
        const key = String(idOrTerm);
        setRecent((prev) => prev.filter((x) => x.id !== key && x.term !== key));
        try {
            await apiRemoveRecentSearch(key);
        } catch { }
    };

    const clearRecent = async () => {
        setRecent([]);
        try {
            await apiClearRecentSearch();
        } catch { }
    };

    const onPressTrend = (t) => {
        setQ(t);
        setActiveChip("");
        search(t, "");
    };

    const onPressRecent = (term) => {
        setQ(term);
        setActiveChip("");
        search(term, "");
    };

    const onPressChip = (c) => {
        const next = activeChip === c ? "" : c;
        setActiveChip(next);
        search(q, next);
    };

    const ProductRow = ({ item }) => (
        <Pressable
            style={styles.resultRow}
            onPress={() => navigation.navigate("ProductDetail", { productId: item.id, product: item.raw })}
        >
            <View style={styles.resultImgBox}>
                <Image source={{ uri: item.img }} style={styles.resultImg} />
            </View>

            <View style={{ flex: 1 }}>
                <Text style={styles.resultName} numberOfLines={2}>
                    {item.name}
                </Text>

                <View style={styles.resultMetaRow}>
                    {item.isFreeship ? <Text style={styles.metaTag}>Freeship</Text> : null}
                    {item.isInstallment0 ? <Text style={styles.metaTag}>Trả góp 0%</Text> : null}
                </View>

                <Text style={styles.resultPrice}>{item.priceText}</Text>
            </View>

            <Ionicons name="chevron-forward" size={18} color="#9AA0A6" />
        </Pressable>
    );

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>
                {/* Search header */}
                <View style={styles.searchRow}>
                    <Pressable style={styles.back} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={22} color={TEXT} />
                    </Pressable>

                    <View style={styles.searchBox}>
                        <TextInput
                            value={q}
                            onChangeText={(t) => {
                                setQ(t);
                                if (!t.trim() && !activeChip) {
                                    setMode("discovery");
                                    setResults([]);
                                }
                            }}
                            placeholder="Tìm laptop, PC, phụ kiện..."
                            placeholderTextColor="#9AA0A6"
                            style={styles.searchInput}
                            returnKeyType="search"
                            onSubmitEditing={onSubmit}
                        />
                        <Pressable style={styles.micBtn} onPress={onSubmit}>
                            <Ionicons name="search" size={18} color={BLUE} />
                        </Pressable>
                    </View>
                </View>

                {/* Chips */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.chipsScroll}
                    contentContainerStyle={styles.chipsRow}
                    >
                    {chips.map((c) => (
                        <Chip key={c} label={c} active={activeChip === c} onPress={() => onPressChip(c)} />
                    ))}
                </ScrollView>


                {/* Body */}
                {mode === "results" ? (
                    <View style={{ flex: 1 }}>
                        {loading ? (
                            <View style={styles.loadingWrap}>
                                <ActivityIndicator />
                                <Text style={styles.loadingText}>Đang tìm...</Text>
                            </View>
                        ) : (
                            <FlatList
                                data={results}
                                keyExtractor={(i) => i.id}
                                renderItem={ProductRow}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 14 }}
                                ListEmptyComponent={
                                    <View style={styles.empty}>
                                        <Ionicons name="search-outline" size={42} color="#9AA0A6" />
                                        <Text style={styles.emptyTitle}>Không có kết quả</Text>
                                        <Text style={styles.emptySub}>Thử từ khóa khác</Text>
                                    </View>
                                }
                            />
                        )}
                    </View>
                ) : (
                    <ScrollView contentContainerStyle={{ paddingBottom: 14 }} showsVerticalScrollIndicator={false}>
                        {/* Recent */}
                        <View style={styles.sectionRow}>
                            <View style={styles.sectionLeft}>
                                <Ionicons name="time-outline" size={18} color={TEXT} />
                                <Text style={styles.sectionTitle}>Tìm kiếm gần đây</Text>
                            </View>

                            <Pressable onPress={clearRecent}>
                                <Text style={styles.clearAll}>Xóa tất cả</Text>
                            </Pressable>
                        </View>

                        <View style={styles.recentWrap}>
                            {recent.map((x) => (
                                <Pressable key={x.id} style={styles.recentChip} onPress={() => onPressRecent(x.term)}>
                                    <Text style={styles.recentText}>{x.term}</Text>
                                    <Pressable onPress={() => removeRecent(x.id)} hitSlop={10}>
                                        <Ionicons name="close" size={14} color="#6B7280" />
                                    </Pressable>
                                </Pressable>
                            ))}
                            {recent.length === 0 ? <Text style={styles.emptyHint}>Chưa có lịch sử</Text> : null}
                        </View>

                        {/* Trends */}
                        <View style={[styles.sectionRow, { marginTop: 14 }]}>
                            <View style={styles.sectionLeft}>
                                <Ionicons name="flame-outline" size={18} color={TEXT} />
                                <Text style={styles.sectionTitle}>Xu hướng tìm kiếm</Text>
                            </View>
                        </View>

                        <View style={styles.list}>
                            {trends.map((t, idx) => (
                                <Pressable key={t} style={[styles.listRow, idx === 0 && styles.listRowFirst]} onPress={() => onPressTrend(t)}>
                                    <View style={styles.trendIcon}>
                                        <Ionicons name="trending-up" size={16} color="#fff" />
                                    </View>
                                    <Text style={styles.listText}>{t}</Text>
                                    <Ionicons name="chevron-forward" size={18} color="#9AA0A6" />
                                </Pressable>
                            ))}
                        </View>

                        {/* Popular categories */}
                        <View style={[styles.sectionRow, { marginTop: 14 }]}>
                            <View style={styles.sectionLeft}>
                                <Ionicons name="grid-outline" size={18} color={TEXT} />
                                <Text style={styles.sectionTitle}>Danh mục phổ biến</Text>
                            </View>
                        </View>

                        <View style={styles.grid}>
                            {popularCats.map((c) => (
                                <Pressable
                                    key={c.id}
                                    style={styles.catCard}
                                    onPress={() =>
                                        navigation.navigate("Category", {
                                            screen: "CategoryDetail",
                                            params: { categoryId: c.id, title: c.label },
                                        })
                                    }
                                >
                                    <View style={styles.catIconBox}>
                                        <Ionicons name={c.icon} size={22} color={BLUE} />
                                    </View>
                                    <Text style={styles.catName}>{c.label}</Text>
                                    <Text style={styles.catCount}>({c.count} sản phẩm)</Text>
                                </Pressable>
                            ))}
                        </View>
                    </ScrollView>
                )}
            </View>
        </SafeAreaView>
    );
}