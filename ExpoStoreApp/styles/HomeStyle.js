import { StyleSheet, Dimensions } from "react-native";

export const COLORS = {
  BLUE: "#0B63F6",
  BG: "#F6F8FC",
  TEXT: "#111",
  SUB: "#666",
  RED: "#E53935",
  GREEN: "#27AE60",

  GRAY_BG: "#EFEFEF",
  BORDER: "#EEF2F8",
  MUTED: "#9AA0A6",
  DOT: "#D0D6E0",
  IMG_BG: "#F2F2F2",
};

const { width } = Dimensions.get("window");
export const PAD = 18;
export const GAP = 12;

export const BANNER_W = width - PAD * 2;
export const BANNER_H = 140;

export const CARD_W_2COL = (BANNER_W - GAP) / 2;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.BG },
  container: { paddingHorizontal: PAD, paddingTop: 10, paddingBottom: 18 },

  searchRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  searchBox: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.GRAY_BG,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.TEXT },

  cartBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.GRAY_BG,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.RED,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "800" },

  banner: {
    width: BANNER_W,
    height: BANNER_H,
    borderRadius: 16,
    backgroundColor: COLORS.BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerTitle: { color: "#fff", fontSize: 22, fontWeight: "900", marginBottom: 6 },
  bannerSub: { color: "#fff", fontSize: 14, fontWeight: "600", opacity: 0.95 },

  dots: { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.DOT },
  dotActive: { width: 18, backgroundColor: "#fff" },

  catScroll: { gap: 10, marginTop: 14, paddingRight: 6 },
  catPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F1F1F1",
  },
  catPillActive: { backgroundColor: COLORS.BLUE },
  catText: { fontSize: 13, fontWeight: "700", color: "#111", maxWidth: 160 },
  catTextActive: { color: "#fff" },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 10,
  },
  sectionLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "900", color: COLORS.TEXT },

  sectionRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  endsText: { fontSize: 12, color: COLORS.RED, fontWeight: "700" },
  timerPill: { backgroundColor: COLORS.RED, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  timerText: { color: "#fff", fontSize: 12, fontWeight: "900" },

  flashCard: {
    width: 150,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    padding: 10,
  },
  flashImgWrap: { borderRadius: 12, overflow: "hidden", height: 90, backgroundColor: COLORS.IMG_BG },
  flashImg: { width: "100%", height: "100%", resizeMode: "cover" },
  discountBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: COLORS.RED,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  discountText: { color: "#fff", fontSize: 11, fontWeight: "900" },

  flashName: { marginTop: 10, fontSize: 12.5, fontWeight: "700", color: COLORS.TEXT, lineHeight: 16 },
  oldPrice: { marginTop: 6, fontSize: 11, color: COLORS.MUTED, textDecorationLine: "line-through" },
  newPrice: { marginTop: 2, fontSize: 14, fontWeight: "900", color: COLORS.RED },

  sectionTitleBig: { fontSize: 18, fontWeight: "900", color: COLORS.TEXT, marginBottom: 12 },

  // ===== NEW: horizontal product list (Featured + New) =====
  hList: { gap: 12, paddingRight: 6 },

  hCard: {
    width: 150,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    padding: 10,
    overflow: "hidden",
  },

  hImg: { width: "100%", height: 110, borderRadius: 10, backgroundColor: COLORS.IMG_BG },

  hName: { marginTop: 10, fontSize: 13, fontWeight: "800", color: COLORS.TEXT, lineHeight: 17 },

  hOldPrice: { marginTop: 6, fontSize: 11, color: COLORS.MUTED, textDecorationLine: "line-through" },

  hPrice: { marginTop: 2, fontSize: 14, fontWeight: "900", color: COLORS.RED },

  hBadgeGreen: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.GREEN,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 8,
  },

  hBadgeBlue: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.BLUE,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 8,
  },

  hBadgeText: { color: "#fff", fontSize: 11, fontWeight: "900" },
});

export default styles;
