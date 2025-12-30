import { StyleSheet } from "react-native";

export const COLORS = {
    BG: "#F6F8FC",
    BLUE: "#0B63F6",
    TEXT: "#111",

    WHITE: "#fff",
    BORDER: "#EEF2F8",

    TAGLINE: "#666",
    TAB_INACTIVE: "#777",
    TAB_LINE: "#E6E6E6",

    LABEL: "#222",
    INPUT_BORDER: "#E7E7E7",
    INPUT_BG: "#FBFBFB",
    ICON_GRAY: "#8A8A8A",

    AGREE_TEXT: "#333",

    HERO_GREEN: "#55D16B",
    HERO_RED: "#FF5A5A",
    HERO_PHONE_BG: "#EAF2FF",
    HERO_PHONE_BORDER: "#D6E6FF",
};

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.BG },
    container: { padding: 18, paddingBottom: 28 },

    header: { alignItems: "center", marginTop: 8, marginBottom: 10 },
    brand: { fontSize: 28, fontWeight: "800", color: COLORS.BLUE },
    tagline: { marginTop: 4, fontSize: 13, color: COLORS.TAGLINE },

    heroIconWrap: { flexDirection: "row", alignItems: "center", marginTop: 14, marginBottom: 10 },
    heroBarLeft: { width: 10, height: 34, borderRadius: 3, backgroundColor: COLORS.HERO_GREEN, marginRight: 10 },
    heroBarRight: { width: 10, height: 34, borderRadius: 3, backgroundColor: COLORS.HERO_RED, marginLeft: 10 },
    heroPhone: {
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: COLORS.HERO_PHONE_BG,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: COLORS.HERO_PHONE_BORDER,
    },

    welcome: { marginTop: 8, fontSize: 20, fontWeight: "800", color: COLORS.TEXT, textAlign: "center" },
    subwelcome: { marginTop: 6, fontSize: 13, color: COLORS.TAGLINE, textAlign: "center" },

    tabs: { flexDirection: "row", marginTop: 14, marginBottom: 12 },
    tabBtn: { flex: 1, alignItems: "center" },
    tabText: { fontSize: 15, fontWeight: "700", color: COLORS.TAB_INACTIVE },
    tabActive: { color: COLORS.BLUE },
    tabLine: { height: 2, width: "100%", backgroundColor: COLORS.TAB_LINE, marginTop: 10 },
    tabLineActive: { backgroundColor: COLORS.BLUE },

    form: { backgroundColor: COLORS.WHITE, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: COLORS.BORDER },
    label: { fontSize: 13, fontWeight: "700", color: COLORS.LABEL, marginTop: 10, marginBottom: 8 },
    inputWrap: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderWidth: 1,
        borderColor: COLORS.INPUT_BORDER,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: COLORS.INPUT_BG,
    },
    input: { flex: 1, fontSize: 14, color: COLORS.TEXT },

    agreeRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 12 },
    agreeText: { fontSize: 13, color: COLORS.AGREE_TEXT },

    primaryBtn: {
        marginTop: 14,
        backgroundColor: COLORS.BLUE,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 10,
        shadowColor: COLORS.BLUE,
        shadowOpacity: 0.18,
        shadowRadius: 8,
        elevation: 2,
    },
    primaryBtnDisabled: { opacity: 0.6 },
    primaryBtnText: { color: COLORS.WHITE, fontWeight: "800", fontSize: 15 },

    bottomRow: { flexDirection: "row", justifyContent: "center", marginTop: 14 },
    bottomText: { fontSize: 13, color: COLORS.TAGLINE },
    bottomLink: { color: COLORS.BLUE, fontWeight: "800" },
});

export default styles;
