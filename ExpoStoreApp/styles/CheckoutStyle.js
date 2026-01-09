import { StyleSheet } from "react-native";

export const COLORS = {
  BG: "#F6F8FC",
  TEXT: "#111",
  SUB: "#6B7280",
  BLUE: "#0B63F6",
  BORDER: "#EEF2F8",
  CARD: "#fff",
  GREEN: "#22C55E",
  RED: "#EF4444",

  WHITE: "#fff",
  FUTURE_BORDER: "#D1D5DB",
  LINE: "#E5E7EB",
  MUTED: "#9AA0A6",
  SHIP_BORDER: "#E5E7EB",
  SHIP_ACTIVE_BG: "#F7FAFF",

  DEFAULT_PILL_BG: "#EAF2FF",
  DEFAULT_PILL_BORDER: "#D6E6FF",

  ACTION_DEL_BORDER: "#FFD1D1",
  ACTION_DEL_BG: "#FFF5F5",

  OVERLAY: "rgba(0,0,0,0.35)",
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.BG },

  header: { paddingHorizontal: 12, paddingTop: 6, paddingBottom: 8, flexDirection: "row", alignItems: "center" },
  headerBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: "900", color: COLORS.TEXT },

  container: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 18, gap: 12 },

  stepWrap: { backgroundColor: COLORS.WHITE, borderRadius: 16, borderWidth: 1, borderColor: COLORS.BORDER, padding: 12 },
  stepLine: { position: "absolute", left: 18, right: 18, top: 28, height: 2, backgroundColor: COLORS.LINE },
  stepRow: { flexDirection: "row", justifyContent: "space-between" },
  stepItem: { alignItems: "center", width: "25%" },
  stepDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    backgroundColor: COLORS.WHITE,
  },
  stepDotDone: { backgroundColor: COLORS.BLUE, borderColor: COLORS.BLUE },
  stepDotActive: { backgroundColor: COLORS.BLUE, borderColor: COLORS.BLUE },
  stepDotFuture: { borderColor: COLORS.FUTURE_BORDER },
  stepNum: { fontSize: 13, fontWeight: "900" },
  stepLabel: { marginTop: 6, fontSize: 11.5, fontWeight: "800", color: COLORS.MUTED },

  card: { backgroundColor: COLORS.CARD, borderRadius: 16, borderWidth: 1, borderColor: COLORS.BORDER, padding: 12 },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  cardHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardTitle: { fontSize: 14, fontWeight: "900", color: COLORS.TEXT },
  cardLink: { fontSize: 13, fontWeight: "900", color: COLORS.BLUE },

  addrLoadingRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 6 },
  addrLoadingText: { fontSize: 12.5, fontWeight: "800", color: COLORS.SUB },

  addrEmpty: { alignItems: "center", paddingVertical: 10, gap: 8 },
  addrEmptyText: { fontSize: 13, fontWeight: "900", color: COLORS.MUTED },

  addrRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  addrIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: COLORS.BLUE, alignItems: "center", justifyContent: "center" },
  addrName: { fontSize: 14, fontWeight: "900", color: COLORS.TEXT },
  addrPhone: { marginTop: 4, fontSize: 12.5, fontWeight: "700", color: COLORS.SUB },
  addrText: { marginTop: 6, fontSize: 13, fontWeight: "700", color: COLORS.TEXT, lineHeight: 18 },

  shipItem: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.SHIP_BORDER,
    backgroundColor: COLORS.WHITE,
    alignItems: "flex-start",
  },
  shipItemActive: { borderColor: COLORS.BLUE, borderWidth: 2, backgroundColor: COLORS.SHIP_ACTIVE_BG },
  shipTitle: { fontSize: 13.5, fontWeight: "900", color: COLORS.TEXT },
  shipSub: { marginTop: 4, fontSize: 12.5, fontWeight: "700", color: COLORS.SUB },
  shipPrice: { marginTop: 6, fontSize: 13, fontWeight: "900" },

  prodHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  prodRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  prodCount: { fontSize: 12.5, fontWeight: "800", color: COLORS.SUB },

  prodRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  prodName: { fontSize: 13.5, fontWeight: "900", color: COLORS.TEXT },
  prodSub: { marginTop: 4, fontSize: 12, fontWeight: "700", color: COLORS.SUB },
  prodPrice: { fontSize: 13.5, fontWeight: "900", color: COLORS.BLUE },

  voucherBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.WHITE,
  },
  voucherBarLabel: { fontSize: 12.5, fontWeight: "800", color: COLORS.SUB },
  voucherBarValue: { marginTop: 2, fontSize: 13.5, fontWeight: "900", color: COLORS.TEXT },
  voucherStatus: { marginTop: 8, fontSize: 12.5, fontWeight: "800" },
  voucherStatusError: { color: COLORS.RED },
  voucherStatusSuccess: { color: COLORS.GREEN },
  voucherInfoRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 },
  voucherInfoText: { fontSize: 12.5, fontWeight: "800", color: COLORS.SUB },
  voucherItem: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    padding: 12,
    marginBottom: 10,
    backgroundColor: COLORS.WHITE,
  },
  voucherItemActive: { borderColor: COLORS.BLUE, borderWidth: 2, backgroundColor: COLORS.SHIP_ACTIVE_BG },
  voucherItemTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  voucherItemTitle: { flex: 1, fontSize: 13.5, fontWeight: "900", color: COLORS.TEXT },
  voucherItemBadge: {
    backgroundColor: COLORS.DEFAULT_PILL_BG,
    borderWidth: 1,
    borderColor: COLORS.DEFAULT_PILL_BORDER,
    borderRadius: 999,
    paddingHorizontal: 8,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  voucherItemBadgeText: { fontSize: 12, fontWeight: "900", color: COLORS.BLUE },
  voucherItemCode: { marginTop: 6, fontSize: 12.5, fontWeight: "800", color: COLORS.TEXT },
  voucherItemMetaRow: { marginTop: 6, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  voucherItemMeta: { fontSize: 11.5, fontWeight: "700", color: COLORS.SUB },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 14,
  },
  totalRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  totalLabel: { fontSize: 13, fontWeight: "800", color: COLORS.SUB },
  totalValue: { fontSize: 18, fontWeight: "900", color: COLORS.RED },

  orderBtn: { marginTop: 10, height: 50, borderRadius: 14, backgroundColor: COLORS.BLUE, alignItems: "center", justifyContent: "center" },
  orderBtnDisabled: { backgroundColor: COLORS.LINE },
  orderBtnText: { fontSize: 14, fontWeight: "900", color: COLORS.WHITE },

  modalOverlay: { flex: 1, backgroundColor: COLORS.OVERLAY, justifyContent: "center", paddingHorizontal: 14 },
  modalSheet: { backgroundColor: COLORS.WHITE, borderRadius: 16, borderWidth: 1, borderColor: COLORS.BORDER, padding: 12, maxHeight: "80%" },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  modalTitle: { fontSize: 16, fontWeight: "900", color: COLORS.TEXT },
  modalClose: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },

  modalLoading: { alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 18 },
  loadingText: { fontSize: 13, fontWeight: "800", color: COLORS.SUB },

  addrCard: { backgroundColor: COLORS.WHITE, borderRadius: 16, borderWidth: 1, borderColor: COLORS.BORDER, padding: 12, marginBottom: 12 },
  addrCardActive: { borderColor: COLORS.BLUE, borderWidth: 2, backgroundColor: COLORS.SHIP_ACTIVE_BG },

  addrTopRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  addrTypeIcon: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },

  addrItemName: { fontSize: 13.5, fontWeight: "900", color: COLORS.TEXT },
  addrItemPhone: { marginTop: 2, fontSize: 12.5, fontWeight: "700", color: COLORS.SUB },
  addrItemText: { marginTop: 6, fontSize: 12.5, fontWeight: "700", color: COLORS.TEXT, lineHeight: 18 },

  defaultPill: {
    backgroundColor: COLORS.DEFAULT_PILL_BG,
    borderWidth: 1,
    borderColor: COLORS.DEFAULT_PILL_BORDER,
    borderRadius: 999,
    paddingHorizontal: 10,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  defaultPillText: { color: COLORS.BLUE, fontSize: 12, fontWeight: "900" },

  addrActions: { flexDirection: "row", gap: 10, marginTop: 12 },
  actionBtn: { flex: 1, height: 36, borderRadius: 10, borderWidth: 1, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 6 },
  actionDelete: { borderColor: COLORS.ACTION_DEL_BORDER, backgroundColor: COLORS.ACTION_DEL_BG },
  actionDefault: { borderColor: COLORS.DEFAULT_PILL_BORDER, backgroundColor: COLORS.SHIP_ACTIVE_BG },
  actionText: { fontSize: 12.5, fontWeight: "900" },
});

export default styles;
