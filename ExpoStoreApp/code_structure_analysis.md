# Phân Tích Cấu Trúc Code Dự Án ExpoStoreApp

## Tổng Quan Dự Án
ExpoStoreApp là một ứng dụng di động được xây dựng bằng React Native và Expo, phục vụ cho cửa hàng máy tính. Ứng dụng sử dụng React Navigation cho điều hướng, Axios cho API calls, và AsyncStorage cho lưu trữ local.

## Cấu Trúc Thư Mục Chính

### Root Files
- **App.js**: Entry point chính của ứng dụng, wrap NavigationContainer và AuthProvider
- **index.js**: File khởi tạo Expo
- **app.json**: Cấu hình Expo
- **package.json**: Dependencies và scripts

### Thư Mục Chính

#### 1. **navigation/**
Chứa các file cấu hình điều hướng:
- **RootNavigator.js**: Navigator gốc, kiểm tra authentication và chuyển hướng đến AuthStack hoặc AppStack
- **AuthStack.js**: Stack cho authentication (Login, Register)
- **AppStack.js**: Stack chính của app với AppTabs và các modal screens (Search, Cart, ProductDetail, etc.)
- **AppTabs.js**: Bottom tab navigator với 4 tabs: Home, Category, Deals, Account
- **CategoryStack.js**: Nested stack trong Category tab (CategoryScreen, CategoryDetailScreen)
- **AccountStack.js**: Nested stack trong Account tab (AccountScreen, AddressScreen, OrderScreen, etc.)

#### 2. **screens/**
Chứa tất cả các component màn hình:
- **HomeScreen.js**: Màn hình chính
- **CategoryScreen.js**, **CategoryDetailScreen.js**: Danh mục sản phẩm
- **ProductDetailScreen.js**: Chi tiết sản phẩm
- **CartScreen.js**, **CheckoutScreen.js**, **OrderSuccessScreen.js**: Giỏ hàng và thanh toán
- **OrderScreen.js**, **OrderDetailScreen.js**: Đơn hàng
- **SearchScreen.js**: Tìm kiếm
- **LoginScreen.js**, **RegisterScreen.js**: Authentication
- **AccountScreen.js**, **EditProfileScreen.js**: Tài khoản người dùng
- **AddressScreen.js**: Địa chỉ
- **DealsScreen.js**: Khuyến mãi
- **RecentlyViewedScreen.js**, **WishlistScreen.js**: Sản phẩm đã xem và yêu thích

#### 3. **context/**
Quản lý state toàn cục:
- **AuthContext.js**: Quản lý authentication state (token, user), sử dụng AsyncStorage để persist data

#### 4. **services/**
Xử lý API và endpoints:
- **api.js**: Cấu hình Axios instance với base URL và auth interceptor
- **endpoints.js**: Định nghĩa tất cả API endpoints (auth, user, categories, products, cart, orders, addresses, promotions, search)

#### 5. **styles/**
Stylesheets cho từng màn hình:
- Mỗi file style tương ứng với một screen (vd: OrderDetailStyle.js cho OrderDetailScreen)
- Sử dụng StyleSheet.create với màu sắc được định nghĩa trong COLORS object

#### 6. **assets/**
Chứa hình ảnh và tài nguyên static (không được liệt kê chi tiết)

## Kiến Trúc Ứng Dụng

### Navigation Architecture
- **Root Level**: AuthProvider wrap NavigationContainer
- **Authentication Flow**: RootNavigator kiểm tra token → AuthStack (Login/Register) hoặc AppStack
- **Main App**: AppStack chứa AppTabs (bottom tabs) + modal screens
- **Nested Navigation**: CategoryStack và AccountStack là nested stacks trong tabs

### State Management
- **Authentication**: AuthContext với AsyncStorage persistence
- **API State**: Xử lý trong từng screen component (không có global state management như Redux)

### API Integration
- **Base URL**: http://192.168.1.8:3001 (local server)
- **Authentication**: Bearer token trong headers
- **Endpoints**: RESTful API cho tất cả features (products, cart, orders, etc.)

### Styling
- **Consistent Colors**: COLORS object được sử dụng xuyên suốt
- **Component-based Styles**: Mỗi screen có file style riêng
- **Responsive Design**: Sử dụng flexbox và padding/margin

## Dependencies Chính
- **React Navigation**: @react-navigation/native, bottom-tabs, native-stack
- **Expo**: expo, expo-status-bar, expo-checkbox
- **Async Storage**: @react-native-async-storage/async-storage
- **HTTP Client**: axios
- **Icons**: @expo/vector-icons (Ionicons)

## Patterns và Best Practices
- **Separation of Concerns**: Navigation, Screens, Styles, Services riêng biệt
- **Reusable Components**: (có thể cải thiện bằng cách tạo shared components)
- **Error Handling**: API interceptors và loading states
- **Authentication Flow**: Proper token management với auto-login

## Điểm Cần Cải Thiện
- **Global State**: Có thể thêm Redux hoặc Context cho cart, wishlist, etc.
- **Shared Components**: Tạo reusable UI components
- **TypeScript**: Chuyển sang TypeScript cho type safety
- **Testing**: Thêm unit tests và integration tests
- **Error Boundaries**: Global error handling</content>
<parameter name="filePath">c:\Users\DUC HUY\Desktop\ComputerStoreApp\ExpoStoreApp\code_structure_analysis.md