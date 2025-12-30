import { StyleSheet } from "react-native";

export const COLORS = {
    BG: "#F6F8FC",
    TEXT: "#111",
    SUB: "#6B7280",
    BLUE: "#0B63F6",
    BORDER: "#EEF2F8",
    CARD: "#fff",
    GREEN: "#22C55E",
    RED: "#EF4444",
    WHITE: "#fff",

    META_BG: "#F3F4F6",
    META_BORDER: "#E5E7EB",
    SECONDARY_BORDER: "#D6E6FF",
};

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.BG },

    header: {
        paddingHorizontal: 12,
        paddingTop: 6,
        paddingBottom: 8,
        flexDirection: "row",
        alignItems: "center",
    },
    headerBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: "900",
        color: COLORS.TEXT,
        textAlign: "center",
    },

    container: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 18, gap: 12 },

    hero: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.BORDER,
        padding: 14,
        alignItems: "center",
    },
    checkWrap: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.GREEN,
        alignItems: "center",
        justifyContent: "center",
    },
    heroTitle: { marginTop: 10, fontSize: 18, fontWeight: "900", color: COLORS.TEXT },
    heroSub: { marginTop: 6, fontSize: 13, fontWeight: "800", color: COLORS.SUB },

    metaRow: {
        marginTop: 12,
        flexDirection: "row",
        gap: 10,
        flexWrap: "wrap",
        justifyContent: "center",
    },
    metaPill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 10,
        height: 32,
        borderRadius: 999,
        backgroundColor: COLORS.META_BG,
        borderWidth: 1,
        borderColor: COLORS.META_BORDER,
    },
    metaText: { fontSize: 12.5, fontWeight: "900", color: COLORS.TEXT },

    card: {
        backgroundColor: COLORS.CARD,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.BORDER,
        padding: 12,
    },
    cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
    cardHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
    cardTitle: { fontSize: 14, fontWeight: "900", color: COLORS.TEXT },
    smallNote: { fontSize: 12.5, fontWeight: "800", color: COLORS.SUB },
    muted: { fontSize: 12.5, fontWeight: "800", color: COLORS.SUB },

    addrRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
    addrIcon: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: COLORS.BLUE,
        alignItems: "center",
        justifyContent: "center",
    },
    addrName: { fontSize: 14, fontWeight: "900", color: COLORS.TEXT },
    addrPhone: { marginTop: 4, fontSize: 12.5, fontWeight: "700", color: COLORS.SUB },
    addrText: { marginTop: 6, fontSize: 13, fontWeight: "700", color: COLORS.TEXT, lineHeight: 18 },

    itemRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    itemName: { fontSize: 13.5, fontWeight: "900", color: COLORS.TEXT },
    itemSub: { marginTop: 4, fontSize: 12, fontWeight: "700", color: COLORS.SUB },
    itemPrice: { fontSize: 13.5, fontWeight: "900", color: COLORS.BLUE },

    sumRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6 },
    sumLabel: { fontSize: 13, fontWeight: "800", color: COLORS.SUB },
    sumValue: { fontSize: 13, fontWeight: "900", color: COLORS.TEXT },

    divider: { height: 1, backgroundColor: COLORS.BORDER, marginTop: 10 },

    totalRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 },
    totalLabel: { fontSize: 13.5, fontWeight: "900", color: COLORS.TEXT },
    totalValue: { fontSize: 18, fontWeight: "900", color: COLORS.RED },

    primaryBtn: {
        height: 52,
        borderRadius: 14,
        backgroundColor: COLORS.BLUE,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 10,
    },
    primaryText: { fontSize: 14, fontWeight: "900", color: COLORS.WHITE },

    secondaryBtn: {
        marginTop: 10,
        height: 52,
        borderRadius: 14,
        backgroundColor: COLORS.WHITE,
        borderWidth: 1,
        borderColor: COLORS.SECONDARY_BORDER,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 10,
    },
    secondaryText: { fontSize: 14, fontWeight: "900", color: COLORS.BLUE },
});

export default styles;
