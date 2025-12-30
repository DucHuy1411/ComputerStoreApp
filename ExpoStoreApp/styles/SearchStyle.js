import { StyleSheet } from "react-native";

export const COLORS = {
  BG: "#F6F8FC",
  TEXT: "#111",
  SUB: "#6B7280",
  BLUE: "#0B63F6",
  RED: "#E53935",

  MUTED: "#9AA0A6",
  BORDER: "#EEF2F8",
  WHITE: "#fff",
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.BG },
  container: { flex: 1, paddingHorizontal: 18, paddingTop: 10, paddingBottom: 0 },

  searchRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  back: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },

  searchBox: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: COLORS.BLUE,
    backgroundColor: COLORS.WHITE,
    paddingLeft: 14,
    paddingRight: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchInput: { flex: 1, fontSize: 14, fontWeight: "700", color: COLORS.TEXT },
  micBtn: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },

  // FIX khoảng cách trước "Tìm kiếm gần đây"
  chipsScroll: {
    flexGrow: 0,       // khóa chiều cao thanh chips (chip cao 34)
    paddingVertical: 10,
  },

  chipsRow: {
    gap: 10,
    paddingRight: 6,
    paddingBottom: 0,    // bỏ cái gây phình chiều cao
    alignItems: "center", // canh giữa theo trục dọc
  },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 17,
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    alignItems: "center",
    justifyContent: "center",
  },
  chipOn: { backgroundColor: COLORS.BLUE, borderColor: COLORS.BLUE },
  chipText: { fontSize: 12.5, fontWeight: "800", color: COLORS.TEXT },
  chipTextOn: { color: COLORS.WHITE },

  // FIX khoảng cách trước "Tìm kiếm gần đây"
  sectionRow: { marginTop: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },

  sectionLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionTitle: { fontSize: 14, fontWeight: "900", color: COLORS.TEXT },
  clearAll: { fontSize: 13, fontWeight: "900", color: COLORS.BLUE },

  emptyHint: { fontSize: 12.5, fontWeight: "800", color: COLORS.MUTED, marginTop: 6 },

  recentWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 10 },
  recentChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 17,
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: "#E6E6E6",
  },
  recentText: { fontSize: 12.5, fontWeight: "800", color: COLORS.TEXT },

  list: {
    marginTop: 10,
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    overflow: "hidden",
  },
  listRow: {
    height: 54,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  listRowFirst: { borderTopWidth: 0 },
  trendIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FB6A4A",
    alignItems: "center",
    justifyContent: "center",
  },
  listText: { flex: 1, fontSize: 13.5, fontWeight: "900", color: COLORS.TEXT },

  grid: { marginTop: 10, flexDirection: "row", flexWrap: "wrap", gap: 12 },
  catCard: {
    width: "48.4%",
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    padding: 12,
    alignItems: "center",
  },
  catIconBox: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#F2F7FF",
    borderWidth: 1,
    borderColor: "#D6E6FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  catName: { fontSize: 13.5, fontWeight: "900", color: COLORS.TEXT, textAlign: "center" },
  catCount: { marginTop: 4, fontSize: 12, fontWeight: "800", color: COLORS.SUB },

  loadingWrap: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10 },
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

  resultRow: {
    marginTop: 12,
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  resultImgBox: {
    width: 72,
    height: 72,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    backgroundColor: "#F2F2F2",
    overflow: "hidden",
  },
  resultImg: { width: "100%", height: "100%", resizeMode: "cover" },

  resultName: { fontSize: 14, fontWeight: "900", color: COLORS.TEXT, lineHeight: 18 },
  resultMetaRow: { marginTop: 8, flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },

  metaTag: {
    backgroundColor: "#EAFBF3",
    borderWidth: 1,
    borderColor: "#B9F0D3",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 26,
    textAlignVertical: "center",
    fontSize: 12,
    fontWeight: "900",
    color: "#0F9D58",
  },

  resultPrice: { marginTop: 8, fontSize: 16, fontWeight: "900", color: COLORS.BLUE },
});

export default styles;
