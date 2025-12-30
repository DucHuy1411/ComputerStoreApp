import { StyleSheet, Dimensions } from "react-native";

export const COLORS = {
    BG: "#F6F8FC",
    TEXT: "#111",
    SUB: "#9AA0A6",
    BLUE: "#0B63F6",
    RED: "#EF4444",
    GREEN: "#22C55E",

    BORDER: "#EEF2F8",
    WHITE: "#fff",
    GREY_BORDER: "#E6E6E6",
    DOT: "#D0D6E0",
    SHADOW: "#000",
    SPEC_BG: "#EAF2FF",
    SPEC_BORDER: "#D6E6FF",
};

const { width } = Dimensions.get("window");

export const LAYOUT = {
    PAD: 18,
    IMG_W: width - 18 * 2,
    IMG_H: 290,
    SPEC_W: (width - 18 * 2 - 12) / 2,
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
    headerIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
    headerTitle: { flex: 1, fontSize: 16, fontWeight: "900", color: COLORS.TEXT },
    headerRight: { flexDirection: "row", alignItems: "center", gap: 6 },

    badge: {
        position: "absolute",
        top: 6,
        right: 6,
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: COLORS.RED,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 4,
    },
    badgeText: { color: COLORS.WHITE, fontSize: 10, fontWeight: "900" },

    container: { paddingHorizontal: LAYOUT.PAD, paddingBottom: 18 },

    imgWrap: {
        marginTop: 6,
        borderRadius: 16,
        backgroundColor: COLORS.WHITE,
        borderWidth: 1,
        borderColor: COLORS.BORDER,
        overflow: "hidden",
    },
    imgPage: { width: LAYOUT.IMG_W, height: LAYOUT.IMG_H, alignItems: "center", justifyContent: "center" },
    img: { width: "88%", height: "88%", resizeMode: "contain" },

    dots: {
        position: "absolute",
        bottom: 10,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
        gap: 6,
    },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.DOT },
    dotActive: { width: 18, backgroundColor: COLORS.TEXT },

    fabCol: { position: "absolute", top: 12, right: 12, gap: 10 },
    fab: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.WHITE,
        borderWidth: 1,
        borderColor: COLORS.GREY_BORDER,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: COLORS.SHADOW,
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 2,
    },

    loadingOverlay: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255,0.45)",
    },

    name: { marginTop: 12, fontSize: 16, fontWeight: "900", color: COLORS.TEXT, lineHeight: 22 },

    infoRow: { flexDirection: "row", gap: 10, marginTop: 10, flexWrap: "wrap" },
    infoPill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 12,
        height: 34,
        borderRadius: 17,
        backgroundColor: COLORS.WHITE,
        borderWidth: 1,
        borderColor: COLORS.SPEC_BORDER,
    },
    infoText: { fontSize: 12.5, fontWeight: "900", color: COLORS.BLUE },

    meta: { marginTop: 8, fontSize: 12.5, fontWeight: "700", color: COLORS.SUB },

    priceRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 12, flexWrap: "wrap" },
    priceNow: { fontSize: 24, fontWeight: "900", color: COLORS.BLUE },
    priceOld: { fontSize: 14, fontWeight: "800", color: COLORS.SUB, textDecorationLine: "line-through" },
    discountPill: { backgroundColor: COLORS.RED, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
    discountText: { color: COLORS.WHITE, fontSize: 12, fontWeight: "900" },

    installment: {
        marginTop: 12,
        backgroundColor: COLORS.WHITE,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: COLORS.BORDER,
        paddingHorizontal: 12,
        height: 54,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    installLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
    greenPill: { backgroundColor: COLORS.GREEN, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
    greenPillText: { color: COLORS.WHITE, fontSize: 12, fontWeight: "900" },
    installText: { fontSize: 13, fontWeight: "800", color: COLORS.TEXT },
    installMoney: { color: COLORS.GREEN },

    specGrid: { marginTop: 12, flexDirection: "row", flexWrap: "wrap", gap: 12 },
    specCard: {
        width: LAYOUT.SPEC_W,
        backgroundColor: COLORS.WHITE,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: COLORS.BORDER,
        padding: 12,
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
    },
    specIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: COLORS.SPEC_BG,
        borderWidth: 1,
        borderColor: COLORS.SPEC_BORDER,
        alignItems: "center",
        justifyContent: "center",
    },
    specK: { fontSize: 11.5, fontWeight: "800", color: COLORS.SUB },
    specV: { marginTop: 2, fontSize: 12.5, fontWeight: "900", color: COLORS.TEXT },

    qtyBlock: { marginTop: 14 },
    qtyLabel: { fontSize: 13, fontWeight: "900", color: COLORS.TEXT },
    qtyRow: { marginTop: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },

    stepper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.GREY_BORDER,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: COLORS.WHITE,
    },
    stepBtn: { width: 46, height: 40, alignItems: "center", justifyContent: "center" },
    stepTxt: { fontSize: 20, fontWeight: "900", color: COLORS.TEXT },
    stepMid: {
        width: 56,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: COLORS.GREY_BORDER,
    },
    qtyNum: { fontSize: 14, fontWeight: "900", color: COLORS.TEXT },

    stock: { fontSize: 12.5, fontWeight: "900", color: COLORS.GREEN },

    bottomBar: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: COLORS.WHITE,
        borderTopWidth: 1,
        borderTopColor: COLORS.BORDER,
        paddingHorizontal: 12,
        paddingTop: 10,
        paddingBottom: 12,
        flexDirection: "row",
        gap: 12,
    },
    addBtn: {
        flex: 1,
        height: 52,
        borderRadius: 14,
        backgroundColor: COLORS.SPEC_BG,
        borderWidth: 1,
        borderColor: COLORS.SPEC_BORDER,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 10,
    },
    addText: { fontSize: 14, fontWeight: "900", color: COLORS.BLUE },

    buyBtn: { flex: 1, height: 52, borderRadius: 14, backgroundColor: COLORS.BLUE, alignItems: "center", justifyContent: "center" },
    buyText: { fontSize: 14, fontWeight: "900", color: COLORS.WHITE },
});

export default styles;
