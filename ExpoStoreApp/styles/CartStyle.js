import { StyleSheet } from "react-native";

export const COLORS = {
  BG: "#F6F8FC",
  TEXT: "#111",
  SUB: "#6B7280",
  BLUE: "#0B63F6",
  TEAL: "#0E7490",
  RED: "#EF4444",

  WHITE: "#fff",
  BORDER: "#EEF2F8",
  MUTED: "#9AA0A6",
  CB_BORDER: "#D0D6E0",
  STEP_BORDER: "#E6E6E6",
  IMG_BG: "#F2F2F2",
  GREEN_SHIP: "#0F9D58",
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.BG },

  header: { paddingHorizontal: 12, paddingTop: 6, paddingBottom: 8, flexDirection: "row", alignItems: "center" },
  headerIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: "900", color: COLORS.TEXT },
  clearText: { color: COLORS.RED, fontSize: 13, fontWeight: "900" },

  content: { flex: 1, paddingHorizontal: 12 },

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

  cb: {
    width: 22,
    height: 22,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.CB_BORDER,
    backgroundColor: COLORS.WHITE,
    alignItems: "center",
    justifyContent: "center",
  },
  cbOn: { backgroundColor: COLORS.TEAL, borderColor: COLORS.TEAL },

  selectAll: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    paddingHorizontal: 12,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  selectLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  selectText: { fontSize: 14, fontWeight: "900", color: COLORS.TEXT },
  selectRight: { fontSize: 13, fontWeight: "900", color: COLORS.BLUE },

  itemCard: {
    marginTop: 12,
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    padding: 12,
  },
  itemRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  itemImgBox: {
    width: 72,
    height: 72,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    backgroundColor: COLORS.IMG_BG,
    overflow: "hidden",
  },
  itemImg: { width: "100%", height: "100%", resizeMode: "cover" },

  itemTopRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 10 },
  trashBtn: { paddingTop: 2 },

  itemName: { flex: 1, fontSize: 14, fontWeight: "900", color: COLORS.TEXT, lineHeight: 18 },
  itemSub: { marginTop: 4, fontSize: 12, fontWeight: "700", color: COLORS.MUTED },

  itemBottom: { marginTop: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  itemPrice: { fontSize: 16, fontWeight: "900", color: COLORS.BLUE },

  stepper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.STEP_BORDER,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: COLORS.WHITE,
  },
  stepBtn: { width: 38, height: 34, alignItems: "center", justifyContent: "center" },
  disabledBtn: { opacity: 0.5 },
  stepTxt: { fontSize: 18, fontWeight: "900", color: COLORS.TEXT },
  stepMid: {
    width: 44,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.STEP_BORDER,
  },
  qtyNum: { fontSize: 14, fontWeight: "900", color: COLORS.TEXT },

  bottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 14,
  },
  sumRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6 },
  sumLabel: { fontSize: 13, fontWeight: "800", color: COLORS.SUB },
  sumValue: { fontSize: 13, fontWeight: "900", color: COLORS.TEXT },

  sumDivider: { height: 1, backgroundColor: COLORS.BORDER, marginTop: 10 },

  totalRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 },
  totalLabel: { fontSize: 15, fontWeight: "900", color: COLORS.TEXT },
  totalValue: { fontSize: 22, fontWeight: "900", color: COLORS.RED },

  checkoutBtn: {
    marginTop: 12,
    height: 54,
    borderRadius: 14,
    backgroundColor: COLORS.TEAL,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  checkoutBtnDisabled: { opacity: 0.55 },
  checkoutText: { color: COLORS.WHITE, fontSize: 15, fontWeight: "900" },
});

export default styles;
