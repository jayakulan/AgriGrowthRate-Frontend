import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ta' | 'si';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Menu
    'menu.dashboard': 'Dashboard',
    'menu.myProducts': 'My Products',
    'menu.addProduct': 'Add Product',
    'menu.orders': 'Orders',
    'menu.chat': 'Chat',
    'menu.diseaseDetect': 'Crop Disease Detection',
    'menu.aiAssistant': 'AI Assistant',
    'menu.profile': 'Profile',
    'menu.logout': 'Logout',

    // Header
    'header.notifications': 'Notifications',
    'header.markAllRead': 'Mark all as read',
    'header.roleFarmer': 'Farmer',
    'header.roleAdmin': 'Admin',
    'header.roleConsumer': 'Consumer',
    'header.newNotifications': 'New',

    // Dashboard General
    'dashboard.title': 'Dashboard',
    'dashboard.desc': 'Your central hub for overview and analytics.',
    'dashboard.hi': 'Hi, {name}.',
    'dashboard.weather': '24°C Sunny',
    'dashboard.totalProducts': 'Total Products',
    'dashboard.activeOrders': 'Active Orders',
    'dashboard.totalEarnings': 'Total Earnings',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.viewAll': 'View All',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.scanCrop': 'Scan Crop',
    'dashboard.scanCropDesc': 'Analyze plant health with AI',
    'dashboard.addProductDesc': 'List new harvest to marketplace',
    'dashboard.marketplaceStatus': 'Marketplace Status',
    'dashboard.growthForecast': 'Growth Forecast',
    'dashboard.optTemp': 'Optimal Temp Range',
    'dashboard.soilMoist': 'Soil Moisture Target',
    'dashboard.activity.harvest': 'Harvest Completed: Heirloom Lettuce',
    'dashboard.activity.harvestDesc': 'Batch #8821 was successfully recorded. Estimated yield: 450kg.',
    'dashboard.activity.order': 'New Order Received: Premium Wheat',
    'dashboard.activity.orderDesc': 'Order #ORD-2044 from Miller Bakery Co. awaits confirmation.',
    'dashboard.activity.soil': 'Soil Scan Diagnostic',
    'dashboard.activity.soilDesc': 'Nitrogen levels in South Plot are slightly low. Recommended treatment available.',

    // Table
    'dashboard.table.orderId': 'Order ID',
    'dashboard.table.customer': 'Customer Name',
    'dashboard.table.product': 'Product',
    'dashboard.table.quantity': 'Quantity',
    'dashboard.table.price': 'Total Price',
    'dashboard.table.status': 'Status',
    'dashboard.table.date': 'Date',
    'dashboard.table.actions': 'Actions',
    'dashboard.table.complete': 'Complete',
    'dashboard.table.completed': 'Completed',
    'dashboard.table.guest': 'Guest',
    'dashboard.table.anonymous': 'Anonymous',
    'dashboard.table.showingAll': 'Showing all {count} orders',
    'dashboard.table.noOrders': 'No orders received yet.',

    // Stats
    'dashboard.stats.topSelling': 'Top Selling This Week',
    'dashboard.stats.ordersCount': '{count} Orders',
    'dashboard.stats.revenueGrowth': 'Revenue Growth',
    'dashboard.stats.vsLastWeek': 'vs last week',
    'dashboard.stats.fulfillmentRate': 'Fulfillment Rate',
    'dashboard.stats.avgProcessing': 'Average processing time: {time}',

    // Verify Modal
    'dashboard.verifyModal.title': 'Confirm Order Completion',
    'dashboard.verifyModal.desc': 'Please ask the consumer for the Order Reference Number sent to their phone to verify delivery. Enter it below to complete fulfillment.',
    'dashboard.verifyModal.customer': 'Customer:',
    'dashboard.verifyModal.product': 'Product:',
    'dashboard.verifyModal.amount': 'Amount:',
    'dashboard.verifyModal.inputLabel': 'Order Reference Number',
    'dashboard.verifyModal.verifyBtn': 'Verify & Complete',
    'dashboard.verifyModal.cancelBtn': 'Cancel',
    'dashboard.verifyModal.errorInvalid': 'Incorrect Reference Number. Please verify with the consumer and try again.',

    // Rate Modal
    'dashboard.rateModal.title': 'Rate & Review Consumer',
    'dashboard.rateModal.desc': 'How was your experience with {name}? Leave a rating and brief feedback.',
    'dashboard.rateModal.commentLabel': 'Feedback Comments',
    'dashboard.rateModal.commentPlaceholder': 'Write your feedback here...',
    'dashboard.rateModal.skip': 'Skip',
    'dashboard.rateModal.submit': 'Submit Feedback',

    // Products Page
    'products.category': 'Category:',
    'products.status': 'Status:',
    'products.addNewProduct': 'Add New Product',
    'products.organic': 'ORGANIC',
    'products.availableStock': 'AVAILABLE STOCK',
    'products.unlist': 'Unlist',
    'products.list': 'List',
    'products.outOfStock': 'Out of Stock',
    'products.pendingApproval': 'Pending Approval',
    'products.active': 'Active',
    'products.draft': 'Draft',
    'products.rejected': 'Rejected',
    'products.vegetables': 'VEGETABLES',
    'products.grains': 'GRAINS',
    'products.fruits': 'FRUITS',
    'products.dairy': 'DAIRY',
    'products.herbs': 'HERBS',
    'products.other': 'OTHER',

    // Add Product Page
    'addproduct.genInfo': 'GENERAL INFORMATION',
    'addproduct.prodName': 'Product Name',
    'addproduct.detailedDesc': 'Detailed Description',
    'addproduct.pricingInv': 'PRICING & INVENTORY',
    'addproduct.unitPrice': 'Unit Price (Rs)',
    'addproduct.sellingUnit': 'Selling Unit',
    'addproduct.initialStock': 'Initial Stock Quantity',
    'addproduct.cancel': 'Cancel',
    'addproduct.publish': 'Publish Product',
    'addproduct.listingImg': 'LISTING IMAGE',
    'addproduct.dragDrop': 'Drag & drop your crop image',
    'addproduct.supports': 'Supports PNG, JPG, JPEG up to 5MB',
    'addproduct.mockPhoto': 'OR CHOOSE A MOCK CROP PHOTO',
    'addproduct.marketStandard': 'Modern Market Standard',
    'addproduct.marketStandardDesc': 'All products listed undergo a quick automated check. Organic labels require authentic farmer verification. Ensure descriptions accurately represent pesticide and soil quality standards.',
    'addproduct.publishing': 'Publishing...',
    'addproduct.listingProduct': 'Listing product...',
    'addproduct.category': 'Category',
    'addproduct.vegetables': 'Vegetables',
    'addproduct.grains': 'Grains',
    'addproduct.fruits': 'Fruits',
    'addproduct.tomato': 'Tomato',
    'addproduct.wheat': 'Wheat',
    'addproduct.spinach': 'Spinach',
    'addproduct.potatoes': 'Potatoes',

    // Messages
    'msg.commentRequired': 'Please write some feedback comment',
    'msg.successFeedback': 'Thank you! Feedback submitted successfully.',
    'msg.successCompleted': 'Order successfully completed',
    'msg.errorCompleted': 'Failed to update order',
    'msg.errorFeedback': 'Failed to submit feedback',
    'msg.errorFetch': 'Could not fetch orders from server.',
  },
  ta: {
    // Menu
    'menu.dashboard': 'முகப்பு',
    'menu.myProducts': 'எனது தயாரிப்புகள்',
    'menu.addProduct': 'தயாரிப்பைச் சேர்',
    'menu.orders': 'கட்டளைகள்',
    'menu.chat': 'உரையாடல்',
    'menu.diseaseDetect': 'பயிர் நோய் கண்டறிதல்',
    'menu.aiAssistant': 'AI உதவியாளர்',
    'menu.profile': 'விவரக்குறிப்பு',
    'menu.logout': 'வெளியேறு',

    // Header
    'header.notifications': 'அறிவிப்புகள்',
    'header.markAllRead': 'அனைத்தையும் வாசித்ததாகக் குறிக்கவும்',
    'header.roleFarmer': 'விவசாயி',
    'header.roleAdmin': 'நிர்வாகி',
    'header.roleConsumer': 'நுகர்வோர்',
    'header.newNotifications': 'புதியது',

    // Dashboard General
    'dashboard.title': 'முகப்பு',
    'dashboard.desc': 'கண்ணோட்டம் மற்றும் பகுப்பாய்வுகளுக்கான உங்கள் மைய மையம்.',
    'dashboard.hi': 'வணக்கம், {name}.',
    'dashboard.weather': '24°C வெயில்',
    'dashboard.totalProducts': 'மொத்த தயாரிப்புகள்',
    'dashboard.activeOrders': 'செயலில் உள்ள கட்டளைகள்',
    'dashboard.totalEarnings': 'மொத்த வருவாய்',
    'dashboard.recentActivity': 'சமீபத்திய நடவடிக்கைகள்',
    'dashboard.viewAll': 'அனைத்தையும் பார்',
    'dashboard.quickActions': 'விரைவான செயல்பாடுகள்',
    'dashboard.scanCrop': 'பயிரை ஸ்கேன் செய்க',
    'dashboard.scanCropDesc': 'AI மூலம் தாவர ஆரோக்கியத்தை பகுப்பாய்வு செய்யவும்',
    'dashboard.addProductDesc': 'புதிய அறுவடையை சந்தையில் பட்டியலிடுங்கள்',
    'dashboard.marketplaceStatus': 'சந்தை நிலைமை',
    'dashboard.growthForecast': 'வளர்ச்சி முன்னறிவிப்பு',
    'dashboard.optTemp': 'உகந்த வெப்பநிலை வரம்பு',
    'dashboard.soilMoist': 'மண் ஈரப்பதம் இலக்கு',
    'dashboard.activity.harvest': 'அறுவடை முடிந்தது: கீரை வகைகள்',
    'dashboard.activity.harvestDesc': 'தொகுதி #8821 வெற்றிகரமாக பதிவு செய்யப்பட்டது. மதிப்பிடப்பட்ட மகசூல்: 450 கிலோ.',
    'dashboard.activity.order': 'புதிய ஆர்டர் பெறப்பட்டது: கோதுமை',
    'dashboard.activity.orderDesc': 'மில்லர் பேக்கரியிலிருந்து ஆர்டர் #ORD-2044 உறுதிப்படுத்தலுக்காக காத்திருக்கிறது.',
    'dashboard.activity.soil': 'மண் ஸ்கேன் கண்டறிதல்',
    'dashboard.activity.soilDesc': 'மண்ணில் நைட்ரஜன் அளவு சற்று குறைவாக உள்ளது. பரிந்துரைக்கப்பட்ட சிகிச்சை கிடைக்கிறது.',

    // Table
    'dashboard.table.orderId': 'கட்டளை எண்',
    'dashboard.table.customer': 'வாடிக்கையாளர் பெயர்',
    'dashboard.table.product': 'தயாரிப்பு',
    'dashboard.table.quantity': 'அளவு',
    'dashboard.table.price': 'மொத்த விலை',
    'dashboard.table.status': 'நிலை',
    'dashboard.table.date': 'தேதி',
    'dashboard.table.actions': 'செயல்பாடுகள்',
    'dashboard.table.complete': 'நிறைவு செய்',
    'dashboard.table.completed': 'நிறைவடைந்தது',
    'dashboard.table.guest': 'விருந்தினர்',
    'dashboard.table.anonymous': 'பெயரற்றவர்',
    'dashboard.table.showingAll': 'அனைத்து {count} கட்டளைகளையும் காட்டுகிறது',
    'dashboard.table.noOrders': 'இன்னும் கட்டளைகள் எதுவும் பெறப்படவில்லை.',

    // Stats
    'dashboard.stats.topSelling': 'இந்த வார சிறந்த விற்பனை',
    'dashboard.stats.ordersCount': '{count} கட்டளைகள்',
    'dashboard.stats.revenueGrowth': 'வருவாய் வளர்ச்சி',
    'dashboard.stats.vsLastWeek': 'கடந்த வாரத்துடன் ஒப்பிடுகையில்',
    'dashboard.stats.fulfillmentRate': 'நிறைவேற்றல் விகிதம்',
    'dashboard.stats.avgProcessing': 'சராசரி செயலாக்க நேரம்: {time}',

    // Verify Modal
    'dashboard.verifyModal.title': 'கட்டளை நிறைவை உறுதிப்படுத்தவும்',
    'dashboard.verifyModal.desc': 'விநியோகத்தை சரிபார்க்க நுகர்வோரின் தொலைபேசிக்கு அனுப்பப்பட்ட கட்டளை குறிப்பு எண்ணைக் கேட்கவும். நிறைவை முடிக்க அதை கீழே உள்ளிடவும்.',
    'dashboard.verifyModal.customer': 'வாடிக்கையாளர்:',
    'dashboard.verifyModal.product': 'தயாரிப்பு:',
    'dashboard.verifyModal.amount': 'தொகை:',
    'dashboard.verifyModal.inputLabel': 'கட்டளை குறிப்பு எண்',
    'dashboard.verifyModal.verifyBtn': 'சரிபார்த்து நிறைவு செய்',
    'dashboard.verifyModal.cancelBtn': 'ரத்துசெய்',
    'dashboard.verifyModal.errorInvalid': 'தவறான குறிப்பு எண். வாடிக்கையாளருடன் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',

    // Rate Modal
    'dashboard.rateModal.title': 'வாடிக்கையாளரை மதிப்பிடவும்',
    'dashboard.rateModal.desc': '{name} உடனான உங்கள் அனுபவம் எப்படி இருந்தது? மதிப்பீடு மற்றும் சுருக்கமான கருத்துக்களை இடுங்கள்.',
    'dashboard.rateModal.commentLabel': 'கருத்துக்கள்',
    'dashboard.rateModal.commentPlaceholder': 'உங்கள் கருத்துக்களை இங்கே எழுதுங்கள்...',
    'dashboard.rateModal.skip': 'தவிர்',
    'dashboard.rateModal.submit': 'கருத்தைச் சமர்ப்பி',

    // Products Page
    'products.category': 'வகை:',
    'products.status': 'நிலை:',
    'products.addNewProduct': 'புதிய தயாரிப்பைச் சேர்',
    'products.organic': 'இயற்கை',
    'products.availableStock': 'கிடைக்கக்கூடிய இருப்பு',
    'products.unlist': 'பட்டியலில் இருந்து நீக்கு',
    'products.list': 'பட்டியலிடு',
    'products.outOfStock': 'இருப்பு இல்லை',
    'products.pendingApproval': 'அனுமதி நிலுவையில் உள்ளது',
    'products.active': 'செயலில் உள்ளது',
    'products.draft': 'வரைவு',
    'products.rejected': 'நிராகரிக்கப்பட்டது',
    'products.vegetables': 'காய்கறிகள்',
    'products.grains': 'தானியங்கள்',
    'products.fruits': 'பழங்கள்',
    'products.dairy': 'பால் பொருட்கள்',
    'products.herbs': 'மூලிகைகள்',
    'products.other': 'இதர',

    // Add Product Page
    'addproduct.genInfo': 'பொதுவான தகவல்',
    'addproduct.prodName': 'தயாரிப்பு பெயர்',
    'addproduct.detailedDesc': 'விவரமான விளக்கம்',
    'addproduct.pricingInv': 'விலை மற்றும் இருப்பு விவரம்',
    'addproduct.unitPrice': 'அலகு விலை (Rs)',
    'addproduct.sellingUnit': 'விற்பனை அலகு',
    'addproduct.initialStock': 'ஆரம்ப இருப்பு அளவு',
    'addproduct.cancel': 'ரத்துசெய்',
    'addproduct.publish': 'தயாரிப்பை வெளியிடு',
    'addproduct.listingImg': 'தயாரிப்பு படம்',
    'addproduct.dragDrop': 'உங்கள் பயிர் படத்தை இழுத்து விடவும்',
    'addproduct.supports': 'PNG, JPG, JPEG 5MB வரை ஆதரிக்கப்படும்',
    'addproduct.mockPhoto': 'அல்லது மாதிரி பயிர் புகைப்படத்தைத் தேர்ந்தெடுக்கவும்',
    'addproduct.marketStandard': 'நவீன சந்தை தரம்',
    'addproduct.marketStandardDesc': 'பட்டியலிடப்பட்ட அனைத்து தயாரிப்புகளும் விரைவான தானியங்கி சோதனைக்கு உட்படுத்தப்படுகின்றன. இயற்கை முத்திரைகளுக்கு உண்மையான விவசாயி சரிபார்ப்பு தேவை. விளக்கங்கள் பூச்சிக்கொல்லி மற்றும் மண் தரத் தரங்களை துல்லியமாக பிரதிநிதித்துவப்படுத்துவதை உறுதிசெய்க.',
    'addproduct.publishing': 'வெளியிடப்படுகிறது...',
    'addproduct.listingProduct': 'தயாரிப்பு பட்டியலிடப்படுகிறது...',
    'addproduct.category': 'வகை',
    'addproduct.vegetables': 'காய்கறிகள்',
    'addproduct.grains': 'தானியங்கள்',
    'addproduct.fruits': 'பழங்கள்',
    'addproduct.tomato': 'தக்காளி',
    'addproduct.wheat': 'கோதுமை',
    'addproduct.spinach': 'கீரை',
    'addproduct.potatoes': 'உருளைக்கிழங்கு',

    // Messages
    'msg.commentRequired': 'கருத்துரையை எழுதவும்',
    'msg.successFeedback': 'நன்றி! கருத்து வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது.',
    'msg.successCompleted': 'கட்டளை வெற்றிகரமாக நிறைவு செய்யப்பட்டது',
    'msg.errorCompleted': 'கட்டளையைப் புதுப்பிக்க முடியவில்லை',
    'msg.errorFeedback': 'கருத்தைச் சமர்ப்பிக்க முடியவில்லை',
    'msg.errorFetch': 'சேவையகத்திலிருந்து கட்டளைகளைப் பெற முடியவில்லை.',
  },
  si: {
    // Menu
    'menu.dashboard': 'ප්‍රධාන පුවරුව',
    'menu.myProducts': 'මගේ නිෂ්පාදන',
    'menu.addProduct': 'නිෂ්පාදනයක් එක් කරන්න',
    'menu.orders': 'ඇණවුම්',
    'menu.chat': 'සංවාද',
    'menu.diseaseDetect': 'බෝග රෝග හඳුනා ගැනීම',
    'menu.aiAssistant': 'AI සහායකයා',
    'menu.profile': 'ප්‍රෝෆයිල්',
    'menu.logout': 'නික්ම යන්න',

    // Header
    'header.notifications': 'දැනුම්දීම්',
    'header.markAllRead': 'සියල්ල කියවූ ලෙස සලකුණු කරන්න',
    'header.roleFarmer': 'ගොවි',
    'header.roleAdmin': 'පරිපාලක',
    'header.roleConsumer': 'පාරිභෝගික',
    'header.newNotifications': 'නව',

    // Dashboard General
    'dashboard.title': 'ප්‍රධාන පුවරුව',
    'dashboard.desc': 'ඔබේ දළ විශ්ලේෂණය සහ විශ්ලේෂණ සඳහා මධ්‍යම කේන්ද්‍රස්ථානය.',
    'dashboard.hi': 'ආයුබෝවන්, {name}.',
    'dashboard.weather': '24°C අව්ව සහිතයි',
    'dashboard.totalProducts': 'මුළු නිෂ්පාදන',
    'dashboard.activeOrders': 'සක්‍රිය ඇණවුම්',
    'dashboard.totalEarnings': 'මුළු උපයීම්',
    'dashboard.recentActivity': 'මෑත ක්‍රියාකාරකම්',
    'dashboard.viewAll': 'සියල්ල බලන්න',
    'dashboard.quickActions': 'ක්ෂණික ක්‍රියාමාර්ග',
    'dashboard.scanCrop': 'බෝගය පරිලෝකනය කරන්න',
    'dashboard.scanCropDesc': 'AI සමඟ ශාක සෞඛ්‍යය විශ්ලේෂණය කරන්න',
    'dashboard.addProductDesc': 'නව අස්වැන්න වෙළඳපොළට ඇතුළත් කරන්න',
    'dashboard.marketplaceStatus': 'වෙළඳපොළ තත්ත්වය',
    'dashboard.growthForecast': 'වර්ධන පුරෝකථනය',
    'dashboard.optTemp': 'ප්‍රශස්ත උෂ්ණත්ව පරාසය',
    'dashboard.soilMoist': 'පස් තෙතමනය ඉලක්කය',
    'dashboard.activity.harvest': 'අස්වනු නෙලීම සම්පූර්ණයි: සලාද කොළ',
    'dashboard.activity.harvestDesc': 'කාණ්ඩ අංක #8821 සාර්ථකව වාර්තා කරන ලදී. ඇස්තමේන්තුගත අස්වැන්න: 450kg.',
    'dashboard.activity.order': 'නව ඇණවුමක් ලැබුණි: තිරිඟු',
    'dashboard.activity.orderDesc': 'මිලර් බේකරි වෙතින් ඇණවුම් අංක #ORD-2044 තහවුරු කිරීම බලාපොරොත්තුවෙන් පවතී.',
    'dashboard.activity.soil': 'පස පරිලෝකන රෝග විනිශ්චය',
    'dashboard.activity.soilDesc': 'දකුණු බිම් කොටසේ නයිට්‍රජන් මට්ටම තරමක් අඩුයි. නිර්දේශිත ප්‍රතිකාර තිබේ.',

    // Table
    'dashboard.table.orderId': 'ඇණවුම් අංකය',
    'dashboard.table.customer': 'පාරිභෝගිකයාගේ නම',
    'dashboard.table.product': 'නිෂ්පාදනය',
    'dashboard.table.quantity': 'ප්‍රමාණය',
    'dashboard.table.price': 'මුළු මිල',
    'dashboard.table.status': 'තත්ත්වය',
    'dashboard.table.date': 'දිනය',
    'dashboard.table.actions': 'ක්‍රියාකාරකම්',
    'dashboard.table.complete': 'සම්පූර්ණ කරන්න',
    'dashboard.table.completed': 'සම්පූර්ණයි',
    'dashboard.table.guest': 'අමුත්තා',
    'dashboard.table.anonymous': 'අනාමික',
    'dashboard.table.showingAll': 'සියලුම ඇණවුම් {count} පෙන්වයි',
    'dashboard.table.noOrders': 'තවමත් ඇණවුම් ලැබී නොමැත.',

    // Stats
    'dashboard.stats.topSelling': 'මේ සතියේ වැඩිම අලෙවිය',
    'dashboard.stats.ordersCount': 'ඇණවුම් {count}',
    'dashboard.stats.revenueGrowth': 'ආදායම් වර්ධනය',
    'dashboard.stats.vsLastWeek': 'පසුගිය සතියට සාපේක්ෂව',
    'dashboard.stats.fulfillmentRate': 'ඇණවුම් සම්පූර්ණ කිරීමේ අනුපාතය',
    'dashboard.stats.avgProcessing': 'සාමාන්‍ය සැකසුම් කාලය: {time}',

    // Verify Modal
    'dashboard.verifyModal.title': 'ඇණවුම සම්පූර්ණ කිරීම තහවුරු කරන්න',
    'dashboard.verifyModal.desc': 'බෙදා හැරීම සත්‍යාපනය කිරීම සඳහා පාරිභෝගිකයාගේ දුරකථනයට එවන ලද ඇණවුම් විමර්ශන අංකය විමසන්න. එය සම්පූර්ණ කිරීමට පහත ඇතුළත් කරන්න.',
    'dashboard.verifyModal.customer': 'පාරිභෝගිකයා:',
    'dashboard.verifyModal.product': 'නිෂ්පාදනය:',
    'dashboard.verifyModal.amount': 'මුදල:',
    'dashboard.verifyModal.inputLabel': 'ඇණවුම් විමර්ශන අංකය',
    'dashboard.verifyModal.verifyBtn': 'සත්‍යාපනය කර සම්පූර්ණ කරන්න',
    'dashboard.verifyModal.cancelBtn': 'අවලංගු කරන්න',
    'dashboard.verifyModal.errorInvalid': 'වැරදි විමර්ශන අංකයකි. කරුණාකර පාරිභෝගිකයා සමඟ සත්‍යාපනය කර නැවත උත්සාහ කරන්න.',

    // Rate Modal
    'dashboard.rateModal.title': 'පාරිභෝගිකයා ඇගයීමට ලක් කරන්න',
    'dashboard.rateModal.desc': '{name} සමඟ ඔබේ අත්දැකීම kෙසේද? ඇගයීමක් සහ කෙටි ප්‍රතිපෝෂණයක් ලබා දෙන්න.',
    'dashboard.rateModal.commentLabel': 'ප්‍රතිපෝෂණ අදහස්',
    'dashboard.rateModal.commentPlaceholder': 'ඔබේ ප්‍රතිපෝෂණය මෙහි ලියන්න...',
    'dashboard.rateModal.skip': 'මඟහරින්න',
    'dashboard.rateModal.submit': 'ප්‍රතිපෝෂණය ඉදිරිපත් කරන්න',

    // Products Page
    'products.category': 'ප්‍රභේදය:',
    'products.status': 'තත්ත්වය:',
    'products.addNewProduct': 'නිෂ්පාදනයක් එක් කරන්න',
    'products.organic': 'කාබනික',
    'products.availableStock': 'ලබාගත හැකි තොගය',
    'products.unlist': 'ලැයිස්තුවෙන් ඉවත් කරන්න',
    'products.list': 'ලැයිස්තුගත කරන්න',
    'products.outOfStock': 'තොග නොමැත',
    'products.pendingApproval': 'අනුමැතිය බලාපොරොත්තුවෙන්',
    'products.active': 'සක්‍රිය',
    'products.draft': 'කෙටුම්පත',
    'products.rejected': 'ප්‍රතික්ෂේපිත',
    'products.vegetables': 'එළවළු',
    'products.grains': 'ධාන්‍ය',
    'products.fruits': 'පලතුරු',
    'products.dairy': 'කිරි නිෂ්පාදන',
    'products.herbs': 'ඖෂධ පැළෑටි',
    'products.other': 'වෙනත්',

    // Add Product Page
    'addproduct.genInfo': 'සාමාන්‍ය තොරතුරු',
    'addproduct.prodName': 'නිෂ්පාදනයේ නම',
    'addproduct.detailedDesc': 'විස්තරාත්මක විස්තරය',
    'addproduct.pricingInv': 'මිල නියම කිරීම සහ තොග තොරතුරු',
    'addproduct.unitPrice': 'ඒකක මිල (Rs)',
    'addproduct.sellingUnit': 'විකිණුම් ඒකකය',
    'addproduct.initialStock': 'ආරම්භක තොග ප්‍රමාණය',
    'addproduct.cancel': 'අවලංගු කරන්න',
    'addproduct.publish': 'නිෂ්පාදනය පළ කරන්න',
    'addproduct.listingImg': 'නිෂ්පාදන ඡායාරූපය',
    'addproduct.dragDrop': 'ඔබේ බෝග ඡායාරූපය ඇදගෙන මෙතැනින් අත්හරින්න',
    'addproduct.supports': 'PNG, JPG, JPEG 5MB දක්වා පමණි',
    'addproduct.mockPhoto': 'නැතහොත් ආදර්ශ බෝග ඡායාරූපයක් තෝරන්න',
    'addproduct.marketStandard': 'නවීන වෙළඳපල ප්‍රමිතිය',
    'addproduct.marketStandardDesc': 'ලැයිස්තුගත කර ඇති සියලුම නිෂ්පාදන ඉක්මන් ස්වයංක්‍රීය පරීක්ෂණයකට භාජනය වේ. කාබනික ලේබල් සඳහා සත්‍ය ගොවි සත්‍යාපනය අවශ්‍ය වේ. විස්තර මගින් පළිබෝධනාශක සහ පසෙහි ගුණාත්මක ප්‍රමිතීන් නිවැරදිව නිරූපණය වන බව සහතික කරන්න.',
    'addproduct.publishing': 'පළ කරමින්...',
    'addproduct.listingProduct': 'නිෂ්පාදනය ලැයිස්තුගත කරමින්...',
    'addproduct.category': 'ප්‍රභේදය',
    'addproduct.vegetables': 'එළවළු',
    'addproduct.grains': 'ධාන්‍ය',
    'addproduct.fruits': 'පලතුරු',
    'addproduct.tomato': 'තක්කාලි',
    'addproduct.wheat': 'තිරිඟු',
    'addproduct.spinach': 'නිවිති',
    'addproduct.potatoes': 'අල',

    // Messages
    'msg.commentRequired': 'කරුණාකර ප්‍රතිපෝෂණ අදහසක් ලියන්න',
    'msg.successFeedback': 'ස්තූතියි! ප්‍රතිපෝෂණය සාර්ථකව ඉදිරිපත් කරන ලදී.',
    'msg.successCompleted': 'ඇණවුම සාර්ථකව සම්පූර්ණ කරන ලදී',
    'msg.errorCompleted': 'ඇණවුම යාවත්කාලීන කිරීමට අපොහොසත් විය',
    'msg.errorFeedback': 'ප්‍රතිපෝෂණ ඉදිරිපත් කිරීමට අපොහොසත් විය',
    'msg.errorFetch': 'කරුණාකර සේවාදායකයෙන් ඇණවුම් ලබා ගැනීමට නොහැකි විය.',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('farmer_dashboard_lang') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'ta' || savedLang === 'si')) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('farmer_dashboard_lang', lang);
  };

  const t = (key: string): string => {
    const translationSet = translations[language] || translations.en;
    // @ts-ignore
    return translationSet[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  return context;
};
