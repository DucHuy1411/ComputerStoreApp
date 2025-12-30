import { StyleSheet } from "react-native";

export const COLORS = {
  BG: "#F6F8FC",
  TEXT: "#111",
  SUB: "#6B7280",
  BLUE: "#0B63F6",
  RED: "#EF4444",
  BORDER: "#EEF2F8",
  CARD: "#fff",
  MUTED_ICON: "#9AA0A6",
  EMPTY_SUB: "#9AA0A6",
  IMG_BG: "#F2F2F2",
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

  list: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 18, gap: 12 },

  empty: {
    marginTop: 12,
    backgroundColor: COLORS.CARD,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    padding: 18,
    alignItems: "center",
    gap: 6,
  },
  emptyTitle: { marginTop: 6, fontSize: 14, fontWeight: "900", color: COLORS.TEXT },
  emptySub: { fontSize: 12, fontWeight: "700", color: COLORS.EMPTY_SUB },

  row: {
    backgroundColor: COLORS.CARD,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  imgBox: {
    width: 72,
    height: 72,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    backgroundColor: COLORS.IMG_BG,
    overflow: "hidden",
  },
  img: { width: "100%", height: "100%", resizeMode: "cover" },

  name: { fontSize: 14, fontWeight: "900", color: COLORS.TEXT, lineHeight: 18 },
  meta: { marginTop: 4, fontSize: 12, fontWeight: "700", color: "#9AA0A6" },
  price: { marginTop: 8, fontSize: 16, fontWeight: "900", color: COLORS.BLUE },

  iconBtn: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
});

export default styles;
