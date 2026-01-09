import { StyleSheet } from "react-native";

export const COLORS = {
  BG: "#F6F8FC",
  TEXT: "#111",
  SUB: "#6B7280",
  BLUE: "#0B63F6",
  BORDER: "#EEF2F8",
  CARD: "#fff",
  WHITE: "#fff",
  MUTED: "#9AA0A6",
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
  headerTitle: { flex: 1, fontSize: 18, fontWeight: "900", color: COLORS.TEXT, textAlign: "center" },

  container: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 18, gap: 12 },

  card: {
    backgroundColor: COLORS.CARD,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    padding: 12,
  },
  row: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  iconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },

  titleRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 8 },
  title: { fontSize: 14, fontWeight: "900", color: COLORS.TEXT, flexShrink: 1 },
  sub: { marginTop: 4, fontSize: 12.5, fontWeight: "700", color: COLORS.SUB },

  pill: {
    backgroundColor: COLORS.BLUE,
    borderRadius: 12,
    paddingHorizontal: 8,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  pillText: { fontSize: 11.5, fontWeight: "900", color: COLORS.WHITE },

  infoBox: {
    backgroundColor: COLORS.CARD,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    padding: 14,
  },
  infoTitle: { fontSize: 13.5, fontWeight: "900", color: COLORS.TEXT },
  infoText: { marginTop: 6, fontSize: 12.5, fontWeight: "700", color: COLORS.SUB, lineHeight: 18 },
});

export default styles;
