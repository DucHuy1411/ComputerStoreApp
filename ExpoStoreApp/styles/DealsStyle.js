import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const PAD = 18;
const GAP = 12;
const CARD_W = (width - PAD * 2 - GAP) / 2;

export const METRICS = { width, PAD, GAP, CARD_W };

export const COLORS = {
  BG: "#F6F8FC",
  TEXT: "#111",
  SUB: "#6B7280",
  BLUE: "#0B63F6",
  RED: "#E53935",

  WHITE: "#fff",
  BORDER: "#EEF2F8",
  MUTED: "#6B7280",
  MUTED_2: "#9AA0A6",

  PURPLE: "#7C3AED",
  HERO_BG: "#FF6A00",
  HERO_PILL: "rgba(0,0,0,0.25)",
  VOUCHER_TAG_BG: "rgba(255,255,255,0.22)",
  VOUCHER_CODE_BG: "rgba(0,0,0,0.18)",
  DECOR_CIRCLE: "rgba(255,255,255,0.16)",
  DECOR_WAVE: "rgba(0,0,0,0.10)",

  SAVED_BG: "#EAFBF3",
  SAVED_BORDER: "#B9F0D3",
  SAVED_GREEN: "#0F9D58",

  IMG_BG: "#F2F2F2",
  TRACK_BG: "#F3F4F6",
  PROGRESS_ORANGE: "#F59E0B",

  TAB_BORDER: "#E6E6E6",
  CHIP_BORDER: "#E6E6E6",

  OVERLAY: "rgba(0,0,0,0.35)",
  SHADOW: "#000",
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.BG },
  container: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 18 },

  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "900", color: COLORS.TEXT },

  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.PURPLE,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: { color: COLORS.WHITE, fontSize: 10, fontWeight: "900" },

  hero: {
    marginTop: 10,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: "center",
    backgroundColor: COLORS.HERO_BG,
  },
  heroTitle: { marginTop: 8, fontSize: 22, fontWeight: "900", color: COLORS.WHITE, letterSpacing: 1 },
  heroTimerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 },
  heroTimerLabel: { color: COLORS.WHITE, fontSize: 12.5, fontWeight: "700" },
  heroTimerPill: { backgroundColor: COLORS.HERO_PILL, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7 },
  heroTimerText: { color: COLORS.WHITE, fontSize: 14, fontWeight: "900" },

  heroBtn: {
    marginTop: 14,
    backgroundColor: COLORS.WHITE,
    borderRadius: 999,
    paddingHorizontal: 22,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.SHADOW,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 2,
  },
  heroBtnText: { color: COLORS.RED, fontWeight: "900", fontSize: 14 },

  notifyRow: {
    marginTop: 12,
    backgroundColor: COLORS.WHITE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    paddingHorizontal: 12,
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  notifyLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  notifyText: { fontSize: 13, fontWeight: "800", color: COLORS.TEXT },

  tabs: {
    marginTop: 12,
    flexDirection: "row",
    gap: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.TAB_BORDER,
    paddingBottom: 10,
  },
  tabBtn: { alignItems: "flex-start" },
  tabText: { fontSize: 13, fontWeight: "800", color: COLORS.SUB },
  tabTextActive: { color: COLORS.BLUE },
  tabLine: { marginTop: 8, height: 2, width: 28, backgroundColor: "transparent", borderRadius: 2 },
  tabLineActive: { backgroundColor: COLORS.BLUE },

  sectionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8, marginBottom: 10 },
  sectionTitle: { fontSize: 14, fontWeight: "900", color: COLORS.TEXT },
  seeAll: { flexDirection: "row", alignItems: "center", gap: 2 },
  seeAllText: { fontSize: 12.5, fontWeight: "900", color: COLORS.BLUE },

  voucherCard: { width: width - 72, borderRadius: 16, padding: 14, overflow: "hidden" },
  voucherTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  voucherTitle: { color: "#EAF2FF", fontSize: 13, fontWeight: "800" },
  voucherValue: { marginTop: 4, color: COLORS.WHITE, fontSize: 32, fontWeight: "900" },

  voucherTag: { backgroundColor: COLORS.VOUCHER_TAG_BG, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  voucherTagText: { color: COLORS.WHITE, fontSize: 11.5, fontWeight: "900" },

  voucherCodePill: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: COLORS.VOUCHER_CODE_BG,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  voucherCodeText: { color: COLORS.WHITE, fontSize: 12, fontWeight: "900" },

  voucherMeta: { marginTop: 10, color: "#EAF2FF", fontSize: 12.5, fontWeight: "700" },
  voucherBottom: { marginTop: 10, flexDirection: "row", alignItems: "center", gap: 10 },
  voucherExp: { flex: 1, color: "#EAF2FF", fontSize: 11.5, fontWeight: "700" },

  savedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.SAVED_BG,
    borderRadius: 999,
    paddingHorizontal: 10,
    height: 30,
    borderWidth: 1,
    borderColor: COLORS.SAVED_BORDER,
  },
  savedText: { color: COLORS.SAVED_GREEN, fontSize: 12, fontWeight: "900" },

  useNowBtn: { backgroundColor: COLORS.WHITE, borderRadius: 999, height: 30, paddingHorizontal: 12, alignItems: "center", justifyContent: "center" },
  useNowText: { color: COLORS.BLUE, fontSize: 12, fontWeight: "900" },

  voucherDecorCircle: { position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: 70, backgroundColor: COLORS.DECOR_CIRCLE },
  voucherDecorWave: { position: "absolute", bottom: -30, right: -20, width: 160, height: 90, borderRadius: 45, backgroundColor: COLORS.DECOR_WAVE },

  flashBar: {
    marginTop: 14,
    backgroundColor: COLORS.WHITE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    height: 44,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
  },
  flashBarText: { fontSize: 13, fontWeight: "900", color: COLORS.TEXT },
  flashBarTimer: { fontSize: 13, fontWeight: "900", color: COLORS.RED },

  grid: { marginTop: 12, flexDirection: "row", flexWrap: "wrap", gap: 12 },
  flashCard: { width: CARD_W, backgroundColor: COLORS.WHITE, borderRadius: 14, borderWidth: 1, borderColor: COLORS.BORDER, padding: 10 },
  flashImgWrap: { height: 120, borderRadius: 12, overflow: "hidden", backgroundColor: COLORS.IMG_BG },
  flashImg: { width: "100%", height: "100%", resizeMode: "cover" },

  discountBadge: { position: "absolute", top: 8, right: 8, backgroundColor: COLORS.RED, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  discountText: { color: COLORS.WHITE, fontSize: 11, fontWeight: "900" },

  leftBadge: { position: "absolute", bottom: 8, left: 8, backgroundColor: COLORS.RED, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  leftText: { color: COLORS.WHITE, fontSize: 11, fontWeight: "900" },

  flashName: { marginTop: 10, fontSize: 13, fontWeight: "900", color: COLORS.TEXT, lineHeight: 17 },
  soldText: { marginTop: 8, fontSize: 11.5, fontWeight: "800", color: COLORS.RED },
  progressTrack: { marginTop: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.TRACK_BG, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3, backgroundColor: COLORS.PROGRESS_ORANGE },

  placeholder: { marginTop: 14, backgroundColor: COLORS.WHITE, borderRadius: 14, borderWidth: 1, borderColor: COLORS.BORDER, padding: 14 },
  placeholderText: { fontSize: 13, fontWeight: "800", color: COLORS.SUB },

  modalOverlay: { flex: 1, backgroundColor: COLORS.OVERLAY, justifyContent: "flex-end" },
  modalSheet: {
    backgroundColor: COLORS.WHITE,
    padding: 14,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  modalHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  modalTitle: { fontSize: 16, fontWeight: "900", color: COLORS.TEXT },
  resetText: { fontSize: 13, fontWeight: "900", color: COLORS.RED },

  groupTitle: { marginTop: 10, marginBottom: 10, fontSize: 13, fontWeight: "900", color: COLORS.TEXT },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },

  chip: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 17,
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.CHIP_BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: { backgroundColor: COLORS.BLUE, borderColor: COLORS.BLUE },
  chipText: { fontSize: 12.5, fontWeight: "800", color: COLORS.TEXT },
  chipTextActive: { color: COLORS.WHITE },

  applyBtn: { marginTop: 14, height: 48, borderRadius: 12, backgroundColor: COLORS.BLUE, alignItems: "center", justifyContent: "center" },
  applyText: { color: COLORS.WHITE, fontSize: 14, fontWeight: "900" },
});

export default styles;
