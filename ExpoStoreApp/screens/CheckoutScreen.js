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

  const [shipMethod, setShipMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('cod'); // "cod" hoặc "vnpay"
  const [productsOpen, setProductsOpen] = useState(false);

  const [addrModal, setAddrModal] = useState(false);
  const [addrLoading, setAddrLoading] = useState(true);
  const [addrBusyId, setAddrBusyId] = useState(null);
  const [addresses, setAddresses] = useState([]);

  const [placing, setPlacing] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

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

  const shippingOptions = useMemo(
    () => [
      {
        id: 'standard',
        title: 'Giao hàng tiêu chuẩn',
        sub: 'Dự kiến giao: 25 - 27 Tháng 12',
        price: 'Miễn phí',
        free: true,
      },
      {
        id: 'fast',
        title: 'Giao hàng nhanh (24h)',
        sub: 'Dự kiến giao: 23 Tháng 12',
        price: '50.000đ',
        free: false,
      },
      {
        id: 'store',
        title: 'Nhận tại cửa hàng',
        sub: 'Sẵn sàng sau 2 giờ',
        price: 'Miễn phí',
        free: true,
      },
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

  const totalText = useMemo(() => {
    if (order?.total) return order.total;
    if (order?.totalNumber != null) return formatVnd(order.totalNumber);
    if (product)
      return formatVnd(Number(product.price || 0) * Number(qty || 1));
    return '0đ';
  }, [order, product, qty]);

  const canPlace = !!selectedAddress && products.length > 0 && !placing;

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
            products: order?.products || [],
            subtotalNumber: order?.subtotalNumber,
            shippingNumber: order?.shippingNumber,
            totalNumber: order?.totalNumber,
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
            products: order?.products || [],
            subtotalNumber: order?.subtotalNumber,
            shippingNumber: order?.shippingNumber,
            totalNumber: order?.totalNumber,
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
    const selected = shipMethod === opt.id;
    return (
      <Pressable
        style={[styles.shipItem, selected && styles.shipItemActive]}
        onPress={() => setShipMethod(opt.id)}>
        <Ionicons
          name={selected ? 'radio-button-on' : 'radio-button-off'}
          size={22}
          color={selected ? COLORS.BLUE : COLORS.FUTURE_BORDER}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.shipTitle}>{opt.title}</Text>
          <Text style={styles.shipSub}>{opt.sub}</Text>
          <Text
            style={[
              styles.shipPrice,
              opt.free ? { color: COLORS.GREEN } : { color: COLORS.BLUE },
            ]}>
            {opt.price}
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

          <View style={{ gap: 10 }}>
            {shippingOptions.map((opt) => (
              <ShippingCard key={opt.id} opt={opt} />
            ))}
          </View>
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
