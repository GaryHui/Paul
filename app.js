const teams = {
  MEX: { name: "Mexico", flag: "🇲🇽", group: "A", pos: 1, languages: "Spanish", power: 80, attack: 79, defense: 78, form: 6, confed: "CONCACAF" },
  RSA: { name: "South Africa", flag: "🇿🇦", group: "A", pos: 2, languages: "Zulu, Xhosa, Afrikaans, English + official languages", power: 68, attack: 67, defense: 69, form: 3, confed: "CAF" },
  KOR: { name: "Korea Republic", flag: "🇰🇷", group: "A", pos: 3, languages: "Korean", power: 78, attack: 78, defense: 76, form: 5, confed: "AFC" },
  CZE: { name: "Czechia", flag: "🇨🇿", group: "A", pos: 4, languages: "Czech", power: 76, attack: 75, defense: 77, form: 4, confed: "UEFA" },

  CAN: { name: "Canada", flag: "🇨🇦", group: "B", pos: 1, languages: "English, French", power: 77, attack: 78, defense: 74, form: 5, confed: "CONCACAF" },
  BIH: { name: "Bosnia and Herzegovina", flag: "🇧🇦", group: "B", pos: 2, languages: "Bosnian, Croatian, Serbian", power: 73, attack: 73, defense: 72, form: 4, confed: "UEFA" },
  QAT: { name: "Qatar", flag: "🇶🇦", group: "B", pos: 3, languages: "Arabic", power: 70, attack: 70, defense: 69, form: 3, confed: "AFC" },
  SUI: { name: "Switzerland", flag: "🇨🇭", group: "B", pos: 4, languages: "German, French, Italian, Romansh", power: 82, attack: 80, defense: 84, form: 6, confed: "UEFA" },

  BRA: { name: "Brazil", flag: "🇧🇷", group: "C", pos: 1, languages: "Portuguese", power: 91, attack: 92, defense: 87, form: 7, confed: "CONMEBOL" },
  MAR: { name: "Morocco", flag: "🇲🇦", group: "C", pos: 2, languages: "Arabic, Amazigh", power: 84, attack: 82, defense: 86, form: 7, confed: "CAF" },
  HAI: { name: "Haiti", flag: "🇭🇹", group: "C", pos: 3, languages: "Haitian Creole, French", power: 64, attack: 64, defense: 62, form: 3, confed: "CONCACAF" },
  SCO: { name: "Scotland", flag: "🏴", group: "C", pos: 4, languages: "English, Scots, Scottish Gaelic", power: 75, attack: 73, defense: 76, form: 4, confed: "UEFA" },

  USA: { name: "United States", flag: "🇺🇸", group: "D", pos: 1, languages: "English", power: 81, attack: 82, defense: 78, form: 6, confed: "CONCACAF" },
  PAR: { name: "Paraguay", flag: "🇵🇾", group: "D", pos: 2, languages: "Spanish, Guarani", power: 75, attack: 73, defense: 77, form: 4, confed: "CONMEBOL" },
  AUS: { name: "Australia", flag: "🇦🇺", group: "D", pos: 3, languages: "English", power: 74, attack: 73, defense: 75, form: 4, confed: "AFC" },
  TUR: { name: "Turkiye", flag: "🇹🇷", group: "D", pos: 4, languages: "Turkish", power: 79, attack: 81, defense: 76, form: 5, confed: "UEFA" },

  GER: { name: "Germany", flag: "🇩🇪", group: "E", pos: 1, languages: "German", power: 89, attack: 88, defense: 86, form: 7, confed: "UEFA" },
  CUW: { name: "Curacao", flag: "🇨🇼", group: "E", pos: 2, languages: "Papiamentu, Dutch, English", power: 63, attack: 63, defense: 62, form: 4, confed: "CONCACAF" },
  CIV: { name: "Cote d'Ivoire", flag: "🇨🇮", group: "E", pos: 3, languages: "French", power: 78, attack: 79, defense: 76, form: 6, confed: "CAF" },
  ECU: { name: "Ecuador", flag: "🇪🇨", group: "E", pos: 4, languages: "Spanish, Kichwa, Shuar", power: 82, attack: 80, defense: 83, form: 6, confed: "CONMEBOL" },

  NED: { name: "Netherlands", flag: "🇳🇱", group: "F", pos: 1, languages: "Dutch", power: 88, attack: 87, defense: 87, form: 7, confed: "UEFA" },
  JPN: { name: "Japan", flag: "🇯🇵", group: "F", pos: 2, languages: "Japanese", power: 83, attack: 84, defense: 81, form: 7, confed: "AFC" },
  SWE: { name: "Sweden", flag: "🇸🇪", group: "F", pos: 3, languages: "Swedish", power: 77, attack: 76, defense: 78, form: 4, confed: "UEFA" },
  TUN: { name: "Tunisia", flag: "🇹🇳", group: "F", pos: 4, languages: "Arabic", power: 72, attack: 70, defense: 74, form: 4, confed: "CAF" },

  BEL: { name: "Belgium", flag: "🇧🇪", group: "G", pos: 1, languages: "Dutch, French, German", power: 85, attack: 86, defense: 82, form: 6, confed: "UEFA" },
  EGY: { name: "Egypt", flag: "🇪🇬", group: "G", pos: 2, languages: "Arabic", power: 77, attack: 78, defense: 75, form: 5, confed: "CAF" },
  IRN: { name: "IR Iran", flag: "🇮🇷", group: "G", pos: 3, languages: "Persian", power: 76, attack: 75, defense: 77, form: 5, confed: "AFC" },
  NZL: { name: "New Zealand", flag: "🇳🇿", group: "G", pos: 4, languages: "English, Maori, New Zealand Sign Language", power: 67, attack: 66, defense: 68, form: 4, confed: "OFC" },

  ESP: { name: "Spain", flag: "🇪🇸", group: "H", pos: 1, languages: "Spanish", power: 92, attack: 91, defense: 90, form: 8, confed: "UEFA" },
  CPV: { name: "Cape Verde", flag: "🇨🇻", group: "H", pos: 2, languages: "Portuguese, Cape Verdean Creole", power: 69, attack: 70, defense: 67, form: 5, confed: "CAF" },
  KSA: { name: "Saudi Arabia", flag: "🇸🇦", group: "H", pos: 3, languages: "Arabic", power: 71, attack: 70, defense: 71, form: 4, confed: "AFC" },
  URU: { name: "Uruguay", flag: "🇺🇾", group: "H", pos: 4, languages: "Spanish", power: 86, attack: 85, defense: 86, form: 7, confed: "CONMEBOL" },

  FRA: { name: "France", flag: "🇫🇷", group: "I", pos: 1, languages: "French", power: 93, attack: 94, defense: 90, form: 8, confed: "UEFA" },
  SEN: { name: "Senegal", flag: "🇸🇳", group: "I", pos: 2, languages: "French, Wolof", power: 80, attack: 79, defense: 81, form: 6, confed: "CAF" },
  IRQ: { name: "Iraq", flag: "🇮🇶", group: "I", pos: 3, languages: "Arabic, Kurdish", power: 68, attack: 68, defense: 67, form: 5, confed: "AFC" },
  NOR: { name: "Norway", flag: "🇳🇴", group: "I", pos: 4, languages: "Norwegian", power: 82, attack: 86, defense: 77, form: 6, confed: "UEFA" },

  ARG: { name: "Argentina", flag: "🇦🇷", group: "J", pos: 1, languages: "Spanish", power: 94, attack: 93, defense: 91, form: 9, confed: "CONMEBOL" },
  ALG: { name: "Algeria", flag: "🇩🇿", group: "J", pos: 2, languages: "Arabic, Tamazight", power: 76, attack: 77, defense: 74, form: 5, confed: "CAF" },
  AUT: { name: "Austria", flag: "🇦🇹", group: "J", pos: 3, languages: "German", power: 81, attack: 80, defense: 81, form: 6, confed: "UEFA" },
  JOR: { name: "Jordan", flag: "🇯🇴", group: "J", pos: 4, languages: "Arabic", power: 66, attack: 66, defense: 65, form: 4, confed: "AFC" },

  POR: { name: "Portugal", flag: "🇵🇹", group: "K", pos: 1, languages: "Portuguese", power: 90, attack: 91, defense: 86, form: 8, confed: "UEFA" },
  COD: { name: "DR Congo", flag: "🇨🇩", group: "K", pos: 2, languages: "French, Lingala, Kikongo, Swahili, Tshiluba", power: 72, attack: 73, defense: 71, form: 5, confed: "CAF" },
  UZB: { name: "Uzbekistan", flag: "🇺🇿", group: "K", pos: 3, languages: "Uzbek", power: 70, attack: 69, defense: 71, form: 5, confed: "AFC" },
  COL: { name: "Colombia", flag: "🇨🇴", group: "K", pos: 4, languages: "Spanish", power: 84, attack: 84, defense: 82, form: 7, confed: "CONMEBOL" },

  ENG: { name: "England", flag: "🏴", group: "L", pos: 1, languages: "English", power: 90, attack: 90, defense: 88, form: 7, confed: "UEFA" },
  CRO: { name: "Croatia", flag: "🇭🇷", group: "L", pos: 2, languages: "Croatian", power: 83, attack: 81, defense: 84, form: 6, confed: "UEFA" },
  GHA: { name: "Ghana", flag: "🇬🇭", group: "L", pos: 3, languages: "English, Akan, Ewe, Ga, Dagbani", power: 75, attack: 76, defense: 73, form: 4, confed: "CAF" },
  PAN: { name: "Panama", flag: "🇵🇦", group: "L", pos: 4, languages: "Spanish", power: 69, attack: 68, defense: 69, form: 4, confed: "CONCACAF" }
};

const groupOrder = "ABCDEFGHIJKL".split("");
const defaultRoundFilter = "Recent";
const roundOptions = [defaultRoundFilter, "All", "Group Stage", "Round of 32", "Round of 16", "Quarterfinal", "Semifinal", "Third Place", "Final"];
const roundLabels = {
  Recent: "Recent matches",
  All: "All",
  "Group Stage": "Group Stage"
};
const groupLabels = { All: "All" };
const languageKey = "paul.language.v1";
const languageOptions = [
  ["en", "English", "en-US"],
  ["es", "Español", "es-ES"],
  ["fr", "Français", "fr-FR"],
  ["de", "Deutsch", "de-DE"],
  ["pt", "Português", "pt-BR"],
  ["ar", "العربية", "ar"],
  ["zh", "中文", "zh-CN"],
  ["ja", "日本語", "ja-JP"],
  ["ko", "한국어", "ko-KR"],
  ["it", "Italiano", "it-IT"],
  ["nl", "Nederlands", "nl-NL"],
  ["tr", "Türkçe", "tr-TR"]
];
const languageCopy = {
  en: {
    languageLabel: "Language", navPredictions: "Predictions", navTrace: "Trace", navAutomation: "Automation", navProof: "Proof", navGroups: "Groups",
    heroEyebrow: "2026 FIFA World Cup AI Prediction Lab", heroTitle: "PAUL predicts every match, then enters Knockout Oracle Mode.",
    heroLede: "Group-stage picks build the public record from day one. Once the Round of 32 begins, PAUL shifts into knockout focus with upset signals, proof-locked picks, and bracket paths.",
    openPredictor: "Open Predictor", viewTeams: "View 48 Teams", groupAccuracy: "Group-stage accuracy", knockoutAccuracy: "Knockout accuracy", upsetCallsHit: "Upset calls hit", proofVerifiedPicks: "Proof-verified picks",
    traceEyebrow: "2026 Match Trace", traceTitle: "Follow PAUL against the market, match by match.", traceCopy: "This public trace shows the current PAUL read, market reference when available, final result after sync, and the match-by-match impact versus the market favorite.",
    playableFixtures: "Playable fixtures", officialLocks: "Official PAUL locks", dailyReads: "Daily PAUL reads", marketReferences: "Market references", finalResults: "Final results",
    match: "Match", paul: "PAUL", market: "Market", result: "Result", impact: "Impact", pending: "Pending", timePending: "Time pending", none: "None", winner: "Winner", startsIn: "Starts in", liveNow: "Live now", fullTimeWindowPassed: "Full time window passed", kickoffTba: "Kickoff time TBA", paulVsMarket: "PAUL vs market", noMarket: "No market reference yet"
  },
  es: { languageLabel: "Idioma", navPredictions: "Predicciones", navTrace: "Seguimiento", navAutomation: "Automatización", navProof: "Prueba", navGroups: "Grupos", heroEyebrow: "Laboratorio IA del Mundial 2026", heroTitle: "PAUL predice cada partido y luego entra en modo eliminatorio.", heroLede: "La fase de grupos crea el historial público desde el primer día. En dieciseisavos, PAUL se enfoca en señales de sorpresa, pruebas selladas y rutas de cuadro.", openPredictor: "Abrir predictor", viewTeams: "Ver 48 equipos", groupAccuracy: "Precisión en grupos", knockoutAccuracy: "Precisión eliminatoria", upsetCallsHit: "Sorpresas acertadas", proofVerifiedPicks: "Predicciones verificadas", traceEyebrow: "Seguimiento 2026", traceTitle: "Sigue a PAUL contra el mercado, partido a partido.", traceCopy: "Este seguimiento muestra la lectura actual de PAUL, referencia del mercado, resultado final e impacto contra el favorito del mercado.", playableFixtures: "Partidos jugables", officialLocks: "Bloqueos oficiales", dailyReads: "Lecturas diarias", marketReferences: "Referencias mercado", finalResults: "Resultados finales", match: "Partido", paul: "PAUL", market: "Mercado", result: "Resultado", impact: "Impacto", pending: "Pendiente", timePending: "Hora pendiente", none: "Ninguno", winner: "Ganador", startsIn: "Empieza en", liveNow: "En vivo", fullTimeWindowPassed: "Ventana final pasada", kickoffTba: "Hora por confirmar", paulVsMarket: "PAUL vs mercado", noMarket: "Sin referencia de mercado" },
  fr: { languageLabel: "Langue", navPredictions: "Prédictions", navTrace: "Suivi", navAutomation: "Automatisation", navProof: "Preuve", navGroups: "Groupes", heroEyebrow: "Laboratoire IA Coupe du Monde 2026", heroTitle: "PAUL prédit chaque match, puis passe en mode élimination.", heroLede: "La phase de groupes construit le bilan public dès le premier jour. Dès les seizièmes, PAUL se concentre sur les surprises, les preuves verrouillées et le tableau.", openPredictor: "Ouvrir le prédicteur", viewTeams: "Voir les 48 équipes", groupAccuracy: "Précision groupes", knockoutAccuracy: "Précision élimination", upsetCallsHit: "Surprises réussies", proofVerifiedPicks: "Choix vérifiés", traceEyebrow: "Suivi 2026", traceTitle: "Suivez PAUL face au marché, match par match.", traceCopy: "Ce suivi montre la lecture actuelle de PAUL, la référence du marché, le résultat final et l’impact contre le favori du marché.", playableFixtures: "Matchs jouables", officialLocks: "Choix officiels", dailyReads: "Lectures quotidiennes", marketReferences: "Références marché", finalResults: "Résultats finaux", match: "Match", paul: "PAUL", market: "Marché", result: "Résultat", impact: "Impact", pending: "En attente", timePending: "Heure en attente", none: "Aucun", winner: "Vainqueur", startsIn: "Débute dans", liveNow: "En direct", fullTimeWindowPassed: "Fenêtre terminée", kickoffTba: "Horaire à confirmer", paulVsMarket: "PAUL vs marché", noMarket: "Pas de référence marché" },
  de: { languageLabel: "Sprache", navPredictions: "Prognosen", navTrace: "Trace", navAutomation: "Automatisierung", navProof: "Nachweis", navGroups: "Gruppen", heroEyebrow: "KI-Labor WM 2026", heroTitle: "PAUL prognostiziert jedes Spiel und wechselt dann in den K.o.-Modus.", heroLede: "Die Gruppenphase baut die öffentliche Bilanz auf. Ab der Runde der 32 fokussiert PAUL Überraschungssignale, gesperrte Nachweise und Turnierpfade.", openPredictor: "Predictor öffnen", viewTeams: "48 Teams ansehen", groupAccuracy: "Gruppen-Genauigkeit", knockoutAccuracy: "K.o.-Genauigkeit", upsetCallsHit: "Upsets getroffen", proofVerifiedPicks: "Verifizierte Tipps", traceEyebrow: "Match Trace 2026", traceTitle: "PAUL gegen den Markt, Spiel für Spiel.", traceCopy: "Diese öffentliche Spur zeigt PAULs aktuelle Einschätzung, Marktbezug, Endergebnis und Auswirkung gegenüber dem Marktfavoriten.", playableFixtures: "Spielbare Partien", officialLocks: "Offizielle PAUL-Locks", dailyReads: "Tägliche Reads", marketReferences: "Marktreferenzen", finalResults: "Endergebnisse", match: "Spiel", paul: "PAUL", market: "Markt", result: "Ergebnis", impact: "Auswirkung", pending: "Ausstehend", timePending: "Zeit offen", none: "Keine", winner: "Sieger", startsIn: "Startet in", liveNow: "Live", fullTimeWindowPassed: "Zeitfenster vorbei", kickoffTba: "Anstoß offen", paulVsMarket: "PAUL vs Markt", noMarket: "Noch kein Marktbezug" },
  pt: { languageLabel: "Idioma", navPredictions: "Previsões", navTrace: "Rastro", navAutomation: "Automação", navProof: "Prova", navGroups: "Grupos", heroEyebrow: "Laboratório IA Copa 2026", heroTitle: "PAUL prevê cada jogo e depois entra no modo mata-mata.", heroLede: "A fase de grupos cria o histórico público desde o primeiro dia. No mata-mata, PAUL foca sinais de zebra, provas travadas e caminho da chave.", openPredictor: "Abrir previsor", viewTeams: "Ver 48 seleções", groupAccuracy: "Acerto nos grupos", knockoutAccuracy: "Acerto no mata-mata", upsetCallsHit: "Zebras acertadas", proofVerifiedPicks: "Palpites verificados", traceEyebrow: "Rastro 2026", traceTitle: "Acompanhe PAUL contra o mercado, jogo a jogo.", traceCopy: "Este rastro mostra a leitura atual de PAUL, referência de mercado, resultado final e impacto contra o favorito do mercado.", playableFixtures: "Jogos disponíveis", officialLocks: "Travas oficiais", dailyReads: "Leituras diárias", marketReferences: "Referências mercado", finalResults: "Resultados finais", match: "Jogo", paul: "PAUL", market: "Mercado", result: "Resultado", impact: "Impacto", pending: "Pendente", timePending: "Horário pendente", none: "Nenhum", winner: "Vencedor", startsIn: "Começa em", liveNow: "Ao vivo", fullTimeWindowPassed: "Janela encerrada", kickoffTba: "Horário a confirmar", paulVsMarket: "PAUL vs mercado", noMarket: "Sem referência de mercado" },
  zh: { languageLabel: "语言", navPredictions: "预测", navTrace: "追踪", navAutomation: "自动化", navProof: "证明", navGroups: "小组", heroEyebrow: "2026 世界杯 AI 预测实验室", heroTitle: "PAUL 预测每一场比赛，并在淘汰赛进入神谕模式。", heroLede: "小组赛从第一天开始积累公开战绩。32 强开始后，PAUL 会聚焦冷门信号、赛前锁定证明和晋级路径。", openPredictor: "打开预测器", viewTeams: "查看 48 队", groupAccuracy: "小组赛命中率", knockoutAccuracy: "淘汰赛命中率", upsetCallsHit: "冷门命中", proofVerifiedPicks: "已验证预测", traceEyebrow: "2026 比赛追踪", traceTitle: "逐场对比 PAUL 与市场。", traceCopy: "这里公开显示 PAUL 当前判断、市场参考、赛果同步后的最终结果，以及 PAUL 相对市场热门的逐场影响。", playableFixtures: "可追踪比赛", officialLocks: "正式锁定", dailyReads: "每日判断", marketReferences: "市场参考", finalResults: "最终赛果", match: "比赛", paul: "PAUL", market: "市场", result: "赛果", impact: "影响", pending: "待定", timePending: "时间待定", none: "无", winner: "胜者", startsIn: "距离开赛", liveNow: "比赛进行中", fullTimeWindowPassed: "完赛窗口已过", kickoffTba: "开赛时间待定", paulVsMarket: "PAUL 对比市场", noMarket: "暂无市场参考" }
};
["ar", "ja", "ko", "it", "nl", "tr"].forEach((key) => {
  languageCopy[key] = { ...languageCopy.en, languageLabel: languageOptions.find((item) => item[0] === key)?.[1] || "Language" };
});
Object.assign(languageCopy.ar, { navPredictions: "التوقعات", navTrace: "التتبع", navAutomation: "الأتمتة", navProof: "الدليل", navGroups: "المجموعات", heroEyebrow: "مختبر توقعات كأس العالم 2026 بالذكاء الاصطناعي", heroTitle: "PAUL يتوقع كل مباراة ثم يدخل وضع الإقصائيات.", openPredictor: "افتح التوقعات", viewTeams: "عرض 48 فريقا", groupAccuracy: "دقة المجموعات", knockoutAccuracy: "دقة الإقصائيات", upsetCallsHit: "المفاجآت الصحيحة", proofVerifiedPicks: "توقعات موثقة", traceEyebrow: "تتبع مباريات 2026", traceTitle: "تابع PAUL مقابل السوق، مباراة بمباراة.", playableFixtures: "مباريات قابلة للتتبع", officialLocks: "توقعات رسمية", dailyReads: "قراءات يومية", marketReferences: "مراجع السوق", finalResults: "نتائج نهائية", match: "المباراة", market: "السوق", result: "النتيجة", impact: "الأثر", pending: "قيد الانتظار", timePending: "الوقت قيد الانتظار", none: "لا يوجد", winner: "الفائز", startsIn: "تبدأ خلال", liveNow: "مباشر الآن", fullTimeWindowPassed: "انتهت نافذة المباراة", kickoffTba: "وقت البداية غير محدد", paulVsMarket: "PAUL ضد السوق", noMarket: "لا يوجد مرجع سوقي بعد" });
Object.assign(languageCopy.ja, { navPredictions: "予測", navTrace: "トレース", navAutomation: "自動化", navProof: "証明", navGroups: "グループ", heroEyebrow: "2026 ワールドカップ AI 予測ラボ", heroTitle: "PAUL は全試合を予測し、決勝トーナメントで神託モードへ。", openPredictor: "予測を見る", viewTeams: "48チームを見る", groupAccuracy: "グループ的中率", knockoutAccuracy: "決勝T的中率", upsetCallsHit: "番狂わせ的中", proofVerifiedPicks: "証明済み予測", traceEyebrow: "2026 試合トレース", traceTitle: "PAUL と市場を試合ごとに比較。", playableFixtures: "対象試合", officialLocks: "公式ロック", dailyReads: "日次読み", marketReferences: "市場参照", finalResults: "最終結果", match: "試合", market: "市場", result: "結果", impact: "影響", pending: "未定", timePending: "時刻未定", none: "なし", winner: "勝者", startsIn: "開始まで", liveNow: "ライブ中", fullTimeWindowPassed: "試合時間終了", kickoffTba: "開始時刻未定", paulVsMarket: "PAUL 対 市場", noMarket: "市場参照なし" });
Object.assign(languageCopy.ko, { navPredictions: "예측", navTrace: "추적", navAutomation: "자동화", navProof: "증명", navGroups: "조", heroEyebrow: "2026 월드컵 AI 예측 랩", heroTitle: "PAUL은 모든 경기를 예측하고 토너먼트에서 오라클 모드로 전환합니다.", openPredictor: "예측 열기", viewTeams: "48개 팀 보기", groupAccuracy: "조별 정확도", knockoutAccuracy: "토너먼트 정확도", upsetCallsHit: "이변 적중", proofVerifiedPicks: "검증된 예측", traceEyebrow: "2026 경기 추적", traceTitle: "경기별로 PAUL과 시장을 비교하세요.", playableFixtures: "추적 경기", officialLocks: "공식 고정", dailyReads: "일일 분석", marketReferences: "시장 참고", finalResults: "최종 결과", match: "경기", market: "시장", result: "결과", impact: "영향", pending: "대기", timePending: "시간 대기", none: "없음", winner: "승자", startsIn: "시작까지", liveNow: "진행 중", fullTimeWindowPassed: "경기 창 종료", kickoffTba: "킥오프 미정", paulVsMarket: "PAUL vs 시장", noMarket: "시장 참고 없음" });
Object.assign(languageCopy.it, { navPredictions: "Pronostici", navTrace: "Traccia", navAutomation: "Automazione", navProof: "Prova", navGroups: "Gruppi", heroEyebrow: "Laboratorio IA Mondiale 2026", heroTitle: "PAUL prevede ogni partita e poi entra in modalità eliminazione.", openPredictor: "Apri pronostici", viewTeams: "Vedi 48 squadre", groupAccuracy: "Precisione gironi", knockoutAccuracy: "Precisione eliminazione", upsetCallsHit: "Sorpese centrate", proofVerifiedPicks: "Pronostici verificati", traceEyebrow: "Traccia 2026", traceTitle: "Segui PAUL contro il mercato, partita per partita.", playableFixtures: "Partite tracciate", officialLocks: "Blocchi ufficiali", dailyReads: "Letture giornaliere", marketReferences: "Riferimenti mercato", finalResults: "Risultati finali", match: "Partita", market: "Mercato", result: "Risultato", impact: "Impatto", pending: "In attesa", timePending: "Ora in attesa", none: "Nessuno", winner: "Vincitore", startsIn: "Inizia tra", liveNow: "In diretta", fullTimeWindowPassed: "Finestra conclusa", kickoffTba: "Orario da confermare", paulVsMarket: "PAUL vs mercato", noMarket: "Nessun riferimento mercato" });
Object.assign(languageCopy.nl, { navPredictions: "Voorspellingen", navTrace: "Trace", navAutomation: "Automatisering", navProof: "Bewijs", navGroups: "Groepen", heroEyebrow: "WK 2026 AI-voorspellab", heroTitle: "PAUL voorspelt elke wedstrijd en gaat daarna in knock-outmodus.", openPredictor: "Open predictor", viewTeams: "Bekijk 48 teams", groupAccuracy: "Groepsnauwkeurigheid", knockoutAccuracy: "Knock-outnauwkeurigheid", upsetCallsHit: "Verrassingen raak", proofVerifiedPicks: "Geverifieerde picks", traceEyebrow: "Wedstrijdtrace 2026", traceTitle: "Volg PAUL tegen de markt, wedstrijd voor wedstrijd.", playableFixtures: "Tracebare wedstrijden", officialLocks: "Officiële locks", dailyReads: "Dagelijkse reads", marketReferences: "Marktreferenties", finalResults: "Einduitslagen", match: "Wedstrijd", market: "Markt", result: "Uitslag", impact: "Impact", pending: "In afwachting", timePending: "Tijd onbekend", none: "Geen", winner: "Winnaar", startsIn: "Start over", liveNow: "Live", fullTimeWindowPassed: "Wedstrijdvenster voorbij", kickoffTba: "Aftrap onbekend", paulVsMarket: "PAUL vs markt", noMarket: "Nog geen marktreferentie" });
Object.assign(languageCopy.tr, { navPredictions: "Tahminler", navTrace: "İz", navAutomation: "Otomasyon", navProof: "Kanıt", navGroups: "Gruplar", heroEyebrow: "2026 Dünya Kupası AI Tahmin Laboratuvarı", heroTitle: "PAUL her maçı tahmin eder, sonra eleme moduna geçer.", openPredictor: "Tahmini aç", viewTeams: "48 takımı gör", groupAccuracy: "Grup doğruluğu", knockoutAccuracy: "Eleme doğruluğu", upsetCallsHit: "Sürpriz isabetleri", proofVerifiedPicks: "Kanıtlı tahminler", traceEyebrow: "2026 Maç İzi", traceTitle: "PAUL'u piyasaya karşı maç maç izle.", playableFixtures: "İzlenen maçlar", officialLocks: "Resmi kilitler", dailyReads: "Günlük okumalar", marketReferences: "Piyasa referansları", finalResults: "Final sonuçları", match: "Maç", market: "Piyasa", result: "Sonuç", impact: "Etki", pending: "Bekliyor", timePending: "Saat bekliyor", none: "Yok", winner: "Kazanan", startsIn: "Başlamasına", liveNow: "Canlı", fullTimeWindowPassed: "Maç penceresi geçti", kickoffTba: "Başlama saati belirsiz", paulVsMarket: "PAUL vs piyasa", noMarket: "Piyasa referansı yok" });
Object.assign(languageCopy.en, {
  overallAccuracy: "PAUL accuracy", correctPicks: "Correct picks", correctMatches: "Correct calls", noCorrectPicksYet: "Correct calls will appear here in green after final scores are synced.", verifyJson: "JSON", copyJson: "Copy JSON", proofCopy: "Copy any Proof JSON, paste it into the verifier, and check the hash and timestamp yourself.", proofStepCopy: "1. Copy Proof JSON", proofStepPaste: "2. Paste below", proofStepVerify: "3. Verify hash and time",
  entertainmentNoticeTitle: "Entertainment only", entertainmentNoticeCopy: "This site is for entertainment and reference only. PAUL predictions are not betting or financial advice.",
  recordEyebrow: "PAUL Record", recordTitle: "Public accuracy, tracked match by match.", recordCopy: "Every locked pick is counted after the final score. The record stays public, proof-linked, and consistent for every visitor.",
  publicFavorite: "Market favorite accuracy", teamRead: "Team model accuracy", paulGain: "PAUL over market", calibration: "Accuracy / confidence", referenceRecord: "Reference record.", extraCorrectPicks: "Extra correct picks.", actualVsConfidence: "Actual accuracy vs confidence.",
  predictorEyebrow: "PK Predictor", predictorTitle: "Group-stage record first, knockout oracle after qualification.", predictorCopy: "PAUL still predicts every playable match before kickoff, including the group stage. The public showpiece begins when the Round of 32 bracket is resolved and every pick becomes a win-or-go-home call.",
  round: "Round", group: "Group", groupLabel: "Group", search: "Search", searchPlaceholder: "Team, country, match number...",
  automationEyebrow: "Automation Engine", automationTitle: "Daily odds refresh, result sync, bracket advancement, and pre-match predictions.", automationCopy: "Vercel Cron refreshes market odds snapshots, checks for final scores, records winners, fills the next knockout round, locks PAUL predictions before each playable match, and keeps the public accuracy record consistent for every visitor.",
  lockedPredictions: "Locked predictions", syncedResults: "Synced results", predictionAccuracy: "Prediction accuracy", nextScheduledPick: "Next scheduled pick", runDueTasks: "Run Due Tasks", loadingAutomation: "Loading automation status...",
  proofEyebrow: "Proof of Prediction", proofTitle: "Every PAUL pick gets a public hash and timestamp proof.", proofCopy: "When PAUL locks a prediction, the full prediction payload is converted into canonical JSON and hashed with SHA-256. Official proofs also try to create an OpenTimestamps .ots receipt, so anyone can verify the same hash outside this site.",
  totalProofs: "Total proofs", allRounds: "All rounds", groupStage: "Group stage", knockout: "Knockout", otsReceipts: "OTS receipts", noLockedProofs: "No locked proofs yet", proofsAppear: "Proof records will appear here as soon as PAUL locks an official prediction.", proofSearchPlaceholder: "Match, team, hash, round...", showAllProofs: "Show all proofs",
  groupsEyebrow: "48-Team Field", groupsTitle: "Groups A-L", groupsCopy: "Each team card includes its flag, group, and local-language line for the PK page.",
  primaryLanguages: "Primary languages", localLanguage: "Local language", bracketStatus: "Bracket status", slotFilled: "This slot will be filled automatically after earlier results are synced.",
  fanVote: "Fan Vote", bracketSlotPending: "Bracket slot pending", votes: "votes", dailyRead: "Daily PAUL Read", waitingTeams: "Waiting for teams", nextRefreshPending: "Next refresh pending", dailyRefreshCopy: "PAUL will refresh this matchup automatically when it enters the daily analysis window.", currentLean: "Current lean", confidence: "confidence", draw: "Draw", liveEstimate: "Live estimate", officialLock: "Official lock", postLockDrift: "Post-lock drift", postLockDriftCopy: "The proof stays unchanged, but new pre-match data now points another way. This affects lab calibration only.", lockAlignedCopy: "Live PAUL still agrees with the official lock. New data is being used only for calibration.",
  correct: "Correct", missed: "Missed", final: "Final", locked: "Locked", proofLocked: "Proof locked", notLocked: "Not locked", lockedAt: "Locked", kickoff: "Kickoff", generatedAt: "Generated at", updated: "Updated", officialConfidence: "Official confidence", officialPredictionPending: "Official prediction pending", officialPredictionNotLocked: "Official PAUL prediction is not locked yet.", bracketNotResolved: "This bracket slot is not resolved yet.", kickoffCountdown: "Kickoff countdown", finalScorePending: "Final score has not synced yet. Accuracy will update after full time.", predictedScore: "Predicted score", officialPaulPick: "Official PAUL Pick", whyLocked: "Why PAUL locked this pick", evidenceUsed: "Evidence used", upsetWatch: "Upset Watch", proofStatus: "Proof Status", upsetRisk: "Upset Risk", proofLockedPublicRecord: "After full time, this pick is added to PAUL's public record.", finalScoresVerify: "Final scores will verify this pick after the match.", officialPredictionFallback: "PAUL has returned an official prediction.", lockedWithoutDetails: "PAUL has locked this pick without a detailed explanation.", awaitingGroups: "Awaiting groups", awaitingGroupPick: "Awaiting Group-stage PAUL Pick", awaitingKnockoutPick: "Awaiting Knockout Oracle Pick", waitingBracketResults: "Waiting for bracket results", pendingGroupPickCopy: "This group-stage pick will be proof-locked before kickoff and counted in PAUL's public baseline record.", pendingKnockoutPickCopy: "Knockout Oracle Mode will lock this win-or-go-home pick before kickoff, with upset risk and bracket-path reasoning.", unresolvedSlotCopy: "This knockout slot will become predictable after earlier real results fill the official bracket.", pendingModelCopy: "The proof-locked official pick is still pending. Daily PAUL probabilities can update above before the lock window.", unresolvedModelCopy: "This match will become predictable after the earlier winners are known.", knockoutFixturesPending: "Knockout fixtures will appear only after real group-stage results and the official bracket are available.", groupStageRecord: "Group-stage record", knockoutOracleMode: "Knockout Oracle Mode", noMatchingProofs: "No matching proofs", noProofsMatchCopy: "Change the round filter or search term. The official proof ledger still keeps every locked prediction.", proofServiceUnavailable: "Proof service unavailable", copy: "Copy", copied: "Copied", copyBlockedLoaded: "Copy was blocked. JSON was loaded below for manual copy.", loadInVerifier: "Load in verifier", downloadCanonical: "Download canonical", downloadOts: "Download .ots", copiedProofJson: "Proof JSON copied.", copiedProofForMatch: "Copied proof for match", proofJsonLoaded: "Proof JSON loaded. Click Verify Proof.", demoProofLoaded: "Fixed demo proof with bundled .ots loaded. Click Verify Proof.", proofVerificationComplete: "Proof verification completed locally in this browser.", proofInputPlaceholder: "Paste proof JSON here...", proofVerifierEyebrow: "Public Proof Verifier", proofVerifierTitle: "Verify a PAUL proof yourself.", proofVerifierCopy: "Paste proof JSON from any card. The browser recalculates SHA-256 locally, checks canonical consistency, and shows GitHub/OpenTimestamps evidence.", loadDemoProof: "Load Demo Proof", verifyProof: "Verify Proof", clear: "Clear", noProofLoaded: "No proof loaded.", showLatest: "Show latest", showAll: "Show all", retainedProofs: "retained official proofs", matchingProofs: "matching proofs", showing: "Showing", latest: "latest", of: "of", hashVerified: "Hash verified", hashMismatch: "Hash mismatch", beforeKickoff: "Before kickoff", checkTime: "Check time", otsReceipt: "OTS receipt", unknown: "Unknown", pick: "Pick", githubProof: "GitHub proof", noGithubTimestamp: "No GitHub timestamp", githubPending: "GitHub pending", noOtsProof: "No OpenTimestamps proof", otsPending: "OpenTimestamps pending", openOtsVerifier: "Open OTS verifier"
  , all: "All"
});
Object.assign(languageCopy.zh, {
  overallAccuracy: "PAUL 命中率", correctPicks: "命中场数", correctMatches: "已命中场次", noCorrectPicksYet: "赛果同步并确认 PAUL 命中后，会在这里用绿色显示。", verifyJson: "JSON", copyJson: "复制 JSON", proofCopy: "复制任意 Proof JSON，粘贴到验证器，即可自己检查哈希和时间戳。", proofStepCopy: "1. 复制 Proof JSON", proofStepPaste: "2. 粘贴到下方", proofStepVerify: "3. 验证哈希和时间",
  entertainmentNoticeTitle: "仅供娱乐参考", entertainmentNoticeCopy: "本网站仅供娱乐和参考，不构成投注、投资或财务建议。",
  recordEyebrow: "PAUL 战绩", recordTitle: "逐场公开统计命中率。", recordCopy: "每个赛前锁定预测都会在赛后计入战绩。所有访客看到同一份公开、带证明、可追踪的记录。",
  publicFavorite: "市场热门命中率", teamRead: "球队模型命中率", paulGain: "PAUL 比市场多中", calibration: "实际命中率 / 平均信心", referenceRecord: "参考战绩。", extraCorrectPicks: "比参考多命中的场次。", actualVsConfidence: "实际命中率对比信心值。",
  predictorEyebrow: "PK 预测器", predictorTitle: "先积累小组赛战绩，再进入淘汰赛神谕模式。", predictorCopy: "PAUL 会在开赛前预测每一场可预测比赛，包括小组赛。32 强签表确定后，每个预测都会变成一场定生死的淘汰赛判断。",
  round: "轮次", group: "小组", groupLabel: "小组", search: "搜索", searchPlaceholder: "球队、国家、比赛编号...",
  automationEyebrow: "自动化引擎", automationTitle: "每日刷新赔率、同步赛果、推进签表，并在赛前锁定预测。", automationCopy: "Vercel Cron 会刷新市场赔率快照、检查最终比分、记录胜者、填充下一轮淘汰赛，并在每场比赛前锁定 PAUL 预测，让所有访客看到一致的公开战绩。",
  lockedPredictions: "已锁定预测", syncedResults: "已同步赛果", predictionAccuracy: "预测命中率", nextScheduledPick: "下一次赛前预测", runDueTasks: "运行到期任务", loadingAutomation: "正在加载自动化状态...",
  proofEyebrow: "预测证明", proofTitle: "每个 PAUL 预测都会生成公开哈希和时间戳证明。", proofCopy: "当 PAUL 锁定预测后，完整预测内容会转换为标准 JSON 并计算 SHA-256 哈希。正式预测还会尝试生成 OpenTimestamps .ots 收据，方便任何人在站外验证同一个哈希。",
  totalProofs: "总证明数", allRounds: "全部轮次", groupStage: "小组赛", knockout: "淘汰赛", otsReceipts: "OTS 收据", noLockedProofs: "还没有锁定证明", proofsAppear: "PAUL 锁定正式预测后，证明记录会显示在这里。", proofSearchPlaceholder: "比赛、球队、哈希、轮次...", showAllProofs: "显示全部证明",
  groupsEyebrow: "48 支球队", groupsTitle: "A-L 小组", groupsCopy: "每张球队卡包含国旗、小组，以及 PK 页使用的本国语言文本。",
  primaryLanguages: "主要语言", localLanguage: "本国语言", bracketStatus: "签表状态", slotFilled: "前序比赛结果同步后，这个席位会自动填充。",
  fanVote: "观众投票", bracketSlotPending: "签表席位待定", votes: "票", dailyRead: "PAUL 每日判断", waitingTeams: "等待球队确定", nextRefreshPending: "等待下次刷新", dailyRefreshCopy: "当这场比赛进入每日分析窗口后，PAUL 会自动刷新这一场对阵。", currentLean: "当前倾向", confidence: "信心", draw: "平局", liveEstimate: "实时估计", officialLock: "正式锁定", postLockDrift: "锁定后漂移", postLockDriftCopy: "Proof 保持不变，但新的赛前数据已经指向另一边。这个变化只影响实验室校准。", lockAlignedCopy: "实时 PAUL 仍与正式锁定一致。新数据只用于校准层。",
  correct: "命中", missed: "未命中", final: "已完赛", locked: "已锁定", proofLocked: "证明已锁定", notLocked: "未锁定", lockedAt: "锁定时间", kickoff: "开赛时间", generatedAt: "生成时间", updated: "已更新", officialConfidence: "正式信心", officialPredictionPending: "正式预测待定", officialPredictionNotLocked: "PAUL 正式预测还未锁定。", bracketNotResolved: "这个签表席位还没有确定。", kickoffCountdown: "开赛倒计时", finalScorePending: "最终比分还未同步。完赛后会更新命中率。", predictedScore: "预测比分", officialPaulPick: "PAUL 正式选择", upsetWatch: "冷门观察", proofStatus: "证明状态", upsetRisk: "冷门风险", proofLockedPublicRecord: "完赛后，这个预测会计入 PAUL 公开战绩。", finalScoresVerify: "赛后比分会验证这个预测。", officialPredictionFallback: "PAUL 已返回正式预测。", lockedWithoutDetails: "PAUL 已锁定本场预测，但没有提供详细说明。", awaitingGroups: "等待小组赛", awaitingGroupPick: "等待小组赛 PAUL 预测", awaitingKnockoutPick: "等待淘汰赛 PAUL 神谕", waitingBracketResults: "等待签表结果", pendingGroupPickCopy: "这场小组赛预测会在开赛前生成证明并锁定，并计入 PAUL 公开基础战绩。", pendingKnockoutPickCopy: "淘汰赛神谕模式会在开赛前锁定这场定生死预测，并考虑冷门风险和签表路径。", unresolvedSlotCopy: "前序真实赛果填充正式签表后，这个淘汰赛席位才会进入可预测状态。", pendingModelCopy: "正式证明预测仍在等待锁定。锁定窗口前，上方每日概率仍可更新。", unresolvedModelCopy: "前序胜者确定后，这场比赛才会进入可预测状态。", knockoutFixturesPending: "真实小组赛结果和正式签表可用后，淘汰赛列表才会显示。", groupStageRecord: "小组赛战绩", knockoutOracleMode: "淘汰赛神谕模式", noMatchingProofs: "没有匹配的证明", noProofsMatchCopy: "请更换轮次筛选或搜索词。正式证明账本仍会保留每一个锁定预测。", proofServiceUnavailable: "证明服务暂时不可用", copy: "复制", loadInVerifier: "载入验证器", downloadCanonical: "下载标准 JSON", downloadOts: "下载 .ots", copiedProofJson: "证明 JSON 已复制。", copiedProofForMatch: "已复制比赛证明", proofJsonLoaded: "证明 JSON 已载入。点击验证证明。", demoProofLoaded: "固定演示证明和内置 .ots 已载入。点击验证证明。", proofVerificationComplete: "证明已在本浏览器本地验证完成。", proofInputPlaceholder: "在这里粘贴证明 JSON...", proofVerifierEyebrow: "公开证明验证器", proofVerifierTitle: "自己验证 PAUL 证明。", proofVerifierCopy: "粘贴任意卡片中的证明 JSON。浏览器会在本地重新计算 SHA-256，检查标准内容一致性，并显示 GitHub/OpenTimestamps 证据。", loadDemoProof: "载入演示证明", verifyProof: "验证证明", clear: "清空", noProofLoaded: "还没有载入证明。", showLatest: "显示最新", showAll: "显示全部", retainedProofs: "条已保留正式证明", matchingProofs: "条匹配证明", showing: "显示", latest: "最新", of: "/", hashVerified: "哈希已验证", hashMismatch: "哈希不匹配", beforeKickoff: "早于开赛", checkTime: "检查时间", otsReceipt: "OTS 收据", unknown: "未知", pick: "选择", githubProof: "GitHub 证明", noGithubTimestamp: "暂无 GitHub 时间戳", githubPending: "GitHub 待处理", noOtsProof: "暂无 OpenTimestamps 证明", otsPending: "OpenTimestamps 待处理", openOtsVerifier: "打开 OTS 验证器"
  , all: "全部"
});
Object.assign(languageCopy.en, {
  yourTime: "Your time",
  venueLocalTime: "Venue local time",
  officialScheduleSource: "Official schedule source"
});

Object.assign(languageCopy.zh, {
  yourTime: "你的时间",
  venueLocalTime: "比赛当地时间",
  officialScheduleSource: "官方赛程来源"
});

Object.assign(languageCopy.en, {
  ratingsMissing: "Ratings missing",
  awaitingGroupLock: "Awaiting group lock",
  awaitingKnockoutLock: "Awaiting knockout lock",
  awaitingLock: "Awaiting lock",
  awaitingResult: "Awaiting result",
  afterFinal: "After final",
  noComparison: "No comparison",
  marketPending: "Market pending",
  driftReason: "Drift reason",
  ratingsLoaded: "team ratings loaded",
  ratingsMissingStatus: "team ratings missing"
});

Object.assign(languageCopy.zh, {
  pending: "待定",
  recordEyebrow: "PAUL 战绩",
  recordTitle: "逐场公开统计命中率。",
  recordCopy: "每个赛前锁定预测都会在赛后计入战绩，记录公开、带证明，并对所有访客保持一致。",
  publicFavorite: "市场热门命中率",
  teamRead: "球队模型命中率",
  paulGain: "PAUL 比市场多中",
  calibration: "实际命中率 / 平均信心",
  referenceRecord: "参考战绩。",
  extraCorrectPicks: "比市场多命中的场次。",
  actualVsConfidence: "实际命中率对比信心值。",
  ratingsMissing: "评级数据缺失",
  awaitingGroupLock: "等待小组赛锁定",
  awaitingKnockoutLock: "等待淘汰赛锁定",
  awaitingLock: "等待锁定",
  awaitingResult: "等待赛果",
  afterFinal: "赛后计算",
  noComparison: "暂无对比",
  marketPending: "等待市场数据",
  driftReason: "漂移原因",
  ratingsLoaded: "球队评级已加载",
  ratingsMissingStatus: "球队评级缺失"
});

["es", "fr", "de", "pt", "ar", "ja", "ko", "it", "nl", "tr"].forEach((key) => {
  Object.entries(languageCopy.en).forEach(([copyKey, value]) => {
    languageCopy[key][copyKey] ||= value;
  });
});

const recordSectionCopy = {
  es: {
    entertainmentNoticeTitle: "Solo entretenimiento",
    entertainmentNoticeCopy: "Este sitio es solo para entretenimiento y referencia. Las predicciones de PAUL no son asesoramiento de apuestas ni financiero.",
    recordEyebrow: "Registro de PAUL",
    recordTitle: "Precision publica, partido a partido.",
    recordCopy: "Cada prediccion bloqueada se cuenta despues del resultado final. El registro permanece publico, enlazado a pruebas y consistente para todos.",
    publicFavorite: "Precision favorito mercado",
    teamRead: "Precision modelo equipo",
    paulGain: "PAUL sobre mercado",
    calibration: "Precision / confianza",
    referenceRecord: "Registro de referencia.",
    extraCorrectPicks: "Aciertos adicionales.",
    actualVsConfidence: "Precision real vs confianza."
  },
  fr: {
    entertainmentNoticeTitle: "Divertissement seulement",
    entertainmentNoticeCopy: "Ce site est fourni a titre de divertissement et de reference. Les predictions de PAUL ne sont pas des conseils de pari ou financiers.",
    recordEyebrow: "Bilan PAUL",
    recordTitle: "Precision publique, match par match.",
    recordCopy: "Chaque choix verrouille est compte apres le score final. Le bilan reste public, lie aux preuves et identique pour chaque visiteur.",
    publicFavorite: "Precision favori marche",
    teamRead: "Precision modele equipe",
    paulGain: "PAUL vs marche",
    calibration: "Precision / confiance",
    referenceRecord: "Bilan de reference.",
    extraCorrectPicks: "Choix corrects en plus.",
    actualVsConfidence: "Precision reelle vs confiance."
  },
  de: {
    entertainmentNoticeTitle: "Nur Unterhaltung",
    entertainmentNoticeCopy: "Diese Website dient nur der Unterhaltung und Orientierung. PAUL-Prognosen sind keine Wett- oder Finanzberatung.",
    recordEyebrow: "PAUL Bilanz",
    recordTitle: "Offentliche Genauigkeit, Spiel fur Spiel.",
    recordCopy: "Jeder gesperrte Tipp wird nach dem Endstand gezahlt. Die Bilanz bleibt offentlich, beweisverknupft und fur alle Besucher gleich.",
    publicFavorite: "Markt-Favorit Trefferquote",
    teamRead: "Teammodell Trefferquote",
    paulGain: "PAUL vor Markt",
    calibration: "Trefferquote / Vertrauen",
    referenceRecord: "Referenzbilanz.",
    extraCorrectPicks: "Zusatzlich richtige Tipps.",
    actualVsConfidence: "Reale Genauigkeit vs Vertrauen."
  },
  pt: {
    entertainmentNoticeTitle: "Apenas entretenimento",
    entertainmentNoticeCopy: "Este site e apenas para entretenimento e referencia. As previsoes de PAUL nao sao aconselhamento de apostas ou financeiro.",
    recordEyebrow: "Historico PAUL",
    recordTitle: "Precisao publica, jogo a jogo.",
    recordCopy: "Cada palpite travado e contado apos o placar final. O historico permanece publico, ligado a provas e igual para todos.",
    publicFavorite: "Acerto favorito mercado",
    teamRead: "Acerto modelo equipe",
    paulGain: "PAUL sobre mercado",
    calibration: "Acerto / confianca",
    referenceRecord: "Historico de referencia.",
    extraCorrectPicks: "Acertos extras.",
    actualVsConfidence: "Precisao real vs confianca."
  },
  it: {
    entertainmentNoticeTitle: "Solo intrattenimento",
    entertainmentNoticeCopy: "Questo sito e solo per intrattenimento e riferimento. Le previsioni di PAUL non sono consigli di scommessa o finanziari.",
    recordEyebrow: "Record PAUL",
    recordTitle: "Precisione pubblica, partita per partita.",
    recordCopy: "Ogni pronostico bloccato viene conteggiato dopo il risultato finale. Il record resta pubblico, collegato alle prove e uguale per tutti.",
    publicFavorite: "Precisione favorito mercato",
    teamRead: "Precisione modello squadra",
    paulGain: "PAUL sul mercato",
    calibration: "Precisione / fiducia",
    referenceRecord: "Record di riferimento.",
    extraCorrectPicks: "Pronostici corretti extra.",
    actualVsConfidence: "Precisione reale vs fiducia."
  },
  nl: {
    entertainmentNoticeTitle: "Alleen entertainment",
    entertainmentNoticeCopy: "Deze site is alleen voor entertainment en referentie. PAUL-voorspellingen zijn geen gok- of financieel advies.",
    recordEyebrow: "PAUL record",
    recordTitle: "Publieke nauwkeurigheid, wedstrijd voor wedstrijd.",
    recordCopy: "Elke vergrendelde pick telt mee na de eindstand. Het record blijft publiek, bewijsgekoppeld en gelijk voor elke bezoeker.",
    publicFavorite: "Marktfavoriet nauwkeurigheid",
    teamRead: "Teammodel nauwkeurigheid",
    paulGain: "PAUL boven markt",
    calibration: "Nauwkeurigheid / vertrouwen",
    referenceRecord: "Referentierecord.",
    extraCorrectPicks: "Extra juiste picks.",
    actualVsConfidence: "Werkelijke nauwkeurigheid vs vertrouwen."
  },
  tr: {
    entertainmentNoticeTitle: "Sadece eglence",
    entertainmentNoticeCopy: "Bu site yalnizca eglence ve referans amaclidir. PAUL tahminleri bahis veya finans tavsiyesi degildir.",
    recordEyebrow: "PAUL kaydi",
    recordTitle: "Herkese acik dogruluk, mac mac.",
    recordCopy: "Kilitlenen her tahmin final skorundan sonra sayilir. Kayit herkese acik, kanit baglantili ve tum ziyaretciler icin aynidir.",
    publicFavorite: "Piyasa favorisi dogrulugu",
    teamRead: "Takim modeli dogrulugu",
    paulGain: "PAUL piyasanin ustunde",
    calibration: "Dogruluk / guven",
    referenceRecord: "Referans kaydi.",
    extraCorrectPicks: "Ek dogru tahminler.",
    actualVsConfidence: "Gercek dogruluk vs guven."
  },
  ar: {
    entertainmentNoticeTitle: "للترفيه فقط",
    entertainmentNoticeCopy: "هذا الموقع للترفيه والمرجع فقط. توقعات PAUL ليست نصيحة مراهنة أو نصيحة مالية.",
    recordEyebrow: "سجل PAUL",
    recordTitle: "دقة علنية، مباراة بمباراة.",
    recordCopy: "كل توقع مقفل يتم احتسابه بعد النتيجة النهائية. يبقى السجل علنيا ومرتبطا بالدليل ومتطابقا لكل زائر.",
    publicFavorite: "دقة مرشح السوق",
    teamRead: "دقة نموذج الفريق",
    paulGain: "PAUL فوق السوق",
    calibration: "الدقة / الثقة",
    referenceRecord: "سجل مرجعي.",
    extraCorrectPicks: "اختيارات صحيحة إضافية.",
    actualVsConfidence: "الدقة الفعلية مقابل الثقة."
  },
  ja: {
    entertainmentNoticeTitle: "娯楽目的のみ",
    entertainmentNoticeCopy: "このサイトは娯楽と参考のためのものです。PAUL の予測は賭けや金融の助言ではありません。",
    recordEyebrow: "PAUL 成績",
    recordTitle: "公開精度を試合ごとに追跡。",
    recordCopy: "ロックされた予測は最終結果後に集計されます。記録は公開され、証明に紐づき、全訪問者で同じです。",
    publicFavorite: "市場本命的中率",
    teamRead: "チームモデル的中率",
    paulGain: "PAULの市場超過",
    calibration: "的中率 / 信頼度",
    referenceRecord: "参考記録。",
    extraCorrectPicks: "追加的中数。",
    actualVsConfidence: "実際の精度 vs 信頼度。"
  },
  ko: {
    entertainmentNoticeTitle: "오락 참고용",
    entertainmentNoticeCopy: "이 사이트는 오락과 참고용입니다. PAUL 예측은 베팅 또는 금융 조언이 아닙니다.",
    recordEyebrow: "PAUL 기록",
    recordTitle: "공개 정확도, 경기별 추적.",
    recordCopy: "잠긴 예측은 최종 스코어 후 기록됩니다. 기록은 공개되고 증명과 연결되며 모든 방문자에게 동일합니다.",
    publicFavorite: "시장 인기 정확도",
    teamRead: "팀 모델 정확도",
    paulGain: "PAUL 시장 초과",
    calibration: "정확도 / 신뢰도",
    referenceRecord: "참고 기록.",
    extraCorrectPicks: "추가 적중.",
    actualVsConfidence: "실제 정확도 vs 신뢰도."
  }
};

Object.entries(recordSectionCopy).forEach(([key, copy]) => {
  Object.assign(languageCopy[key], copy);
});

Object.assign(languageCopy.es, {
  overallAccuracy: "Precisión de PAUL",
  correctPicks: "Aciertos",
  correctMatches: "Aciertos confirmados",
  noCorrectPicksYet: "Los aciertos aparecerán aquí en verde cuando se sincronicen los resultados finales.",
  verifyJson: "JSON",
  copyJson: "Copiar JSON",
  proofCopy: "Copia cualquier Proof JSON, pégalo en el verificador y comprueba el hash y la marca de tiempo.",
  proofStepCopy: "1. Copiar Proof JSON",
  proofStepPaste: "2. Pegar abajo",
  proofStepVerify: "3. Verificar hash y hora",
  fanVote: "Voto de aficionados",
  bracketSlotPending: "Casilla del cuadro pendiente",
  votes: "votos",
  dailyRead: "Lectura diaria de PAUL",
  waitingTeams: "Esperando equipos",
  nextRefreshPending: "Próxima actualización pendiente",
  dailyRefreshCopy: "PAUL actualizará este partido automáticamente cuando entre en la ventana diaria de análisis.",
  currentLean: "Tendencia actual",
  confidence: "confianza",
  draw: "Empate",
  correct: "Correcto",
  missed: "Fallado",
  final: "Final",
  locked: "Bloqueado",
  proofLocked: "Prueba bloqueada",
  notLocked: "No bloqueado",
  lockedAt: "Bloqueado",
  kickoff: "Inicio",
  generatedAt: "Generado",
  updated: "Actualizado",
  officialConfidence: "Confianza oficial",
  officialPredictionPending: "Predicción oficial pendiente",
  officialPredictionNotLocked: "La predicción oficial de PAUL aún no está bloqueada.",
  bracketNotResolved: "Esta casilla del cuadro aún no está resuelta.",
  kickoffCountdown: "Cuenta regresiva",
  finalScorePending: "El resultado final aún no se ha sincronizado. La precisión se actualizará después del final.",
  predictedScore: "Marcador previsto",
  officialPaulPick: "Elección oficial de PAUL",
  upsetWatch: "Alerta de sorpresa",
  proofStatus: "Estado de la prueba",
  upsetRisk: "Riesgo de sorpresa",
  proofLockedPublicRecord: "Después del final, esta elección se suma al registro público de PAUL.",
  finalScoresVerify: "El resultado final verificará esta elección después del partido.",
  officialPredictionFallback: "PAUL ha devuelto una predicción oficial.",
  lockedWithoutDetails: "PAUL ha bloqueado esta elección sin una explicación detallada.",
  awaitingGroups: "Esperando fase de grupos",
  awaitingGroupPick: "Esperando predicción de PAUL en fase de grupos",
  awaitingKnockoutPick: "Esperando oráculo de PAUL en eliminatorias",
  waitingBracketResults: "Esperando resultados del cuadro",
  pendingGroupPickCopy: "Esta predicción de fase de grupos se probará y bloqueará antes del inicio, y contará en el registro público base de PAUL.",
  pendingKnockoutPickCopy: "El modo Oráculo de eliminatorias bloqueará esta elección de vida o muerte antes del inicio, con riesgo de sorpresa y lectura del camino del cuadro.",
  unresolvedSlotCopy: "Esta casilla eliminatoria será predecible cuando los resultados reales anteriores completen el cuadro oficial.",
  pendingModelCopy: "La predicción oficial con prueba aún está pendiente. Las probabilidades diarias de PAUL pueden actualizarse arriba antes de la ventana de bloqueo.",
  unresolvedModelCopy: "Este partido será predecible cuando se conozcan los ganadores anteriores.",
  knockoutFixturesPending: "Los partidos eliminatorios aparecerán solo cuando existan resultados reales de la fase de grupos y el cuadro oficial.",
  groupStageRecord: "Registro de fase de grupos",
  knockoutOracleMode: "Modo Oráculo eliminatorio",
  all: "Todo"
});

let currentLanguage = (() => {
  try {
    return localStorage.getItem(languageKey) || "en";
  } catch {
    return "en";
  }
})();

function tr(key) {
  return languageCopy[currentLanguage]?.[key] || languageCopy.en[key] || key;
}

function currentLocale() {
  return languageOptions.find((item) => item[0] === currentLanguage)?.[2] || "en-US";
}

function roundLabel(round) {
  const labels = {
    Recent: {
      en: "Recent matches",
      es: "Partidos recientes",
      fr: "Matchs récents",
      de: "Aktuelle Spiele",
      pt: "Jogos recentes",
      ar: "المباريات القريبة",
      zh: "最近比赛",
      ja: "直近の試合",
      ko: "최근 경기",
      it: "Partite recenti",
      nl: "Recente wedstrijden",
      tr: "Yakın maçlar"
    },
    All: { en: "All", es: "Todo", zh: "全部" },
    "Group Stage": { en: "Group stage", es: "Fase de grupos", zh: "小组赛" },
    "Round of 32": { en: "Round of 32", es: "Dieciseisavos", zh: "32 强" },
    "Round of 16": { en: "Round of 16", es: "Octavos", zh: "16 强" },
    Quarterfinal: { en: "Quarterfinal", es: "Cuartos de final", zh: "四分之一决赛" },
    Semifinal: { en: "Semifinal", es: "Semifinal", zh: "半决赛" },
    "Third Place": { en: "Third Place", es: "Tercer puesto", zh: "季军赛" },
    Final: { en: "Final", es: "Final", zh: "决赛" }
  };
  return labels[round]?.[currentLanguage] || labels[round]?.en || roundLabels[round] || round;
}

const groupDates = {
  A: ["Jun 11", "Jun 11", "Jun 18", "Jun 18", "Jun 24", "Jun 24"],
  B: ["Jun 12", "Jun 13", "Jun 18", "Jun 18", "Jun 24", "Jun 24"],
  C: ["Jun 13", "Jun 13", "Jun 19", "Jun 19", "Jun 24", "Jun 24"],
  D: ["Jun 12", "Jun 13", "Jun 19", "Jun 19", "Jun 25", "Jun 25"],
  E: ["Jun 14", "Jun 14", "Jun 20", "Jun 20", "Jun 25", "Jun 25"],
  F: ["Jun 14", "Jun 14", "Jun 20", "Jun 20", "Jun 25", "Jun 25"],
  G: ["Jun 15", "Jun 15", "Jun 21", "Jun 21", "Jun 26", "Jun 26"],
  H: ["Jun 15", "Jun 15", "Jun 21", "Jun 21", "Jun 26", "Jun 26"],
  I: ["Jun 16", "Jun 16", "Jun 22", "Jun 22", "Jun 26", "Jun 26"],
  J: ["Jun 16", "Jun 16", "Jun 22", "Jun 22", "Jun 27", "Jun 27"],
  K: ["Jun 17", "Jun 17", "Jun 23", "Jun 23", "Jun 27", "Jun 27"],
  L: ["Jun 17", "Jun 17", "Jun 23", "Jun 23", "Jun 27", "Jun 27"]
};

const cityRoute = {
  A: "Mexico City / Guadalajara / Atlanta",
  B: "Toronto / Bay Area / Los Angeles",
  C: "New York-New Jersey / Boston / Miami",
  D: "Los Angeles / Vancouver / Seattle",
  E: "Philadelphia / Houston / New York-New Jersey",
  F: "Dallas / Monterrey / Kansas City",
  G: "Seattle / Los Angeles / Vancouver",
  H: "Atlanta / Miami / Houston",
  I: "New York-New Jersey / Boston / Toronto",
  J: "Kansas City / Bay Area / Dallas",
  K: "Houston / Mexico City / Miami",
  L: "Dallas / Toronto / Philadelphia"
};

const pairPattern = [[1, 2], [3, 4], [4, 2], [1, 3], [4, 1], [2, 3]];
const modelNames = ["EloPulse", "FormNet", "TacticalLens", "OracleSynth"];

const kickoffInfoByMatchId = {
  "1": {
    "kickoffAt": "2026-06-11T19:00:00.000Z",
    "venueLocalTime": "1:00 p.m. UTC−6",
    "officialMatchId": 1,
    "officialVenue": "Estadio Azteca, Mexico City",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "2": {
    "kickoffAt": "2026-06-12T02:00:00.000Z",
    "venueLocalTime": "8:00 p.m. UTC−6",
    "officialMatchId": 2,
    "officialVenue": "Estadio Akron, Zapopan",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "3": {
    "kickoffAt": "2026-06-18T16:00:00.000Z",
    "venueLocalTime": "12:00 p.m. UTC−4",
    "officialMatchId": 3,
    "officialVenue": "Mercedes-Benz Stadium, Atlanta",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "4": {
    "kickoffAt": "2026-06-19T01:00:00.000Z",
    "venueLocalTime": "7:00 p.m. UTC−6",
    "officialMatchId": 4,
    "officialVenue": "Estadio Akron, Zapopan",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "5": {
    "kickoffAt": "2026-06-25T01:00:00.000Z",
    "venueLocalTime": "7:00 p.m. UTC−6",
    "officialMatchId": 5,
    "officialVenue": "Estadio Azteca, Mexico City",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "6": {
    "kickoffAt": "2026-06-25T01:00:00.000Z",
    "venueLocalTime": "7:00 p.m. UTC−6",
    "officialMatchId": 6,
    "officialVenue": "Estadio BBVA, Guadalupe",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "7": {
    "kickoffAt": "2026-06-12T19:00:00.000Z",
    "venueLocalTime": "3:00 p.m. UTC−4",
    "officialMatchId": 7,
    "officialVenue": "BMO Field, Toronto",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "8": {
    "kickoffAt": "2026-06-13T19:00:00.000Z",
    "venueLocalTime": "12:00 p.m. UTC−7",
    "officialMatchId": 8,
    "officialVenue": "Levi's Stadium, Santa Clara",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "9": {
    "kickoffAt": "2026-06-18T19:00:00.000Z",
    "venueLocalTime": "12:00 p.m. UTC−7",
    "officialMatchId": 9,
    "officialVenue": "SoFi Stadium, Inglewood",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "10": {
    "kickoffAt": "2026-06-18T22:00:00.000Z",
    "venueLocalTime": "3:00 p.m. UTC−7",
    "officialMatchId": 10,
    "officialVenue": "BC Place, Vancouver",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "11": {
    "kickoffAt": "2026-06-24T19:00:00.000Z",
    "venueLocalTime": "12:00 p.m. UTC−7",
    "officialMatchId": 11,
    "officialVenue": "BC Place, Vancouver",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "12": {
    "kickoffAt": "2026-06-24T19:00:00.000Z",
    "venueLocalTime": "12:00 p.m. UTC−7",
    "officialMatchId": 12,
    "officialVenue": "Lumen Field, Seattle",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "13": {
    "kickoffAt": "2026-06-13T22:00:00.000Z",
    "venueLocalTime": "6:00 p.m. UTC−4",
    "officialMatchId": 13,
    "officialVenue": "MetLife Stadium, East Rutherford",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "14": {
    "kickoffAt": "2026-06-14T01:00:00.000Z",
    "venueLocalTime": "9:00 p.m. UTC−4",
    "officialMatchId": 14,
    "officialVenue": "Gillette Stadium, Foxborough",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "15": {
    "kickoffAt": "2026-06-19T22:00:00.000Z",
    "venueLocalTime": "6:00 p.m. UTC−4",
    "officialMatchId": 15,
    "officialVenue": "Gillette Stadium, Foxborough",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "16": {
    "kickoffAt": "2026-06-20T00:30:00.000Z",
    "venueLocalTime": "8:30 p.m. UTC−4",
    "officialMatchId": 16,
    "officialVenue": "Lincoln Financial Field, Philadelphia",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "17": {
    "kickoffAt": "2026-06-24T22:00:00.000Z",
    "venueLocalTime": "6:00 p.m. UTC−4",
    "officialMatchId": 17,
    "officialVenue": "Hard Rock Stadium, Miami Gardens",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "18": {
    "kickoffAt": "2026-06-24T22:00:00.000Z",
    "venueLocalTime": "6:00 p.m. UTC−4",
    "officialMatchId": 18,
    "officialVenue": "Mercedes-Benz Stadium, Atlanta",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "19": {
    "kickoffAt": "2026-06-13T01:00:00.000Z",
    "venueLocalTime": "6:00 p.m. UTC−7",
    "officialMatchId": 19,
    "officialVenue": "SoFi Stadium, Inglewood",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "20": {
    "kickoffAt": "2026-06-14T04:00:00.000Z",
    "venueLocalTime": "9:00 p.m. UTC−7",
    "officialMatchId": 20,
    "officialVenue": "BC Place, Vancouver",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "21": {
    "kickoffAt": "2026-06-20T03:00:00.000Z",
    "venueLocalTime": "8:00 p.m. UTC−7",
    "officialMatchId": 22,
    "officialVenue": "Levi's Stadium, Santa Clara",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "22": {
    "kickoffAt": "2026-06-19T19:00:00.000Z",
    "venueLocalTime": "12:00 p.m. UTC−7",
    "officialMatchId": 21,
    "officialVenue": "Lumen Field, Seattle",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "23": {
    "kickoffAt": "2026-06-26T02:00:00.000Z",
    "venueLocalTime": "7:00 p.m. UTC−7",
    "officialMatchId": 23,
    "officialVenue": "SoFi Stadium, Inglewood",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "24": {
    "kickoffAt": "2026-06-26T02:00:00.000Z",
    "venueLocalTime": "7:00 p.m. UTC−7",
    "officialMatchId": 24,
    "officialVenue": "Levi's Stadium, Santa Clara",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "25": {
    "kickoffAt": "2026-06-14T17:00:00.000Z",
    "venueLocalTime": "12:00 p.m. UTC−5",
    "officialMatchId": 25,
    "officialVenue": "NRG Stadium, Houston",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "26": {
    "kickoffAt": "2026-06-14T23:00:00.000Z",
    "venueLocalTime": "7:00 p.m. UTC−4",
    "officialMatchId": 26,
    "officialVenue": "Lincoln Financial Field, Philadelphia",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "27": {
    "kickoffAt": "2026-06-21T00:00:00.000Z",
    "venueLocalTime": "7:00 p.m. UTC−5",
    "officialMatchId": 28,
    "officialVenue": "Arrowhead Stadium, Kansas City",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "28": {
    "kickoffAt": "2026-06-20T20:00:00.000Z",
    "venueLocalTime": "4:00 p.m. UTC−4",
    "officialMatchId": 27,
    "officialVenue": "BMO Field, Toronto",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "29": {
    "kickoffAt": "2026-06-25T20:00:00.000Z",
    "venueLocalTime": "4:00 p.m. UTC−4",
    "officialMatchId": 30,
    "officialVenue": "MetLife Stadium, East Rutherford",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "30": {
    "kickoffAt": "2026-06-25T20:00:00.000Z",
    "venueLocalTime": "4:00 p.m. UTC−4",
    "officialMatchId": 29,
    "officialVenue": "Lincoln Financial Field, Philadelphia",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "31": {
    "kickoffAt": "2026-06-14T20:00:00.000Z",
    "venueLocalTime": "3:00 p.m. UTC−5",
    "officialMatchId": 31,
    "officialVenue": "AT&T Stadium, Arlington",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "32": {
    "kickoffAt": "2026-06-15T02:00:00.000Z",
    "venueLocalTime": "8:00 p.m. UTC−6",
    "officialMatchId": 32,
    "officialVenue": "Estadio BBVA, Guadalupe",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "33": {
    "kickoffAt": "2026-06-21T04:00:00.000Z",
    "venueLocalTime": "10:00 p.m. UTC−6",
    "officialMatchId": 34,
    "officialVenue": "Estadio BBVA, Guadalupe",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "34": {
    "kickoffAt": "2026-06-20T17:00:00.000Z",
    "venueLocalTime": "12:00 p.m. UTC−5",
    "officialMatchId": 33,
    "officialVenue": "NRG Stadium, Houston",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "35": {
    "kickoffAt": "2026-06-25T23:00:00.000Z",
    "venueLocalTime": "6:00 p.m. UTC−5",
    "officialMatchId": 36,
    "officialVenue": "Arrowhead Stadium, Kansas City",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "36": {
    "kickoffAt": "2026-06-25T23:00:00.000Z",
    "venueLocalTime": "6:00 p.m. UTC−5",
    "officialMatchId": 35,
    "officialVenue": "AT&T Stadium, Arlington",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "37": {
    "kickoffAt": "2026-06-15T19:00:00.000Z",
    "venueLocalTime": "12:00 p.m. UTC−7",
    "officialMatchId": 37,
    "officialVenue": "Lumen Field, Seattle",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "38": {
    "kickoffAt": "2026-06-16T01:00:00.000Z",
    "venueLocalTime": "6:00 p.m. UTC−7",
    "officialMatchId": 38,
    "officialVenue": "SoFi Stadium, Inglewood",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "39": {
    "kickoffAt": "2026-06-22T01:00:00.000Z",
    "venueLocalTime": "6:00 p.m. UTC−7",
    "officialMatchId": 40,
    "officialVenue": "BC Place, Vancouver",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "40": {
    "kickoffAt": "2026-06-21T19:00:00.000Z",
    "venueLocalTime": "12:00 p.m. UTC−7",
    "officialMatchId": 39,
    "officialVenue": "SoFi Stadium, Inglewood",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "41": {
    "kickoffAt": "2026-06-27T03:00:00.000Z",
    "venueLocalTime": "8:00 p.m. UTC−7",
    "officialMatchId": 42,
    "officialVenue": "BC Place, Vancouver",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "42": {
    "kickoffAt": "2026-06-27T03:00:00.000Z",
    "venueLocalTime": "8:00 p.m. UTC−7",
    "officialMatchId": 41,
    "officialVenue": "Lumen Field, Seattle",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "43": {
    "kickoffAt": "2026-06-15T16:00:00.000Z",
    "venueLocalTime": "12:00 p.m. UTC−4",
    "officialMatchId": 43,
    "officialVenue": "Mercedes-Benz Stadium, Atlanta",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "44": {
    "kickoffAt": "2026-06-15T22:00:00.000Z",
    "venueLocalTime": "6:00 p.m. UTC−4",
    "officialMatchId": 44,
    "officialVenue": "Hard Rock Stadium, Miami Gardens",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "45": {
    "kickoffAt": "2026-06-21T22:00:00.000Z",
    "venueLocalTime": "6:00 p.m. UTC−4",
    "officialMatchId": 46,
    "officialVenue": "Hard Rock Stadium, Miami Gardens",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "46": {
    "kickoffAt": "2026-06-21T16:00:00.000Z",
    "venueLocalTime": "12:00 p.m. UTC−4",
    "officialMatchId": 45,
    "officialVenue": "Mercedes-Benz Stadium, Atlanta",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "47": {
    "kickoffAt": "2026-06-27T00:00:00.000Z",
    "venueLocalTime": "6:00 p.m. UTC−6",
    "officialMatchId": 48,
    "officialVenue": "Estadio Akron, Zapopan",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "48": {
    "kickoffAt": "2026-06-27T00:00:00.000Z",
    "venueLocalTime": "7:00 p.m. UTC−5",
    "officialMatchId": 47,
    "officialVenue": "NRG Stadium, Houston",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "49": {
    "kickoffAt": "2026-06-16T19:00:00.000Z",
    "venueLocalTime": "3:00 p.m. UTC−4",
    "officialMatchId": 49,
    "officialVenue": "MetLife Stadium, East Rutherford",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "50": {
    "kickoffAt": "2026-06-16T22:00:00.000Z",
    "venueLocalTime": "6:00 p.m. UTC−4",
    "officialMatchId": 50,
    "officialVenue": "Gillette Stadium, Foxborough",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "51": {
    "kickoffAt": "2026-06-23T00:00:00.000Z",
    "venueLocalTime": "8:00 p.m. UTC−4",
    "officialMatchId": 52,
    "officialVenue": "MetLife Stadium, East Rutherford",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "52": {
    "kickoffAt": "2026-06-22T21:00:00.000Z",
    "venueLocalTime": "5:00 p.m. UTC−4",
    "officialMatchId": 51,
    "officialVenue": "Lincoln Financial Field, Philadelphia",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "53": {
    "kickoffAt": "2026-06-26T19:00:00.000Z",
    "venueLocalTime": "3:00 p.m. UTC−4",
    "officialMatchId": 53,
    "officialVenue": "Gillette Stadium, Foxborough",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "54": {
    "kickoffAt": "2026-06-26T19:00:00.000Z",
    "venueLocalTime": "3:00 p.m. UTC−4",
    "officialMatchId": 54,
    "officialVenue": "BMO Field, Toronto",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "55": {
    "kickoffAt": "2026-06-17T01:00:00.000Z",
    "venueLocalTime": "8:00 p.m. UTC−5",
    "officialMatchId": 55,
    "officialVenue": "Arrowhead Stadium, Kansas City",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "56": {
    "kickoffAt": "2026-06-17T04:00:00.000Z",
    "venueLocalTime": "9:00 p.m. UTC−7",
    "officialMatchId": 56,
    "officialVenue": "Levi's Stadium, Santa Clara",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "57": {
    "kickoffAt": "2026-06-23T03:00:00.000Z",
    "venueLocalTime": "8:00 p.m. UTC−7",
    "officialMatchId": 58,
    "officialVenue": "Levi's Stadium, Santa Clara",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "58": {
    "kickoffAt": "2026-06-22T17:00:00.000Z",
    "venueLocalTime": "12:00 p.m. UTC−5",
    "officialMatchId": 57,
    "officialVenue": "AT&T Stadium, Arlington",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "59": {
    "kickoffAt": "2026-06-28T02:00:00.000Z",
    "venueLocalTime": "9:00 p.m. UTC−5",
    "officialMatchId": 60,
    "officialVenue": "AT&T Stadium, Arlington",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "60": {
    "kickoffAt": "2026-06-28T02:00:00.000Z",
    "venueLocalTime": "9:00 p.m. UTC−5",
    "officialMatchId": 59,
    "officialVenue": "Arrowhead Stadium, Kansas City",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "61": {
    "kickoffAt": "2026-06-17T17:00:00.000Z",
    "venueLocalTime": "12:00 p.m. UTC−5",
    "officialMatchId": 61,
    "officialVenue": "NRG Stadium, Houston",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "62": {
    "kickoffAt": "2026-06-18T02:00:00.000Z",
    "venueLocalTime": "8:00 p.m. UTC−6",
    "officialMatchId": 62,
    "officialVenue": "Estadio Azteca, Mexico City",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "63": {
    "kickoffAt": "2026-06-24T02:00:00.000Z",
    "venueLocalTime": "8:00 p.m. UTC−6",
    "officialMatchId": 64,
    "officialVenue": "Estadio Akron, Zapopan",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "64": {
    "kickoffAt": "2026-06-23T17:00:00.000Z",
    "venueLocalTime": "12:00 p.m. UTC−5",
    "officialMatchId": 63,
    "officialVenue": "NRG Stadium, Houston",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "65": {
    "kickoffAt": "2026-06-27T23:30:00.000Z",
    "venueLocalTime": "7:30 p.m. UTC−4",
    "officialMatchId": 65,
    "officialVenue": "Hard Rock Stadium, Miami Gardens",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "66": {
    "kickoffAt": "2026-06-27T23:30:00.000Z",
    "venueLocalTime": "7:30 p.m. UTC−4",
    "officialMatchId": 66,
    "officialVenue": "Mercedes-Benz Stadium, Atlanta",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "67": {
    "kickoffAt": "2026-06-17T20:00:00.000Z",
    "venueLocalTime": "3:00 p.m. UTC−5",
    "officialMatchId": 67,
    "officialVenue": "AT&T Stadium, Arlington",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "68": {
    "kickoffAt": "2026-06-17T23:00:00.000Z",
    "venueLocalTime": "7:00 p.m. UTC−4",
    "officialMatchId": 68,
    "officialVenue": "BMO Field, Toronto",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "69": {
    "kickoffAt": "2026-06-23T23:00:00.000Z",
    "venueLocalTime": "7:00 p.m. UTC−4",
    "officialMatchId": 70,
    "officialVenue": "BMO Field, Toronto",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "70": {
    "kickoffAt": "2026-06-23T20:00:00.000Z",
    "venueLocalTime": "4:00 p.m. UTC−4",
    "officialMatchId": 69,
    "officialVenue": "Gillette Stadium, Foxborough",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "71": {
    "kickoffAt": "2026-06-27T21:00:00.000Z",
    "venueLocalTime": "5:00 p.m. UTC−4",
    "officialMatchId": 71,
    "officialVenue": "MetLife Stadium, East Rutherford",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "72": {
    "kickoffAt": "2026-06-27T21:00:00.000Z",
    "venueLocalTime": "5:00 p.m. UTC−4",
    "officialMatchId": 72,
    "officialVenue": "Lincoln Financial Field, Philadelphia",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "73": {
    "kickoffAt": "2026-06-28T19:00:00.000Z",
    "venueLocalTime": "12:00 p.m. UTC−7",
    "officialMatchId": 73,
    "officialVenue": "SoFi Stadium, Inglewood",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "74": {
    "kickoffAt": "2026-06-29T17:00:00.000Z",
    "venueLocalTime": "12:00 p.m. UTC−5",
    "officialMatchId": 74,
    "officialVenue": "NRG Stadium, Houston",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "75": {
    "kickoffAt": "2026-06-29T20:30:00.000Z",
    "venueLocalTime": "4:30 p.m. UTC−4",
    "officialMatchId": 75,
    "officialVenue": "Gillette Stadium, Foxborough",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "76": {
    "kickoffAt": "2026-06-30T01:00:00.000Z",
    "venueLocalTime": "7:00 p.m. UTC−6",
    "officialMatchId": 76,
    "officialVenue": "Estadio BBVA, Guadalupe",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "77": {
    "kickoffAt": "2026-06-30T17:00:00.000Z",
    "venueLocalTime": "12:00 p.m. UTC−5",
    "officialMatchId": 77,
    "officialVenue": "AT&T Stadium, Arlington",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "78": {
    "kickoffAt": "2026-06-30T21:00:00.000Z",
    "venueLocalTime": "5:00 p.m. UTC−4",
    "officialMatchId": 78,
    "officialVenue": "MetLife Stadium, East Rutherford",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "79": {
    "kickoffAt": "2026-07-01T01:00:00.000Z",
    "venueLocalTime": "7:00 p.m. UTC−6",
    "officialMatchId": 79,
    "officialVenue": "Estadio Azteca, Mexico City",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "80": {
    "kickoffAt": "2026-07-01T16:00:00.000Z",
    "venueLocalTime": "12:00 p.m. UTC−4",
    "officialMatchId": 80,
    "officialVenue": "Mercedes-Benz Stadium, Atlanta",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "81": {
    "kickoffAt": "2026-07-01T20:00:00.000Z",
    "venueLocalTime": "1:00 p.m. UTC−7",
    "officialMatchId": 81,
    "officialVenue": "Lumen Field, Seattle",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "82": {
    "kickoffAt": "2026-07-02T00:00:00.000Z",
    "venueLocalTime": "5:00 p.m. UTC−7",
    "officialMatchId": 82,
    "officialVenue": "Levi's Stadium, Santa Clara",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "83": {
    "kickoffAt": "2026-07-02T19:00:00.000Z",
    "venueLocalTime": "12:00 p.m. UTC−7",
    "officialMatchId": 83,
    "officialVenue": "SoFi Stadium, Inglewood",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "84": {
    "kickoffAt": "2026-07-02T23:00:00.000Z",
    "venueLocalTime": "7:00 p.m. UTC−4",
    "officialMatchId": 84,
    "officialVenue": "BMO Field, Toronto",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "85": {
    "kickoffAt": "2026-07-03T03:00:00.000Z",
    "venueLocalTime": "8:00 p.m. UTC−7",
    "officialMatchId": 85,
    "officialVenue": "BC Place, Vancouver",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "86": {
    "kickoffAt": "2026-07-03T18:00:00.000Z",
    "venueLocalTime": "1:00 p.m. UTC−5",
    "officialMatchId": 86,
    "officialVenue": "AT&T Stadium, Arlington",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "87": {
    "kickoffAt": "2026-07-03T22:00:00.000Z",
    "venueLocalTime": "6:00 p.m. UTC−4",
    "officialMatchId": 87,
    "officialVenue": "Hard Rock Stadium, Miami Gardens",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "88": {
    "kickoffAt": "2026-07-04T01:30:00.000Z",
    "venueLocalTime": "8:30 p.m. UTC−5",
    "officialMatchId": 88,
    "officialVenue": "Arrowhead Stadium, Kansas City",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "89": {
    "kickoffAt": "2026-07-04T17:00:00.000Z",
    "venueLocalTime": "12:00 p.m. UTC−5",
    "officialMatchId": 89,
    "officialVenue": "NRG Stadium, Houston",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "90": {
    "kickoffAt": "2026-07-04T21:00:00.000Z",
    "venueLocalTime": "5:00 p.m. UTC−4",
    "officialMatchId": 90,
    "officialVenue": "Lincoln Financial Field, Philadelphia",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "91": {
    "kickoffAt": "2026-07-05T20:00:00.000Z",
    "venueLocalTime": "4:00 p.m. UTC−4",
    "officialMatchId": 91,
    "officialVenue": "MetLife Stadium, East Rutherford",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "92": {
    "kickoffAt": "2026-07-06T00:00:00.000Z",
    "venueLocalTime": "6:00 p.m. UTC−6",
    "officialMatchId": 92,
    "officialVenue": "Estadio Azteca, Mexico City",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "93": {
    "kickoffAt": "2026-07-06T19:00:00.000Z",
    "venueLocalTime": "2:00 p.m. UTC−5",
    "officialMatchId": 93,
    "officialVenue": "AT&T Stadium, Arlington",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "94": {
    "kickoffAt": "2026-07-07T00:00:00.000Z",
    "venueLocalTime": "5:00 p.m. UTC−7",
    "officialMatchId": 94,
    "officialVenue": "Lumen Field, Seattle",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "95": {
    "kickoffAt": "2026-07-07T16:00:00.000Z",
    "venueLocalTime": "12:00 p.m. UTC−4",
    "officialMatchId": 95,
    "officialVenue": "Mercedes-Benz Stadium, Atlanta",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "96": {
    "kickoffAt": "2026-07-07T20:00:00.000Z",
    "venueLocalTime": "1:00 p.m. UTC−7",
    "officialMatchId": 96,
    "officialVenue": "BC Place, Vancouver",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "97": {
    "kickoffAt": "2026-07-09T20:00:00.000Z",
    "venueLocalTime": "4:00 p.m. UTC−4",
    "officialMatchId": 97,
    "officialVenue": "Gillette Stadium, Foxborough",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "98": {
    "kickoffAt": "2026-07-10T19:00:00.000Z",
    "venueLocalTime": "12:00 p.m. UTC−7",
    "officialMatchId": 98,
    "officialVenue": "SoFi Stadium, Inglewood",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "99": {
    "kickoffAt": "2026-07-11T21:00:00.000Z",
    "venueLocalTime": "5:00 p.m. UTC−4",
    "officialMatchId": 99,
    "officialVenue": "Hard Rock Stadium, Miami Gardens",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "100": {
    "kickoffAt": "2026-07-12T01:00:00.000Z",
    "venueLocalTime": "8:00 p.m. UTC−5",
    "officialMatchId": 100,
    "officialVenue": "Arrowhead Stadium, Kansas City",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "101": {
    "kickoffAt": "2026-07-14T19:00:00.000Z",
    "venueLocalTime": "2:00 p.m. UTC−5",
    "officialMatchId": 101,
    "officialVenue": "AT&T Stadium, Arlington",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "102": {
    "kickoffAt": "2026-07-15T19:00:00.000Z",
    "venueLocalTime": "3:00 p.m. UTC−4",
    "officialMatchId": 102,
    "officialVenue": "Mercedes-Benz Stadium, Atlanta",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "103": {
    "kickoffAt": "2026-07-18T21:00:00.000Z",
    "venueLocalTime": "5:00 p.m. UTC−4",
    "officialMatchId": 103,
    "officialVenue": "Hard Rock Stadium, Miami Gardens",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  },
  "104": {
    "kickoffAt": "2026-07-19T19:00:00.000Z",
    "venueLocalTime": "3:00 p.m. UTC−4",
    "officialMatchId": 104,
    "officialVenue": "MetLife Stadium, East Rutherford",
    "timeSource": "FIFA/Wikipedia schedule, all times local"
  }
};

function withKickoffInfo(match) {
  return { ...match, ...(kickoffInfoByMatchId[match.id] || {}) };
}

function teamByGroupPos(group, pos) {
  return Object.entries(teams).find(([, team]) => team.group === group && team.pos === pos)?.[0];
}

function hashText(text) {
  return [...text].reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 9973, 17);
}

function logistic(x) {
  return 1 / (1 + Math.exp(-x / 11));
}

function modelVote(model, aCode, bCode, round) {
  const a = teams[aCode];
  const b = teams[bCode];
  const homeBoost = ["MEX", "CAN", "USA"].includes(aCode) ? 1.8 : ["MEX", "CAN", "USA"].includes(bCode) ? -1.8 : 0;
  const knockoutBoost = round === "Group Stage" ? 0 : 1.25;
  let diff = a.power - b.power + homeBoost;
  let reason = "内置 power 评分 + 东道主地区加成";

  if (model === "FormNet") {
    diff = (a.attack - b.defense) * 0.65 + (a.form - b.form) * 1.9 + (a.power - b.power) * 0.55;
    reason = "内置 attack/defense/form 评分组合";
  }
  if (model === "TacticalLens") {
    diff = (a.defense - b.defense) * 0.8 + (a.power - b.power) * 0.62 + knockoutBoost * (a.confed === "UEFA" || a.confed === "CONMEBOL" ? 1 : 0) - knockoutBoost * (b.confed === "UEFA" || b.confed === "CONMEBOL" ? 1 : 0);
    reason = "内置 defense/power 评分 + 淘汰赛稳定性权重";
  }
  if (model === "OracleSynth") {
    const noise = ((hashText(`${aCode}-${bCode}-${round}`) % 15) - 7) * 0.65;
    diff = (a.power - b.power) * 0.72 + (a.form - b.form) + noise;
    reason = "内置强度评分 + 固定冷门扰动";
  }

  const confidence = Math.round((logistic(Math.abs(diff)) * 52 + 38));
  return {
    model,
    pick: diff >= 0 ? aCode : bCode,
    confidence: Math.min(92, Math.max(51, confidence)),
    reason
  };
}

function predict(aCode, bCode, round) {
  const votes = modelNames.map((model) => modelVote(model, aCode, bCode, round));
  const tallies = votes.reduce((acc, vote) => {
    acc[vote.pick] = (acc[vote.pick] || 0) + vote.confidence;
    return acc;
  }, {});
  const rawDiff = (tallies[aCode] || 0) - (tallies[bCode] || 0);
  const a = teams[aCode];
  const b = teams[bCode];
  const allowDraw = round === "Group Stage";
  const drawZone = allowDraw && Math.abs(rawDiff) < 28;
  const winner = drawZone ? "DRAW" : rawDiff >= 0 ? aCode : bCode;
  const confidence = drawZone ? 52 : Math.min(94, Math.round(58 + Math.abs(rawDiff) / 8));
  const goalBase = round === "Group Stage" ? 1 : 1.2;
  let aGoals = Math.max(0, Math.round(goalBase + (a.attack - b.defense) / 18 + ((hashText(aCode + bCode + round) % 3) - 1) * 0.35));
  let bGoals = Math.max(0, Math.round(goalBase + (b.attack - a.defense) / 18 + ((hashText(bCode + aCode + round) % 3) - 1) * 0.35));

  if (winner === "DRAW") {
    const drawGoals = Math.max(0, Math.min(2, Math.round((aGoals + bGoals) / 2)));
    aGoals = drawGoals;
    bGoals = drawGoals;
  } else if (winner === aCode && aGoals <= bGoals) {
    aGoals = bGoals + 1;
  } else if (winner === bCode && bGoals <= aGoals) {
    bGoals = aGoals + 1;
  }

  return {
    aCode,
    bCode,
    winner,
    score: `${aGoals}-${bGoals}`,
    aGoals,
    bGoals,
    confidence,
    votes
  };
}

function buildGroupMatches() {
  const matches = [];
  let id = 1;
  groupOrder.forEach((group) => {
    pairPattern.forEach(([left, right], idx) => {
      const aCode = teamByGroupPos(group, left);
      const bCode = teamByGroupPos(group, right);
      matches.push(withKickoffInfo({
        id: id++,
        round: "Group Stage",
        group,
        date: `${groupDates[group][idx]}, 2026`,
        venue: cityRoute[group],
        aCode,
        bCode,
        slot: `Group ${group}`
      }));
    });
  });
  return matches;
}

function rankSlot(group, rank) {
  const rankName = rank === 1 ? "winner" : rank === 2 ? "runner-up" : "third place";
  return { type: "groupRank", group, rank, label: `Group ${group} ${rankName}` };
}

function bestThirdSlot(groups) {
  return { type: "bestThird", groups, label: `Best 3rd place (${groups.join("/")})` };
}

function winnerSlot(matchId) {
  return { type: "winner", matchId, label: `Winner Match ${matchId}` };
}

function loserSlot(matchId) {
  return { type: "loser", matchId, label: `Loser Match ${matchId}` };
}

function knockoutMatch(id, round, date, venue, leftSlot, rightSlot) {
  return { id, round, date, venue, aSlot: leftSlot, bSlot: rightSlot, slot: round };
}

function buildKnockoutMatches() {
  return [
    knockoutMatch(73, "Round of 32", "Jun 28, 2026", "Los Angeles / Inglewood", rankSlot("A", 2), rankSlot("B", 2)),
    knockoutMatch(74, "Round of 32", "Jun 29, 2026", "Boston / Foxborough", rankSlot("E", 1), bestThirdSlot(["A", "B", "C", "D", "F"])),
    knockoutMatch(75, "Round of 32", "Jun 29, 2026", "Monterrey / Guadalupe", rankSlot("F", 1), rankSlot("C", 2)),
    knockoutMatch(76, "Round of 32", "Jun 29, 2026", "Houston", rankSlot("C", 1), rankSlot("F", 2)),
    knockoutMatch(77, "Round of 32", "Jun 30, 2026", "New York-New Jersey", rankSlot("I", 1), bestThirdSlot(["C", "D", "F", "G", "H"])),
    knockoutMatch(78, "Round of 32", "Jun 30, 2026", "Dallas / Arlington", rankSlot("E", 2), rankSlot("I", 2)),
    knockoutMatch(79, "Round of 32", "Jun 30, 2026", "Mexico City", rankSlot("A", 1), bestThirdSlot(["C", "E", "F", "H", "I"])),
    knockoutMatch(80, "Round of 32", "Jul 1, 2026", "Atlanta", rankSlot("L", 1), bestThirdSlot(["E", "H", "I", "J", "K"])),
    knockoutMatch(81, "Round of 32", "Jul 1, 2026", "San Francisco Bay Area", rankSlot("D", 1), bestThirdSlot(["B", "E", "F", "I", "J"])),
    knockoutMatch(82, "Round of 32", "Jul 1, 2026", "Seattle", rankSlot("G", 1), bestThirdSlot(["A", "E", "H", "I", "J"])),
    knockoutMatch(83, "Round of 32", "Jul 2, 2026", "Toronto", rankSlot("K", 2), rankSlot("L", 2)),
    knockoutMatch(84, "Round of 32", "Jul 2, 2026", "Los Angeles / Inglewood", rankSlot("H", 1), rankSlot("J", 2)),
    knockoutMatch(85, "Round of 32", "Jul 2, 2026", "Vancouver", rankSlot("B", 1), bestThirdSlot(["E", "F", "G", "I", "J"])),
    knockoutMatch(86, "Round of 32", "Jul 3, 2026", "Miami", rankSlot("J", 1), rankSlot("H", 2)),
    knockoutMatch(87, "Round of 32", "Jul 3, 2026", "Kansas City", rankSlot("K", 1), bestThirdSlot(["D", "E", "I", "J", "L"])),
    knockoutMatch(88, "Round of 32", "Jul 3, 2026", "Dallas / Arlington", rankSlot("D", 2), rankSlot("G", 2)),
    knockoutMatch(89, "Round of 16", "Jul 4, 2026", "Philadelphia", winnerSlot(74), winnerSlot(77)),
    knockoutMatch(90, "Round of 16", "Jul 4, 2026", "Houston", winnerSlot(73), winnerSlot(75)),
    knockoutMatch(91, "Round of 16", "Jul 5, 2026", "New York-New Jersey", winnerSlot(76), winnerSlot(78)),
    knockoutMatch(92, "Round of 16", "Jul 5, 2026", "Mexico City", winnerSlot(79), winnerSlot(80)),
    knockoutMatch(93, "Round of 16", "Jul 6, 2026", "Dallas / Arlington", winnerSlot(83), winnerSlot(84)),
    knockoutMatch(94, "Round of 16", "Jul 6, 2026", "Seattle", winnerSlot(81), winnerSlot(82)),
    knockoutMatch(95, "Round of 16", "Jul 7, 2026", "Atlanta", winnerSlot(86), winnerSlot(88)),
    knockoutMatch(96, "Round of 16", "Jul 7, 2026", "Vancouver", winnerSlot(85), winnerSlot(87)),
    knockoutMatch(97, "Quarterfinal", "Jul 9, 2026", "Boston / Foxborough", winnerSlot(89), winnerSlot(90)),
    knockoutMatch(98, "Quarterfinal", "Jul 10, 2026", "Los Angeles / Inglewood", winnerSlot(93), winnerSlot(94)),
    knockoutMatch(99, "Quarterfinal", "Jul 11, 2026", "Miami", winnerSlot(91), winnerSlot(92)),
    knockoutMatch(100, "Quarterfinal", "Jul 11, 2026", "Kansas City", winnerSlot(95), winnerSlot(96)),
    knockoutMatch(101, "Semifinal", "Jul 14, 2026", "Dallas / Arlington", winnerSlot(97), winnerSlot(98)),
    knockoutMatch(102, "Semifinal", "Jul 15, 2026", "Atlanta", winnerSlot(99), winnerSlot(100)),
    knockoutMatch(103, "Third Place", "Jul 18, 2026", "Miami", loserSlot(101), loserSlot(102)),
    knockoutMatch(104, "Final", "Jul 19, 2026", "New York-New Jersey", winnerSlot(101), winnerSlot(102))
  ];
}

function standingsFrom(matches) {
  const table = {};
  Object.keys(teams).forEach((code) => {
    table[code] = { code, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
  });

  matches.forEach((match) => {
    const pred = match.prediction;
    const a = table[match.aCode];
    const b = table[match.bCode];
    a.p += 1;
    b.p += 1;
    a.gf += pred.aGoals;
    a.ga += pred.bGoals;
    b.gf += pred.bGoals;
    b.ga += pred.aGoals;
    if (pred.winner === "DRAW") {
      a.d += 1;
      b.d += 1;
      a.pts += 1;
      b.pts += 1;
    } else if (pred.winner === match.aCode) {
      a.w += 1;
      b.l += 1;
      a.pts += 3;
    } else {
      b.w += 1;
      a.l += 1;
      b.pts += 3;
    }
    a.gd = a.gf - a.ga;
    b.gd = b.gf - b.ga;
  });

  const byGroup = {};
  groupOrder.forEach((group) => {
    byGroup[group] = Object.values(table)
      .filter((row) => teams[row.code].group === group)
      .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || teams[b.code].power - teams[a.code].power);
  });
  return byGroup;
}

function completedGroupMatches(group) {
  return tournament.matches.filter((match) => match.round === "Group Stage" && match.group === group && officialResult(match)?.status === "final");
}

function actualStandingsFromResults() {
  const table = {};
  Object.keys(teams).forEach((code) => {
    table[code] = { code, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
  });

  tournament.matches
    .filter((match) => match.round === "Group Stage")
    .forEach((match) => {
      const result = officialResult(match);
      if (result?.status !== "final") return;
      const a = table[match.aCode];
      const b = table[match.bCode];
      const aGoals = Number(result.homeScore);
      const bGoals = Number(result.awayScore);
      a.p += 1;
      b.p += 1;
      a.gf += aGoals;
      a.ga += bGoals;
      b.gf += bGoals;
      b.ga += aGoals;
      if (aGoals === bGoals) {
        a.d += 1;
        b.d += 1;
        a.pts += 1;
        b.pts += 1;
      } else if (aGoals > bGoals) {
        a.w += 1;
        b.l += 1;
        a.pts += 3;
      } else {
        b.w += 1;
        a.l += 1;
        b.pts += 3;
      }
      a.gd = a.gf - a.ga;
      b.gd = b.gf - b.ga;
    });

  const byGroup = {};
  groupOrder.forEach((group) => {
    byGroup[group] = Object.values(table)
      .filter((row) => teams[row.code].group === group)
      .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || teams[b.code].power - teams[a.code].power);
  });
  return byGroup;
}

function groupIsComplete(group) {
  return completedGroupMatches(group).length === 6;
}

function allGroupsComplete() {
  return groupOrder.every((group) => groupIsComplete(group));
}

function bestThirdTeams(standings) {
  if (!allGroupsComplete()) return [];
  return groupOrder
    .map((group) => standings[group]?.[2])
    .filter(Boolean)
    .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || teams[b.code].power - teams[a.code].power)
    .slice(0, 8);
}

function thirdPlaceAssignments(standings) {
  const pool = bestThirdTeams(standings);
  const used = new Set();
  const assignments = {};
  tournament.matches
    .filter((match) => match.round === "Round of 32")
    .forEach((match) => {
      [match.aSlot, match.bSlot].filter((slot) => slot?.type === "bestThird").forEach((slot) => {
        const key = slot.label;
        if (assignments[key]) return;
        const chosen = pool.find((row) => slot.groups.includes(teams[row.code].group) && !used.has(row.code)) || pool.find((row) => !used.has(row.code));
        if (chosen) {
          assignments[key] = chosen.code;
          used.add(chosen.code);
        }
      });
    });
  return assignments;
}

function knockoutWinnerCode(match, wantLoser = false) {
  const result = officialResult(match);
  if (result?.status !== "final") return null;
  if (Number(result.homeScore) === Number(result.awayScore)) {
    return wantLoser ? result.loserCode || null : result.winnerCode || null;
  }
  const winner = Number(result.homeScore) > Number(result.awayScore) ? resolvedTeamCode(match, "a") : resolvedTeamCode(match, "b");
  const loser = Number(result.homeScore) > Number(result.awayScore) ? resolvedTeamCode(match, "b") : resolvedTeamCode(match, "a");
  return wantLoser ? loser : winner;
}

function resolveSlot(slot) {
  if (!slot) return null;
  const standings = actualStandingsFromResults();
  if (slot.type === "groupRank") {
    if (!groupIsComplete(slot.group)) return null;
    return standings[slot.group]?.[slot.rank - 1]?.code || null;
  }
  if (slot.type === "bestThird") {
    return thirdPlaceAssignments(standings)[slot.label] || null;
  }
  if (slot.type === "winner" || slot.type === "loser") {
    const source = tournament.matches.find((match) => match.id === slot.matchId);
    return source ? knockoutWinnerCode(source, slot.type === "loser") : null;
  }
  return null;
}

function resolvedTeamCode(match, side) {
  if (side === "a") return match.aCode || resolveSlot(match.aSlot);
  return match.bCode || resolveSlot(match.bSlot);
}

function resolvedTeams(match) {
  return {
    aCode: resolvedTeamCode(match, "a"),
    bCode: resolvedTeamCode(match, "b")
  };
}

function slotLabel(match, side) {
  return side === "a" ? match.aSlot?.label || teams[match.aCode]?.name || "TBD" : match.bSlot?.label || teams[match.bCode]?.name || "TBD";
}

function buildTournament() {
  const groupMatches = buildGroupMatches().map((match) => ({
    ...match,
    prediction: predict(match.aCode, match.bCode, "Group Stage")
  }));
  const knockoutMatches = buildKnockoutMatches();
  const standings = standingsFrom(groupMatches);

  return { matches: [...groupMatches, ...knockoutMatches], standings, bestThird: [] };
}

const tournament = buildTournament();
let activeMatchId = 1;
let automationState = {
  predictions: {},
  results: {},
  dailyAnalysis: {},
  liveCorrections: {},
  mistakeMemory: null,
  marketTrace: {},
  accuracy: { accuracy: 0, completed: 0, graded: 0, correct: 0 },
  stageAccuracy: {
    group: { accuracy: 0, completed: 0, graded: 0, correct: 0 },
    knockout: { accuracy: 0, completed: 0, graded: 0, correct: 0 },
    rounds: {},
    upsets: { called: 0, hit: 0 },
    proofVerified: 0
  }
};
const storedPredictionKey = "paul.manualPredictions.v2";
const pollVoterKey = "paul.pollVoter.v1";
const pollChoiceKey = "paul.pollChoices.v1";
const pollState = {};
let publicProofEntries = [];
let proofLedgerExpanded = false;
const proofLedgerLimit = 12;

function loadStoredPredictions() {
  try {
    return JSON.parse(localStorage.getItem(storedPredictionKey) || "{}");
  } catch {
    return {};
  }
}

function saveStoredPrediction(matchId, record) {
  try {
    const predictions = loadStoredPredictions();
    predictions[matchId] = record;
    localStorage.setItem(storedPredictionKey, JSON.stringify(predictions));
  } catch {
    // Local storage is optional; the current page state still updates.
  }
}

function nextPredictionFromMatches(predictions, leadHours = 24, now = new Date()) {
  return tournament.matches
    .map((match) => {
      if (predictions[match.id]) return null;
      if (officialResult(match)?.status === "final") return null;
      const resolved = resolvedTeams(match);
      if (!resolved.aCode || !resolved.bCode) return null;
      const matchTime = matchKickoffTime(match);
      if (Number.isNaN(matchTime.getTime())) return null;
      return {
        id: match.id,
        label: `${teams[resolved.aCode].name} vs ${teams[resolved.bCode].name}`,
        dueAt: new Date(matchTime.getTime() - leadHours * 60 * 60 * 1000).toISOString()
      };
    })
    .filter(Boolean)
    .filter((item) => new Date(item.dueAt) >= now)
    .sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt))[0] || null;
}

function matchKickoffTime(match) {
  return match?.kickoffAt ? new Date(match.kickoffAt) : new Date(`${match.date} 20:00:00 GMT+0000`);
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function syncPendingLabel(id) {
  const element = document.getElementById(id);
  if (!element) return;
  const pendingValues = new Set([
    "Pending",
    "待定",
    "未定",
    "Pendiente",
    "En attente",
    "Ausstehend",
    "Pendente",
    "قيد الانتظار",
    "대기",
    "In attesa",
    "In afwachting",
    "Bekliyor"
  ]);
  if (pendingValues.has(element.textContent.trim())) {
    element.textContent = tr("pending");
  }
}

function syncLanguageSensitiveStats() {
  ["marketBaselineStat", "ratingBaselineStat", "paulEdgeStat", "calibrationStat", "autoNext"].forEach(syncPendingLabel);
}

function formatAccuracyBucket(bucket, { compact = false } = {}) {
  if (!bucket || bucket.status === "pending" || (!bucket.completed && !bucket.graded)) return tr("pending");
  if (!bucket.graded) return compact ? tr("pending") : `0/${bucket.completed} · ${tr("pending")}`;
  return compact
    ? `${bucket.accuracy}%`
    : `${bucket.correct}/${bucket.graded} · ${bucket.accuracy}%`;
}

function formatDisplayDateTime(value, options = {}) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value || "");
  return new Intl.DateTimeFormat(currentLocale(), {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...options
  }).format(date);
}

function formatMatchDate(match) {
  const kickoff = matchKickoffTime(match);
  if (Number.isNaN(kickoff.getTime())) return match?.date || "";
  return new Intl.DateTimeFormat(currentLocale(), {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(kickoff);
}

function viewerTimeZoneLabel() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "local";
  } catch {
    return "local";
  }
}

function formatMatchDateWithZone(match) {
  const kickoff = matchKickoffTime(match);
  if (Number.isNaN(kickoff.getTime())) return match?.date || "";
  const viewer = formatDisplayDateTime(kickoff);
  const local = match?.venueLocalTime ? `${tr("venueLocalTime")}: ${match.venueLocalTime}` : "";
  return `${tr("yourTime")}: ${viewer} (${viewerTimeZoneLabel()})${local ? ` - ${local}` : ""}`;
}

function setupLanguageSelect() {
  const select = document.getElementById("languageSelect");
  if (!select) return;
  select.innerHTML = languageOptions
    .map(([code, label]) => `<option value="${code}">${label}</option>`)
    .join("");
  select.value = languageCopy[currentLanguage] ? currentLanguage : "en";
  currentLanguage = select.value;
  select.addEventListener("change", () => {
    currentLanguage = select.value;
    try {
      localStorage.setItem(languageKey, currentLanguage);
    } catch {
      // Language persistence is optional.
    }
    applyLanguage();
    syncLanguageSensitiveStats();
    refreshFilterOptions();
    renderGroups();
    renderMatchList();
    renderPublicTrace();
    renderHitList();
    renderPK();
    loadAutomationStatus();
  });
}

function applyLanguage() {
  document.documentElement.lang = currentLocale().split("-")[0];
  document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = tr(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.setAttribute("placeholder", tr(element.dataset.i18nPlaceholder));
  });
  const proofRoundFilter = document.getElementById("proofRoundFilter");
  if (proofRoundFilter) {
    const current = proofRoundFilter.value || "All";
    proofRoundFilter.innerHTML = `
      <option value="All">${tr("allRounds")}</option>
      <option value="Group Stage">${tr("groupStage")}</option>
      <option value="Knockout">${tr("knockout")}</option>
    `;
    proofRoundFilter.value = current;
  }
  syncLanguageSensitiveStats();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function matchMode(match) {
  return match.round === "Group Stage" ? tr("groupStageRecord") : tr("knockoutOracleMode");
}

function modeClass(match) {
  return match.round === "Group Stage" ? "mode-pill--group" : "mode-pill--knockout";
}

function compactDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value) => String(value).padStart(2, "0");
  if (days > 0) return `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function matchCountdown(match, now = new Date()) {
  const kickoff = matchKickoffTime(match);
  if (Number.isNaN(kickoff.getTime())) return tr("kickoffTba");
  const diff = kickoff.getTime() - now.getTime();
  if (diff > 0) return `${tr("startsIn")} ${compactDuration(diff)}`;
  if (diff > -130 * 60000) return tr("liveNow");
  return tr("fullTimeWindowPassed");
}

function countdownMarkup(match) {
  return `<span data-countdown-match="${match.id}">${matchCountdown(match)}</span>`;
}

function refreshCountdowns() {
  const now = new Date();
  document.querySelectorAll("[data-countdown-match]").forEach((element) => {
    const match = tournament.matches.find((item) => String(item.id) === String(element.dataset.countdownMatch));
    if (match) element.textContent = matchCountdown(match, now);
  });
}

const flagIds = {
  MEX: "mx",
  RSA: "za",
  KOR: "kr",
  CZE: "cz",
  CAN: "ca",
  BIH: "ba",
  QAT: "qa",
  SUI: "ch",
  BRA: "br",
  MAR: "ma",
  HAI: "ht",
  SCO: "gb-sct",
  USA: "us",
  PAR: "py",
  AUS: "au",
  TUR: "tr",
  GER: "de",
  CUW: "cw",
  CIV: "ci",
  ECU: "ec",
  NED: "nl",
  JPN: "jp",
  SWE: "se",
  TUN: "tn",
  BEL: "be",
  EGY: "eg",
  IRN: "ir",
  NZL: "nz",
  ESP: "es",
  CPV: "cv",
  KSA: "sa",
  URU: "uy",
  FRA: "fr",
  SEN: "sn",
  IRQ: "iq",
  NOR: "no",
  ARG: "ar",
  ALG: "dz",
  AUT: "at",
  JOR: "jo",
  POR: "pt",
  COD: "cd",
  UZB: "uz",
  COL: "co",
  ENG: "gb-eng",
  CRO: "hr",
  GHA: "gh",
  PAN: "pa"
};

const teamLocales = {
  MEX: { language: "Español", phrase: "Predicción de PAUL para México" },
  RSA: { language: "isiZulu / English / Afrikaans", phrase: "Isibikezelo sika PAUL seNingizimu Afrika" },
  KOR: { language: "한국어", phrase: "대한민국을 위한 PAUL 예측" },
  CZE: { language: "Čeština", phrase: "PAULova předpověď pro Česko" },
  CAN: { language: "English / Français", phrase: "PAUL prediction for Canada / Prédiction de PAUL pour le Canada" },
  BIH: { language: "Bosanski / Hrvatski / Srpski", phrase: "PAUL predviđa za Bosnu i Hercegovinu" },
  QAT: { language: "العربية", phrase: "توقع PAUL لقطر" },
  SUI: { language: "Deutsch / Français / Italiano / Rumantsch", phrase: "PAUL-Prognose für die Schweiz" },
  BRA: { language: "Português", phrase: "Previsão de PAUL para o Brasil" },
  MAR: { language: "العربية / ⵜⴰⵎⴰⵣⵉⵖⵜ", phrase: "توقع PAUL للمغرب" },
  HAI: { language: "Kreyòl ayisyen / Français", phrase: "Prediksyon PAUL pou Ayiti" },
  SCO: { language: "English / Scots / Gàidhlig", phrase: "PAUL prediction for Scotland" },
  USA: { language: "English", phrase: "PAUL prediction for the United States" },
  PAR: { language: "Español / Guaraní", phrase: "Predicción de PAUL para Paraguay" },
  AUS: { language: "English", phrase: "PAUL prediction for Australia" },
  TUR: { language: "Türkçe", phrase: "PAUL'un Türkiye tahmini" },
  GER: { language: "Deutsch", phrase: "PAUL-Prognose für Deutschland" },
  CUW: { language: "Papiamentu / Nederlands / English", phrase: "Pronostiko di PAUL pa Kòrsou" },
  CIV: { language: "Français", phrase: "Pronostic de PAUL pour la Côte d'Ivoire" },
  ECU: { language: "Español / Kichwa / Shuar", phrase: "Predicción de PAUL para Ecuador" },
  NED: { language: "Nederlands", phrase: "PAULs voorspelling voor Nederland" },
  JPN: { language: "日本語", phrase: "日本のためのPAUL予測" },
  SWE: { language: "Svenska", phrase: "PAULs prognos för Sverige" },
  TUN: { language: "العربية", phrase: "توقع PAUL لتونس" },
  BEL: { language: "Nederlands / Français / Deutsch", phrase: "PAULs voorspelling voor België" },
  EGY: { language: "العربية", phrase: "توقع PAUL لمصر" },
  IRN: { language: "فارسی", phrase: "پیش‌بینی PAUL برای ایران" },
  NZL: { language: "English / Māori", phrase: "PAUL prediction for Aotearoa New Zealand" },
  ESP: { language: "Español", phrase: "Predicción de PAUL para España" },
  CPV: { language: "Português / Kriolu", phrase: "Previsão de PAUL para Cabo Verde" },
  KSA: { language: "العربية", phrase: "توقع PAUL للسعودية" },
  URU: { language: "Español", phrase: "Predicción de PAUL para Uruguay" },
  FRA: { language: "Français", phrase: "Pronostic de PAUL pour la France" },
  SEN: { language: "Français / Wolof", phrase: "Pronostic de PAUL pour le Sénégal" },
  IRQ: { language: "العربية / کوردی", phrase: "توقع PAUL للعراق" },
  NOR: { language: "Norsk", phrase: "PAULs spådom for Norge" },
  ARG: { language: "Español", phrase: "Predicción de PAUL para Argentina" },
  ALG: { language: "العربية / Tamazight", phrase: "توقع PAUL للجزائر" },
  AUT: { language: "Deutsch", phrase: "PAUL-Prognose für Österreich" },
  JOR: { language: "العربية", phrase: "توقع PAUL للأردن" },
  POR: { language: "Português", phrase: "Previsão de PAUL para Portugal" },
  COD: { language: "Français / Lingála / Kiswahili", phrase: "Pronostic de PAUL pour la RD Congo" },
  UZB: { language: "O‘zbekcha", phrase: "PAULning O‘zbekiston uchun bashorati" },
  COL: { language: "Español", phrase: "Predicción de PAUL para Colombia" },
  ENG: { language: "English", phrase: "PAUL prediction for England" },
  CRO: { language: "Hrvatski", phrase: "PAULova prognoza za Hrvatsku" },
  GHA: { language: "English / Akan / Ewe / Ga", phrase: "PAUL prediction for Ghana" },
  PAN: { language: "Español", phrase: "Predicción de PAUL para Panamá" }
};

function flagImage(code, className = "flag-frame") {
  const team = teams[code];
  const flagId = flagIds[code];
  const alt = `${team.name} flag`;
  if (!flagId) return `<span class="${className} flag-frame--emoji" aria-label="${alt}">${team.flag}</span>`;
  return `
    <span class="${className}" aria-label="${alt}">
      <img src="https://flagcdn.com/w160/${flagId}.png" srcset="https://flagcdn.com/w320/${flagId}.png 2x" alt="${alt}" loading="lazy" />
    </span>
  `;
}

function teamLocaleMarkup(code) {
  const locale = teamLocales[code];
  if (!locale) return "";
  return `
    <p class="local-language">
      <strong>${tr("localLanguage")}:</strong>
      <span>${locale.language}</span>
      <em>${locale.phrase}</em>
    </p>
  `;
}

function teamMarkup(code) {
  const team = teams[code];
  return `
    <div class="team-card-heading">
      ${flagImage(code)}
      <div>
        <div class="team-name">${team.name}</div>
        <div class="team-code">${code} · ${tr("groupLabel")} ${team.group}</div>
      </div>
    </div>
    <p class="language"><strong>${tr("primaryLanguages")}:</strong><br>${team.languages}</p>
  `;
}

function slotMarkup(label) {
  return `
    <div class="team-card-heading">
      <span class="flag-frame flag-frame--slot">TBD</span>
      <div>
        <div class="team-name">${label}</div>
        <div class="team-code">${tr("pending")}</div>
      </div>
    </div>
    <p class="language"><strong>${tr("bracketStatus")}:</strong><br>${tr("slotFilled")}</p>
  `;
}

function officialPrediction(match) {
  return automationState.predictions?.[match.id] || null;
}

function proofPredictionRecord(match) {
  const entry = proofEntryForMatch(match.id);
  const prediction = entry?.payload?.prediction;
  if (!prediction) return null;
  return {
    matchId: match.id,
    generatedAt: entry.lockedAt || entry.payload?.lockedAt || null,
    proof: { hash: entry.hash || null },
    analysis: prediction,
    evidence: entry.payload?.evidence || null
  };
}

function officialPredictionRecord(match) {
  return officialPrediction(match) || proofPredictionRecord(match);
}

function officialResult(match) {
  return automationState.results?.[match.id] || null;
}

function resultWinner(result) {
  if (!result) return null;
  if (result.winnerCode) return result.winnerCode;
  if (Number(result.homeScore) === Number(result.awayScore)) return "DRAW";
  return Number(result.homeScore) > Number(result.awayScore) ? result.aCode : result.bCode;
}

function officialPickCode(record) {
  if (!record?.analysis) return null;
  return record.analysis.winnerCode || record.analysis.winner || null;
}

function officialPredictedScore(record) {
  return String(record?.analysis?.predictedScore || record?.analysis?.score || "").replace(/\s/g, "");
}

function officialPredictedScoreLabel(record) {
  return String(record?.analysis?.predictedScore || record?.analysis?.score || "").trim();
}

function resultScoreString(result) {
  if (!result || result.homeScore === undefined || result.awayScore === undefined) return "";
  return `${result.homeScore}-${result.awayScore}`.replace(/\s/g, "");
}

function predictionOutcomeText(record, result) {
  if (!record || result?.status !== "final") return "";
  const winnerHit = String(officialPickCode(record) || "").toUpperCase() === String(resultWinner(result) || "").toUpperCase();
  if (!winnerHit) return currentLanguage === "zh" ? "胜负未中" : "Win call missed";
  const scoreHit = officialPredictedScore(record) && officialPredictedScore(record) === resultScoreString(result);
  return currentLanguage === "zh"
    ? `胜负命中 · ${scoreHit ? "比分全中" : "比分未中"}`
    : `Win call hit · score ${scoreHit ? "exact" : "missed"}`;
}

function pollVoterId() {
  try {
    let id = localStorage.getItem(pollVoterKey);
    if (!id) {
      id = `v_${crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random().toString(16).slice(2)}`}`;
      localStorage.setItem(pollVoterKey, id);
    }
    return id;
  } catch {
    return `session_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }
}

function storedPollChoices() {
  try {
    return JSON.parse(localStorage.getItem(pollChoiceKey) || "{}");
  } catch {
    return {};
  }
}

function setStoredPollChoice(matchId, side) {
  try {
    const choices = storedPollChoices();
    choices[matchId] = side;
    localStorage.setItem(pollChoiceKey, JSON.stringify(choices));
  } catch {
    // Poll still works server-side without local display memory.
  }
}

function pollLabel(match, side) {
  const resolved = resolvedTeams(match);
  if (side === "home") return resolved.aCode ? teams[resolved.aCode].name : slotLabel(match, "a");
  if (side === "away") return resolved.bCode ? teams[resolved.bCode].name : slotLabel(match, "b");
  return tr("draw") || "Draw";
}

function pollVisibleTotal(poll, sides) {
  return sides.reduce((sum, side) => sum + Number(poll?.votes?.[side] || 0), 0);
}

function pollPercent(poll, side, sides = ["home", "draw", "away"]) {
  const total = pollVisibleTotal(poll, sides);
  if (!total) return 0;
  return Math.round(((poll.votes?.[side] || 0) / total) * 100);
}

function renderPollPanel(match, poll = pollState[match.id] || { votes: {}, total: 0 }) {
  const panel = document.getElementById("pollPanel");
  if (!panel) return;
  const resolved = resolvedTeams(match);
  if (!resolved.aCode || !resolved.bCode) {
    panel.innerHTML = `
      <div class="poll-head">
        <span>${tr("fanVote")}</span>
        <strong>${tr("bracketSlotPending")}</strong>
      </div>
    `;
    return;
  }
  const choices = storedPollChoices();
  const selected = choices[match.id] || "";
  const pollSides = match.round === "Group Stage" ? ["home", "draw", "away"] : ["home", "away"];
  const visibleTotal = pollVisibleTotal(poll, pollSides);
  panel.innerHTML = `
    <div class="poll-head">
      <span>${tr("fanVote")}</span>
      <strong>${visibleTotal} ${tr("votes")}</strong>
    </div>
    <div class="poll-options">
      ${pollSides.map((side) => {
        const percent = pollPercent(poll, side, pollSides);
        return `
          <button class="poll-option ${selected === side ? "is-selected" : ""}" type="button" data-side="${side}">
            <span class="poll-option__top">
              <strong>${pollLabel(match, side)}</strong>
              <em>${percent}%</em>
            </span>
            <span class="poll-bar"><i style="width: ${percent}%"></i></span>
          </button>
        `;
      }).join("")}
    </div>
  `;
  panel.querySelectorAll(".poll-option").forEach((button) => {
    button.addEventListener("click", () => submitPollVote(match.id, button.dataset.side));
  });
}

function dailyReadFor(match) {
  return automationState.dailyAnalysis?.[match.id] || automationState.dailyAnalysis?.[String(match.id)] || null;
}

function liveCorrectionFor(match) {
  return automationState.liveCorrections?.[match.id] || automationState.liveCorrections?.[String(match.id)] || null;
}

function marketTraceFor(match) {
  return automationState.marketTrace?.[match.id] || automationState.marketTrace?.[String(match.id)] || null;
}

function dailyReadPercent(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return tr("pending");
  return `${Math.max(0, Math.min(100, Math.round(number)))}%`;
}

function percentText(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return tr("pending");
  const percent = Math.abs(number) > 0 && Math.abs(number) <= 1 ? number * 100 : number;
  return `${Math.max(0, Math.min(100, Math.round(percent)))}%`;
}

function listText(items = []) {
  return Array.isArray(items) ? items.filter(Boolean).join(" / ") : "";
}

function scoreScenarioText(items = [], limit = 3) {
  if (!Array.isArray(items) || !items.length) return "";
  return items
    .slice(0, limit)
    .map((item) => `${item.score} ${percentText(item.probability)}`)
    .join(" / ");
}

function normalizeScoreLabel(score) {
  return String(score || "").replace(/\s/g, "");
}

function scoreScenariosFor(match, official = officialPredictionRecord(match), daily = dailyReadFor(match)) {
  const officialScenarios = official?.analysis?.scoreScenarios || official?.proof?.payload?.prediction?.scoreScenarios;
  if (Array.isArray(officialScenarios) && officialScenarios.length) return officialScenarios.slice(0, 5);
  const dailyScenarios = daily?.lab?.scoreScenarios;
  return Array.isArray(dailyScenarios) ? dailyScenarios.slice(0, 5) : [];
}

function scoreScenarioHit(scenarios = [], result) {
  const actual = result?.score || resultScoreString(result);
  const normalizedActual = normalizeScoreLabel(actual);
  if (!normalizedActual || !Array.isArray(scenarios) || !scenarios.length) {
    return { top3: false, top5: false, label: "" };
  }
  const scores = scenarios.map((item) => normalizeScoreLabel(item?.score));
  const top3 = scores.slice(0, 3).includes(normalizedActual);
  const top5 = scores.slice(0, 5).includes(normalizedActual);
  const label = top3 ? "Top3 score hit" : top5 ? "Top5 score hit" : "Top5 score missed";
  return { top3, top5, label };
}

function scoreScenarioMarkup(scenarios = [], result = null) {
  if (!Array.isArray(scenarios) || !scenarios.length) return "";
  const hit = scoreScenarioHit(scenarios, result);
  return `
    <div class="daily-read__meta">
      <strong>Score paths</strong>
      <p>Top 3: ${escapeHtml(scoreScenarioText(scenarios, 3))}</p>
      <p>Top 5: ${escapeHtml(scoreScenarioText(scenarios, 5))}</p>
      ${hit.label ? `<p>${escapeHtml(hit.label)}</p>` : ""}
    </div>
  `;
}

function probabilityCompareText(layer) {
  if (!layer?.before || !layer?.after) return "";
  const before = layer.before;
  const after = layer.after;
  return `H ${percentText(before.home)} -> ${percentText(after.home)} / D ${percentText(before.draw)} -> ${percentText(after.draw)} / A ${percentText(before.away)} -> ${percentText(after.away)}`;
}

function calibrationNotesText(layer) {
  if (!Array.isArray(layer?.notes) || !layer.notes.length) return "";
  return layer.notes.join(" / ");
}

function calibrationBlockMarkup(layer, { title = "KV calibration", compact = false } = {}) {
  if (!layer?.applied) {
    return `
      <div class="daily-read__meta daily-read__meta--calibration">
        <strong>${escapeHtml(title)}</strong>
        <p>Not applied yet.</p>
        <p>No usable mistake-memory sample was found for this matchup, or this lock/read was generated before the KV calibration version.</p>
      </div>
    `;
  }
  const lines = [
    `<strong>${escapeHtml(title)}</strong>`,
    `<p>Sample ${escapeHtml(String(layer.sampleSize || 0))} · ${escapeHtml(layer.version || "kv-calibration")}</p>`
  ];
  if (layer.before && layer.after) {
    lines.push(`<p>${compact ? "Prob" : "Before -> after"}: ${escapeHtml(probabilityCompareText(layer))}</p>`);
  }
  const adjustments = layer.adjustments || {};
  lines.push(`<p>Edge ${escapeHtml(String(adjustments.edgeTrustDelta ?? 0))} · Market ${escapeHtml(String(adjustments.marketShrinkDelta ?? 0))} · Draw ${escapeHtml(String(adjustments.drawRiskDelta ?? 0))} · Upset ${escapeHtml(String(adjustments.upsetSensitivityDelta ?? 0))}</p>`);
  if (Number(adjustments.scoreConfidenceDelta || 0) || Number(adjustments.goalVolatilityDelta || 0)) {
    lines.push(`<p>Score ${escapeHtml(String(adjustments.scoreConfidenceDelta ?? 0))} · Goals ${escapeHtml(String(adjustments.goalVolatilityDelta ?? 0))}</p>`);
  }
  if (calibrationNotesText(layer)) {
    lines.push(`<p>${escapeHtml(calibrationNotesText(layer))}</p>`);
  }
  return `<div class="daily-read__meta daily-read__meta--calibration">${lines.join("")}</div>`;
}

function currentKvMemoryMarkup() {
  const memory = automationState.mistakeMemory || {};
  const total = Number(memory.totalReviewed || 0);
  if (!total) return "";
  const updated = memory.updatedAt ? formatProofTime(memory.updatedAt) : tr("unknown");
  const details = currentKvCalibrationDetails({ includeUpdated: false });
  return `
    <div class="daily-read__meta daily-read__meta--calibration">
      <strong>Current KV memory</strong>
      <p>${total} post-match reviews · direction misses ${escapeHtml(String(memory.directionMisses || 0))} · score misses ${escapeHtml(String(memory.scoreMisses || 0))}</p>
      ${details}
      <p>${memory.usable ? "Available for new Daily PAUL reads and future locks." : "Stored, but not enough calibration signal yet."} Updated ${escapeHtml(updated)}.</p>
    </div>
  `;
}

function currentKvCalibrationDetails({ includeUpdated = true } = {}) {
  const memory = automationState.mistakeMemory || {};
  const total = Number(memory.totalReviewed || 0);
  if (!total) return `<p>No current KV calibration sample is available yet.</p>`;
  const updated = memory.updatedAt ? formatProofTime(memory.updatedAt) : tr("unknown");
  const profile = memory.learningProfile || {};
  const adjustment = profile.calibrationAdjustment || memory.calibrationAdjustment || {};
  const weights = profile.modelWeights || null;
  const maturity = profile.maturity || (adjustment.sampleSize ? "active" : "");
  const lines = [];
  if (maturity || profile.directionMissRate !== undefined || profile.scoreMissRate !== undefined) {
    lines.push(`<p>Learning stage: ${escapeHtml(maturity || "active")} · direction miss rate ${escapeHtml(String(profile.directionMissRate ?? "n/a"))} · score miss rate ${escapeHtml(String(profile.scoreMissRate ?? "n/a"))}</p>`);
  }
  if (weights) {
    lines.push(`<p>Adaptive weights: market ${escapeHtml(String(weights.market))} · Elo ${escapeHtml(String(weights.elo))} · score ${escapeHtml(String(weights.poisson))}</p>`);
  }
  if (adjustment.sampleSize || memory.usable) {
    lines.push(`<p>Next-read calibration: edge ${escapeHtml(String(adjustment.edgeTrustDelta ?? 0))} · market ${escapeHtml(String(adjustment.marketShrinkDelta ?? 0))} · draw ${escapeHtml(String(adjustment.drawRiskDelta ?? 0))} · upset ${escapeHtml(String(adjustment.upsetSensitivityDelta ?? 0))}</p>`);
    lines.push(`<p>Score layer: confidence ${escapeHtml(String(adjustment.scoreConfidenceDelta ?? 0))} · goals ${escapeHtml(String(adjustment.goalVolatilityDelta ?? 0))} · sample ${escapeHtml(String(adjustment.sampleSize || total))}</p>`);
  }
  if (Array.isArray(profile.currentBias) && profile.currentBias.length) {
    lines.push(`<p>Learning bias: ${escapeHtml(profile.currentBias.slice(0, 3).join(" / "))}</p>`);
  }
  if (includeUpdated) lines.push(`<p>Updated ${escapeHtml(updated)}.</p>`);
  return lines.join("") || `<p>${total} KV reviews are stored, but adaptive calibration details are still warming up.</p>`;
}

function liveCorrectionMarkup(match) {
  const correction = liveCorrectionFor(match);
  if (!correction) return "";
  const resolved = resolvedTeams(match);
  const homeName = teams[resolved.aCode]?.name || slotLabel(match, "a");
  const awayName = teams[resolved.bCode]?.name || slotLabel(match, "b");
  const live = correction.live || {};
  const official = correction.official || {};
  const officialProbability = official.probability || official.confidence || null;
  const updated = correction.generatedAt ? formatProofTime(correction.generatedAt) : tr("unknown");
  const freshness = correction.freshness?.evidenceUpdatedAt ? formatProofTime(correction.freshness.evidenceUpdatedAt) : tr("pending");
  return `
    <div class="daily-read__drift ${correction.drifted ? "is-drifted" : "is-aligned"}">
      <span>KV live correction</span>
      <strong>${tr("officialLock")}: ${escapeHtml(official.winnerName || tr("pending"))}${officialProbability ? ` ${dailyReadPercent(officialProbability)}` : ""} -> ${tr("liveEstimate")}: ${escapeHtml(live.winnerName || tr("pending"))}${live.probability ? ` ${dailyReadPercent(live.probability)}` : ""}</strong>
      <p>${tr("predictedScore")}: ${tr("officialLock")} ${escapeHtml(official.predictedScore || "N/A")} -> ${tr("liveEstimate")} ${escapeHtml(live.predictedScore || official.predictedScore || "N/A")}</p>
      ${live.probabilities ? `<p>${escapeHtml(homeName)}: ${dailyReadPercent(live.probabilities.home)} · ${tr("draw")}: ${dailyReadPercent(live.probabilities.draw)} · ${escapeHtml(awayName)}: ${dailyReadPercent(live.probabilities.away)}</p>` : ""}
      <p>${tr("driftReason")}: ${escapeHtml(correction.reason || "KV memory and latest cached evidence are adjusting the live lab estimate.")}</p>
      <p>Updated ${escapeHtml(updated)} · evidence ${escapeHtml(freshness)}. News refresh will replace this when Daily PAUL Read completes.</p>
    </div>
  `;
}

function lockVsLiveMarkup(match) {
  const read = dailyReadFor(match);
  const drift = read ? liveDriftFor(match, read) : null;
  if (drift) {
    return `
      <div class="daily-read__drift ${drift.drifted || drift.scoreChanged ? "is-drifted" : "is-aligned"}">
        <span>${drift.drifted || drift.scoreChanged ? tr("postLockDrift") : tr("liveEstimate")}</span>
        <strong>${tr("officialLock")}: ${escapeHtml(drift.officialName)}${drift.officialConfidence ? ` ${dailyReadPercent(drift.officialConfidence)}` : ""} -> ${tr("liveEstimate")}: ${escapeHtml(drift.liveName)}${drift.liveConfidence ? ` ${dailyReadPercent(drift.liveConfidence)}` : ""}</strong>
        <p>${tr("predictedScore")}: ${tr("officialLock")} ${escapeHtml(drift.officialScore || "N/A")} -> ${tr("liveEstimate")} ${escapeHtml(drift.liveScore || "N/A")}</p>
        ${drift.winnerVolatility ? `<p>Win drift: ${escapeHtml(drift.winnerVolatility.leaderName || tr("pending"))} · gap ${percentText(drift.winnerVolatility.gap)} · ${escapeHtml(drift.winnerVolatility.label || "watch")}</p>` : ""}
        ${drift.scoreScenarios?.length ? `<p>Top 3 score paths: ${escapeHtml(scoreScenarioText(drift.scoreScenarios, 3))}</p>` : ""}
        ${drift.scoreScenarios?.length ? `<p>Top 5 score paths: ${escapeHtml(scoreScenarioText(drift.scoreScenarios, 5))}</p>` : ""}
        <p>${tr("driftReason")}: ${escapeHtml(driftReasonText(drift, read))}</p>
      </div>
    `;
  }
  return liveCorrectionMarkup(match);
}

function scoreFromScenarios(scenarios = []) {
  return scenarios.find((item) => item?.score)?.score || null;
}

function driftReasonText(drift, read) {
  const reasons = [];
  if (drift?.winnerVolatility) {
    reasons.push(`winner gap ${percentText(drift.winnerVolatility.gap)} (${drift.winnerVolatility.label || "watch"})`);
  }
  if (drift?.scoreScenarios?.length) {
    reasons.push(`top score paths ${scoreScenarioText(drift.scoreScenarios, 5)}`);
  }
  if (drift?.rehearsal?.searchRequired) {
    reasons.push(`fresh news/lineup/Opta review: ${listText(drift.rehearsal.focus || []) || "required"}`);
  } else if (drift?.rehearsal?.focus?.length) {
    reasons.push(`replay focus ${listText(drift.rehearsal.focus)}`);
  }
  if (read?.pick?.calibrationLayer?.applied) {
    reasons.push("KV calibration applied");
  }
  if (read?.summary) reasons.push(String(read.summary).trim());
  if (read?.evidenceUsed?.length) reasons.push(`evidence ${listText(read.evidenceUsed.slice(0, 6))}`);
  if (drift?.rehearsal?.suggestedQueries?.length) reasons.push(`news checks ${listText(drift.rehearsal.suggestedQueries.slice(0, 2))}`);
  return reasons.filter(Boolean).join("; ") || (drift?.drifted ? tr("postLockDriftCopy") : tr("lockAlignedCopy"));
}

function liveDriftFor(match, read) {
  const official = officialPredictionRecord(match);
  const officialCode = official ? officialPickCode(official) : null;
  const liveCode = read?.pick?.winnerCode ? String(read.pick.winnerCode).toUpperCase() : null;
  if (!officialCode || !liveCode) return null;
  const normalizedOfficial = String(officialCode).toUpperCase();
  const drifted = normalizedOfficial !== liveCode;
  const officialScore = official?.analysis?.predictedScore || official?.analysis?.score || null;
  const officialConfidence = official?.analysis?.confidence || null;
  const scoreScenarios = Array.isArray(read?.lab?.scoreScenarios) ? read.lab.scoreScenarios.slice(0, 5) : [];
  const liveScore = read?.pick?.predictedScore || scoreFromScenarios(scoreScenarios) || null;
  const scoreChanged = Boolean(officialScore && liveScore && String(officialScore).trim() !== String(liveScore).trim());
  return {
    drifted,
    scoreChanged,
    officialCode: normalizedOfficial,
    officialName: teamNameForCode(normalizedOfficial, match),
    officialConfidence,
    liveCode,
    liveName: teamNameForCode(liveCode, match),
    liveConfidence: read.pick?.confidence || null,
    officialScore,
    liveScore,
    winnerVolatility: read?.lab?.winnerVolatility || null,
    scoreScenarios,
    rehearsal: read?.lab?.rehearsal || null
  };
}

function renderDailyRead(match) {
  const panel = document.getElementById("dailyRead");
  if (!panel) return;
  const resolved = resolvedTeams(match);
  if (!resolved.aCode || !resolved.bCode) {
    panel.innerHTML = `
      <div class="daily-read__head">
        <span>${tr("dailyRead")}</span>
        <strong>${tr("waitingTeams")}</strong>
      </div>
    `;
    return;
  }

  const read = dailyReadFor(match);
  if (!read) {
    panel.innerHTML = `
      <div class="daily-read__head">
        <span>${tr("dailyRead")}</span>
        <strong>${liveCorrectionFor(match) ? tr("liveEstimate") : tr("nextRefreshPending")}</strong>
      </div>
      <p class="daily-read__empty">${tr("dailyRefreshCopy")}</p>
      ${liveCorrectionMarkup(match)}
      ${currentKvMemoryMarkup()}
    `;
    return;
  }

  const probabilities = read.probabilities || {};
  const pickCode = read.pick?.winnerCode;
  const pickName = read.pick?.winnerName || teams[pickCode]?.name || tr("pending");
  const updatedAt = read.generatedAt ? formatProofTime(read.generatedAt) : tr("unknown");
  const drift = liveDriftFor(match, read);
  const rows = [
    { side: "home", label: teams[resolved.aCode]?.name || slotLabel(match, "a"), value: probabilities.home },
    { side: "draw", label: tr("draw"), value: probabilities.draw },
    { side: "away", label: teams[resolved.bCode]?.name || slotLabel(match, "b"), value: probabilities.away }
  ];

  panel.innerHTML = `
    <div class="daily-read__head">
      <span>${tr("dailyRead")}</span>
      <strong>${tr("updated")} ${escapeHtml(updatedAt)}</strong>
    </div>
    <div class="daily-read__pick">
      <span>${tr("currentLean")}</span>
      <strong>${escapeHtml(pickName)}${read.pick?.confidence ? ` · ${dailyReadPercent(read.pick.confidence)} ${tr("confidence")}` : ""}</strong>
    </div>
    ${drift ? `
      <div class="daily-read__drift ${drift.drifted ? "is-drifted" : "is-aligned"}">
        <span>${drift.drifted ? tr("postLockDrift") : tr("liveEstimate")}</span>
        <strong>${tr("officialLock")}: ${escapeHtml(drift.officialName)}${drift.officialConfidence ? ` ${dailyReadPercent(drift.officialConfidence)}` : ""} · ${tr("liveEstimate")}: ${escapeHtml(drift.liveName)}${drift.liveConfidence ? ` ${dailyReadPercent(drift.liveConfidence)}` : ""}</strong>
        <p>${tr("predictedScore")}: ${tr("officialLock")} ${escapeHtml(drift.officialScore || "N/A")} -> ${tr("liveEstimate")} ${escapeHtml(drift.liveScore || "N/A")}</p>
        ${drift.winnerVolatility ? `<p>Win drift: ${escapeHtml(drift.winnerVolatility.leaderName || tr("pending"))} · gap ${percentText(drift.winnerVolatility.gap)} · ${escapeHtml(drift.winnerVolatility.label || "watch")}</p>` : ""}
        ${drift.scoreScenarios?.length ? `<p>Top 3 score paths: ${escapeHtml(scoreScenarioText(drift.scoreScenarios, 3))}</p>` : ""}
        ${drift.scoreScenarios?.length ? `<p>Top 5 score paths: ${escapeHtml(scoreScenarioText(drift.scoreScenarios, 5))}</p>` : ""}
        ${drift.rehearsal ? `<p>Replay room: ${drift.rehearsal.searchRequired ? "refreshing news / lineups / Opta-style preview" : "local pre-lock rehearsal covered"}${drift.rehearsal.focus?.length ? ` · ${escapeHtml(listText(drift.rehearsal.focus))}` : ""}</p>` : ""}
        <p>${tr("driftReason")}: ${escapeHtml(driftReasonText(drift, read))}</p>
      </div>
    ` : ""}
    ${read.lab?.rehearsal ? `
      <div class="daily-read__meta">
        <strong>Pre-lock rehearsal</strong>
        <p>${read.lab.rehearsal.searchRequired ? "Need more news refresh before lock or live drift review." : "Local pre-lock rehearsal is covered."}</p>
        ${read.lab.rehearsal.focus?.length ? `<p>Focus: ${escapeHtml(listText(read.lab.rehearsal.focus))}</p>` : ""}
      </div>
    ` : ""}
    ${read.lab?.winnerVolatility || read.lab?.scoreScenarios?.length ? `
      <div class="daily-read__meta">
        <strong>Lab drift</strong>
        ${read.lab?.winnerVolatility ? `<p>Winner volatility: ${escapeHtml(read.lab.winnerVolatility.leaderName || tr("pending"))} · gap ${percentText(read.lab.winnerVolatility.gap)} · ${escapeHtml(read.lab.winnerVolatility.label || "watch")}</p>` : ""}
        ${read.lab?.scoreScenarios?.length ? `<p>Top 3 score paths: ${escapeHtml(scoreScenarioText(read.lab.scoreScenarios, 3))}</p>` : ""}
        ${read.lab?.scoreScenarios?.length ? `<p>Top 5 score paths: ${escapeHtml(scoreScenarioText(read.lab.scoreScenarios, 5))}</p>` : ""}
      </div>
    ` : ""}
    ${calibrationBlockMarkup(read.pick?.calibrationLayer, { title: "KV calibration", compact: false })}
    <div class="daily-read__bars">
      ${rows.map((row) => {
        const pct = Number.isFinite(Number(row.value)) ? Math.max(0, Math.min(100, Math.round(Number(row.value)))) : 0;
        return `
          <div class="daily-read__row">
            <span>${escapeHtml(row.label)}</span>
            <strong>${dailyReadPercent(row.value)}</strong>
            <i style="width: ${pct}%"></i>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function teamNameForCode(code, match) {
  if (!code) return tr("pending");
  if (code === "DRAW") return tr("draw");
  if (teams[code]) return teams[code].name;
  const resolved = match ? resolvedTeams(match) : {};
  if (code === resolved.aCode) return teams[resolved.aCode]?.name || code;
  if (code === resolved.bCode) return teams[resolved.bCode]?.name || code;
  return code;
}

function traceProbability(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "";
  const percent = number <= 1 ? number * 100 : number;
  return `${Math.round(percent)}%`;
}

function probabilityTriple(match, probabilities = {}) {
  probabilities ||= {};
  const resolved = resolvedTeams(match);
  const home = traceProbability(probabilities.home);
  const draw = traceProbability(probabilities.draw);
  const away = traceProbability(probabilities.away);
  if (!home && !draw && !away) return "";
  return `${resolved.aCode || "H"} ${home || "-"} · D ${draw || "-"} · ${resolved.bCode || "A"} ${away || "-"}`;
}

function sideToCode(match, side) {
  const resolved = resolvedTeams(match);
  if (side === "draw") return "DRAW";
  if (side === "home") return resolved.aCode || null;
  if (side === "away") return resolved.bCode || null;
  return null;
}

function favoriteFromProbabilities(match, probabilities = {}) {
  probabilities ||= {};
  const sides = ["home", "draw", "away"].filter((side) => Number.isFinite(Number(probabilities[side])));
  if (!sides.length) return null;
  const side = sides.sort((a, b) => Number(probabilities[b]) - Number(probabilities[a]))[0];
  const code = sideToCode(match, side);
  return {
    side,
    code,
    name: teamNameForCode(code, match),
    probability: probabilities[side]
  };
}

function officialMarketTrace(match, official) {
  const market = official?.proof?.payload?.evidence?.market || official?.evidence?.market || null;
  if (!market?.probabilities) return null;
  const favorite = favoriteFromProbabilities(match, market.probabilities);
  if (!favorite) return null;
  return {
    matchId: match.id,
    provider: market.provider || market.source || null,
    updatedAt: market.updatedAt || null,
    favoriteSide: favorite.side,
    favoriteCode: favorite.code,
    favoriteName: favorite.name,
    probabilities: market.probabilities,
    bookmakerCount: market.bookmakerCount || null
  };
}

function traceAwaitingPickLabel(match) {
  const resolved = resolvedTeams(match);
  if (!resolved.aCode || !resolved.bCode) return tr("bracketSlotPending");
  return match.round === "Group Stage" ? tr("awaitingGroupLock") : tr("awaitingKnockoutLock");
}

function tracePaulPick(match, official, daily) {
  if (official) {
    const code = officialPickCode(official);
    return {
      code,
      name: official.analysis?.winnerName || teamNameForCode(code, match),
      confidence: official.analysis?.confidence || null,
      probabilities: official.analysis?.probabilities || null,
      predictedScore: official.analysis?.predictedScore || official.analysis?.score || null,
      scoreScenarios: scoreScenariosFor(match, official, daily),
      status: "Official locked"
    };
  }
  if (daily?.pick?.winnerCode) {
    return {
      code: daily.pick.winnerCode,
      name: daily.pick.winnerName || teamNameForCode(daily.pick.winnerCode, match),
      confidence: daily.pick.confidence || null,
      probabilities: daily.probabilities || null,
      predictedScore: daily.pick.predictedScore || daily.pick.score || null,
      scoreScenarios: scoreScenariosFor(match, official, daily),
      status: "Daily read"
    };
  }
  return { code: null, name: tr("awaitingLock"), confidence: null, probabilities: null, predictedScore: null, scoreScenarios: [], status: traceAwaitingPickLabel(match) };
}

function traceResult(match, result) {
  if (!result?.status || result.status !== "final") return { label: tr("awaitingResult"), winnerCode: null, score: null };
  const resolved = resolvedTeams(match);
  const winnerCode = result.winnerCode || (Number(result.homeScore) === Number(result.awayScore)
    ? "DRAW"
    : Number(result.homeScore) > Number(result.awayScore)
      ? resolved.aCode
      : resolved.bCode);
  return {
    label: `${teams[resolved.aCode]?.name || "Home"} ${result.homeScore}-${result.awayScore} ${teams[resolved.bCode]?.name || "Away"}`,
    score: `${result.homeScore}-${result.awayScore}`,
    winnerCode
  };
}

function tracePaulOutcomeLabel(paul, result) {
  if (!result.winnerCode || !paul.code) return "";
  const winnerHit = String(paul.code).toUpperCase() === String(result.winnerCode).toUpperCase();
  if (!winnerHit) return currentLanguage === "zh" ? "PAUL 胜负未中" : "PAUL win call missed";
  const scoreHit = paul.predictedScore && result.score && String(paul.predictedScore).replace(/\s/g, "") === String(result.score).replace(/\s/g, "");
  return currentLanguage === "zh"
    ? `PAUL 胜负命中 · ${scoreHit ? "比分全中" : "比分未中"}`
    : `PAUL win call hit · score ${scoreHit ? "exact" : "missed"}`;
}

function tracePaulOutcomeLabel(paul, result) {
  if (!result.winnerCode || !paul.code) return "";
  const winnerHit = String(paul.code).toUpperCase() === String(result.winnerCode).toUpperCase();
  if (!winnerHit) return "PAUL win call missed";
  const scoreHit = paul.predictedScore && result.score && normalizeScoreLabel(paul.predictedScore) === normalizeScoreLabel(result.score);
  const scenarioHit = scoreScenarioHit(paul.scoreScenarios, result);
  return `PAUL win call hit · score ${scoreHit ? "exact" : "missed"}${scenarioHit.label ? ` · ${scenarioHit.label}` : ""}`;
}

function traceMarketImpact(paulCode, marketCode, winnerCode) {
  if (!winnerCode) return tr("afterFinal");
  if (!paulCode || !marketCode) return tr("noComparison");
  const paulCorrect = String(paulCode).toUpperCase() === String(winnerCode).toUpperCase() ? 1 : 0;
  const marketCorrect = String(marketCode).toUpperCase() === String(winnerCode).toUpperCase() ? 1 : 0;
  const impact = paulCorrect - marketCorrect;
  return `${impact >= 0 ? "+" : ""}${impact}`;
}

function publicTraceMarketEdge() {
  let edge = 0;
  let compared = 0;
  tournament.matches.forEach((match) => {
    const resolved = resolvedTeams(match);
    if (!resolved.aCode || !resolved.bCode) return;
    const official = officialPredictionRecord(match);
    const daily = dailyReadFor(match);
    const market = marketTraceFor(match) || officialMarketTrace(match, official);
    const paul = tracePaulPick(match, official, daily);
    const result = traceResult(match, officialResult(match));
    if (!paul.code || !market?.favoriteCode || !result.winnerCode) return;
    const paulCorrect = String(paul.code).toUpperCase() === String(result.winnerCode).toUpperCase() ? 1 : 0;
    const marketCorrect = String(market.favoriteCode).toUpperCase() === String(result.winnerCode).toUpperCase() ? 1 : 0;
    edge += paulCorrect - marketCorrect;
    compared += 1;
  });
  return compared ? { edge, compared } : null;
}

function renderPublicTraceUnsafe() {
  const container = document.getElementById("publicTrace");
  const summary = document.getElementById("publicTraceSummary");
  if (!container) return;
  const rows = tournament.matches
    .filter((match) => {
      const resolved = resolvedTeams(match);
      return resolved.aCode && resolved.bCode;
    })
    .map((match) => {
      const official = officialPredictionRecord(match);
      const daily = dailyReadFor(match);
      const market = marketTraceFor(match) || officialMarketTrace(match, official);
      const paul = tracePaulPick(match, official, daily);
      const result = traceResult(match, officialResult(match));
      return { match, official, daily, market, paul, result };
    });

  const officialCount = rows.filter((row) => row.official).length;
  const dailyCount = rows.filter((row) => row.daily).length || Object.keys(automationState.dailyAnalysis || {}).length;
  const marketCount = rows.filter((row) => row.market).length;
  const resultCount = rows.filter((row) => row.result.winnerCode).length;
  if (summary) {
    summary.innerHTML = `
      <article><strong>${rows.length}</strong><span>${tr("playableFixtures")}</span></article>
      <article><strong>${officialCount}</strong><span>${tr("officialLocks")}</span></article>
      <article><strong>${dailyCount}</strong><span>${tr("dailyReads")}</span></article>
      <article><strong>${marketCount}</strong><span>${tr("marketReferences")}</span></article>
      <article><strong>${resultCount}</strong><span>${tr("finalResults")}</span></article>
    `;
  }

  container.innerHTML = `
    <div class="trace-table" role="table" aria-label="2026 PAUL public match trace">
      <div class="trace-row trace-row--head" role="row">
        <span>${tr("match")}</span>
        <span>${tr("paul")}</span>
        <span>${tr("market")}</span>
        <span>${tr("result")}</span>
        <span>${tr("impact")}</span>
      </div>
      ${rows.map(({ match, market, paul, result, daily, official }) => {
        const resolved = resolvedTeams(match);
        const matchName = `${teams[resolved.aCode]?.name || slotLabel(match, "a")} vs ${teams[resolved.bCode]?.name || slotLabel(match, "b")}`;
        const marketName = market?.favoriteName || teamNameForCode(market?.favoriteCode, match);
        const marketProb = market?.favoriteSide ? traceProbability(market.probabilities?.[market.favoriteSide]) : "";
        const paulConfidence = paul.confidence ? ` · ${traceProbability(paul.confidence)}` : "";
        const paulScore = paul.predictedScore ? ` · ${tr("predictedScore")} ${escapeHtml(paul.predictedScore)}` : "";
        const paulProbabilities = probabilityTriple(match, paul.probabilities);
        const marketProbabilities = probabilityTriple(match, market?.probabilities);
        const impact = traceMarketImpact(paul.code, market?.favoriteCode, result.winnerCode);
        const paulCorrect = result.winnerCode && String(paul.code || "").toUpperCase() === String(result.winnerCode).toUpperCase();
        const settledClass = result.winnerCode ? (paulCorrect ? "trace-row--correct" : "trace-row--missed") : "";
        const paulClass = paul.status === "Official locked" ? "trace-paul--locked" : "";
        const paulOutcome = tracePaulOutcomeLabel(paul, result);
        const drift = daily ? liveDriftFor(match, daily) : null;
        const replayRoom = daily?.lab?.rehearsal?.focus?.length ? ` · replay ${escapeHtml(listText(daily.lab.rehearsal.focus))}` : "";
        const winnerVolatility = daily?.lab?.winnerVolatility ? ` · win drift ${escapeHtml(daily.lab.winnerVolatility.label)} ${percentText(daily.lab.winnerVolatility.gap)}` : "";
        const scorePath = daily?.lab?.scoreScenarios?.length ? ` · score ${escapeHtml(scoreScenarioText(daily.lab.scoreScenarios))}` : "";
        const scoreScenarios = scoreScenariosFor(match, official, daily);
        const scorePathHit = scoreScenarioHit(scoreScenarios, result);
        const scorePathDetails = scoreScenarios.length
          ? ` · Top3 ${escapeHtml(scoreScenarioText(scoreScenarios, 3))} · Top5 ${escapeHtml(scoreScenarioText(scoreScenarios, 5))}${scorePathHit.label && result.winnerCode ? ` · ${escapeHtml(scorePathHit.label)}` : ""}`
          : "";
        const driftOfficialPct = drift?.officialConfidence ? ` ${dailyReadPercent(drift.officialConfidence)}` : "";
        const driftLivePct = drift?.liveConfidence ? ` ${dailyReadPercent(drift.liveConfidence)}` : "";
        const driftLine = drift
          ? `${drift.drifted ? tr("postLockDrift") : tr("liveEstimate")} · ${escapeHtml(drift.officialName)}${driftOfficialPct} -> ${escapeHtml(drift.liveName)}${driftLivePct} · score ${escapeHtml(drift.officialScore || "-")} -> ${escapeHtml(drift.liveScore || "-")}`
          : "";
        return `
          <div class="trace-row ${settledClass}" role="row">
            <span>
              <strong>#${match.id} ${escapeHtml(matchName)}</strong>
              <em>${roundLabel(match.round)} · ${formatMatchDateWithZone(match)} · ${match.venue}</em>
            </span>
            <span class="${paulClass}">
              <strong>${escapeHtml(paul.name)}${paulConfidence}</strong>
              ${scorePathDetails ? `<em>${scorePathDetails}</em>` : ""}
              <em>${escapeHtml(paul.status)}${paulScore}${paulProbabilities ? ` · ${paulProbabilities}` : ""}${driftLine ? ` · ${escapeHtml(driftLine)}` : ""}${winnerVolatility}${scorePath}${replayRoom}</em>
            </span>
            <span>
              <strong>${market?.favoriteCode ? `${escapeHtml(marketName)}${marketProb ? ` · ${marketProb}` : ""}` : tr("marketPending")}</strong>
              <em>${market?.provider ? `${escapeHtml(market.provider)}${market.bookmakerCount ? ` · ${market.bookmakerCount} books` : ""}${marketProbabilities ? ` · ${marketProbabilities}` : ""}` : tr("noMarket")}</em>
            </span>
            <span>
              <strong>${escapeHtml(result.label)}</strong>
              <em>${result.winnerCode ? `${tr("winner")}: ${escapeHtml(teamNameForCode(result.winnerCode, match))}${paulOutcome ? ` · ${escapeHtml(paulOutcome)}` : ""}` : countdownMarkup(match)}</em>
            </span>
            <span class="${impact.startsWith("+1") ? "trace-impact--win" : impact.startsWith("-") ? "trace-impact--loss" : ""}">
              <strong>${impact}</strong>
              <em>${tr("paulVsMarket")}</em>
            </span>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderPublicTrace() {
  const container = document.getElementById("publicTrace");
  try {
    renderPublicTraceUnsafe();
  } catch (error) {
    if (container) {
      container.innerHTML = `<div class="empty-list">Match trace failed to render: ${escapeHtml(error.message || "unknown error")}</div>`;
    }
  }
}

function proofEntryForMatch(matchId) {
  return publicProofEntries.find((entry) => String(entry.matchId) === String(matchId));
}

function correctMatchRows() {
  return tournament.matches
    .map((match) => {
      const official = officialPredictionRecord(match);
      const result = officialResult(match);
      if (result?.status !== "final" || !official) return null;
      const pick = String(officialPickCode(official) || "").toUpperCase();
      const winner = String(resultWinner(result) || "").toUpperCase();
      if (!pick || pick !== winner) return null;
      const resolved = resolvedTeams(match);
      const home = teams[resolved.aCode]?.name || slotLabel(match, "a");
      const away = teams[resolved.bCode]?.name || slotLabel(match, "b");
      const scoreScenarios = scoreScenariosFor(match, official, dailyReadFor(match));
      const scorePathHit = scoreScenarioHit(scoreScenarios, result);
      return {
        match,
        official,
        result,
        proof: proofEntryForMatch(match.id),
        label: `${home} ${result.homeScore}-${result.awayScore} ${away}`,
        pickName: teamNameForCode(pick, match),
        outcome: predictionOutcomeText(official, result),
        predictedScore: officialPredictedScoreLabel(official) || "N/A",
        finalScore: resultScoreString(result) || "N/A",
        scoreExact: Boolean(officialPredictedScore(official) && officialPredictedScore(official) === resultScoreString(result)),
        scoreScenarios,
        scorePathHit
      };
    })
    .filter(Boolean);
}

function bindHitListActions(container) {
  container.querySelectorAll(".hit-json-button").forEach((button) => {
    button.addEventListener("click", () => {
      const entry = proofEntryForMatch(button.dataset.matchId);
      if (!entry) return;
      setProofVerifierInput(publicProofJson(entry));
      document.getElementById("proofVerifier")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function renderHitList() {
  const container = document.getElementById("hitList");
  if (!container) return;
  const hits = correctMatchRows();
  container.innerHTML = `
    <div class="hit-list__head">
      <strong>${tr("correctMatches")}</strong>
      <span>${hits.length}</span>
    </div>
    <div class="hit-list__items">
      ${hits.length ? hits.map(({ match, label, pickName, proof, outcome, predictedScore, finalScore, scoreExact, scoreScenarios, scorePathHit }) => `
        <article class="hit-card">
          <span>#${match.id}</span>
          <strong>${escapeHtml(label)}</strong>
          <em>${tr("pick")}: ${escapeHtml(pickName)}${outcome ? ` · ${escapeHtml(outcome)}` : ""}</em>
          <em>Predicted score: ${escapeHtml(predictedScore)} · Final score: ${escapeHtml(finalScore)} · ${scoreExact ? "score exact" : "score missed"}</em>
          ${scoreScenarios.length ? `<em>Top3: ${escapeHtml(scoreScenarioText(scoreScenarios, 3))}</em><em>Top5: ${escapeHtml(scoreScenarioText(scoreScenarios, 5))}${scorePathHit.label ? ` · ${escapeHtml(scorePathHit.label)}` : ""}</em>` : ""}
          ${proof ? `<button class="button button--ghost hit-json-button" type="button" data-match-id="${match.id}">${tr("verifyJson")}</button>` : ""}
        </article>
      `).join("") : `<p>${tr("noCorrectPicksYet")}</p>`}
    </div>
  `;
  bindHitListActions(container);
}

async function loadPoll(matchId) {
  try {
    const response = await fetch(`/api/polls?matchId=${encodeURIComponent(matchId)}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Poll failed.");
    pollState[matchId] = data;
    if (activeMatchId === matchId) {
      const match = tournament.matches.find((item) => item.id === matchId);
      if (match) renderPollPanel(match, data);
    }
  } catch {
    // Polling is optional; predictions should remain usable if it fails.
  }
}

async function submitPollVote(matchId, side) {
  setStoredPollChoice(matchId, side);
  const match = tournament.matches.find((item) => item.id === matchId);
  if (match) renderPollPanel(match, pollState[matchId]);
  try {
    const response = await fetch("/api/polls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId, side, voterId: pollVoterId() })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Vote failed.");
    pollState[matchId] = data;
    if (match && activeMatchId === matchId) renderPollPanel(match, data);
  } catch {
    if (match) renderPollPanel(match, pollState[matchId]);
  }
}

function predictionStatus(match) {
  const record = officialPredictionRecord(match);
  const result = officialResult(match);
  if (result?.status === "final" && record) {
    return predictionOutcomeText(record, result) || tr("final");
  }
  if (result?.status === "final") return tr("final");
  if (record) return tr("locked");
  return tr("pending");
}

function resultLabel(match) {
  const result = officialResult(match);
  if (result?.status === "final") {
    const winner = result.winnerCode || resultWinner(result);
    const winnerName = winner === "DRAW" ? tr("draw") : teams[winner]?.name || tr("final");
    return `${winnerName} ${result.homeScore}-${result.awayScore}`;
  }
  const record = officialPredictionRecord(match);
  if (!record) return tr("pending");
  const pick = officialPickCode(record);
  if (!pick || pick === "DRAW") return tr("draw");
  return teams[pick]?.name || record.analysis.winnerName || tr("locked");
}

function officialEvidenceMarkup(analysis) {
  const evidence = Array.isArray(analysis?.evidenceUsed)
    ? analysis.evidenceUsed.filter(Boolean).slice(0, 5)
    : [];
  if (!evidence.length) return "";
  return `
    <div class="locked-analysis__block">
      <strong>${tr("evidenceUsed")}</strong>
      <ul>
        ${evidence.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </div>
  `;
}

function officialAnalysisMarkup(official, match) {
  const analysis = official?.analysis || {};
  const reasoning = analysis.reasoning || analysis.calibrationNote || tr("lockedWithoutDetails");
  const currentKv = currentKvMemoryMarkup();
  const lockVsLive = match ? lockVsLiveMarkup(match) : "";
  const scorePaths = match ? scoreScenariosFor(match, official, dailyReadFor(match)) : [];
  const scorePathsMarkup = match ? scoreScenarioMarkup(scorePaths, officialResult(match)) : "";
  return `
    <div class="locked-analysis">
      <div class="locked-analysis__block">
        <strong>${tr("whyLocked")}</strong>
        <p>${escapeHtml(reasoning)}</p>
      </div>
      ${analysis.upsetRisk ? `
        <div class="locked-analysis__block">
          <strong>${tr("upsetRisk")}</strong>
          <p>${escapeHtml(analysis.upsetRisk)}</p>
        </div>
      ` : ""}
      <div class="locked-analysis__block">
        <strong>KV calibration</strong>
        ${analysis.calibrationLayer?.applied
          ? `
            <p>Sample ${escapeHtml(String(analysis.calibrationLayer.sampleSize || 0))} · ${escapeHtml(analysis.calibrationLayer.version || "kv-calibration")}</p>
            <p>${escapeHtml(probabilityCompareText(analysis.calibrationLayer))}</p>
            <p>${escapeHtml(calibrationNotesText(analysis.calibrationLayer) || "Automatic pre-match correction from post-match review KV.")}</p>
          `
          : `
            <p>Not applied at lock time.</p>
            <p>This proof is frozen. Current KV memory can still calibrate Daily PAUL reads and future locks.</p>
            ${currentKvCalibrationDetails({ includeUpdated: true })}
          `}
      </div>
      ${lockVsLive}
      ${scorePathsMarkup}
      ${currentKv}
      ${officialEvidenceMarkup(analysis)}
    </div>
  `;
}

function officialModelCards(official, match) {
  const analysis = official.analysis || {};
  const scorePaths = scoreScenariosFor(match, official, dailyReadFor(match));
  return `
    <article class="model-card">
      <h3>${tr("officialPaulPick")}</h3>
      <div class="vote">${escapeHtml(analysis.winnerName || resultLabel(match))} · ${analysis.confidence || "N/A"}%</div>
      <p>${escapeHtml(analysis.reasoning || tr("officialPredictionFallback"))}</p>
    </article>
    <article class="model-card">
      <h3>${tr("predictedScore")}</h3>
      <div class="vote">${escapeHtml(analysis.predictedScore || analysis.score || "N/A")}</div>
      <p>${tr("lockedAt")}: ${formatDisplayDateTime(official.generatedAt, { year: "numeric" })}.</p>
      ${scorePaths.length ? `<p>Top 3: ${escapeHtml(scoreScenarioText(scorePaths, 3))}</p><p>Top 5: ${escapeHtml(scoreScenarioText(scorePaths, 5))}</p>` : ""}
    </article>
    <article class="model-card">
      <h3>${tr("upsetWatch")}</h3>
      <div class="vote">${escapeHtml(analysis.upsetRisk || "N/A")}</div>
      <p>${escapeHtml(analysis.upsetCase || tr("finalScoresVerify"))}</p>
    </article>
    <article class="model-card">
      <h3>${tr("proofStatus")}</h3>
      <div class="vote">${official.proof?.hash ? tr("proofLocked") : tr("locked")}</div>
      <p>${tr("proofLockedPublicRecord")}</p>
    </article>
  `;
}

function updateChampionLabel() {
  setText("championName", tr("awaitingGroups"));
}

function recentMatchRank(match, now = new Date()) {
  const kickoff = matchKickoffTime(match);
  const resolved = resolvedTeams(match);
  if (!resolved.aCode || !resolved.bCode || Number.isNaN(kickoff.getTime())) {
    return { bucket: 9, distance: Number.MAX_SAFE_INTEGER };
  }
  const result = officialResult(match);
  const locked = Boolean(officialPredictionRecord(match));
  const distance = Math.abs(kickoff.getTime() - now.getTime());
  if (locked && result?.status !== "final") return { bucket: 0, distance };
  if (result?.status === "final") return { bucket: 1, distance };
  if (kickoff >= now) return { bucket: 2, distance };
  return { bucket: 3, distance };
}

function sortRecentMatches(a, b, now = new Date()) {
  const aRank = recentMatchRank(a, now);
  const bRank = recentMatchRank(b, now);
  return aRank.bucket - bRank.bucket || aRank.distance - bRank.distance || a.id - b.id;
}

function renderMatchList() {
  const round = document.getElementById("roundFilter").value;
  const group = document.getElementById("groupFilter").value;
  const query = document.getElementById("searchBox").value.trim().toLowerCase();
  const list = document.getElementById("matchList");
  const now = new Date();

  let filtered = tournament.matches.filter((match) => {
    const resolved = resolvedTeams(match);
    const aLabel = resolved.aCode ? teams[resolved.aCode].name : slotLabel(match, "a");
    const bLabel = resolved.bCode ? teams[resolved.bCode].name : slotLabel(match, "b");
    const haystack = `${match.id} ${match.round} ${match.group || ""} ${aLabel} ${bLabel} ${match.venue}`.toLowerCase();
    const isRecent = round === defaultRoundFilter;
    const resolvedPlayable = Boolean(resolved.aCode && resolved.bCode && !Number.isNaN(matchKickoffTime(match).getTime()));
    return (isRecent ? resolvedPlayable : (round === "All" || match.round === round))
      && (group === "All" || match.group === group)
      && (!query || haystack.includes(query));
  });

  if (round === defaultRoundFilter) {
    filtered = filtered
      .sort((a, b) => sortRecentMatches(a, b, now))
      .slice(0, query ? filtered.length : 24);
  }

  if (filtered.length && !filtered.some((match) => match.id === activeMatchId)) {
    activeMatchId = filtered[0].id;
  }

  list.innerHTML = filtered
    .map((match) => {
      const resolved = resolvedTeams(match);
      const aLabel = resolved.aCode ? teams[resolved.aCode].name : slotLabel(match, "a");
      const bLabel = resolved.bCode ? teams[resolved.bCode].name : slotLabel(match, "b");
      const flags = resolved.aCode && resolved.bCode
        ? `${flagImage(resolved.aCode, "flag-frame match-flag")} ${flagImage(resolved.bCode, "flag-frame match-flag")}`
        : `<span class="slot-badge">TBD</span>`;
      return `
        <button class="match-card ${match.id === activeMatchId ? "is-active" : ""}" data-id="${match.id}">
          <span class="match-no">#${match.id}</span>
        <span>
          <span class="match-title">
            <span class="match-flags">${flags}</span>
            <span>${aLabel} vs ${bLabel}</span>
          </span>
          <span class="match-sub">${roundLabel(match.round)} · ${formatMatchDate(match)} · ${match.venue}</span>
          <span class="match-countdown">${countdownMarkup(match)}</span>
          <span class="mode-pill ${modeClass(match)}">${matchMode(match)}</span>
        </span>
        <span class="winner-pill">${predictionStatus(match)} · ${resultLabel(match)}</span>
      </button>
    `;
    })
    .join("");

  if (!filtered.length) {
    list.innerHTML = `
      <div class="empty-list">
        ${tr("knockoutFixturesPending")}
      </div>
    `;
  }

  list.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      activeMatchId = Number(button.dataset.id);
      renderMatchList();
      renderPK();
    });
  });
}

function renderPK() {
  const match = tournament.matches.find((item) => item.id === activeMatchId);
  const resolved = resolvedTeams(match);
  const official = officialPredictionRecord(match);
  const officialPick = officialPickCode(official);
  const finalResult = officialResult(match);
  const leftWon = Boolean(official && resolved.aCode && officialPick === resolved.aCode);
  const rightWon = Boolean(official && resolved.bCode && officialPick === resolved.bCode);
  const mode = matchMode(match);
  const pkPanel = document.getElementById("pkPanel");
  const lane = document.getElementById("octopusLane");
  const crawler = document.getElementById("crawler");
  const direction = leftWon ? "left" : rightWon ? "right" : "center";
  const phoneStage = window.matchMedia?.("(max-width: 700px)").matches;
  const compactStage = window.matchMedia?.("(max-width: 980px)").matches;
  const leftCrawl = phoneStage ? "-24%" : compactStage ? "-8%" : "-34%";
  const rightCrawl = phoneStage ? "24%" : compactStage ? "8%" : "34%";
  const crawlX = leftWon ? leftCrawl : rightWon ? rightCrawl : "0%";
  const shouldCrawl = leftWon || rightWon;
  const crawlerAsset = "assets/real-paul-side-cutout.png";

  pkPanel.dataset.mode = match.round === "Group Stage" ? "group" : "knockout";
  pkPanel.dataset.direction = direction;
  document.getElementById("pkMeta").textContent = `${mode} · ${tr("match")} ${match.id} · ${roundLabel(match.round)} · ${formatMatchDateWithZone(match)} · ${match.venue}`;
  document.getElementById("pkConfidence").innerHTML = official
    ? `${tr("officialConfidence")} ${official.analysis?.confidence || "N/A"}% · ${countdownMarkup(match)}`
    : `${resolved.aCode && resolved.bCode ? tr("officialPredictionPending") : tr("bracketSlotPending")} · ${countdownMarkup(match)}`;
  document.getElementById("leftTeam").innerHTML = resolved.aCode ? teamMarkup(resolved.aCode) + teamLocaleMarkup(resolved.aCode) : slotMarkup(slotLabel(match, "a"));
  document.getElementById("rightTeam").innerHTML = resolved.bCode ? teamMarkup(resolved.bCode) + teamLocaleMarkup(resolved.bCode) : slotMarkup(slotLabel(match, "b"));
  lane.style.setProperty("--crawl-x", crawlX);
  lane.dataset.direction = direction;
  if (!crawler.getAttribute("src")?.includes(crawlerAsset)) {
    crawler.setAttribute("src", crawlerAsset);
  }
  crawler.style.animation = "none";
  crawler.offsetHeight;
  crawler.style.animation = shouldCrawl ? "" : "none";

  if (official) {
    const pickName = officialPick === "DRAW" ? tr("draw") : teams[officialPick]?.name || official.analysis?.winnerName || "N/A";
    const verdict = officialPick === "DRAW" ? `${tr("paul")} ${tr("winner")}: ${tr("draw")}` : `${tr("paul")} ${tr("winner")}: ${pickName}`;
    const resultCopy = finalResult?.status === "final"
      ? `${tr("final")}: ${teams[resolved.aCode]?.name || slotLabel(match, "a")} ${finalResult.homeScore}-${finalResult.awayScore} ${teams[resolved.bCode]?.name || slotLabel(match, "b")}. ${predictionStatus(match)}.`
      : tr("finalScorePending");
    document.getElementById("predictionCopy").innerHTML = `
      <p><strong>${verdict}</strong> · ${tr("predictedScore")}: <strong>${official.analysis?.predictedScore || official.analysis?.score || "N/A"}</strong>.</p>
      ${officialAnalysisMarkup(official, match)}
      <p>${resultCopy}</p>
    `;
  } else {
    document.getElementById("predictionCopy").innerHTML = `
      <p><strong>${resolved.aCode && resolved.bCode ? tr("officialPredictionNotLocked") : tr("bracketNotResolved")}</strong></p>
      <p class="countdown-detail">${tr("kickoffCountdown")}: <strong>${countdownMarkup(match)}</strong></p>
    `;
  }

  const modelGrid = document.getElementById("modelGrid");
  modelGrid.hidden = !official;
  modelGrid.innerHTML = "";
  if (official) {
    modelGrid.innerHTML = officialModelCards(official, match);
  }

  renderDailyRead(match);
  renderPollPanel(match);
  loadPoll(match.id);

  const qwenResult = document.getElementById("qwenResult");
  if (qwenResult) {
    qwenResult.className = "qwen-result";
    qwenResult.textContent = "";
  }
}

function qwenPayload(match) {
  const resolved = resolvedTeams(match);
  if (!resolved.aCode || !resolved.bCode) return null;
  const prediction = match.prediction || predict(resolved.aCode, resolved.bCode, match.round);
  const makeTeam = (code) => ({
    code,
    name: teams[code].name,
    group: teams[code].group,
    languages: teams[code].languages,
    power: teams[code].power,
    attack: teams[code].attack,
    defense: teams[code].defense,
    form: teams[code].form,
    confed: teams[code].confed
  });

  return {
    id: match.id,
    round: match.round,
    group: match.group,
    date: match.date,
    kickoffAt: match.kickoffAt,
    venueLocalTime: match.venueLocalTime,
    officialMatchId: match.officialMatchId,
    officialVenue: match.officialVenue,
    timeSource: match.timeSource,
    venue: match.venue,
    slot: match.slot,
    teamA: makeTeam(resolved.aCode),
    teamB: makeTeam(resolved.bCode),
    localPrediction: {
      winnerCode: prediction.winner,
      winnerName: prediction.winner === "DRAW" ? "Draw" : teams[prediction.winner].name,
      score: prediction.score,
      confidence: prediction.confidence,
      votes: prediction.votes.map((vote) => ({
        model: vote.model,
        pickCode: vote.pick,
        pickName: teams[vote.pick].name,
        confidence: vote.confidence,
        reason: vote.reason
      }))
    }
  };
}

async function askQwen() {
  const match = tournament.matches.find((item) => item.id === activeMatchId);
  const button = document.getElementById("qwenButton");
  const result = document.getElementById("qwenResult");
  if (!match || !button || !result) return;
  const payload = qwenPayload(match);
  if (!payload) {
    result.className = "qwen-result is-error";
    result.textContent = "This bracket slot is not resolved yet.";
    return;
  }

  button.disabled = true;
  result.className = "qwen-result is-loading";
  result.textContent = "PAUL is reading this matchup...";

  try {
    const response = await fetch("/api/qwen-predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "PAUL request failed.");
    }

    const analysis = data.analysis || {};
    const winnerName = analysis.winnerName || analysis.winner || "No decision yet";
    const confidence = analysis.confidence ? `${analysis.confidence}%` : "N/A";
    const score = analysis.predictedScore || analysis.score || "N/A";
    const upsetRisk = analysis.upsetRisk || "Normal";
    const reasoning = analysis.reasoning || "PAUL did not return analysis text.";

    result.className = "qwen-result";
    result.innerHTML = `
      <p><strong>PAUL pick:</strong> ${winnerName} · confidence ${confidence} · score ${score}</p>
      <p><strong>Upset risk:</strong> ${upsetRisk}</p>
      <p>${reasoning}</p>
    `;

    const record = {
      matchId: match.id,
      generatedAt: data.generatedAt || new Date().toISOString(),
      model: "PAUL",
      analysis
    };
    automationState.predictions[match.id] = record;
    saveStoredPrediction(match.id, record);
    renderMatchList();
    renderPK();
  } catch (error) {
    result.className = "qwen-result is-error";
    result.textContent = error.message;
  } finally {
    button.disabled = false;
  }
}

async function syncAutomationSnapshot() {
  const matches = tournament.matches.map((match) => qwenPayload(match) || {
    id: match.id,
    round: match.round,
    group: match.group,
    date: match.date,
    kickoffAt: match.kickoffAt,
    venueLocalTime: match.venueLocalTime,
    officialMatchId: match.officialMatchId,
    officialVenue: match.officialVenue,
    timeSource: match.timeSource,
    venue: match.venue,
    slot: match.slot,
    aSlot: match.aSlot,
    bSlot: match.bSlot
  });
  try {
    await fetch("/api/automation/snapshot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matches })
    });
  } catch {
    // The static-only mode still works without the local automation server.
  }
}

function formatNextPrediction(nextPrediction) {
  if (!nextPrediction) return "None";
  if (!nextPrediction.dueAt) return `${nextPrediction.label} · Time pending`;
  const dueAt = new Date(nextPrediction.dueAt);
  if (Number.isNaN(dueAt.getTime())) return `${nextPrediction.label} · Time pending`;
  return `${nextPrediction.label} - ${tr("yourTime")}: ${formatDisplayDateTime(dueAt)} (${viewerTimeZoneLabel()})`;
}

function formatLocalizedNextPrediction(nextPrediction) {
  if (!nextPrediction) return tr("none");
  if (!nextPrediction.dueAt) return `${nextPrediction.label} · ${tr("timePending")}`;
  const dueAt = new Date(nextPrediction.dueAt);
  if (Number.isNaN(dueAt.getTime())) return `${nextPrediction.label} · ${tr("timePending")}`;
  return `${nextPrediction.label} - ${tr("yourTime")}: ${formatDisplayDateTime(dueAt)} (${viewerTimeZoneLabel()})`;
}

function formatNextPredictionSynced(nextPrediction) {
  if (!nextPrediction) return tr("none");
  if (!nextPrediction.dueAt) return `${nextPrediction.label} · ${tr("timePending")}`;
  const dueAt = new Date(nextPrediction.dueAt);
  if (Number.isNaN(dueAt.getTime())) return `${nextPrediction.label} · ${tr("timePending")}`;
  return `${nextPrediction.label} - ${tr("yourTime")}: ${formatDisplayDateTime(dueAt)} (${viewerTimeZoneLabel()})`;
}

formatNextPrediction = formatNextPredictionSynced;
formatLocalizedNextPrediction = formatNextPredictionSynced;

async function loadAutomationStatus() {
  const statusText = document.getElementById("automationStatus");
  try {
    const response = await fetch("/api/automation/status");
    const rawStatus = await response.text();
    let status;
    try {
      status = JSON.parse(rawStatus);
    } catch {
      throw new Error(`Automation status returned non-JSON (${response.status}): ${rawStatus.slice(0, 160)}`);
    }
    if (!response.ok) throw new Error(status.error || "Failed to load automation status.");

    const mergedPredictions = status.predictions || {};
    const nextPrediction = nextPredictionFromMatches(mergedPredictions, status.predictionLeadHours || 36) || status.nextPrediction;

    const stageAccuracy = status.stageAccuracy || automationState.stageAccuracy;
    setText("autoPredicted", Object.keys(mergedPredictions).length);
    setText("autoResults", status.resultCount || 0);
    setText("autoAccuracy", `${status.accuracy?.accuracy || 0}%`);
    setText("overallAccuracyStat", `${status.accuracy?.accuracy || 0}%`);
    setText("correctPicksStat", status.accuracy?.correct || 0);
    setText("autoNext", formatLocalizedNextPrediction(nextPrediction));
    const roundStats = stageAccuracy.rounds || {};
    setText("groupAccuracyStat", formatAccuracyBucket(stageAccuracy.group, { compact: true }));
    setText("knockoutAccuracyStat", formatAccuracyBucket(stageAccuracy.knockout, { compact: true }));
    setText("round32AccuracyStat", formatAccuracyBucket(roundStats["Round of 32"], { compact: true }));
    setText("round16AccuracyStat", formatAccuracyBucket(roundStats["Round of 16"], { compact: true }));
    setText("round32LabStat", formatAccuracyBucket(roundStats["Round of 32"]));
    setText("round16LabStat", formatAccuracyBucket(roundStats["Round of 16"]));
    setText("quarterAccuracyStat", formatAccuracyBucket(roundStats.Quarterfinal));
    setText("semiAccuracyStat", formatAccuracyBucket(roundStats.Semifinal));
    setText("thirdPlaceAccuracyStat", formatAccuracyBucket(roundStats["Third Place"]));
    setText("finalAccuracyStat", formatAccuracyBucket(roundStats.Final));
    setText("upsetHitsStat", `${stageAccuracy.upsets?.hit || 0}/${stageAccuracy.upsets?.called || 0}`);
    setText("proofVerifiedStat", stageAccuracy.proofVerified || status.auditCount || 0);
    const readiness = status.dataReadiness || {};
    const baselines = stageAccuracy.baselines || {};
    setText("marketBaselineStat", baselines.market?.graded ? `${baselines.market.accuracy}%` : tr("pending"));
    setText("ratingBaselineStat", baselines.rating?.graded ? `${baselines.rating.accuracy}%` : (readiness.teamRatings ? tr("pending") : tr("ratingsMissing")));
    const edge = baselines.paulVsMarket?.edge;
    setText("paulEdgeStat", Number.isFinite(edge) ? `${edge >= 0 ? "+" : ""}${edge}` : tr("pending"));
    const calibration = stageAccuracy.calibration || {};
    setText(
      "calibrationStat",
      calibration.graded ? `${calibration.actualAccuracy}% / ${calibration.averageConfidence}%` : `${tr("pending")} · 0 samples`
    );
    automationState = {
      predictions: mergedPredictions,
      results: status.results || {},
      dailyAnalysis: status.dailyAnalysis || automationState.dailyAnalysis || {},
      liveCorrections: status.liveCorrections || automationState.liveCorrections || {},
      mistakeMemory: status.mistakeMemory || automationState.mistakeMemory || null,
      marketTrace: status.marketTrace || automationState.marketTrace || {},
      accuracy: status.accuracy || automationState.accuracy,
      stageAccuracy
    };
    const traceEdge = publicTraceMarketEdge();
    if (traceEdge) {
      setText("paulEdgeStat", `${traceEdge.edge >= 0 ? "+" : ""}${traceEdge.edge}`);
    }
    updateChampionLabel();
    renderMatchList();
    renderPK();
    renderPublicTrace();
    renderHitList();

    const qwenState = status.hasQwenKey ? "PAUL AI ready" : "PAUL AI not connected";
    const resultState = status.hasResultsApi ? "Results API ready" : "Results API not connected";
    const evidenceState = readiness.evidenceCacheCount
      ? `${readiness.evidenceCacheCount} odds snapshots cached${readiness.latestEvidenceAt ? `, latest ${formatProofTime(readiness.latestEvidenceAt)}` : ""}`
      : "no cached odds snapshots yet";
    const dailyState = readiness.dailyAnalysisCount
      ? `${readiness.dailyAnalysisCount} daily PAUL reads cached${readiness.latestDailyReadAt ? `, latest ${formatProofTime(readiness.latestDailyReadAt)}` : ""}`
      : "no daily PAUL reads yet";
    const nextDaily = Array.isArray(readiness.nextDailyAnalysisDue) && readiness.nextDailyAnalysisDue.length
      ? readiness.nextDailyAnalysisDue[0]
      : null;
    const dailyDueState = Number(readiness.dailyAnalysisDueCount || 0)
      ? `daily due ${readiness.dailyAnalysisDueCount}${nextDaily ? `, next #${nextDaily.matchId} ${nextDaily.cadence}` : ""}`
      : "daily queue clear";
    const cronState = status.cronProtected ? "Cron protected" : "Cron secret missing";
    const oddsState = readiness.liveOddsProvider
      ? `live odds via ${readiness.liveOddsProvider}`
      : readiness.marketOdds
        ? "market odds loaded"
        : "market odds missing";
    const ratingState = readiness.teamRatings ? tr("ratingsLoaded") : tr("ratingsMissingStatus");
    statusText.textContent = `${qwenState}; ${cronState}; ${oddsState}; ${evidenceState}; ${dailyState}; ${dailyDueState}; ${ratingState}; ${resultState}; ${status.totalMatches || 0} fixtures loaded.`;
  } catch (error) {
    statusText.textContent = error.message;
    const trace = document.getElementById("publicTrace");
    if (trace) {
      trace.innerHTML = `<div class="empty-list">Match trace is temporarily unavailable: ${escapeHtml(error.message)}</div>`;
    }
  }
}

function shortHash(hash) {
  return hash ? `${hash.slice(0, 14)}...${hash.slice(-10)}` : "N/A";
}

function formatProofTime(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return formatDisplayDateTime(date, { year: "numeric" });
}

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
    .join(",")}}`;
}

async function sha256Hex(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function publicProofJson(entry) {
  const predictionSummary = proofPredictionSummary(entry.payload);
  return JSON.stringify({
    id: entry.id,
    version: entry.version,
    matchId: entry.matchId,
    match: entry.match,
    round: entry.round,
    prediction: predictionSummary,
    lockedAt: entry.lockedAt,
    kickoffAt: entry.kickoffAt,
    algorithm: entry.algorithm,
    hash: entry.hash,
    canonical: entry.canonical,
    payload: entry.payload,
    externalProof: entry.externalProof || null
  }, null, 2);
}

function proofPredictionSummary(payload) {
  const prediction = payload?.prediction || {};
  if (!prediction.winnerName && !prediction.winnerCode) return null;
  return {
    winnerName: prediction.winnerName || null,
    winnerCode: prediction.winnerCode || null,
    predictedScore: prediction.predictedScore || prediction.score || null,
    confidence: prediction.confidence ?? null,
    probabilities: prediction.probabilities || null
  };
}

function githubProof(externalProof) {
  return externalProof?.github || (externalProof?.provider === "github" ? externalProof : null);
}

function otsProof(externalProof) {
  return externalProof?.opentimestamps || (externalProof?.provider === "opentimestamps" ? externalProof : null);
}

function proofDownloadName(entry) {
  return `paul-proof-${entry.matchId || "match"}-${String(entry.hash || "hash").slice(0, 12)}.ots`;
}

function canonicalDownloadName(entry) {
  return `paul-proof-${entry.matchId || "match"}-${String(entry.hash || "hash").slice(0, 12)}.canonical.json`;
}

function downloadTextFile(text, filename, type = "application/json;charset=utf-8") {
  const blob = new Blob([text], { type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(link.href);
  link.remove();
}

function downloadCanonicalProof(entry) {
  if (!entry?.canonical) return;
  downloadTextFile(entry.canonical, canonicalDownloadName(entry));
}

function downloadOtsProof(entry) {
  const ots = otsProof(entry?.externalProof);
  if (!ots?.otsBase64) return;
  const bytes = Uint8Array.from(atob(ots.otsBase64), (char) => char.charCodeAt(0));
  const blob = new Blob([bytes], { type: "application/octet-stream" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = proofDownloadName(entry);
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(link.href);
  link.remove();
}

const fixedDemoProofJson = String.raw`{
  "id": "1:1bb71fdcec218484",
  "version": "paul-proof-v2",
  "matchId": 1,
  "match": "Mexico vs South Africa",
  "round": "Group Stage",
  "lockedAt": "2026-06-02T14:34:50.196Z",
  "kickoffAt": "2026-06-11T20:00:00.000Z",
  "algorithm": "sha256",
  "hash": "1bb71fdcec218484418bd16b11e2366d27a976cc17136a95e7ccc83c33ebacc0",
  "canonical": "{\"evidence\":{\"form\":null,\"generatedAt\":\"2026-06-02T14:34:50.196Z\",\"hasPrimaryEvidence\":true,\"market\":{\"bookmakerCount\":3,\"eventId\":\"demo-match-1\",\"odds\":{\"away\":3.9,\"draw\":3.55,\"home\":2.05},\"probabilities\":{\"away\":0.23,\"draw\":0.253,\"home\":0.437},\"provider\":\"server demo\",\"sampleBookmakers\":[\"DemoBook A\",\"DemoBook B\",\"DemoBook C\"],\"source\":\"demo\",\"updatedAt\":\"2026-06-02T14:34:50.196Z\"},\"missing\":[],\"ratings\":null,\"searchFallback\":false},\"kickoffAt\":\"2026-06-11T20:00:00.000Z\",\"lockedAt\":\"2026-06-02T14:34:50.196Z\",\"match\":\"Mexico vs South Africa\",\"matchId\":1,\"model\":\"PAUL-DEMO\",\"nonce\":\"79a4906603800af68ac374a0cfc64613\",\"prediction\":{\"confidence\":57,\"evidenceUsed\":[\"demo odds snapshot\",\"OpenTimestamps demo\"],\"predictedScore\":\"2-1\",\"probabilities\":{\"away\":25,\"draw\":27,\"home\":48},\"reasoning\":\"Synthetic server-generated proof used to test OpenTimestamps without writing production data.\",\"upsetRisk\":\"Demo only\",\"winnerCode\":\"MEX\",\"winnerName\":\"Mexico\"},\"round\":\"Group Stage\",\"teams\":{\"away\":{\"code\":\"RSA\",\"name\":\"South Africa\"},\"home\":{\"code\":\"MEX\",\"name\":\"Mexico\"}},\"version\":\"paul-proof-v2\"}",
  "payload": {
    "version": "paul-proof-v2",
    "matchId": 1,
    "round": "Group Stage",
    "match": "Mexico vs South Africa",
    "teams": {
      "home": {
        "code": "MEX",
        "name": "Mexico"
      },
      "away": {
        "code": "RSA",
        "name": "South Africa"
      }
    },
    "kickoffAt": "2026-06-11T20:00:00.000Z",
    "lockedAt": "2026-06-02T14:34:50.196Z",
    "model": "PAUL-DEMO",
    "prediction": {
      "winnerCode": "MEX",
      "winnerName": "Mexico",
      "confidence": 57,
      "predictedScore": "2-1",
      "probabilities": {
        "home": 48,
        "draw": 27,
        "away": 25
      },
      "upsetRisk": "Demo only",
      "reasoning": "Synthetic server-generated proof used to test OpenTimestamps without writing production data.",
      "evidenceUsed": [
        "demo odds snapshot",
        "OpenTimestamps demo"
      ]
    },
    "evidence": {
      "generatedAt": "2026-06-02T14:34:50.196Z",
      "hasPrimaryEvidence": true,
      "missing": [],
      "market": {
        "source": "demo",
        "provider": "server demo",
        "eventId": "demo-match-1",
        "updatedAt": "2026-06-02T14:34:50.196Z",
        "bookmakerCount": 3,
        "sampleBookmakers": [
          "DemoBook A",
          "DemoBook B",
          "DemoBook C"
        ],
        "odds": {
          "home": 2.05,
          "draw": 3.55,
          "away": 3.9
        },
        "probabilities": {
          "home": 0.437,
          "draw": 0.253,
          "away": 0.23
        }
      },
      "ratings": null,
      "form": null,
      "searchFallback": false
    },
    "nonce": "79a4906603800af68ac374a0cfc64613"
  },
  "externalProof": {
    "github": null,
    "opentimestamps": {
      "provider": "opentimestamps",
      "status": "pending-bitcoin-confirmation",
      "createdAt": "2026-06-02T14:34:51.302Z",
      "hash": "1bb71fdcec218484418bd16b11e2366d27a976cc17136a95e7ccc83c33ebacc0",
      "otsBase64": "AE9wZW5UaW1lc3RhbXBzAABQcm9vZgC/ieLohOiSlAEIG7cf3OwhhIRBi9FrEeI2bSepdswXE2qV58zIPDPrrMDwEB8luUujemVj5iVQvX2ucb8I//AIh8WYeENJQfUI8SAR8mWR3Ld7wtYd2BIDQhOFUy7ogC278+RTfzSBWeqEqgjwEGSzJwdlzTV1VEs6MapbYyoI8SDsiPjcaAWI9cWcvNTmZgOuW2Mq5ikRZZ7YjnictdRVWQjwIFuv6H6iRUoyZ8I0wlO+cpJWWEM+eJNc6GljNbPIsLarCPEEah7qCvAI3LGNWrGM3TgAg9/jDS75DI4uLWh0dHBzOi8vYWxpY2UuYnRjLmNhbGVuZGFyLm9wZW50aW1lc3RhbXBzLm9yZ//wCDBHjDhpVIX5CPAQ6drEG7+FSeq2w3Yt/CQPSAjxIC4zogz3fjur+VXCKKRWa6+cgatAVq38JLnY++HaXHwxCPAgcH2LngBY/J7NI39WQjrXZaA6vyETs1NHO0cxbW+Y1R8I8QRqHuoK8Ah7gGygZVDquACD3+MNLvkMjiwraHR0cHM6Ly9ib2IuYnRjLmNhbGVuZGFyLm9wZW50aW1lc3RhbXBzLm9yZ//wEHwRDr+qfr2CD88b2M0YfdwI8CBSQHTj2o+JOxPsszvq654875TKdUdCjGc3VaPGruovZAjwIC8J4jTHRdr9gt3MZCHqWP+P3FAZ6wuInozdy4gzfY6hCPEEah7qC/AINUYC0UyrdYUAg9/jDS75DI4pKGh0dHBzOi8vZmlubmV5LmNhbGVuZGFyLmV0ZXJuaXR5d2FsbC5jb23wEHjhp3uoNDT0eqnDrpWebIEI8CB5uKjDIBzPUflRfXZ68V8sOuAnTOf8ssRk3X5rbNGGaQjxBGoe6grwCI/nWWz7mVouAIPf4w0u+QyOIyJodHRwczovL2J0Yy5jYWxlbmRhci5jYXRhbGxheHkuY29t",
      "otsBytes": 735,
      "note": "OpenTimestamps proof created from the SHA-256 hash of canonical proof JSON. It may need later upgrading before Bitcoin block verification is final."
    },
    "demo": {
      "provider": "demo",
      "note": "Server-generated owner demo. Not stored, not official."
    }
  }
}`;

function demoProofJson() {
  return fixedDemoProofJson;
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Some embedded browsers expose Clipboard API but block it by permission.
    }
  }
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.width = "1px";
  textarea.style.height = "1px";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);
  const copied = document.execCommand("copy");
  textarea.remove();
  return copied;
}

async function loadDemoProof() {
  const status = document.getElementById("copyProofStatus");
  setProofVerifierInput(demoProofJson());
  if (status) status.textContent = tr("demoProofLoaded");
}

function setProofVerifierInput(value) {
  const input = document.getElementById("proofInput");
  const status = document.getElementById("copyProofStatus");
  if (input) input.value = value;
  if (status) status.textContent = tr("proofJsonLoaded");
}

function proofIsKnockout(entry) {
  return entry.round && entry.round !== "Group Stage";
}

function proofMatchesLedgerFilters(entry) {
  const roundFilter = document.getElementById("proofRoundFilter")?.value || "All";
  const search = (document.getElementById("proofSearchBox")?.value || "").trim().toLowerCase();
  if (roundFilter === "Group Stage" && entry.round !== "Group Stage") return false;
  if (roundFilter === "Knockout" && !proofIsKnockout(entry)) return false;
  if (!search) return true;
  const haystack = [
    entry.id,
    entry.matchId,
    entry.match,
    entry.round,
    entry.hash,
    entry.lockedAt,
    entry.kickoffAt,
    entry.payload?.prediction?.winnerName,
    entry.payload?.prediction?.winnerCode,
    entry.payload?.teams?.home?.name,
    entry.payload?.teams?.away?.name
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(search);
}

function updateProofLedger(entries, filteredEntries, visibleEntries) {
  const total = entries.length;
  const group = entries.filter((entry) => entry.round === "Group Stage").length;
  const knockout = entries.filter(proofIsKnockout).length;
  const ots = entries.filter((entry) => Boolean(otsProof(entry.externalProof)?.otsBase64)).length;
  const totalStat = document.getElementById("proofTotalStat");
  const groupStat = document.getElementById("proofGroupStat");
  const knockoutStat = document.getElementById("proofKnockoutStat");
  const otsStat = document.getElementById("proofOtsStat");
  const status = document.getElementById("proofLedgerStatus");
  const toggle = document.getElementById("proofToggleButton");
  if (totalStat) totalStat.textContent = String(total);
  if (groupStat) groupStat.textContent = String(group);
  if (knockoutStat) knockoutStat.textContent = String(knockout);
  if (otsStat) otsStat.textContent = String(ots);
  if (toggle) {
    toggle.hidden = filteredEntries.length <= proofLedgerLimit;
    toggle.textContent = proofLedgerExpanded ? `${tr("showLatest")} ${proofLedgerLimit}` : `${tr("showAll")} ${filteredEntries.length}`;
  }
  if (status) {
    if (!total) {
      status.textContent = tr("noLockedProofs");
    } else if (!filteredEntries.length) {
      status.textContent = `${tr("noMatchingProofs")}. ${total} ${tr("retainedProofs")}.`;
    } else if (visibleEntries.length === filteredEntries.length) {
      status.textContent = `${tr("showing")} ${visibleEntries.length} ${tr("of")} ${total} ${tr("retainedProofs")}.`;
    } else {
      status.textContent = `${tr("showing")} ${tr("latest")} ${visibleEntries.length} ${tr("of")} ${filteredEntries.length} ${tr("matchingProofs")}. ${total} ${tr("retainedProofs")}.`;
    }
  }
}

function proofCardMarkup(entry) {
  const github = githubProof(entry.externalProof);
  const ots = otsProof(entry.externalProof);
  const prediction = entry.payload?.prediction;
  const githubLine = github?.commitUrl
    ? `<a href="${github.commitUrl}" target="_blank" rel="noreferrer">GitHub commit</a>`
    : github?.error
      ? `<span>${tr("githubPending")}: ${github.error}</span>`
      : `<span>${tr("noGithubTimestamp")}</span>`;
  const otsLine = ots?.otsBase64
    ? `<span>OpenTimestamps .ots ready (${ots.otsBytes || "N/A"} bytes)</span>`
    : ots?.error
      ? `<span>${tr("otsPending")}: ${ots.error}</span>`
      : `<span>${tr("noOtsProof")}</span>`;
  return `
    <article class="proof-card">
      <div class="proof-card__top">
        <span class="winner-pill">${entry.verified ? tr("hashVerified") : tr("hashMismatch")}</span>
        <span class="winner-pill ${entry.isBeforeKickoff ? "" : "winner-pill--warn"}">${entry.isBeforeKickoff ? tr("beforeKickoff") : tr("checkTime")}</span>
        ${ots?.otsBase64 ? `<span class="winner-pill">${tr("otsReceipt")}</span>` : ""}
      </div>
      <div class="proof-card__heading">
        <h3>#${entry.matchId} ${entry.match}</h3>
        <button class="button button--ghost proof-copy-button" type="button" data-proof-id="${entry.id}">${tr("copyJson")}</button>
      </div>
      <dl>
        <div><dt>${tr("round")}</dt><dd>${entry.round || tr("unknown")}</dd></div>
        ${prediction?.winnerName ? `<div><dt>${tr("pick")}</dt><dd>${prediction.winnerName}${prediction.predictedScore ? ` · ${prediction.predictedScore}` : ""}</dd></div>` : ""}
        <div><dt>${tr("lockedAt")}</dt><dd>${formatProofTime(entry.lockedAt)}</dd></div>
        <div><dt>${tr("kickoff")}</dt><dd>${formatProofTime(entry.kickoffAt)}</dd></div>
        <div><dt>SHA-256</dt><dd><code>${shortHash(entry.hash)}</code></dd></div>
        <div><dt>${tr("githubProof")}</dt><dd>${githubLine}</dd></div>
        <div><dt>OpenTimestamps</dt><dd>${otsLine}</dd></div>
      </dl>
      <div class="proof-card__actions">
        <button class="button button--ghost proof-load-button" type="button" data-proof-id="${entry.id}">${tr("loadInVerifier")}</button>
        <button class="button button--ghost proof-canonical-button" type="button" data-proof-id="${entry.id}">${tr("downloadCanonical")}</button>
        ${ots?.otsBase64 ? `<button class="button button--ghost proof-ots-button" type="button" data-proof-id="${entry.id}">${tr("downloadOts")}</button>` : ""}
        ${ots?.otsBase64 ? `<a class="button button--ghost" href="https://opentimestamps.org/" target="_blank" rel="noreferrer">${tr("openOtsVerifier")}</a>` : ""}
      </div>
    </article>
  `;
}

function bindProofCardActions(grid) {
  grid.querySelectorAll(".proof-copy-button").forEach((button) => {
    button.addEventListener("click", async () => {
      const entry = publicProofEntries.find((item) => item.id === button.dataset.proofId);
      if (!entry) return;
      const originalText = button.textContent;
      button.disabled = true;
      const proofJson = publicProofJson(entry);
      const status = document.getElementById("copyProofStatus");
      try {
        const copied = await copyText(proofJson);
        if (!copied) throw new Error("Copy blocked");
        button.textContent = tr("copied");
        if (status) status.textContent = `${tr("copiedProofForMatch")} #${entry.matchId}.`;
      } catch {
        setProofVerifierInput(proofJson);
        if (status) status.textContent = tr("copyBlockedLoaded");
        document.getElementById("proofVerifier")?.scrollIntoView({ behavior: "smooth", block: "start" });
      } finally {
        window.setTimeout(() => {
          button.disabled = false;
          button.textContent = originalText;
        }, 1400);
      }
    });
  });

  grid.querySelectorAll(".proof-load-button").forEach((button) => {
    button.addEventListener("click", () => {
      const entry = publicProofEntries.find((item) => item.id === button.dataset.proofId);
      if (!entry) return;
      setProofVerifierInput(publicProofJson(entry));
      document.getElementById("proofVerifier")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  grid.querySelectorAll(".proof-ots-button").forEach((button) => {
    button.addEventListener("click", () => {
      const entry = publicProofEntries.find((item) => item.id === button.dataset.proofId);
      if (entry) downloadOtsProof(entry);
    });
  });

  grid.querySelectorAll(".proof-canonical-button").forEach((button) => {
    button.addEventListener("click", () => {
      const entry = publicProofEntries.find((item) => item.id === button.dataset.proofId);
      if (entry) downloadCanonicalProof(entry);
    });
  });
}

function renderProofs(entries) {
  const grid = document.getElementById("proofGrid");
  if (!grid) return;
  publicProofEntries = entries;
  renderHitList();
  const filteredEntries = entries.filter(proofMatchesLedgerFilters);
  const visibleEntries = proofLedgerExpanded ? filteredEntries : filteredEntries.slice(0, proofLedgerLimit);
  updateProofLedger(entries, filteredEntries, visibleEntries);

  if (!entries.length) {
    grid.innerHTML = `
      <article class="proof-card">
        <h3>${tr("noLockedProofs")}</h3>
        <p>${tr("proofsAppear")}</p>
      </article>
    `;
    return;
  }

  if (!filteredEntries.length) {
    grid.innerHTML = `
      <article class="proof-card">
        <h3>${tr("noMatchingProofs")}</h3>
        <p>${tr("noProofsMatchCopy")}</p>
      </article>
    `;
    return;
  }

  grid.innerHTML = visibleEntries.map(proofCardMarkup).join("");
  bindProofCardActions(grid);
}

async function loadAuditProofs() {
  try {
    const response = await fetch("/api/audit");
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to load proof records.");
    renderProofs(data.entries || []);
  } catch (error) {
    renderProofs([]);
    const grid = document.getElementById("proofGrid");
    if (grid) {
      grid.innerHTML = `
        <article class="proof-card">
          <h3>${tr("proofServiceUnavailable")}</h3>
          <p>${error.message}</p>
        </article>
      `;
    }
  }
}

async function verifyProofInput() {
  const input = document.getElementById("proofInput");
  const result = document.getElementById("proofVerifyResult");
  const status = document.getElementById("copyProofStatus");
  if (!input || !result) return;
  const raw = input.value.trim();
  if (!raw) {
    result.innerHTML = `<div class="proof-result-card is-fail"><strong>Missing proof JSON</strong><span>Paste a proof object first.</span></div>`;
    return;
  }

  try {
    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = null;
    }
    const canonical = parsed?.canonical || (parsed?.payload ? stableStringify(parsed.payload) : raw);
    const expectedHash = parsed?.hash || "";
    const actualHash = await sha256Hex(canonical);
    const canonicalPayload = parsed?.canonical ? JSON.parse(parsed.canonical) : parsed?.payload || parsed;
    const submittedPayload = parsed?.payload || canonicalPayload;
    const payloadMatchesCanonical = parsed?.payload ? stableStringify(parsed.payload) === canonical : true;
    const hasPredictionSummary = parsed ? Object.prototype.hasOwnProperty.call(parsed, "prediction") : false;
    const canonicalPredictionSummary = proofPredictionSummary(canonicalPayload);
    const predictionSummaryMatchesCanonical = hasPredictionSummary
      ? stableStringify(parsed.prediction) === stableStringify(canonicalPredictionSummary)
      : true;
    const envelopeMatchesCanonical = parsed
      ? ["matchId", "round", "match", "lockedAt", "kickoffAt"].every((key) => parsed[key] === undefined || parsed[key] === canonicalPayload?.[key])
      : true;
    const proofStructureOk = payloadMatchesCanonical && envelopeMatchesCanonical && predictionSummaryMatchesCanonical;
    const payload = canonicalPayload;
    const lockedAt = payload?.lockedAt;
    const kickoffAt = payload?.kickoffAt;
    const timeOk = lockedAt && kickoffAt ? new Date(lockedAt).getTime() < new Date(kickoffAt).getTime() : null;
    const hashOk = expectedHash ? actualHash === expectedHash && proofStructureOk : null;
    const evidence = payload?.evidence || {};
    const market = evidence.market || {};
    const odds = market.odds || {};
    const github = githubProof(parsed?.externalProof);
    const ots = otsProof(parsed?.externalProof);
    const otsDownloadHref = ots?.otsBase64 && /^[A-Za-z0-9+/=]+$/.test(ots.otsBase64)
      ? `data:application/octet-stream;base64,${ots.otsBase64}`
      : "";
    const otsDownloadName = `paul-proof-${payload?.matchId || parsed?.matchId || "demo"}-${String(expectedHash || actualHash).slice(0, 12)}.ots`;
    const canonicalDownloadName = `paul-proof-${payload?.matchId || parsed?.matchId || "demo"}-${String(expectedHash || actualHash).slice(0, 12)}.canonical.json`;
    const canonicalDownloadHref = `data:application/json;charset=utf-8,${encodeURIComponent(canonical)}`;
    const hasExternalTimestamp = Boolean(github?.commitUrl || ots?.otsBase64);
    const external = [
      github?.commitUrl
        ? `<a href="${github.commitUrl}" target="_blank" rel="noreferrer">GitHub commit timestamp</a>`
        : github?.error
          ? `GitHub pending: ${github.error}`
          : null,
      ots?.otsBase64
        ? `OpenTimestamps .ots ready (${ots.otsBytes || "N/A"} bytes; ${ots.status || "pending"})`
        : ots?.error
          ? `OpenTimestamps pending: ${ots.error}`
          : null,
      parsed?.externalProof?.demo?.note || parsed?.externalProof?.note || null
    ].filter(Boolean).join("<br>") || "No external timestamp in this proof JSON";

    result.innerHTML = `
      <div class="proof-result-grid">
        <article class="proof-result-card ${hashOk === false ? "is-fail" : "is-pass"}">
          <strong>${hashOk === null ? "HASH CALCULATED" : hashOk ? "HASH MATCH" : "HASH MISMATCH"}</strong>
          <span>Calculated SHA-256: <code>${actualHash}</code></span>
          ${expectedHash ? `<span>Expected hash: <code>${expectedHash}</code></span>` : "<span>No expected hash was included; use this calculated hash for manual comparison.</span>"}
        </article>
        <article class="proof-result-card ${proofStructureOk ? "is-pass" : "is-fail"}">
          <strong>${proofStructureOk ? "PROOF STRUCTURE MATCH" : "PROOF STRUCTURE TAMPERED"}</strong>
          <span>Payload vs canonical: ${payloadMatchesCanonical ? "match" : "mismatch"}</span>
          <span>Outer fields vs canonical: ${envelopeMatchesCanonical ? "match" : "mismatch"}</span>
          <span>Prediction summary vs canonical: ${predictionSummaryMatchesCanonical ? "match" : "mismatch"}</span>
          <span>The hash is valid only for the canonical JSON. Edited outer fields do not count.</span>
        </article>
        <article class="proof-result-card ${timeOk === false ? "is-fail" : "is-warn"}">
          <strong>${timeOk === null ? "SELF-DECLARED TIME UNKNOWN" : timeOk ? "SELF-DECLARED BEFORE KICKOFF" : "SELF-DECLARED TIME FAILED"}</strong>
          <span>Locked: ${formatProofTime(lockedAt)}</span>
          <span>Kickoff: ${formatProofTime(kickoffAt)}</span>
          <span>This timestamp is only trusted if an independent public timestamp also exists.</span>
        </article>
        <article class="proof-result-card ${hasExternalTimestamp ? "is-pass" : "is-warn"}">
          <strong>${hasExternalTimestamp ? "PUBLIC TIMESTAMP FOUND" : "NO INDEPENDENT TIMESTAMP"}</strong>
          <span>${external}</span>
          <span>${hasExternalTimestamp ? "GitHub and/or OpenTimestamps can be checked outside this site." : "Hash is valid, but the lockedAt value could still be backdated without an external timestamp."}</span>
        </article>
        <article class="proof-result-card ${ots?.otsBase64 ? "is-pass" : "is-warn"}">
          <strong>${ots?.otsBase64 ? "OPENTIMESTAMPS PROOF READY" : "NO OPENTIMESTAMPS PROOF"}</strong>
          <span>${ots?.otsBase64 ? `Download both files, open the official verifier, then drop the canonical JSON and .ots proof.` : "Official predictions will try to create an .ots proof automatically."}</span>
          <a class="button button--ghost proof-download-inline" download="${canonicalDownloadName}" href="${canonicalDownloadHref}">Download canonical JSON</a>
          ${otsDownloadHref ? `<a class="button button--ghost proof-download-inline" download="${otsDownloadName}" href="${otsDownloadHref}">Download loaded .ots</a>` : ""}
          ${ots?.otsBase64 ? `<a class="button button--ghost proof-download-inline" href="https://opentimestamps.org/" target="_blank" rel="noreferrer">Open OTS verifier</a>` : ""}
          <span>${ots?.note || "OpenTimestamps proofs may start as calendar attestations and need later upgrade to a Bitcoin block."}</span>
        </article>
        <article class="proof-result-card">
          <strong>${payload?.match || parsed?.match || "PAUL proof"}</strong>
          <span>Match #${payload?.matchId || parsed?.matchId || "N/A"} · ${payload?.round || parsed?.round || "N/A"}</span>
          <span>Pick: ${payload?.prediction?.winnerName || payload?.prediction?.winnerCode || "N/A"} · Score ${payload?.prediction?.predictedScore || "N/A"}</span>
          ${proofStructureOk
            ? `<span>${external}</span>`
            : `<span>Canonical lockedAt is ${formatProofTime(payload?.lockedAt)}. Submitted payload lockedAt is ${formatProofTime(submittedPayload?.lockedAt)}.</span>`}
        </article>
        <article class="proof-result-card">
          <strong>Evidence Snapshot</strong>
          <span>Market source: ${market.source || "N/A"} ${market.provider ? `(${market.provider})` : ""}</span>
          <span>Bookmakers: ${market.bookmakerCount || "N/A"}${market.sampleBookmakers?.length ? ` · ${market.sampleBookmakers.join(", ")}` : ""}</span>
          <span>1X2 odds: ${odds.home || "N/A"} / ${odds.draw || "N/A"} / ${odds.away || "N/A"}</span>
        </article>
      </div>
    `;
    if (status) status.textContent = tr("proofVerificationComplete");
  } catch (error) {
    result.innerHTML = `<div class="proof-result-card is-fail"><strong>Verification failed</strong><span>${error.message}</span></div>`;
  }
}

function clearProofVerifier() {
  const input = document.getElementById("proofInput");
  const result = document.getElementById("proofVerifyResult");
  const status = document.getElementById("copyProofStatus");
  if (input) input.value = "";
  if (result) result.innerHTML = "";
  if (status) status.textContent = tr("noProofLoaded");
}

function renderVerifyReport(data) {
  const report = document.getElementById("verifyReport");
  if (!report) return;
  const checks = Object.entries(data.checks || {});
  const groups = data.trace?.groups || {};
  const rounds = data.trace?.rounds || {};
  const knockoutRounds = ["Round of 32", "Round of 16", "Quarterfinal", "Semifinal", "Third Place", "Final"];
  report.innerHTML = `
    <div class="verify-summary ${data.status === "pass" ? "is-pass" : "is-fail"}">
      <strong>${String(data.status || "unknown").toUpperCase()}</strong>
      <span>Results provider: ${data.provider?.name || "none"} (${data.provider?.configured ? "configured" : "not configured"})</span>
    </div>
    <p class="verify-note">${data.trace?.explanation || "Dry-run uses synthetic results to validate mechanics."}</p>
    <h3 class="verify-title">System Checks</h3>
    <div class="verify-checks">
      ${checks
        .map(([key, value]) => `
          <div class="verify-check ${value ? "is-pass" : "is-fail"}">
            <span>${value ? "PASS" : "FAIL"}</span>
            <strong>${key}</strong>
          </div>
        `)
        .join("")}
    </div>
    <h3 class="verify-title">Group Tables</h3>
    <div class="verify-groups">
      ${Object.entries(groups)
        .map(([group, rows]) => `
          <article class="verify-group">
            <h4>Group ${group}</h4>
            <table>
              <thead><tr><th>Team</th><th>Pts</th><th>GD</th><th>GF</th></tr></thead>
              <tbody>
                ${rows
                  .map((row) => `<tr><td>${row.name}</td><td>${row.points}</td><td>${row.gd}</td><td>${row.gf}</td></tr>`)
                  .join("")}
              </tbody>
            </table>
          </article>
        `)
        .join("")}
    </div>
    <h3 class="verify-title">Knockout Trace</h3>
    <div class="verify-rounds">
      ${knockoutRounds
        .map((round) => `
          <article class="verify-round">
            <h4>${round}</h4>
            ${(rounds[round] || [])
              .map((match) => `
                <div class="verify-match">
                  <span>#${match.id}</span>
                  <strong>${match.home} ${match.score} ${match.away}</strong>
                  <em>Winner: ${match.winner}</em>
                </div>
              `)
              .join("")}
          </article>
        `)
        .join("")}
    </div>
    <h3 class="verify-title">Proof Sample</h3>
    <pre>${JSON.stringify(data.sample?.proof || {}, null, 2)}</pre>
  `;
}

function renderResultsHealth(data) {
  const report = document.getElementById("resultsHealthReport");
  if (!report) return;
  const checks = data.checks || [];
  report.innerHTML = `
    <div class="verify-summary ${data.status === "pass" ? "is-pass" : "is-fail"}">
      <strong>RESULT SOURCES ${String(data.status || "unknown").toUpperCase()}</strong>
      <span>${data.providerName || "none"} · production writes: ${data.writesProductionData ? "yes" : "no"}</span>
    </div>
    <div class="verify-health-grid">
      ${checks
        .map((check) => `
          <article class="verify-health-card ${check.ok ? "is-pass" : "is-fail"}">
            <span>${check.ok ? "PASS" : check.skipped ? "SKIP" : "FAIL"}</span>
            <h3>${check.provider}</h3>
            <p>${check.reason || check.error || `HTTP ${check.status || "N/A"} · ${check.elapsedMs ?? "N/A"}ms`}</p>
            ${check.matchCount !== undefined ? `<p>Matches returned: <strong>${check.matchCount}</strong></p>` : ""}
          </article>
        `)
        .join("")}
    </div>
    <div class="verify-safe-check ${data.safeBeforeKickoff ? "is-pass" : "is-fail"}">
      <strong>${data.safeBeforeKickoff ? "PASS" : "FAIL"}</strong>
      <span>Before kickoff safety: ${data.firstPlayable?.label || "N/A"} returns ${data.firstMatchResult ? "a result" : "null"}, so unfinished 0-0 scores ${data.safeBeforeKickoff ? "will not be saved" : "may be saved"}.</span>
    </div>
    <pre>${JSON.stringify({
      generatedAt: data.generatedAt,
      providers: data.providers,
      firstPlayable: data.firstPlayable,
      safeBeforeKickoff: data.safeBeforeKickoff
    }, null, 2)}</pre>
  `;
}

function metricCard(name, metric) {
  return `
    <article class="verify-health-card ${metric?.accuracy >= 50 ? "is-pass" : ""}">
      <span>${name}</span>
      <h3>${metric?.accuracy ?? 0}%</h3>
      <p>${metric?.correct ?? 0}/${metric?.graded ?? 0} correct · Brier ${metric?.brier ?? "N/A"}</p>
    </article>
  `;
}

function datasetBacktestCard(run) {
  const paul = run.metrics?.paul || {};
  const market = run.metrics?.market || {};
  const edge = run.edge?.paulMinusMarket ?? 0;
  return `
    <article class="verify-health-card ${edge >= 0 ? "is-pass" : "is-fail"}">
      <span>${run.year} · ${run.role}</span>
      <h3>${paul.accuracy ?? 0}%</h3>
      <p>PAUL ${paul.correct ?? 0}/${paul.graded ?? 0} · Market ${market.correct ?? 0}/${market.graded ?? 0} · Edge ${edge >= 0 ? "+" : ""}${edge}</p>
      <p>${run.dataset?.coverage || ""}</p>
    </article>
  `;
}

function pickDisplay(match, side) {
  if (side === "home") return match.match?.split(" vs ")[0] || "Home";
  if (side === "away") return match.match?.split(" vs ")[1] || "Away";
  if (side === "draw") return "Draw";
  return side || "N/A";
}

function marketImpact(match) {
  const paulCorrect = match.picks?.paul === match.actual ? 1 : 0;
  const marketCorrect = match.picks?.market === match.actual ? 1 : 0;
  return paulCorrect - marketCorrect;
}

function stabilityCard(title, value, copy, pass = true) {
  return `
    <article class="verify-health-card ${pass ? "is-pass" : "is-fail"}">
      <span>${title}</span>
      <h3>${value}</h3>
      <p>${copy}</p>
    </article>
  `;
}

function renderBacktestReport(data) {
  const report = document.getElementById("backtestReport");
  if (!report) return;
  const metrics = data.metrics || {};
  const calibration = data.calibration || {};
  const holdout = data.holdout || {};
  const holdoutMetrics = holdout.metrics || {};
  const stability = data.stability || {};
  const stabilitySummary = stability.summary || {};
  const bootstrap = stability.bootstrap || {};
  const leagueHoldout = data.leagueHoldout || null;
  const leagueMetrics = leagueHoldout?.metrics || {};
  const crossCompetition = data.crossCompetition || null;
  const crossMetrics = crossCompetition?.metrics || {};
  report.innerHTML = `
    <div class="verify-summary ${data.status === "pass" ? "is-pass" : "is-fail"}">
      <strong>BACKTEST ${String(data.status || "unknown").toUpperCase()}</strong>
      <span>${data.algorithm?.name || "PAUL Edge"} · ${data.dataset?.name || "Historical dataset"} · ${data.dataset?.matches || 0} matches</span>
    </div>
    <p class="verify-note">
      Source: CheckBestOdds archived 1X2 odds, the 2006 TIB/Leibniz ODDSET appendix, and stored final scores. 2022 is the tuning sample; 2018, 2014, 2010, and 2006 are holdout checks with the public archived odds coverage shown below.
      ${data.algorithm?.changes?.length ? `Changes: ${data.algorithm.changes.join("; ")}.` : ""}
    </p>
    <h3 class="verify-title">Holdout Summary</h3>
    <div class="verify-health-grid">
      ${metricCard("PAUL Edge holdout", holdoutMetrics.paul)}
      ${metricCard("Market holdout", holdoutMetrics.market)}
      ${metricCard("Rating holdout", holdoutMetrics.rating)}
      ${metricCard("Poisson holdout", holdoutMetrics.poisson)}
      ${metricCard("Blended holdout", holdoutMetrics.blended)}
      <article class="verify-health-card ${(holdout.edge?.paulMinusMarket ?? 0) >= 0 ? "is-pass" : "is-fail"}">
        <span>Holdout edge</span>
        <h3>${(holdout.edge?.paulMinusMarket ?? 0) >= 0 ? "+" : ""}${holdout.edge?.paulMinusMarket ?? 0}</h3>
        <p>PAUL vs market · ${holdout.edge?.upsetHits ?? 0}/${holdout.edge?.upsetCalls ?? 0} override hits</p>
      </article>
    </div>
    <h3 class="verify-title">Dataset Breakdown</h3>
    <div class="verify-health-grid">
      ${(data.datasets || []).map(datasetBacktestCard).join("")}
      ${(data.leagueDatasets || []).map(datasetBacktestCard).join("")}
    </div>
    <h3 class="verify-title">Stability Audit</h3>
    <p class="verify-note">${stability.verdict || "Stability audit is not available for this run."}</p>
    <div class="verify-health-grid">
      ${stabilityCard(
        "Holdout years",
        `${stabilitySummary.nonNegativeYears ?? 0}/${stabilitySummary.holdoutYears ?? 0}`,
        `Years where PAUL tied or beat market. Min yearly edge ${stabilitySummary.minYearEdge ?? 0}.`,
        (stabilitySummary.nonNegativeYears ?? 0) === (stabilitySummary.holdoutYears ?? 1)
      )}
      ${stabilityCard(
        "Holdout total edge",
        `${(stabilitySummary.totalEdge ?? 0) >= 0 ? "+" : ""}${stabilitySummary.totalEdge ?? 0}`,
        `${stabilitySummary.totalMatches ?? 0} holdout matches.`,
        (stabilitySummary.totalEdge ?? 0) >= 0
      )}
      ${stabilityCard(
        "Bootstrap edge",
        `${bootstrap.nonNegativeRate ?? 0}%`,
        `${bootstrap.iterations ?? 0} resamples; edge range p05/p50/p95: ${bootstrap.edgeP05 ?? 0}/${bootstrap.edgeP50 ?? 0}/${bootstrap.edgeP95 ?? 0}.`,
        (bootstrap.nonNegativeRate ?? 0) >= 70
      )}
    </div>
    <h3 class="verify-title">Cross-Competition Holdout</h3>
    <p class="verify-note">
      Premier League seasons are fetched from Football-Data public CSV files when available. League matches use a conservative market-anchor mode with rolling Elo/form only from earlier matches; the World Cup holdout keeps the tournament upset layer.
      ${data.leagueErrors?.length ? ` League fetch warnings: ${data.leagueErrors.join("; ")}.` : ""}
    </p>
    <div class="verify-health-grid">
      ${leagueHoldout ? metricCard("Premier League PAUL", leagueMetrics.paul) : stabilityCard("Premier League", "N/A", "Football-Data CSV was not available for this run.", false)}
      ${leagueHoldout ? metricCard("Premier League market", leagueMetrics.market) : ""}
      ${leagueHoldout ? stabilityCard(
        "League edge",
        `${(leagueHoldout.edge?.paulMinusMarket ?? 0) >= 0 ? "+" : ""}${leagueHoldout.edge?.paulMinusMarket ?? 0}`,
        `${leagueHoldout.dataset?.matches ?? 0} matches; PAUL is expected to tie the market in high-liquidity league mode.`,
        (leagueHoldout.edge?.paulMinusMarket ?? -1) >= 0
      ) : ""}
      ${crossCompetition ? metricCard("Cross-sample PAUL", crossMetrics.paul) : ""}
      ${crossCompetition ? metricCard("Cross-sample market", crossMetrics.market) : ""}
      ${crossCompetition ? stabilityCard(
        "Cross-sample edge",
        `${(crossCompetition.edge?.paulMinusMarket ?? 0) >= 0 ? "+" : ""}${crossCompetition.edge?.paulMinusMarket ?? 0}`,
        `${crossCompetition.dataset?.matches ?? 0} total holdout matches.`,
        (crossCompetition.edge?.paulMinusMarket ?? -1) >= 0
      ) : ""}
    </div>
    <h3 class="verify-title">Year-by-Year Holdout Edge</h3>
    <div class="verify-checks">
      ${(stability.yearEdges || [])
        .map((year) => `
          <div class="verify-check ${year.edge >= 0 ? "is-pass" : "is-fail"}">
            <span>${year.year}</span>
            <strong>PAUL ${year.paulCorrect}/${year.matches} (${year.paulAccuracy}%) · Market ${year.marketCorrect}/${year.matches} (${year.marketAccuracy}%) · Edge ${year.edge >= 0 ? "+" : ""}${year.edge}</strong>
          </div>
        `)
        .join("")}
    </div>
    <h3 class="verify-title">Leave-One-Year-Out Sensitivity</h3>
    <div class="verify-checks">
      ${(stability.leaveOneOut || [])
        .map((item) => `
          <div class="verify-check ${item.edge >= 0 ? "is-pass" : "is-fail"}">
            <span>Remove ${item.removedYear}</span>
            <strong>${item.matches} matches · PAUL ${item.paulAccuracy}% vs Market ${item.marketAccuracy}% · Edge ${item.edge >= 0 ? "+" : ""}${item.edge}</strong>
          </div>
        `)
        .join("")}
    </div>
    <h3 class="verify-title">All-Dataset Baseline Comparison</h3>
    <div class="verify-health-grid">
      ${metricCard("PAUL Edge", metrics.paul)}
      ${metricCard("Market favorite", metrics.market)}
      ${metricCard("Rating baseline", metrics.rating)}
      ${metricCard("Poisson form", metrics.poisson)}
      ${metricCard("Blended baseline", metrics.blended)}
      ${metricCard("Random", metrics.random)}
    </div>
    <h3 class="verify-title">Edge Audit</h3>
    <div class="verify-checks">
      <div class="verify-check ${data.edge?.paulMinusMarket >= 0 ? "is-pass" : "is-fail"}">
        <span>${data.edge?.paulMinusMarket >= 0 ? "PASS" : "WARN"}</span>
        <strong>PAUL vs market: ${data.edge?.paulMinusMarket >= 0 ? "+" : ""}${data.edge?.paulMinusMarket ?? 0} correct picks</strong>
      </div>
      <div class="verify-check ${data.edge?.paulMinusBlended >= 0 ? "is-pass" : "is-fail"}">
        <span>${data.edge?.paulMinusBlended >= 0 ? "PASS" : "WARN"}</span>
        <strong>PAUL vs blended: ${data.edge?.paulMinusBlended >= 0 ? "+" : ""}${data.edge?.paulMinusBlended ?? 0} correct picks</strong>
      </div>
      <div class="verify-check">
        <span>UPSET</span>
        <strong>${data.edge?.upsetHits ?? 0}/${data.edge?.upsetCalls ?? 0} override hits · ${data.edge?.upsetAccuracy ?? 0}%</strong>
      </div>
    </div>
    <h3 class="verify-title">Calibration Buckets</h3>
    <div class="verify-checks">
      ${Object.entries(calibration)
        .map(([band, bucket]) => `
          <div class="verify-check">
            <span>${band}</span>
            <strong>${bucket.correct}/${bucket.graded} · ${bucket.accuracy}%</strong>
          </div>
        `)
        .join("")}
    </div>
    <h3 class="verify-title">Sample Match Trace</h3>
    <div class="verify-rounds">
      <article class="verify-round">
        ${(data.trace || [])
          .slice(0, 16)
          .map((match) => {
            const impact = marketImpact(match);
            return `
              <div class="verify-match">
                <span>${match.datasetYear || ""} #${match.id}</span>
                <strong>${match.match} ${match.score}</strong>
                <em>
                  Actual: ${pickDisplay(match, match.actual)} ·
                  PAUL: ${pickDisplay(match, match.picks.paul)} ·
                  Market: ${pickDisplay(match, match.picks.market)} ·
                  Upset signal: ${match.paul.upsetScore}/100 ·
                  Market impact: ${impact >= 0 ? "+" : ""}${impact}
                </em>
              </div>
            `;
          })
          .join("")}
      </article>
    </div>
  `;
}

function verifyTokenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("verify") || params.get("verify_token") || "";
}

function storedVerifyToken() {
  try {
    return sessionStorage.getItem("paul.verifyToken") || "";
  } catch {
    return "";
  }
}

function currentVerifyToken() {
  return document.getElementById("verifyTokenInput")?.value.trim() || storedVerifyToken() || "";
}

function setupVerifyAccess() {
  const section = document.getElementById("verify");
  const input = document.getElementById("verifyTokenInput");
  const status = document.getElementById("verifyStatus");
  if (!section || !input) return;
  const token = verifyTokenFromUrl() || storedVerifyToken();
  if (!token && window.location.hash !== "#verify") return;
  section.hidden = false;
  if (token) {
    input.value = token;
    try {
      sessionStorage.setItem("paul.verifyToken", token);
    } catch {
      // Session storage is optional.
    }
    if (status) status.textContent = "Owner verification unlocked for this browser session.";
    document.querySelectorAll(".owner-only").forEach((element) => {
      element.hidden = false;
    });
  }
}

async function runDryVerification() {
  const button = document.getElementById("runVerifyButton");
  const status = document.getElementById("verifyStatus");
  if (!button || !status) return;
  const token = currentVerifyToken();
  if (!token) {
    status.textContent = "Enter the owner verify token first.";
    return;
  }
  button.disabled = true;
  status.textContent = "Running dry-run simulation...";
  try {
    try {
      sessionStorage.setItem("paul.verifyToken", token);
    } catch {
      // Session storage is optional.
    }
    const response = await fetch("/api/test/simulate", {
      headers: { "X-Verify-Token": token }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Dry-run failed.");
    renderVerifyReport(data);
    status.textContent = "Dry-run complete. Production data was not modified.";
  } catch (error) {
    status.textContent = error.message;
    renderVerifyReport({ status: "fail", checks: { dryRunRequest: false }, sample: { error: error.message } });
  } finally {
    button.disabled = false;
  }
}

async function runResultsHealthCheck() {
  const button = document.getElementById("runResultsHealthButton");
  const status = document.getElementById("verifyStatus");
  if (!button || !status) return;
  const token = currentVerifyToken();
  if (!token) {
    status.textContent = "Enter the owner verify token first.";
    return;
  }
  button.disabled = true;
  status.textContent = "Checking result providers...";
  try {
    try {
      sessionStorage.setItem("paul.verifyToken", token);
    } catch {
      // Session storage is optional.
    }
    const response = await fetch("/api/test/simulate?mode=results-health", {
      headers: { "X-Verify-Token": token }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Result source check failed.");
    renderResultsHealth(data);
    status.textContent = "Result source check complete. Production data was not modified.";
  } catch (error) {
    status.textContent = error.message;
    renderResultsHealth({ status: "fail", checks: [{ provider: "request", ok: false, error: error.message }], writesProductionData: false });
  } finally {
    button.disabled = false;
  }
}

async function runHistoricalBacktest() {
  const button = document.getElementById("runBacktestButton");
  const status = document.getElementById("verifyStatus");
  if (!button || !status) return;
  const token = currentVerifyToken();
  if (!token) {
    status.textContent = "Enter the owner verify token first.";
    return;
  }
  button.disabled = true;
  status.textContent = "Running historical 2022 sample plus 2018/2014/2010/2006 holdout backtest...";
  try {
    try {
      sessionStorage.setItem("paul.verifyToken", token);
    } catch {
      // Session storage is optional.
    }
    const response = await fetch("/api/test/simulate?mode=backtest", {
      headers: { "X-Verify-Token": token }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Backtest failed.");
    renderBacktestReport(data);
    status.textContent = "Historical backtest complete. Production data was not modified.";
  } catch (error) {
    status.textContent = error.message;
    renderBacktestReport({ status: "fail", dataset: { name: "Backtest request" }, metrics: {}, edge: {}, trace: [] });
  } finally {
    button.disabled = false;
  }
}

async function runDueAutomation() {
  const button = document.getElementById("runAutomationButton");
  const statusText = document.getElementById("automationStatus");
  if (!button || !statusText) return;
  const token = currentVerifyToken();
  if (!token) {
    statusText.textContent = "Owner token required. Vercel cron runs production tasks automatically.";
    return;
  }

  button.disabled = true;
  statusText.textContent = "Running due prediction and result sync tasks...";
  try {
    const response = await fetch("/api/automation/run-due", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Verify-Token": token },
      body: JSON.stringify({})
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Automation task failed.");
    const okEvents = data.events.filter((event) => event.status === "ok").length;
    const errors = data.events.filter((event) => event.status === "error").length;
    statusText.textContent = `Automation complete: ${okEvents} updates, ${errors} errors.`;
    await loadAutomationStatus();
    await loadAuditProofs();
  } catch (error) {
    statusText.textContent = error.message;
  } finally {
    button.disabled = false;
  }
}

function renderGroups() {
  const grid = document.getElementById("groupGrid");
  grid.innerHTML = groupOrder
    .map((group) => {
      const groupTeams = Object.entries(teams)
        .filter(([, team]) => team.group === group)
        .sort((a, b) => a[1].pos - b[1].pos);
      return `
        <article class="group-card">
          <h3>${tr("groupLabel")} ${group}</h3>
          ${groupTeams
            .map(([code, team]) => `
              <div class="team-row">
                ${flagImage(code, "flag-frame flag-frame--small")}
                <strong>${team.name}</strong>
                <span>${code}</span>
              </div>
            `)
            .join("")}
        </article>
      `;
    })
    .join("");
}

function populateFilters() {
  const roundFilter = document.getElementById("roundFilter");
  const groupFilter = document.getElementById("groupFilter");
  refreshFilterOptions();
  roundFilter.addEventListener("change", renderMatchList);
  groupFilter.addEventListener("change", renderMatchList);
  document.getElementById("searchBox").addEventListener("input", renderMatchList);
}

function refreshFilterOptions() {
  const roundFilter = document.getElementById("roundFilter");
  const groupFilter = document.getElementById("groupFilter");
  if (roundFilter) {
    const current = roundFilter.value || defaultRoundFilter;
    roundFilter.innerHTML = roundOptions.map((round) => `<option value="${round}">${roundLabel(round)}</option>`).join("");
    roundFilter.value = roundOptions.includes(current) ? current : defaultRoundFilter;
  }
  if (groupFilter) {
    const current = groupFilter.value || "All";
    groupFilter.innerHTML = ["All", ...groupOrder].map((group) => `<option value="${group}">${group === "All" ? tr("all") : `${tr("groupLabel")} ${group}`}</option>`).join("");
    groupFilter.value = current;
  }
}

function init() {
  setupLanguageSelect();
  applyLanguage();
  populateFilters();
  setupVerifyAccess();
  renderGroups();
  renderMatchList();
  renderPK();
  document.getElementById("qwenButton")?.addEventListener("click", askQwen);
  document.getElementById("runAutomationButton")?.addEventListener("click", runDueAutomation);
  document.getElementById("runVerifyButton")?.addEventListener("click", runDryVerification);
  document.getElementById("runResultsHealthButton")?.addEventListener("click", runResultsHealthCheck);
  document.getElementById("runBacktestButton")?.addEventListener("click", runHistoricalBacktest);
  document.getElementById("loadDemoProofButton")?.addEventListener("click", loadDemoProof);
  document.getElementById("verifyProofButton")?.addEventListener("click", verifyProofInput);
  document.getElementById("clearProofButton")?.addEventListener("click", clearProofVerifier);
  document.getElementById("proofRoundFilter")?.addEventListener("change", () => {
    proofLedgerExpanded = false;
    renderProofs(publicProofEntries);
  });
  document.getElementById("proofSearchBox")?.addEventListener("input", () => {
    proofLedgerExpanded = false;
    renderProofs(publicProofEntries);
  });
  document.getElementById("proofToggleButton")?.addEventListener("click", () => {
    proofLedgerExpanded = !proofLedgerExpanded;
    renderProofs(publicProofEntries);
  });
  updateChampionLabel();
  syncAutomationSnapshot().then(loadAutomationStatus);
  loadAuditProofs();
  window.setInterval(refreshCountdowns, 1000);
}

init();
