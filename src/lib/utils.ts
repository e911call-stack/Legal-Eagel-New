import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, format } from 'date-fns';
import type { RiskLevel, CaseStatus, TaskStatus } from '@/types';

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function formatDate(date: string) { return format(new Date(date), 'MMM d, yyyy'); }
export function formatDateTime(date: string) { return format(new Date(date), 'MMM d, yyyy · h:mm a'); }
export function timeAgo(date: string) { return formatDistanceToNow(new Date(date), { addSuffix: true }); }

export function riskColor(level: RiskLevel | string) {
  switch (level) {
    case 'high':   return 'text-red-700 bg-red-50 border-red-200 font-semibold';
    case 'medium': return 'text-amber-700 bg-amber-50 border-amber-200 font-semibold';
    case 'low':    return 'text-emerald-700 bg-emerald-50 border-emerald-200 font-semibold';
    default:       return 'text-ink-500 bg-ink-100 border-ink-200';
  }
}
export function riskDot(level: RiskLevel | string) {
  switch (level) {
    case 'high':   return 'bg-red-500';
    case 'medium': return 'bg-amber-500';
    case 'low':    return 'bg-emerald-500';
    default:       return 'bg-ink-400';
  }
}
export function statusColor(status: CaseStatus | string) {
  switch (status) {
    case 'open':       return 'text-blue-700 bg-blue-50 border-blue-200 font-semibold';
    case 'pre_filing': return 'text-violet-700 bg-violet-50 border-violet-200 font-semibold';
    case 'in_court':   return 'text-amber-700 bg-amber-50 border-amber-200 font-semibold';
    case 'closed':     return 'text-ink-500 bg-ink-100 border-ink-200';
    default:           return 'text-ink-500 bg-ink-100 border-ink-200';
  }
}
export function taskStatusColor(status: TaskStatus | string) {
  switch (status) {
    case 'done':        return 'text-emerald-600 bg-emerald-50';
    case 'in_progress': return 'text-blue-600 bg-blue-50';
    default:            return 'text-ink-500 bg-ink-100';
  }
}
export function formatStatus(status: string) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
export function riskScoreGradient(score: number) {
  if (score >= 70) return 'from-red-600 to-red-400';
  if (score >= 40) return 'from-amber-600 to-amber-400';
  return 'from-emerald-600 to-emerald-400';
}
export function formatCurrency(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}
export function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60), m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

// ── i18n ─────────────────────────────────────────────────────────────────────
const translations: Record<string, Record<string, string>> = {
  en: {
    // Nav
    dashboard: 'Dashboard', cases: 'Cases', documents: 'Documents',
    messages: 'Messages', billing: 'Billing', alerts: 'AI Alerts',
    settings: 'Settings', logout: 'Log out', navigation: 'Navigation', system: 'System',
    // Common actions
    newCase: 'New Case', upload: 'Upload', send: 'Send', reply: 'Reply',
    resolve: 'Resolve', markReplied: 'Mark Replied', save: 'Save changes',
    addTime: 'Add Time Entry', uploadDocument: 'Upload Document', runEngine: 'Run Engine Now',
    runHealthCheck: 'Run AI Health Check', analyzing: 'Analyzing…', running: 'Running Analysis…',
    // Common labels
    riskLevel: 'Risk Level', status: 'Status', lastActivity: 'Last Activity',
    client: 'Client', lawyer: 'Lawyer', totalBilled: 'Total Billed', budget: 'Budget',
    search: 'Search', filter: 'Filter', allCases: 'All Cases', allTypes: 'All Types',
    allRisk: 'All Risk', highRisk: 'High Risk', mediumRisk: 'Medium Risk', lowRisk: 'Low Risk',
    internal: 'Internal', unread: 'Unread', seen: 'Seen',
    // Dashboard page
    goodMorning: 'Good morning',
    highRiskCases: 'high-risk cases', unreadMessages: 'unread messages', today: 'today',
    activeCases: 'Active Cases', highRiskCasesLabel: 'High Risk Cases',
    unreadMessagesLabel: 'Unread Messages', pendingTasks: 'Pending Tasks',
    recentCases: 'Recent Cases', recentAlerts: 'Recent Alerts',
    viewAll: 'View all', caseHealth: 'Case Health',
    // Cases page
    totalCases: 'total cases', active: 'active',
    searchCases: 'Search cases, clients, practice areas…',
    open: 'Open', preFiling: 'Pre-Filing', inCourt: 'In Court', closed: 'Closed',
    allCasesLabel: 'All Cases',
    // Documents page
    filesAcross: 'files across all cases',
    searchDocs: 'Search by file name or case…',
    pleading: 'Pleading', contract: 'Contract', draft: 'Draft',
    evidence: 'Evidence', other: 'Other',
    // Messages page
    searchMessages: 'Search messages…',
    // Billing page
    totalBilledMTD: 'Total Billed (MTD)', hoursLoggedMTD: 'Hours Logged (MTD)',
    unbilledHours: 'Unbilled Hours', invoicesPending: 'Invoices Pending',
    budgetOverview: 'Budget Overview by Case', hourly: 'Hourly', flatFee: 'Flat Fee',
    used: 'used', remaining: 'remaining', timeEntries: 'Time Entries',
    billed: 'Billed', unbilled: 'Unbilled', allEntries: 'All Entries',
    billingSubtitle: 'Time entries, fee tracking, and billing overview',
    // Alerts page
    negligenceEngine: 'Negligence Detection Engine', lastRun: 'Last run',
    caseInactivity: 'Case Inactivity', unansweredMessage: 'Unanswered Message',
    missedDeadline: 'Missed Deadline', activeAlerts: 'Active Alerts',
    resolvedAlerts: 'Resolved Alerts', allAlerts: 'All Alerts',
    resolveAlert: 'Resolve', resolvedBy: 'Resolved by',
    // Settings page
    settingsSubtitle: 'Manage your account and platform preferences',
    profile: 'Profile', security: 'Security', notifications: 'Notifications',
    appearance: 'Appearance', api: 'API',
    profileInfo: 'Profile Information', changePhoto: 'Change photo',
    fullName: 'Full Name', emailAddress: 'Email Address', role: 'Role',
    saved: 'Saved!',
    // Case detail
    backToCases: 'Back to cases', timeline: 'Timeline', tasks: 'Tasks',
    deadlines: 'Deadlines', aiReport: 'AI Report', analyzeCase: 'Analyze Case',
  },

  es: {
    dashboard: 'Panel', cases: 'Casos', documents: 'Documentos',
    messages: 'Mensajes', billing: 'Facturación', alerts: 'Alertas IA',
    settings: 'Configuración', logout: 'Cerrar sesión', navigation: 'Navegación', system: 'Sistema',
    newCase: 'Nuevo Caso', upload: 'Subir', send: 'Enviar', reply: 'Responder',
    resolve: 'Resolver', markReplied: 'Marcar Respondido', save: 'Guardar cambios',
    addTime: 'Agregar Tiempo', uploadDocument: 'Subir Documento', runEngine: 'Ejecutar Ahora',
    runHealthCheck: 'Análisis de IA', analyzing: 'Analizando…', running: 'Ejecutando…',
    riskLevel: 'Nivel de Riesgo', status: 'Estado', lastActivity: 'Última Actividad',
    client: 'Cliente', lawyer: 'Abogado', totalBilled: 'Total Facturado', budget: 'Presupuesto',
    search: 'Buscar', filter: 'Filtrar', allCases: 'Todos los Casos', allTypes: 'Todos los Tipos',
    allRisk: 'Todo Riesgo', highRisk: 'Alto Riesgo', mediumRisk: 'Riesgo Medio', lowRisk: 'Bajo Riesgo',
    internal: 'Interno', unread: 'No leído', seen: 'Visto',
    goodMorning: 'Buenos días',
    highRiskCases: 'casos de alto riesgo', unreadMessages: 'mensajes no leídos', today: 'hoy',
    activeCases: 'Casos Activos', highRiskCasesLabel: 'Casos de Alto Riesgo',
    unreadMessagesLabel: 'Mensajes No Leídos', pendingTasks: 'Tareas Pendientes',
    recentCases: 'Casos Recientes', recentAlerts: 'Alertas Recientes',
    viewAll: 'Ver todos', caseHealth: 'Salud del Caso',
    totalCases: 'casos en total', active: 'activos',
    searchCases: 'Buscar casos, clientes, áreas…',
    open: 'Abierto', preFiling: 'Pre-presentación', inCourt: 'En Tribunal', closed: 'Cerrado',
    allCasesLabel: 'Todos los Casos',
    filesAcross: 'archivos en todos los casos',
    searchDocs: 'Buscar por nombre de archivo o caso…',
    pleading: 'Escrito', contract: 'Contrato', draft: 'Borrador', evidence: 'Evidencia', other: 'Otro',
    searchMessages: 'Buscar mensajes…',
    totalBilledMTD: 'Total Facturado (mes)', hoursLoggedMTD: 'Horas Registradas (mes)',
    unbilledHours: 'Horas sin Facturar', invoicesPending: 'Facturas Pendientes',
    budgetOverview: 'Resumen de Presupuesto por Caso', hourly: 'Por Hora', flatFee: 'Tarifa Fija',
    used: 'usado', remaining: 'restante', timeEntries: 'Entradas de Tiempo',
    billed: 'Facturado', unbilled: 'Sin Facturar', allEntries: 'Todas las Entradas',
    billingSubtitle: 'Entradas de tiempo, tarifas y resumen de facturación',
    negligenceEngine: 'Motor de Detección de Negligencia', lastRun: 'Última ejecución',
    caseInactivity: 'Inactividad del Caso', unansweredMessage: 'Mensaje Sin Respuesta',
    missedDeadline: 'Fecha Límite Incumplida', activeAlerts: 'Alertas Activas',
    resolvedAlerts: 'Alertas Resueltas', allAlerts: 'Todas las Alertas',
    resolveAlert: 'Resolver', resolvedBy: 'Resuelto por',
    settingsSubtitle: 'Gestionar cuenta y preferencias de la plataforma',
    profile: 'Perfil', security: 'Seguridad', notifications: 'Notificaciones',
    appearance: 'Apariencia', api: 'API',
    profileInfo: 'Información del Perfil', changePhoto: 'Cambiar foto',
    fullName: 'Nombre Completo', emailAddress: 'Correo Electrónico', role: 'Cargo',
    saved: '¡Guardado!',
    backToCases: 'Volver a casos', timeline: 'Cronología', tasks: 'Tareas',
    deadlines: 'Plazos', aiReport: 'Informe IA', analyzeCase: 'Analizar Caso',
  },

  zh: {
    dashboard: '仪表板', cases: '案件', documents: '文件',
    messages: '消息', billing: '账单', alerts: 'AI 警报',
    settings: '设置', logout: '退出登录', navigation: '导航', system: '系统',
    newCase: '新案件', upload: '上传', send: '发送', reply: '回复',
    resolve: '解决', markReplied: '标记已回复', save: '保存更改',
    addTime: '添加时间', uploadDocument: '上传文件', runEngine: '立即运行',
    runHealthCheck: 'AI 健康检查', analyzing: '分析中…', running: '运行中…',
    riskLevel: '风险级别', status: '状态', lastActivity: '最近活动',
    client: '客户', lawyer: '律师', totalBilled: '总账单', budget: '预算',
    search: '搜索', filter: '筛选', allCases: '所有案件', allTypes: '所有类型',
    allRisk: '所有风险', highRisk: '高风险', mediumRisk: '中风险', lowRisk: '低风险',
    internal: '内部', unread: '未读', seen: '已读',
    goodMorning: '早上好',
    highRiskCases: '高风险案件', unreadMessages: '未读消息', today: '今天',
    activeCases: '活跃案件', highRiskCasesLabel: '高风险案件',
    unreadMessagesLabel: '未读消息', pendingTasks: '待处理任务',
    recentCases: '最近案件', recentAlerts: '最近警报',
    viewAll: '查看全部', caseHealth: '案件健康',
    totalCases: '案件总数', active: '活跃',
    searchCases: '搜索案件、客户、业务领域…',
    open: '开放', preFiling: '预立案', inCourt: '庭审中', closed: '已关闭',
    allCasesLabel: '所有案件',
    filesAcross: '所有案件中的文件',
    searchDocs: '按文件名或案件搜索…',
    pleading: '诉状', contract: '合同', draft: '草稿', evidence: '证据', other: '其他',
    searchMessages: '搜索消息…',
    totalBilledMTD: '本月总账单', hoursLoggedMTD: '本月工时',
    unbilledHours: '未计费工时', invoicesPending: '待处理发票',
    budgetOverview: '各案件预算概览', hourly: '按小时', flatFee: '固定费用',
    used: '已用', remaining: '剩余', timeEntries: '时间记录',
    billed: '已计费', unbilled: '未计费', allEntries: '所有记录',
    billingSubtitle: '时间记录、费用跟踪和账单概览',
    negligenceEngine: '疏忽检测引擎', lastRun: '上次运行',
    caseInactivity: '案件不活跃', unansweredMessage: '未回复消息',
    missedDeadline: '错过截止日期', activeAlerts: '活跃警报',
    resolvedAlerts: '已解决警报', allAlerts: '所有警报',
    resolveAlert: '解决', resolvedBy: '解决者',
    settingsSubtitle: '管理账户和平台首选项',
    profile: '个人资料', security: '安全', notifications: '通知',
    appearance: '外观', api: 'API',
    profileInfo: '个人资料信息', changePhoto: '更换照片',
    fullName: '全名', emailAddress: '电子邮件', role: '角色',
    saved: '已保存！',
    backToCases: '返回案件', timeline: '时间线', tasks: '任务',
    deadlines: '截止日期', aiReport: 'AI 报告', analyzeCase: '分析案件',
  },

  ar: {
    dashboard: 'لوحة التحكم', cases: 'القضايا', documents: 'المستندات',
    messages: 'الرسائل', billing: 'الفواتير', alerts: 'تنبيهات الذكاء الاصطناعي',
    settings: 'الإعدادات', logout: 'تسجيل الخروج', navigation: 'التنقل', system: 'النظام',
    newCase: 'قضية جديدة', upload: 'رفع', send: 'إرسال', reply: 'رد',
    resolve: 'حل', markReplied: 'تحديد كمُجاب', save: 'حفظ التغييرات',
    addTime: 'إضافة وقت', uploadDocument: 'رفع مستند', runEngine: 'تشغيل الآن',
    runHealthCheck: 'فحص الحالة بالذكاء الاصطناعي', analyzing: 'جارٍ التحليل…', running: 'جارٍ التشغيل…',
    riskLevel: 'مستوى المخاطرة', status: 'الحالة', lastActivity: 'آخر نشاط',
    client: 'العميل', lawyer: 'المحامي', totalBilled: 'إجمالي الفواتير', budget: 'الميزانية',
    search: 'بحث', filter: 'تصفية', allCases: 'كل القضايا', allTypes: 'كل الأنواع',
    allRisk: 'كل المخاطر', highRisk: 'مخاطر عالية', mediumRisk: 'مخاطر متوسطة', lowRisk: 'مخاطر منخفضة',
    internal: 'داخلي', unread: 'غير مقروء', seen: 'مقروء',
    goodMorning: 'صباح الخير',
    highRiskCases: 'قضايا عالية المخاطر', unreadMessages: 'رسائل غير مقروءة', today: 'اليوم',
    activeCases: 'القضايا النشطة', highRiskCasesLabel: 'القضايا عالية المخاطر',
    unreadMessagesLabel: 'الرسائل غير المقروءة', pendingTasks: 'المهام المعلقة',
    recentCases: 'القضايا الأخيرة', recentAlerts: 'التنبيهات الأخيرة',
    viewAll: 'عرض الكل', caseHealth: 'صحة القضية',
    totalCases: 'إجمالي القضايا', active: 'نشط',
    searchCases: 'ابحث في القضايا والعملاء…',
    open: 'مفتوح', preFiling: 'ما قبل الإيداع', inCourt: 'في المحكمة', closed: 'مغلق',
    allCasesLabel: 'كل القضايا',
    filesAcross: 'ملفات عبر كل القضايا',
    searchDocs: 'ابحث باسم الملف أو القضية…',
    pleading: 'مذكرة', contract: 'عقد', draft: 'مسودة', evidence: 'دليل', other: 'أخرى',
    searchMessages: 'ابحث في الرسائل…',
    totalBilledMTD: 'إجمالي الفواتير (الشهر)', hoursLoggedMTD: 'ساعات العمل (الشهر)',
    unbilledHours: 'ساعات غير مفوترة', invoicesPending: 'فواتير معلقة',
    budgetOverview: 'نظرة عامة على ميزانية القضايا', hourly: 'بالساعة', flatFee: 'رسوم ثابتة',
    used: 'مستخدم', remaining: 'متبقٍ', timeEntries: 'إدخالات الوقت',
    billed: 'مفوتر', unbilled: 'غير مفوتر', allEntries: 'كل الإدخالات',
    billingSubtitle: 'إدخالات الوقت وتتبع الرسوم ونظرة عامة على الفواتير',
    negligenceEngine: 'محرك كشف الإهمال', lastRun: 'آخر تشغيل',
    caseInactivity: 'عدم نشاط القضية', unansweredMessage: 'رسالة بلا رد',
    missedDeadline: 'موعد نهائي فائت', activeAlerts: 'التنبيهات النشطة',
    resolvedAlerts: 'التنبيهات المحلولة', allAlerts: 'كل التنبيهات',
    resolveAlert: 'حل', resolvedBy: 'تم الحل بواسطة',
    settingsSubtitle: 'إدارة حسابك وتفضيلات المنصة',
    profile: 'الملف الشخصي', security: 'الأمان', notifications: 'الإشعارات',
    appearance: 'المظهر', api: 'API',
    profileInfo: 'معلومات الملف الشخصي', changePhoto: 'تغيير الصورة',
    fullName: 'الاسم الكامل', emailAddress: 'البريد الإلكتروني', role: 'الدور',
    saved: 'تم الحفظ!',
    backToCases: 'العودة إلى القضايا', timeline: 'الجدول الزمني', tasks: 'المهام',
    deadlines: 'المواعيد النهائية', aiReport: 'تقرير الذكاء الاصطناعي', analyzeCase: 'تحليل القضية',
  },

  hi: {
    dashboard: 'डैशबोर्ड', cases: 'मामले', documents: 'दस्तावेज़',
    messages: 'संदेश', billing: 'बिलिंग', alerts: 'AI अलर्ट',
    settings: 'सेटिंग्स', logout: 'लॉग आउट', navigation: 'नेविगेशन', system: 'सिस्टम',
    newCase: 'नया मामला', upload: 'अपलोड', send: 'भेजें', reply: 'उत्तर दें',
    resolve: 'हल करें', markReplied: 'उत्तर दिया चिह्नित करें', save: 'बदलाव सहेजें',
    addTime: 'समय जोड़ें', uploadDocument: 'दस्तावेज़ अपलोड करें', runEngine: 'अभी चलाएं',
    runHealthCheck: 'AI स्वास्थ्य जांच', analyzing: 'विश्लेषण हो रहा है…', running: 'चल रहा है…',
    riskLevel: 'जोखिम स्तर', status: 'स्थिति', lastActivity: 'अंतिम गतिविधि',
    client: 'ग्राहक', lawyer: 'वकील', totalBilled: 'कुल बिल', budget: 'बजट',
    search: 'खोजें', filter: 'फ़िल्टर', allCases: 'सभी मामले', allTypes: 'सभी प्रकार',
    allRisk: 'सभी जोखिम', highRisk: 'उच्च जोखिम', mediumRisk: 'मध्यम जोखिम', lowRisk: 'कम जोखिम',
    internal: 'आंतरिक', unread: 'अपठित', seen: 'देखा गया',
    goodMorning: 'सुप्रभात',
    highRiskCases: 'उच्च जोखिम वाले मामले', unreadMessages: 'अपठित संदेश', today: 'आज',
    activeCases: 'सक्रिय मामले', highRiskCasesLabel: 'उच्च जोखिम मामले',
    unreadMessagesLabel: 'अपठित संदेश', pendingTasks: 'लंबित कार्य',
    recentCases: 'हाल के मामले', recentAlerts: 'हाल के अलर्ट',
    viewAll: 'सब देखें', caseHealth: 'मामले की स्थिति',
    totalCases: 'कुल मामले', active: 'सक्रिय',
    searchCases: 'मामले, ग्राहक, क्षेत्र खोजें…',
    open: 'खुला', preFiling: 'प्री-फाइलिंग', inCourt: 'न्यायालय में', closed: 'बंद',
    allCasesLabel: 'सभी मामले',
    filesAcross: 'सभी मामलों में फ़ाइलें',
    searchDocs: 'फ़ाइल नाम या मामले से खोजें…',
    pleading: 'याचिका', contract: 'अनुबंध', draft: 'मसौदा', evidence: 'साक्ष्य', other: 'अन्य',
    searchMessages: 'संदेश खोजें…',
    totalBilledMTD: 'माह कुल बिल', hoursLoggedMTD: 'माह दर्ज घंटे',
    unbilledHours: 'अनबिल्ड घंटे', invoicesPending: 'लंबित चालान',
    budgetOverview: 'मामले-वार बजट अवलोकन', hourly: 'प्रति घंटा', flatFee: 'एकमुश्त शुल्क',
    used: 'उपयोग', remaining: 'शेष', timeEntries: 'समय प्रविष्टियां',
    billed: 'बिल किया', unbilled: 'अनबिल्ड', allEntries: 'सभी प्रविष्टियां',
    billingSubtitle: 'समय प्रविष्टियां, शुल्क ट्रैकिंग और बिलिंग अवलोकन',
    negligenceEngine: 'लापरवाही पहचान इंजन', lastRun: 'अंतिम बार चला',
    caseInactivity: 'मामला निष्क्रियता', unansweredMessage: 'अनुत्तरित संदेश',
    missedDeadline: 'समय सीमा चूकी', activeAlerts: 'सक्रिय अलर्ट',
    resolvedAlerts: 'हल किए गए अलर्ट', allAlerts: 'सभी अलर्ट',
    resolveAlert: 'हल करें', resolvedBy: 'हल किया',
    settingsSubtitle: 'अपना खाता और प्लेटफ़ॉर्म प्राथमिकताएं प्रबंधित करें',
    profile: 'प्रोफाइल', security: 'सुरक्षा', notifications: 'सूचनाएं',
    appearance: 'रूप', api: 'API',
    profileInfo: 'प्रोफाइल जानकारी', changePhoto: 'फ़ोटो बदलें',
    fullName: 'पूरा नाम', emailAddress: 'ईमेल पता', role: 'भूमिका',
    saved: 'सहेजा गया!',
    backToCases: 'मामलों पर वापस', timeline: 'समयरेखा', tasks: 'कार्य',
    deadlines: 'समय सीमाएं', aiReport: 'AI रिपोर्ट', analyzeCase: 'मामला विश्लेषण',
  },
};

export type Lang = 'en' | 'es' | 'zh' | 'ar' | 'hi';

export function t(key: string, lang: Lang = 'en'): string {
  return translations[lang]?.[key] ?? translations['en']?.[key] ?? key;
}
