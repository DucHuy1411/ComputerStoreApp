import { StyleSheet } from "react-native";

export const COLORS = {
    BG: "#F6F8FC",
    TEXT: "#111",
    SUB: "#6B7280",
    BLUE: "#0B63F6",
    CARD: "#fff",
    BORDER: "#EEF2F8",
    GREEN: "#22C55E",
    GREY: "#D1D5DB",
    RED: "#EF4444",

    MUTED: "#9AA0A6",
    LINE: "#E5E7EB",
    IMG_BG: "#F2F2F2",
    OUTLINE_BLUE: "#D6E6FF",
    AVATAR_BG: "#EAF2FF",
};

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.BG },
    container: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 18, gap: 12 },

    header: { paddingHorizontal: 12, paddingTop: 6, paddingBottom: 8, flexDirection: "row", alignItems: "center" },
    headerBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
    headerTitle: { flex: 1, fontSize: 18, fontWeight: "900", color: COLORS.TEXT },

    loadingWrap: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10 },
    loadingText: { fontSize: 13, fontWeight: "800", color: COLORS.SUB },

    empty: {
        marginTop: 18,
        marginHorizontal: 18,
        backgroundColor: COLORS.CARD,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.BORDER,
        padding: 18,
        alignItems: "center",
        gap: 6,
    },
    emptyTitle: { marginTop: 6, fontSize: 14, fontWeight: "900", color: COLORS.TEXT },
    emptySub: { fontSize: 12, fontWeight: "700", color: COLORS.MUTED },

    topCard: { backgroundColor: COLORS.CARD, borderRadius: 16, borderWidth: 1, borderColor: COLORS.BORDER, padding: 14, alignItems: "center" },
    bigIconWrap: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center", marginBottom: 10 },

    orderCode: { fontSize: 13, fontWeight: "800", color: COLORS.SUB, marginTop: 2 },
    orderCodeBlue: { color: COLORS.BLUE, fontWeight: "900" },

    statusPill: { marginTop: 10, borderRadius: 14, paddingHorizontal: 12, height: 30, alignItems: "center", justifyContent: "center" },
    statusPillText: { fontSize: 12.5, fontWeight: "900" },

    metaRow: { marginTop: 8, flexDirection: "row", alignItems: "center", gap: 8 },
    metaText: { fontSize: 13, fontWeight: "800", color: COLORS.SUB },

    topActions: { marginTop: 12, flexDirection: "row", gap: 12 },
    topBtn: { flex: 1, height: 42, borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderWidth: 1 },
    topBtnOutline: { backgroundColor: COLORS.CARD, borderColor: COLORS.OUTLINE_BLUE },
    topBtnText: { fontSize: 13, fontWeight: "900" },

    card: { backgroundColor: COLORS.CARD, borderRadius: 16, borderWidth: 1, borderColor: COLORS.BORDER, padding: 14 },
    cardTitle: { fontSize: 14.5, fontWeight: "900", color: COLORS.TEXT, marginBottom: 12 },
    muted: { fontSize: 12.5, fontWeight: "800", color: COLORS.MUTED },

    timeline: { gap: 10 },
    tRow: { flexDirection: "row", gap: 12 },
    dotCol: { width: 28, alignItems: "center" },
    dot: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, alignItems: "center", justifyContent: "center" },
    vLine: { width: 2, flex: 1, backgroundColor: COLORS.LINE, marginTop: 6, borderRadius: 1 },
    tContent: { flex: 1, paddingBottom: 6 },
    tTitle: { fontSize: 14, fontWeight: "900" },
    tTime: { marginTop: 4, fontSize: 12.5, fontWeight: "800", color: COLORS.SUB },
    tDesc: { marginTop: 4, fontSize: 12.5, fontWeight: "700", color: COLORS.MUTED, lineHeight: 17 },

    itemRow: { flexDirection: "row", alignItems: "center", gap: 12 },
    itemImgBox: { width: 54, height: 54, borderRadius: 12, backgroundColor: COLORS.IMG_BG, overflow: "hidden", borderWidth: 1, borderColor: COLORS.BORDER },
    itemImg: { width: "100%", height: "100%", resizeMode: "cover" },
    itemName: { fontSize: 13.5, fontWeight: "900", color: COLORS.TEXT, lineHeight: 18 },
    itemSub: { marginTop: 6, fontSize: 12.5, fontWeight: "800", color: COLORS.SUB },
    itemTotal: { fontSize: 13.5, fontWeight: "900", color: COLORS.BLUE },

    moneyBox: { marginTop: 12, backgroundColor: COLORS.CARD, borderRadius: 14, borderWidth: 1, borderColor: COLORS.BORDER, padding: 12, gap: 8 },
    moneyRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    moneyLabel: { fontSize: 13, fontWeight: "800", color: COLORS.SUB },
    moneyValue: { fontSize: 13, fontWeight: "900", color: COLORS.TEXT },
    moneyDivider: { height: 1, backgroundColor: COLORS.BORDER, marginTop: 6 },

    payRow: { marginTop: 6, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    payLabel: { fontSize: 13, fontWeight: "800", color: COLORS.SUB },
    payValue: { fontSize: 13, fontWeight: "900" },

    moneyTotalLabel: { fontSize: 15, fontWeight: "900", color: COLORS.TEXT },
    moneyTotalValue: { fontSize: 18, fontWeight: "900", color: COLORS.RED },

    shipHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    callBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.GREEN, alignItems: "center", justifyContent: "center" },

    shipRow: { flexDirection: "row", gap: 12, alignItems: "center" },
    shipAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.AVATAR_BG, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: COLORS.OUTLINE_BLUE },
    shipAvatarText: { fontSize: 18, fontWeight: "900", color: COLORS.BLUE },
    shipName: { fontSize: 14.5, fontWeight: "900", color: COLORS.TEXT },
    shipSub: { marginTop: 4, fontSize: 12.5, fontWeight: "800", color: COLORS.SUB },
    shipPhone: { marginTop: 6, fontSize: 13, fontWeight: "900", color: COLORS.TEXT },
    shipAddr: { marginTop: 6, fontSize: 12.5, fontWeight: "700", color: COLORS.MUTED, lineHeight: 17 },
});

export default styles;
