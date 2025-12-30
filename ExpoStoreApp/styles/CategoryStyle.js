import { StyleSheet } from "react-native";

export const COLORS = {
  BG: "#F6F8FC",
  TEXT: "#111",
  SUB: "#6B7280",
  BLUE: "#0B63F6",

  WHITE: "#fff",
  BORDER: "#EEF2F8",
  MUTED: "#9AA0A6",

  ICON_BG: "#EAF2FF",
  ICON_BORDER: "#D6E6FF",
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.BG },
  container: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 18 },

  h1: { fontSize: 22, fontWeight: "900", color: COLORS.TEXT },
  h2: { marginTop: 6, fontSize: 13, color: COLORS.SUB, fontWeight: "600" },

  loadingBox: {
    marginTop: 18,
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    padding: 18,
  },
  loadingText: { fontSize: 13, fontWeight: "800", color: COLORS.SUB },

  empty: {
    marginTop: 18,
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    padding: 18,
    alignItems: "center",
    gap: 6,
  },
  emptyTitle: { marginTop: 6, fontSize: 14, fontWeight: "900", color: COLORS.TEXT },
  emptySub: { fontSize: 12, fontWeight: "700", color: COLORS.MUTED },

  section: { marginTop: 14 },
  sectionTitle: { fontSize: 14, fontWeight: "900", color: COLORS.TEXT, marginBottom: 10 },

  list: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    overflow: "hidden",
  },

  row: {
    height: 66,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
    backgroundColor: COLORS.WHITE,
  },
  rowFirst: { borderTopWidth: 0 },
  rowLast: {},

  left: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1, paddingRight: 10 },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.ICON_BG,
    borderWidth: 1,
    borderColor: COLORS.ICON_BORDER,
    alignItems: "center",
    justifyContent: "center",
  },

  label: { fontSize: 14, fontWeight: "900", color: COLORS.TEXT },
  hint: { marginTop: 4, fontSize: 12, fontWeight: "700", color: COLORS.MUTED },
});

export default styles;
