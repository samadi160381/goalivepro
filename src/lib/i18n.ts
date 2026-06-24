// src/lib/i18n.ts
//
// Ported from the original i18n.js demo, with a couple of additions
// (errorLoading, retry, liveTabAriaLabel) needed for real network/error states.

export type Lang = 'en' | 'fr' | 'ar';

export interface Dict {
  dir: 'ltr' | 'rtl';
  brandName: string;
  tabLive: string;
  tabFixtures: string;
  tabStandings: string;
  footerNote: string;
  statusHT: string;
  statusFT: string;
  noMatches: string;
  selectCompetition: string;
  posLabel: string;
  teamLabel: string;
  pLabel: string;
  wLabel: string;
  dLabel: string;
  lLabel: string;
  gfLabel: string;
  gaLabel: string;
  gdLabel: string;
  ptsLabel: string;
  formLabel: string;
  legendQualify: string;
  legendRelegate: string;
  backToMatches: string;
  tabTimeline: string;
  tabLineups: string;
  tabStats: string;
  kickoffAt: string;
  possession: string;
  shots: string;
  shotsOnTarget: string;
  corners: string;
  fouls: string;
  starting11: string;
  eventGoal: string;
  eventYellow: string;
  eventRed: string;
  eventSub: string;
  eventKickoff: string;
  eventFulltime: string;
  eventHalftime: string;
  broadcastOn: string;
  errorLoading: string;
  retry: string;
  loading: string;
  quotaExceeded: string;
}

export const I18N: Record<Lang, Dict> = {
  en: {
    dir: 'ltr',
    brandName: 'ScorePulse',
    tabLive: 'Live & today',
    tabFixtures: 'Fixtures',
    tabStandings: 'Standings',
    footerNote: 'Live data via API-Football',
    statusHT: 'HT',
    statusFT: 'FT',
    noMatches: 'No matches scheduled for this day',
    selectCompetition: 'Competition',
    posLabel: 'Pos',
    teamLabel: 'Team',
    pLabel: 'P',
    wLabel: 'W',
    dLabel: 'D',
    lLabel: 'L',
    gfLabel: 'GF',
    gaLabel: 'GA',
    gdLabel: 'GD',
    ptsLabel: 'Pts',
    formLabel: 'Form',
    legendQualify: 'Qualification / title zone',
    legendRelegate: 'Elimination / relegation zone',
    backToMatches: 'Back to matches',
    tabTimeline: 'Timeline',
    tabLineups: 'Lineups',
    tabStats: 'Stats',
    kickoffAt: 'Kick-off',
    possession: 'Possession',
    shots: 'Shots',
    shotsOnTarget: 'Shots on target',
    corners: 'Corners',
    fouls: 'Fouls',
    starting11: 'Starting XI',
    eventGoal: 'Goal',
    eventYellow: 'Yellow card',
    eventRed: 'Red card',
    eventSub: 'Substitution',
    eventKickoff: 'Kick-off',
    eventFulltime: 'Full-time',
    eventHalftime: 'Half-time',
    broadcastOn: 'Watch on',
    errorLoading: 'Could not load live data right now.',
    retry: 'Retry',
    loading: 'Loading…',
    quotaExceeded: 'Daily API quota reached — showing the most recent data we have.'
  },
  fr: {
    dir: 'ltr',
    brandName: 'ScorePulse',
    tabLive: 'Live & aujourd’hui',
    tabFixtures: 'Calendrier',
    tabStandings: 'Classement',
    footerNote: 'Données en direct via API-Football',
    statusHT: 'MT',
    statusFT: 'TM',
    noMatches: 'Aucun match prévu ce jour',
    selectCompetition: 'Compétition',
    posLabel: 'Pos',
    teamLabel: 'Équipe',
    pLabel: 'J',
    wLabel: 'G',
    dLabel: 'N',
    lLabel: 'P',
    gfLabel: 'BP',
    gaLabel: 'BC',
    gdLabel: 'Diff',
    ptsLabel: 'Pts',
    formLabel: 'Forme',
    legendQualify: 'Zone de qualification / titre',
    legendRelegate: 'Zone d’élimination / relégation',
    backToMatches: 'Retour aux matchs',
    tabTimeline: 'Chronologie',
    tabLineups: 'Compositions',
    tabStats: 'Statistiques',
    kickoffAt: 'Coup d’envoi',
    possession: 'Possession',
    shots: 'Tirs',
    shotsOnTarget: 'Tirs cadrés',
    corners: 'Corners',
    fouls: 'Fautes',
    starting11: 'Composition de départ',
    eventGoal: 'But',
    eventYellow: 'Carton jaune',
    eventRed: 'Carton rouge',
    eventSub: 'Remplacement',
    eventKickoff: 'Coup d’envoi',
    eventFulltime: 'Fin du match',
    eventHalftime: 'Mi-temps',
    broadcastOn: 'Regarder sur',
    errorLoading: 'Impossible de charger les données en direct.',
    retry: 'Réessayer',
    loading: 'Chargement…',
    quotaExceeded: 'Quota quotidien atteint — affichage des dernières données disponibles.'
  },
  ar: {
    dir: 'rtl',
    brandName: 'سكور بلس',
    tabLive: 'مباشر واليوم',
    tabFixtures: 'المباريات',
    tabStandings: 'الترتيب',
    footerNote: 'بيانات مباشرة عبر API-Football',
    statusHT: 'استراحة',
    statusFT: 'انتهت',
    noMatches: 'لا توجد مباريات في هذا اليوم',
    selectCompetition: 'البطولة',
    posLabel: '#',
    teamLabel: 'الفريق',
    pLabel: 'لعب',
    wLabel: 'فاز',
    dLabel: 'تعادل',
    lLabel: 'خسر',
    gfLabel: 'له',
    gaLabel: 'عليه',
    gdLabel: 'فرق',
    ptsLabel: 'نقاط',
    formLabel: 'الأداء',
    legendQualify: 'منطقة التأهل / اللقب',
    legendRelegate: 'منطقة الهبوط / الخروج',
    backToMatches: 'رجوع للمباريات',
    tabTimeline: 'أحداث المباراة',
    tabLineups: 'التشكيل',
    tabStats: 'الإحصائيات',
    kickoffAt: 'موعد الانطلاق',
    possession: 'الاستحواذ',
    shots: 'التسديدات',
    shotsOnTarget: 'تسديدات على المرمى',
    corners: 'الركنيات',
    fouls: 'الأخطاء',
    starting11: 'التشكيلة الأساسية',
    eventGoal: 'هدف',
    eventYellow: 'بطاقة صفراء',
    eventRed: 'بطاقة حمراء',
    eventSub: 'تبديل',
    eventKickoff: 'صافرة البداية',
    eventFulltime: 'صافرة النهاية',
    eventHalftime: 'نهاية الشوط الأول',
    broadcastOn: 'يبث على',
    errorLoading: 'تعذر تحميل البيانات المباشرة الآن.',
    retry: 'إعادة المحاولة',
    loading: 'جارٍ التحميل…',
    quotaExceeded: 'تم الوصول إلى الحد اليومي — يتم عرض آخر بيانات متوفرة.'
  }
};

export function t(lang: Lang, key: keyof Dict): string {
  return (I18N[lang] && (I18N[lang][key] as string)) || (I18N.en[key] as string) || key;
}
