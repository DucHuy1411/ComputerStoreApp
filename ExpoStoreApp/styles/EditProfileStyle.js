import { StyleSheet } from "react-native";

export const COLORS = {
    BG: "#F6F8FC",
    TEXT: "#111",
    SUB: "#6B7280",
    BLUE: "#0B63F6",
    RED: "#EF4444",
    BORDER: "#EEF2F8",
    WHITE: "#fff",
};

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.BG },

    header: {
        paddingHorizontal: 12,
        paddingTop: 6,
        paddingBottom: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    headerBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
    headerTitle: { flex: 1, fontSize: 18, fontWeight: "900", color: COLORS.TEXT },

    loadingWrap: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10 },
    loadingText: { fontSize: 13, fontWeight: "800", color: COLORS.SUB },

    container: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 18, gap: 12 },

    card: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.BORDER,
        padding: 14,
    },
    cardHeadRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
    cardTitle: { fontSize: 14.5, fontWeight: "900", color: COLORS.TEXT },

    label: { marginTop: 12, marginBottom: 8, fontSize: 13, fontWeight: "800", color: "#222" },
    inputWrap: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderWidth: 1,
        borderColor: "#E7E7E7",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: "#FBFBFB",
    },
    input: { flex: 1, fontSize: 14, color: "#111" },

    muted: { marginTop: 8, fontSize: 12.5, fontWeight: "700", color: COLORS.SUB, lineHeight: 18 },

    hintRed: { marginTop: 8, fontSize: 12.5, fontWeight: "800", color: COLORS.RED },

    pill: {
        height: 26,
        borderRadius: 999,
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
    },
    pillOn: { backgroundColor: "#EAF2FF", borderColor: "#D6E6FF" },
    pillOff: { backgroundColor: "#F3F4F6", borderColor: "#E5E7EB" },
    pillText: { fontSize: 11.5, fontWeight: "900" },
    pillTextOn: { color: COLORS.BLUE },
    pillTextOff: { color: COLORS.SUB },

    saveBtn: {
        marginTop: 2,
        height: 52,
        borderRadius: 14,
        backgroundColor: COLORS.BLUE,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 10,
    },
    saveBtnDisabled: { opacity: 0.6 },
    saveText: { fontSize: 14, fontWeight: "900", color: COLORS.WHITE },

    cancelBtn: {
        marginTop: 10,
        height: 52,
        borderRadius: 14,
        backgroundColor: COLORS.WHITE,
        borderWidth: 1,
        borderColor: "#D6E6FF",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 10,
    },
    cancelText: { fontSize: 14, fontWeight: "900", color: COLORS.BLUE },
});

export default styles;
