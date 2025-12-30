import { StyleSheet } from "react-native";

export const COLORS = {
  BG: "#F6F8FC",
  TEXT: "#111",
  SUB: "#6B7280",
  BLUE: "#0B63F6",
  RED: "#E53935",

  WHITE: "#fff",
  BORDER: "#EEF2F8",
  BORDER_SOFT: "#E6E6E6",
  CARD_BORDER: "#E6EEF8",
  MUTED: "#9AA0A6",

  BADGE_BG: "#7C3AED",

  CYAN_BG: "#E9F7FF",
  CYAN_TEXT: "#0077B6",
  CYAN_BORDER: "#BFEAFF",

  TAG_BG: "#EAFBF3",
  TAG_BORDER: "#B9F0D3",
  TAG_TEXT: "#0F9D58",

  IMG_BG: "#F2F2F2",

  OVERLAY: "rgba(0,0,0,0.35)",

  MODAL_ACTIVE_BG: "#F2F7FF",
  MODAL_ACTIVE_BORDER: "#D6E6FF",

  CHECK_BORDER: "#D0D6E0",

  STAR: "#F5B400",
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.BG },

  header: { paddingHorizontal: 12, paddingTop: 6, paddingBottom: 8, flexDirection: "row", alignItems: "center" },
  headerIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: "900", color: COLORS.TEXT, marginLeft: 4 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 6 },

  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.BADGE_BG,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: { color: COLORS.WHITE, fontSize: 10, fontWeight: "900" },

  chips: { gap: 10, paddingHorizontal: 12, paddingBottom: 10 },
  chip: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 17,
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SOFT,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: { backgroundColor: COLORS.BLUE, borderColor: COLORS.BLUE },
  chipText: { fontSize: 12.5, fontWeight: "800", color: COLORS.TEXT },
  chipTextActive: { color: COLORS.WHITE },

  sortRow: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  sortLabel: { fontSize: 13, fontWeight: "800", color: COLORS.SUB },
  sortBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SOFT,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 36,
  },
  sortBtnText: { fontSize: 13, fontWeight: "900", color: COLORS.TEXT },

  loadingWrap: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10, paddingTop: 20 },
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

  list: { paddingHorizontal: 12, paddingBottom: 14, gap: 12 },

  card: { backgroundColor: COLORS.WHITE, borderRadius: 16, borderWidth: 1, borderColor: COLORS.CARD_BORDER, padding: 12 },
  cardInner: { flexDirection: "row", gap: 12 },

  imgBox: {
    width: 110,
    height: 110,
    borderRadius: 14,
    backgroundColor: COLORS.IMG_BG,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  img: { width: "100%", height: "100%", resizeMode: "cover" },

  heartBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SOFT,
    alignItems: "center",
    justifyContent: "center",
  },

  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: "900", color: COLORS.TEXT, lineHeight: 18 },

  specRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  specPill: {
    maxWidth: "100%",
    backgroundColor: COLORS.CYAN_BG,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.CYAN_BORDER,
  },
  specText: { fontSize: 12, fontWeight: "900", color: COLORS.CYAN_TEXT },

  rateRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  starsRow: { flexDirection: "row", gap: 2 },
  review: { marginLeft: 6, fontSize: 12, fontWeight: "800", color: COLORS.SUB },

  price: { marginTop: 8, fontSize: 16, fontWeight: "900", color: COLORS.BLUE },

  tagRow: { flexDirection: "row", gap: 8, marginTop: 10, flexWrap: "wrap" },
  tagPill: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: COLORS.TAG_BG,
    borderWidth: 1,
    borderColor: COLORS.TAG_BORDER,
  },
  tagText: { fontSize: 12, fontWeight: "900", color: COLORS.TAG_TEXT },

  modalOverlay: { flex: 1, backgroundColor: COLORS.OVERLAY, justifyContent: "flex-end" },
  modalSheet: {
    backgroundColor: COLORS.WHITE,
    padding: 14,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  modalTitle: { fontSize: 16, fontWeight: "900", color: COLORS.TEXT, marginBottom: 10 },

  modalRow: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    backgroundColor: COLORS.WHITE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalRowActive: { borderColor: COLORS.MODAL_ACTIVE_BORDER, backgroundColor: COLORS.MODAL_ACTIVE_BG },
  modalRowText: { fontSize: 14, fontWeight: "800", color: COLORS.TEXT },
  modalRowTextActive: { color: COLORS.BLUE },

  modalHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  resetText: { fontSize: 13, fontWeight: "900", color: COLORS.RED },

  groupTitle: { fontSize: 13, fontWeight: "900", color: COLORS.TEXT, marginTop: 6, marginBottom: 10 },
  groupWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },

  pill: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 17,
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SOFT,
    alignItems: "center",
    justifyContent: "center",
  },
  pillActive: { backgroundColor: COLORS.BLUE, borderColor: COLORS.BLUE },
  pillText: { fontSize: 12.5, fontWeight: "800", color: COLORS.TEXT },
  pillTextActive: { color: COLORS.WHITE },

  box: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    overflow: "hidden",
  },
  sep: { height: 1, backgroundColor: COLORS.BORDER },
  toggleRow: { height: 52, paddingHorizontal: 12, justifyContent: "center" },
  toggleLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  toggleLabel: { fontSize: 14, fontWeight: "800", color: COLORS.TEXT },

  checkBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.CHECK_BORDER,
    backgroundColor: COLORS.WHITE,
    alignItems: "center",
    justifyContent: "center",
  },
  checkBoxOn: { backgroundColor: COLORS.BLUE, borderColor: COLORS.BLUE },

  applyBtn: {
    marginTop: 14,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  applyText: { color: COLORS.WHITE, fontSize: 14, fontWeight: "900" },
});

export default styles;
