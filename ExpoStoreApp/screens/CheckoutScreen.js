import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  Text,
  View,
  Pressable,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import {
  apiAddresses,
  apiAddressSetDefault,
  apiAddressDelete,
  apiCheckoutFromCart,
  apiBuyNow,
  apiInitiateVnpayPayment,
  apiCheckPaymentStatus,
  apiOrderDetail,
  apiShippingOptions,
  apiPromotions,
} from '../services/endpoints';

import styles, { COLORS } from '../styles/CheckoutStyle';

const formatVnd = (n) => {
  const s = Math.round(Number(n || 0)).toString();
  return `${s.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}đ`;
};

const normalizeAddresses = (res) => {
  const list = res?.addresses || res?.items || res || [];
  const arr = Array.isArray(list) ? list : [];

  const pick = (o, keys, fb = '') => {
    for (const k of keys) {
      const v = o?.[k];
      if (v !== undefined && v !== null && String(v).trim() !== '') return v;
    }
    return fb;
  };

  return arr.map((a) => {
    const name = pick(a, ['fullName', 'name', 'recipientName'], 'Người nhận');
    const phone = pick(a, ['phone', 'phoneNumber', 'recipientPhone'], '');
    const line1 = pick(a, ['address', 'detail', 'line1', 'street'], '');
    const ward = pick(a, ['ward', 'wardName'], '');
    const district = pick(a, ['district', 'districtName'], '');
    const city = pick(a, ['city', 'province', 'provinceName'], '');
    const parts = [line1, ward, district, city].filter(Boolean);
    const addressText = parts.join(', ');

    const typeRaw = String(pick(a, ['type', 'label'], 'home')).toLowerCase();
    const type =
      typeRaw.includes('work') || typeRaw.includes('office')
        ? 'work'
        : typeRaw.includes('home')
        ? 'home'
        : 'pin';

    const isDefault =
      !!a.isDefault ||
      !!a.is_default ||
      !!a.default ||
      (typeof a.isDefault === 'number' ? a.isDefault === 1 : false);

    return {
      id: String(a.id),
      name,
      phone,
      address: addressText || line1 || '',
      type,
      isDefault,
      raw: a,
    };
  });
};

export default function CheckoutScreen({ navigation, route }) {
  const from = route?.params?.from;
  const order = route?.params?.order;
  const product = route?.params?.product;
  const qty = route?.params?.qty;

  const [shipMethod, setShipMethod] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod'); // "cod" hoặc "vnpay"
  const [productsOpen, setProductsOpen] = useState(false);

  const [addrModal, setAddrModal] = useState(false);
  const [addrLoading, setAddrLoading] = useState(true);
  const [addrBusyId, setAddrBusyId] = useState(null);
  const [addresses, setAddresses] = useState([]);

  const [shippingLoading, setShippingLoading] = useState(true);
  const [shippingOptions, setShippingOptions] = useState([]);

  const [placing, setPlacing] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [voucherInput, setVoucherInput] = useState(
    String(route?.params?.voucherCode || '').trim(),
  );
  const [voucherApplied, setVoucherApplied] = useState(null);
  const [voucherStatus, setVoucherStatus] = useState(null);
  const [voucherBusy, setVoucherBusy] = useState(false);
  const [voucherAutoApplied, setVoucherAutoApplied] = useState(false);
  const [voucherModal, setVoucherModal] = useState(false);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [voucherList, setVoucherList] = useState([]);

  const selectedAddress = useMemo(() => {
    if (!addresses?.length) return null;
    return addresses.find((a) => a.isDefault) || addresses[0];
  }, [addresses]);

  const steps = useMemo(
    () => [
      { id: 1, label: 'Giỏ hàng', done: true },
      { id: 2, label: 'Địa chỉ', done: true },
      { id: 3, label: 'Thanh toán', done: false, active: true },
      { id: 4, label: 'Hoàn tất', done: false },
    ],
    [],
  );

  const products = useMemo(() => {
    if (order?.products?.length) {
      return order.products.map((p, idx) => ({
        id: String(p.cartItemId || p.productId || p.id || idx),
        name: p.name || 'Sản phẩm',
        qty: Number(p.qty || 1),
        price: p.priceText || formatVnd(p.priceNumber || 0),
      }));
    }
    if (product) {
      const name = product.name || 'Sản phẩm';
      const q = Number(qty || 1);
      const priceNumber = Number(product.price || 0);
      return [
        {
          id: String(product.id || 'p1'),
          name,
          qty: q,
          price: formatVnd(priceNumber),
        },
      ];
    }
    return [];
  }, [order?.products, product, qty]);

  const orderProducts = useMemo(() => {
    if (order?.products?.length) return order.products;
    if (product) {
      return [
        {
          productId: product.id,
          name: product.name || 'Sản phẩm',
          qty: Number(qty || 1),
          priceNumber: Number(product.price || 0),
        },
      ];
    }
    return [];
  }, [order?.products, product, qty]);

  const subtotalNumber = useMemo(() => {
    if (order?.subtotalNumber != null)
      return Number(order.subtotalNumber || 0);
    if (order?.products?.length) {
      return order.products.reduce((sum, p) => {
        const lineTotal =
          Number(p.lineTotal ?? NaN) ||
          Number(p.priceNumber ?? NaN) * Number(p.qty ?? 1) ||
          Number(p.price ?? 0) * Number(p.qty ?? 1) ||
          0;
        return sum + lineTotal;
      }, 0);
    }
    if (product)
      return Number(product.price || 0) * Number(qty || 1);
    return 0;
  }, [order, product, qty]);

  const selectedShipping = useMemo(
    () => shippingOptions.find((o) => o.code === shipMethod) || null,
    [shippingOptions, shipMethod],
  );

  const shippingFee = useMemo(
    () => Number(selectedShipping?.fee || 0),
    [selectedShipping],
  );

  const discountNumber = useMemo(() => {
    if (!voucherApplied) return 0;
    const minOrder = Number(voucherApplied.minOrderAmount || 0);
    if (subtotalNumber < minOrder) return 0;
    const dv = Number(voucherApplied.discountValue || 0);
    if (voucherApplied.discountType === 'amount') {
      return Math.min(subtotalNumber, dv);
    }
    if (voucherApplied.discountType === 'percent') {
      return Math.floor((subtotalNumber * dv) / 100);
    }
    return 0;
  }, [subtotalNumber, voucherApplied]);

  const totalNumber = useMemo(() => {
    const base = Math.max(0, subtotalNumber - discountNumber);
    return base + shippingFee;
  }, [subtotalNumber, discountNumber, shippingFee]);

  const totalText = useMemo(() => formatVnd(totalNumber), [totalNumber]);

  const canPlace =
    !!selectedAddress && products.length > 0 && !!shipMethod && !placing;

  const loadAddresses = useCallback(async () => {
    try {
      setAddrLoading(true);
      const res = await apiAddresses();
      const list = normalizeAddresses(res);

      let fixed = list.slice();
      if (fixed.length && !fixed.some((a) => a.isDefault))
        fixed[0] = { ...fixed[0], isDefault: true };

      setAddresses(fixed);
    } catch (e) {
      setAddresses([]);
      Alert.alert('Lỗi', e?.message || 'Không tải được địa chỉ');
    } finally {
      setAddrLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  useFocusEffect(
    useCallback(() => {
      loadAddresses();
    }, [loadAddresses]),
  );

  const loadShippingOptions = useCallback(async () => {
    try {
      setShippingLoading(true);
      const res = await apiShippingOptions();
      const list = Array.isArray(res?.options)
        ? res.options
        : Array.isArray(res?.items)
        ? res.items
        : Array.isArray(res)
        ? res
        : [];

      setShippingOptions(list);
      setShipMethod((cur) => {
        if (cur && list.some((o) => o.code === cur)) return cur;
        return list[0]?.code || null;
      });
    } catch (e) {
      setShippingOptions([]);
      setShipMethod(null);
      Alert.alert('Lỗi', e?.message || 'Không tải được phương thức vận chuyển');
    } finally {
      setShippingLoading(false);
    }
  }, []);

  useEffect(() => {
    loadShippingOptions();
  }, [loadShippingOptions]);

  useFocusEffect(
    useCallback(() => {
      loadShippingOptions();
    }, [loadShippingOptions]),
  );

  const setDefaultAddress = async (id) => {
    const prev = addresses;
    setAddresses((cur) => cur.map((a) => ({ ...a, isDefault: a.id === id })));

    try {
      setAddrBusyId(id);
      await apiAddressSetDefault(id);
      await loadAddresses();
      setAddrModal(false);
    } catch (e) {
      setAddresses(prev);
      Alert.alert('Lỗi', e?.message || 'Không đặt được mặc định');
    } finally {
      setAddrBusyId(null);
    }
  };

  const deleteAddress = async (id) => {
    Alert.alert('Xóa địa chỉ', 'Xóa địa chỉ này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          const prev = addresses;
          setAddresses((cur) => cur.filter((a) => a.id !== id));

          try {
            setAddrBusyId(id);
            await apiAddressDelete(id);
            await loadAddresses();
          } catch (e) {
            setAddresses(prev);
            Alert.alert('Lỗi', e?.message || 'Không xóa được địa chỉ');
          } finally {
            setAddrBusyId(null);
          }
        },
      },
    ]);
  };

  const formatDateVN = (d) => {
    try {
      const x = new Date(d);
      const dd = String(x.getDate()).padStart(2, '0');
      const mm = String(x.getMonth() + 1).padStart(2, '0');
      const yyyy = x.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    } catch {
      return '—';
    }
  };

  const formatVoucherValue = (type, value) => {
    const v = Number(value || 0);
    if (type === 'percent') return `${v}%`;
    if (type === 'amount') return formatVnd(v);
    return '—';
  };

  const normalizeVoucherCode = (code) => String(code || '').trim().toUpperCase();

  const applyVoucherPromo = (promo, rawCode) => {
    const code = normalizeVoucherCode(rawCode || promo?.code || voucherInput);
    if (!promo || !code) {
      setVoucherApplied(null);
      setVoucherStatus({ type: 'error', message: 'Voucher không hợp lệ hoặc đã hết hạn' });
      return;
    }

    const minOrder = Number(promo.minOrderAmount || 0);
    if (subtotalNumber < minOrder) {
      setVoucherApplied(null);
      setVoucherStatus({
        type: 'error',
        message: `Đơn tối thiểu ${formatVnd(minOrder)} để dùng voucher này`,
      });
      return;
    }

    setVoucherInput(code);
    setVoucherApplied({
      id: promo.id,
      code,
      title: promo.title || 'Voucher',
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      minOrderAmount: minOrder,
    });
    setVoucherStatus({ type: 'success', message: `Đã áp dụng ${code}` });
  };

  const applyVoucher = async (rawCode) => {
    const code = normalizeVoucherCode(rawCode || voucherInput);
    if (!code) {
      setVoucherStatus({ type: 'error', message: 'Vui lòng chọn voucher' });
      return;
    }

    try {
      setVoucherBusy(true);
      setVoucherStatus(null);

      const res = await apiPromotions({ type: 'voucher' });
      const list = Array.isArray(res?.promotions) ? res.promotions : [];
      const promo = list.find(
        (p) => normalizeVoucherCode(p?.code) === code && p?.isActive,
      );

      if (!promo) {
        setVoucherApplied(null);
        setVoucherStatus({ type: 'error', message: 'Voucher không hợp lệ hoặc đã hết hạn' });
        return;
      }

      applyVoucherPromo(promo, code);
    } catch (e) {
      setVoucherApplied(null);
      setVoucherStatus({
        type: 'error',
        message: e?.message || 'Không thể áp dụng voucher',
      });
    } finally {
      setVoucherBusy(false);
    }
  };

  const clearVoucher = () => {
    setVoucherApplied(null);
    setVoucherStatus(null);
  };

  const loadVouchers = useCallback(async () => {
    try {
      setVoucherLoading(true);
      const res = await apiPromotions({ type: 'voucher' });
      const list = Array.isArray(res?.promotions) ? res.promotions : [];
      const filtered = list.filter((p) => String(p?.type) === 'voucher' && p?.isActive);
      const normalized = filtered
        .slice()
        .sort((a, b) => (Number(b?.id || 0) || 0) - (Number(a?.id || 0) || 0))
        .map((p) => ({
          id: String(p.id),
          code: normalizeVoucherCode(p.code || ''),
          title: p.title || 'Voucher',
          discountType: p.discountType,
          discountValue: p.discountValue,
          minOrderAmount: Number(p.minOrderAmount || 0),
          endsAt: p.endsAt,
          raw: p,
        }));

      setVoucherList(normalized);
    } catch (e) {
      setVoucherList([]);
    } finally {
      setVoucherLoading(false);
    }
  }, []);

  const openVoucherModal = () => {
    setVoucherModal(true);
    if (voucherList.length === 0 && !voucherLoading) loadVouchers();
  };

  useEffect(() => {
    if (!voucherAutoApplied && voucherInput) {
      setVoucherAutoApplied(true);
      applyVoucher(voucherInput);
    }
  }, [voucherAutoApplied, voucherInput]);

  const placeOrder = async () => {
    if (!selectedAddress) {
      Alert.alert('Thiếu thông tin', 'Chưa có địa chỉ giao hàng');
      return;
    }
    if (products.length === 0) {
      Alert.alert('Thiếu thông tin', 'Chưa có sản phẩm để đặt hàng');
      return;
    }

    try {
      setPlacing(true);

      const payload = {
        addressId: selectedAddress.id,
        shippingMethod: shipMethod,
        promotionCode: voucherApplied?.code || undefined,
      };

      let orderResult;
      if (from === 'cart') {
        orderResult = await apiCheckoutFromCart(payload);
      } else if (product) {
        orderResult = await apiBuyNow({
          ...payload,
          productId: product.id,
          qty: Number(qty || 1),
        });
      } else {
        orderResult = await apiCheckoutFromCart(payload);
      }

      const orderId = orderResult.orderId;

      // Nếu chọn thanh toán VNPay
      if (paymentMethod === 'vnpay') {
        setPlacing(false);
        setProcessingPayment(true);

        try {
          // Lấy IP của device
          let clientIp = '127.0.0.1';
          try {
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipResponse.json();
            clientIp = ipData.ip;
            console.log('[VNPay Payment] Client IP:', clientIp);
          } catch (ipError) {
            console.warn('[VNPay Payment] Could not get client IP, using fallback:', ipError);
          }

          console.log('[VNPay Payment] Initiating payment for orderId:', orderId);
          // Tạo payment URL với VNPay, gửi kèm client IP
          const paymentResult = await apiInitiateVnpayPayment({ 
            orderId,
            clientIp: clientIp,
          });
          console.log('[VNPay Payment] Response:', paymentResult);

          if (paymentResult.success && paymentResult.payUrl) {
            // Mở VNPay web để thanh toán
            const canOpen = await Linking.canOpenURL(paymentResult.payUrl);

            if (canOpen) {
              await Linking.openURL(paymentResult.payUrl);

              // Đợi callback từ VNPay (sẽ được xử lý trong useEffect với deep linking)
              Alert.alert(
                'Đang chuyển đến VNPay',
                'Vui lòng hoàn tất thanh toán trên trang VNPay. Chúng tôi sẽ tự động cập nhật trạng thái đơn hàng.',
                [
                  {
                    text: 'Kiểm tra trạng thái',
                    onPress: () => checkPaymentAndNavigate(orderId),
                  },
                  { text: 'OK', style: 'cancel' },
                ],
              );
            } else {
              Alert.alert(
                'Lỗi',
                'Không thể mở trang thanh toán VNPay.',
              );
            }
          } else {
            Alert.alert(
              'Lỗi',
              paymentResult.message || 'Không thể tạo payment request',
            );
          }
        } catch (e) {
          console.error('VNPay payment error:', e);
          const errorMessage = e?.response?.data?.message || e?.message || 'Thanh toán VNPay thất bại';
          Alert.alert('Lỗi', errorMessage);
        } finally {
          setProcessingPayment(false);
        }
      } else {
        // Thanh toán COD - đi thẳng đến OrderSuccess
        navigation.navigate('OrderSuccess', {
          order: {
            ...order,
            orderId,
            statusKey: 'done',
            createdAt: Date.now(),
            address: {
              name: selectedAddress?.name,
              phone: selectedAddress?.phone,
              address: selectedAddress?.address,
            },
            products: orderProducts,
            subtotalNumber,
            shippingNumber: shippingFee,
            totalNumber,
            discountNumber,
          },
        });
      }
    } catch (e) {
      Alert.alert('Lỗi', e?.message || 'Đặt hàng thất bại');
    } finally {
      setPlacing(false);
    }
  };

  const checkPaymentAndNavigate = async (orderId) => {
    try {
      setProcessingPayment(true);
      const statusResult = await apiCheckPaymentStatus(orderId);

      if (statusResult.paymentStatus === 'paid') {
        // Fetch order detail để lấy thông tin đầy đủ
        const orderDetail = await apiOrderDetail(orderId);

        navigation.navigate('OrderSuccess', {
          order: {
            ...order,
            orderId,
            statusKey: 'done',
            createdAt: Date.now(),
            address: {
              name: selectedAddress?.name,
              phone: selectedAddress?.phone,
              address: selectedAddress?.address,
            },
            products: orderProducts,
            subtotalNumber,
            shippingNumber: shippingFee,
            totalNumber,
            discountNumber,
          },
        });
      } else {
        Alert.alert(
          'Thông báo',
          'Thanh toán chưa hoàn tất. Vui lòng thử lại sau.',
        );
      }
    } catch (e) {
      Alert.alert(
        'Lỗi',
        e?.message || 'Không thể kiểm tra trạng thái thanh toán',
      );
    } finally {
      setProcessingPayment(false);
    }
  };

  // Xử lý deep link từ VNPay
  useEffect(() => {
    const handleDeepLink = (event) => {
      const url = event.url || event;
      if (url && url.includes('expostoreapp://payment/vnpay')) {
        // Parse URL để lấy orderId và status
        const urlParams = new URLSearchParams(url.split('?')[1]);
        const orderId = urlParams.get('orderId');
        const status = urlParams.get('status');

        if (orderId) {
          // Kiểm tra trạng thái thanh toán
          checkPaymentAndNavigate(orderId);
        }
      }
    };

    // Lắng nghe deep link khi app đang mở
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Kiểm tra deep link khi app mở từ trạng thái đóng
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  const Stepper = () => (
    <View style={styles.stepWrap}>
      <View style={styles.stepLine} />
      <View style={styles.stepRow}>
        {steps.map((s) => {
          const isActive = !!s.active;
          const isDone = !!s.done;
          const isFuture = !isDone && !isActive;

          return (
            <View key={s.id} style={styles.stepItem}>
              <View
                style={[
                  styles.stepDot,
                  isDone && styles.stepDotDone,
                  isActive && styles.stepDotActive,
                  isFuture && styles.stepDotFuture,
                ]}>
                {isDone ? (
                  <Ionicons name="checkmark" size={16} color={COLORS.WHITE} />
                ) : (
                  <Text
                    style={[
                      styles.stepNum,
                      isActive
                        ? { color: COLORS.WHITE }
                        : { color: COLORS.MUTED },
                    ]}>
                    {s.id}
                  </Text>
                )}
              </View>
              <Text
                style={[styles.stepLabel, isActive && { color: COLORS.BLUE }]}>
                {s.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );

  const ShippingCard = ({ opt }) => {
    const selected = shipMethod === opt.code;
    const feeNumber = Number(opt.fee || 0);
    const feeText = feeNumber === 0 ? 'Miễn phí' : formatVnd(feeNumber);
    return (
      <Pressable
        style={[styles.shipItem, selected && styles.shipItemActive]}
        onPress={() => setShipMethod(opt.code)}>
        <Ionicons
          name={selected ? 'radio-button-on' : 'radio-button-off'}
          size={22}
          color={selected ? COLORS.BLUE : COLORS.FUTURE_BORDER}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.shipTitle}>{opt.title || 'Vận chuyển'}</Text>
          {!!opt.etaText && <Text style={styles.shipSub}>{opt.etaText}</Text>}
          <Text
            style={[
              styles.shipPrice,
              feeNumber === 0 ? { color: COLORS.GREEN } : { color: COLORS.BLUE },
            ]}>
            {feeText}
          </Text>
        </View>
      </Pressable>
    );
  };

  const AddressTypeIcon = ({ type }) => {
    const bg =
      type === 'home' ? COLORS.BLUE : type === 'work' ? '#F59E0B' : '#A855F7';
    const icon =
      type === 'home'
        ? 'home-outline'
        : type === 'work'
        ? 'briefcase-outline'
        : 'location-outline';

    return (
      <View style={[styles.addrTypeIcon, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={18} color={COLORS.WHITE} />
      </View>
    );
  };

  const AddressItem = ({ a }) => {
    const selected = a.isDefault;
    const busy = addrBusyId === a.id;

    return (
      <View
        style={[
          styles.addrCard,
          selected && styles.addrCardActive,
          busy && { opacity: 0.7 },
        ]}>
        <Pressable
          style={styles.addrTopRow}
          onPress={() => (busy ? null : setDefaultAddress(a.id))}>
          <Ionicons
            name={selected ? 'radio-button-on' : 'radio-button-off'}
            size={20}
            color={selected ? COLORS.BLUE : COLORS.FUTURE_BORDER}
          />
          <AddressTypeIcon type={a.type} />
          <View style={{ flex: 1 }}>
            <Text style={styles.addrItemName}>{a.name}</Text>
            {!!a.phone && <Text style={styles.addrItemPhone}>{a.phone}</Text>}
            <Text style={styles.addrItemText}>{a.address}</Text>
          </View>

          {selected ? (
            <View style={styles.defaultPill}>
              <Text style={styles.defaultPillText}>Mặc định</Text>
            </View>
          ) : null}
        </Pressable>

        <View style={styles.addrActions}>
          <Pressable
            style={[styles.actionBtn, styles.actionDelete]}
            onPress={() => (busy ? null : deleteAddress(a.id))}>
            <Ionicons name="trash-outline" size={16} color={COLORS.RED} />
            <Text style={[styles.actionText, { color: COLORS.RED }]}>Xóa</Text>
          </Pressable>

          {!selected ? (
            <Pressable
              style={[styles.actionBtn, styles.actionDefault]}
              onPress={() => (busy ? null : setDefaultAddress(a.id))}>
              <Ionicons
                name="checkmark-circle-outline"
                size={16}
                color={COLORS.BLUE}
              />
              <Text style={[styles.actionText, { color: COLORS.BLUE }]}>
                Chọn
              </Text>
            </Pressable>
          ) : (
            <View style={{ flex: 1 }} />
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.TEXT} />
        </Pressable>
        <Text style={styles.headerTitle}>Thanh toán</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        <Stepper />

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="location-outline" size={18} color={COLORS.BLUE} />
              <Text style={styles.cardTitle}>Địa chỉ giao hàng</Text>
            </View>
            <Pressable onPress={() => setAddrModal(true)}>
              <Text style={styles.cardLink}>Thay đổi</Text>
            </Pressable>
          </View>

          {addrLoading ? (
            <View style={styles.addrLoadingRow}>
              <ActivityIndicator />
              <Text style={styles.addrLoadingText}>Đang tải địa chỉ...</Text>
            </View>
          ) : selectedAddress ? (
            <View style={styles.addrRow}>
              <View style={styles.addrIcon}>
                <Ionicons
                  name={
                    selectedAddress.type === 'home'
                      ? 'home-outline'
                      : selectedAddress.type === 'work'
                      ? 'briefcase-outline'
                      : 'location-outline'
                  }
                  size={20}
                  color={COLORS.WHITE}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.addrName}>{selectedAddress.name}</Text>
                {!!selectedAddress.phone && (
                  <Text style={styles.addrPhone}>{selectedAddress.phone}</Text>
                )}
                <Text style={styles.addrText}>{selectedAddress.address}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.addrEmpty}>
              <Ionicons
                name="location-outline"
                size={26}
                color={COLORS.MUTED}
              />
              <Text style={styles.addrEmptyText}>Chưa có địa chỉ</Text>
              <Pressable onPress={() => navigation.navigate('Address')}>
                <Text style={styles.cardLink}>Thêm địa chỉ</Text>
              </Pressable>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="car-outline" size={18} color={COLORS.BLUE} />
              <Text style={styles.cardTitle}>Phương thức vận chuyển</Text>
            </View>
          </View>

          {shippingLoading ? (
            <View style={styles.addrLoadingRow}>
              <ActivityIndicator />
              <Text style={styles.addrLoadingText}>Đang tải vận chuyển...</Text>
            </View>
          ) : shippingOptions.length > 0 ? (
            <View style={{ gap: 10 }}>
              {shippingOptions.map((opt) => (
                <ShippingCard key={opt.code} opt={opt} />
              ))}
            </View>
          ) : (
            <View style={styles.addrEmpty}>
              <Ionicons
                name="car-outline"
                size={26}
                color={COLORS.MUTED}
              />
              <Text style={styles.addrEmptyText}>
                Chưa có phương thức vận chuyển
              </Text>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="wallet-outline" size={18} color={COLORS.BLUE} />
              <Text style={styles.cardTitle}>Phương thức thanh toán</Text>
            </View>
          </View>

          <View style={{ gap: 10 }}>
            <Pressable
              style={[
                styles.shipItem,
                paymentMethod === 'cod' && styles.shipItemActive,
              ]}
              onPress={() => setPaymentMethod('cod')}>
              <Ionicons
                name={
                  paymentMethod === 'cod'
                    ? 'radio-button-on'
                    : 'radio-button-off'
                }
                size={22}
                color={
                  paymentMethod === 'cod' ? COLORS.BLUE : COLORS.FUTURE_BORDER
                }
              />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.shipTitle}>
                  Thanh toán khi nhận hàng (COD)
                </Text>
                <Text style={styles.shipSub}>
                  Thanh toán bằng tiền mặt khi nhận hàng
                </Text>
              </View>
            </Pressable>

            <Pressable
              style={[
                styles.shipItem,
                paymentMethod === 'vnpay' && styles.shipItemActive,
              ]}
              onPress={() => setPaymentMethod('vnpay')}>
              <Ionicons
                name={
                  paymentMethod === 'vnpay'
                    ? 'radio-button-on'
                    : 'radio-button-off'
                }
                size={22}
                color={
                  paymentMethod === 'vnpay' ? COLORS.BLUE : COLORS.FUTURE_BORDER
                }
              />
              <View
                style={{
                  flex: 1,
                  marginLeft: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.shipTitle}>VNPay</Text>
                  <Text style={styles.shipSub}>
                    Thanh toán nhanh chóng và an toàn
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: '#A50064',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 4,
                  }}>
                  <Text
                    style={{
                      color: COLORS.WHITE,
                      fontSize: 10,
                      fontWeight: '600',
                    }}>
                    MoMo
                  </Text>
                </View>
              </View>
            </Pressable>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="ticket-outline" size={18} color={COLORS.BLUE} />
              <Text style={styles.cardTitle}>Voucher</Text>
            </View>
            {voucherApplied ? (
              <Pressable onPress={clearVoucher}>
                <Text style={styles.cardLink}>Xóa</Text>
              </Pressable>
            ) : null}
          </View>

          <Pressable style={styles.voucherBar} onPress={openVoucherModal}>
            <View style={{ flex: 1 }}>
              <Text style={styles.voucherBarLabel}>Chọn voucher</Text>
              <Text style={styles.voucherBarValue}>
                {voucherInput ? voucherInput : "Chưa chọn"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.MUTED} />
          </Pressable>

          {!!voucherStatus?.message && (
            <Text
              style={[
                styles.voucherStatus,
                voucherStatus.type === 'error'
                  ? styles.voucherStatusError
                  : styles.voucherStatusSuccess,
              ]}>
              {voucherStatus.message}
            </Text>
          )}

          {voucherApplied ? (
            <View style={styles.voucherInfoRow}>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={COLORS.GREEN}
              />
              <Text style={styles.voucherInfoText}>
                Giảm {formatVnd(discountNumber)} từ voucher {voucherApplied.code}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.card}>
          <Pressable
            style={styles.prodHeader}
            onPress={() => setProductsOpen((v) => !v)}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="bag-outline" size={18} color={COLORS.BLUE} />
              <Text style={styles.cardTitle}>Sản phẩm</Text>
            </View>

            <View style={styles.prodRight}>
              <Text style={styles.prodCount}>({products.length} sản phẩm)</Text>
              <Ionicons
                name={productsOpen ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={COLORS.MUTED}
              />
            </View>
          </Pressable>

          {productsOpen && (
            <View style={{ marginTop: 10, gap: 10 }}>
              {products.map((p) => (
                <View key={p.id} style={styles.prodRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.prodName} numberOfLines={1}>
                      {p.name}
                    </Text>
                    <Text style={styles.prodSub}>Số lượng: {p.qty}</Text>
                  </View>
                  <Text style={styles.prodPrice}>{p.price}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tổng thanh toán</Text>
          <Text style={styles.totalValue}>{totalText}</Text>
        </View>

        <Pressable
          style={[
            styles.orderBtn,
            (!canPlace || processingPayment) && styles.orderBtnDisabled,
          ]}
          onPress={placeOrder}
          disabled={!canPlace || processingPayment}>
          {placing || processingPayment ? (
            <ActivityIndicator color={COLORS.WHITE} />
          ) : (
            <Text style={styles.orderBtnText}>
              {paymentMethod === 'vnpay' ? 'Thanh toán với VNPay' : 'Đặt hàng'}
            </Text>
          )}
        </Pressable>
      </View>

      <Modal
        visible={voucherModal}
        transparent
        animationType="fade"
        onRequestClose={() => setVoucherModal(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setVoucherModal(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn voucher</Text>
              <Pressable
                onPress={() => setVoucherModal(false)}
                style={styles.modalClose}>
                <Ionicons name="close" size={20} color={COLORS.TEXT} />
              </Pressable>
            </View>

            {voucherLoading ? (
              <View style={styles.modalLoading}>
                <ActivityIndicator />
                <Text style={styles.loadingText}>Đang tải...</Text>
              </View>
            ) : voucherList.length > 0 ? (
              <ScrollView
                contentContainerStyle={{ paddingBottom: 12 }}
                showsVerticalScrollIndicator={false}>
                {voucherList.map((v) => {
                  const selected =
                    normalizeVoucherCode(v.code) === normalizeVoucherCode(voucherInput);
                  const valueText = formatVoucherValue(v.discountType, v.discountValue);
                  const minText =
                    v.minOrderAmount > 0
                      ? `Đơn từ ${formatVnd(v.minOrderAmount)}`
                      : 'Áp dụng mọi đơn';
                  const expText = v.endsAt
                    ? `HSD: ${formatDateVN(v.endsAt)}`
                    : 'HSD: —';

                  return (
                    <Pressable
                      key={v.id}
                      style={[
                        styles.voucherItem,
                        selected && styles.voucherItemActive,
                      ]}
                      onPress={() => {
                        applyVoucherPromo(v, v.code);
                        setVoucherModal(false);
                      }}>
                      <View style={styles.voucherItemTop}>
                        <Text style={styles.voucherItemTitle} numberOfLines={1}>
                          {v.title}
                        </Text>
                        <View style={styles.voucherItemBadge}>
                          <Text style={styles.voucherItemBadgeText}>{valueText}</Text>
                        </View>
                      </View>
                      <Text style={styles.voucherItemCode}>Mã: {v.code}</Text>
                      <View style={styles.voucherItemMetaRow}>
                        <Text style={styles.voucherItemMeta}>{minText}</Text>
                        <Text style={styles.voucherItemMeta}>{expText}</Text>
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>
            ) : (
              <View style={styles.addrEmpty}>
                <Ionicons name="ticket-outline" size={26} color={COLORS.MUTED} />
                <Text style={styles.addrEmptyText}>Chưa có voucher phù hợp</Text>
              </View>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={addrModal}
        transparent
        animationType="fade"
        onRequestClose={() => setAddrModal(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setAddrModal(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn địa chỉ</Text>
              <Pressable
                onPress={() => setAddrModal(false)}
                style={styles.modalClose}>
                <Ionicons name="close" size={20} color={COLORS.TEXT} />
              </Pressable>
            </View>

            {addrLoading ? (
              <View style={styles.modalLoading}>
                <ActivityIndicator />
                <Text style={styles.loadingText}>Đang tải...</Text>
              </View>
            ) : (
              <ScrollView
                contentContainerStyle={{ paddingBottom: 12 }}
                showsVerticalScrollIndicator={false}>
                {addresses.map((a) => (
                  <AddressItem key={a.id} a={a} />
                ))}
              </ScrollView>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
