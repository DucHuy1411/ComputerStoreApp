import { StyleSheet } from "react-native";

export const COLORS = {
    BG: "#F6F8FC",
    TEXT: "#111",
    SUB: "#6B7280",
    BLUE: "#0B63F6",
    BORDER: "#EEF2F8",
    RED: "#EF4444",
    CARD: "#fff",
    WHITE: "#fff",
    GREEN: "#22C55E",
    MUTED: "#9AA0A6",
    GRAY_200: "#D1D5DB",
    OVERLAY: "rgba(0,0,0,0.35)",
    BLACK: "#000",
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
    headerBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
    headerTitle: { flex: 1, fontSize: 18, fontWeight: "900", color: COLORS.TEXT },

    container: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 18, gap: 12 },

    card: {
        backgroundColor: COLORS.CARD,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.BORDER,
        padding: 12,
    },
    cardDefault: { borderColor: COLORS.BLUE, borderWidth: 2 },

    topRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
    leftIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },

    nameRow: { flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap" },
    name: { fontSize: 14, fontWeight: "900", color: COLORS.TEXT },
    defaultPill: {
        backgroundColor: COLORS.GREEN,
        borderRadius: 12,
        paddingHorizontal: 10,
        height: 24,
        alignItems: "center",
        justifyContent: "center",
    },
    defaultText: { color: COLORS.WHITE, fontSize: 12, fontWeight: "900" },

    phone: { marginTop: 4, fontSize: 12.5, fontWeight: "700", color: COLORS.SUB },
    addr: { marginTop: 6, fontSize: 13, fontWeight: "700", color: COLORS.TEXT, lineHeight: 18 },

    btnRow: { flexDirection: "row", gap: 10, marginTop: 12, flexWrap: "wrap" },
    btn: {
        height: 40,
        borderRadius: 12,
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        borderWidth: 1,
    },
    btnText: { fontSize: 13, fontWeight: "900" },

    btnBlue: { backgroundColor: COLORS.WHITE, borderColor: COLORS.BLUE },
    btnRed: { backgroundColor: COLORS.WHITE, borderColor: COLORS.RED },
    btnOutlineBlue: { backgroundColor: COLORS.WHITE, borderColor: COLORS.BLUE },

    fab: {
        position: "absolute",
        right: 18,
        bottom: 18,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.BLUE,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: COLORS.BLACK,
        shadowOpacity: 0.18,
        shadowRadius: 10,
        elevation: 5,
    },

    modalOverlay: { flex: 1, backgroundColor: COLORS.OVERLAY, justifyContent: "flex-end" },
    sheet: {
        backgroundColor: COLORS.WHITE,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        borderWidth: 1,
        borderColor: COLORS.BORDER,
        overflow: "hidden",
        maxHeight: "88%",
    },
    sheetHeader: {
        paddingHorizontal: 14,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: COLORS.BORDER,
    },
    sheetTitle: { fontSize: 16, fontWeight: "900", color: COLORS.TEXT },
    sheetClose: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
    sheetBody: { paddingHorizontal: 14, paddingTop: 12, paddingBottom: 14 },

    label: { marginTop: 10, marginBottom: 6, fontSize: 12.5, fontWeight: "800", color: COLORS.TEXT },
    input: {
        height: 44,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.BORDER,
        paddingHorizontal: 12,
        backgroundColor: COLORS.WHITE,
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.TEXT,
    },

    chipRow: { flexDirection: "row", gap: 10, marginBottom: 4, flexWrap: "wrap" },
    chip: {
        height: 36,
        borderRadius: 18,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: COLORS.BORDER,
        backgroundColor: COLORS.WHITE,
        alignItems: "center",
        justifyContent: "center",
    },
    chipOn: { borderColor: COLORS.BLUE },
    chipText: { fontSize: 13, fontWeight: "900", color: COLORS.TEXT },
    chipTextOn: { color: COLORS.BLUE },

    defaultRow: { marginTop: 12, flexDirection: "row", alignItems: "center", gap: 10 },
    defaultRowText: { fontSize: 13, fontWeight: "800", color: COLORS.TEXT },

    sheetFooter: {
        padding: 12,
        flexDirection: "row",
        gap: 10,
        borderTopWidth: 1,
        borderTopColor: COLORS.BORDER,
    },
    footerBtn: { flex: 1, height: 46, borderRadius: 14, alignItems: "center", justifyContent: "center" },
    footerGhost: { backgroundColor: COLORS.WHITE, borderWidth: 1, borderColor: COLORS.BLUE },
    footerPrimary: { backgroundColor: COLORS.BLUE },
    footerBtnText: { fontSize: 14, fontWeight: "900" },
});

export default styles;
