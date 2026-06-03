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
const roundOptions = ["All", "Group Stage", "Round of 32", "Round of 16", "Quarterfinal", "Semifinal", "Third Place", "Final"];
const roundLabels = {
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
  entertainmentNoticeTitle: "Entertainment only", entertainmentNoticeCopy: "This site is for entertainment and reference only. PAUL predictions are not betting or financial advice.",
  recordEyebrow: "PAUL Record", recordTitle: "Public accuracy, tracked match by match.", recordCopy: "Every locked pick is counted after the final score. The record stays public, proof-linked, and consistent for every visitor.",
  publicFavorite: "Public favorite", teamRead: "Team read", paulGain: "PAUL gain", calibration: "Calibration", referenceRecord: "Reference record.", extraCorrectPicks: "Extra correct picks.", actualVsConfidence: "Actual accuracy vs confidence.",
  predictorEyebrow: "PK Predictor", predictorTitle: "Group-stage record first, knockout oracle after qualification.", predictorCopy: "PAUL still predicts every playable match before kickoff, including the group stage. The public showpiece begins when the Round of 32 bracket is resolved and every pick becomes a win-or-go-home call.",
  round: "Round", group: "Group", groupLabel: "Group", search: "Search", searchPlaceholder: "Team, country, match number...",
  automationEyebrow: "Automation Engine", automationTitle: "Daily odds refresh, result sync, bracket advancement, and pre-match predictions.", automationCopy: "Vercel Cron refreshes market odds snapshots, checks for final scores, records winners, fills the next knockout round, locks PAUL predictions before each playable match, and keeps the public accuracy record consistent for every visitor.",
  lockedPredictions: "Locked predictions", syncedResults: "Synced results", predictionAccuracy: "Prediction accuracy", nextScheduledPick: "Next scheduled pick", runDueTasks: "Run Due Tasks", loadingAutomation: "Loading automation status...",
  proofEyebrow: "Proof of Prediction", proofTitle: "Every PAUL pick gets a public hash and timestamp proof.", proofCopy: "When PAUL locks a prediction, the full prediction payload is converted into canonical JSON and hashed with SHA-256. Official proofs also try to create an OpenTimestamps .ots receipt, so anyone can verify the same hash outside this site.",
  totalProofs: "Total proofs", allRounds: "All rounds", groupStage: "Group stage", knockout: "Knockout", otsReceipts: "OTS receipts", noLockedProofs: "No locked proofs yet", proofsAppear: "Proof records will appear here as soon as PAUL locks an official prediction.", proofSearchPlaceholder: "Match, team, hash, round...", showAllProofs: "Show all proofs",
  groupsEyebrow: "48-Team Field", groupsTitle: "Groups A-L", groupsCopy: "Each team card includes its flag, group, and local-language line for the PK page.",
  primaryLanguages: "Primary languages", localLanguage: "Local language", bracketStatus: "Bracket status", slotFilled: "This slot will be filled automatically after earlier results are synced.",
  fanVote: "Fan Vote", bracketSlotPending: "Bracket slot pending", votes: "votes", dailyRead: "Daily PAUL Read", waitingTeams: "Waiting for teams", nextRefreshPending: "Next refresh pending", dailyRefreshCopy: "PAUL will refresh this matchup automatically when it enters the daily analysis window.", currentLean: "Current lean", confidence: "confidence", draw: "Draw",
  correct: "Correct", missed: "Missed", final: "Final", locked: "Locked", proofLocked: "Proof locked", notLocked: "Not locked", lockedAt: "Locked", kickoff: "Kickoff", generatedAt: "Generated at", updated: "Updated", officialConfidence: "Official confidence", officialPredictionPending: "Official prediction pending", officialPredictionNotLocked: "Official PAUL prediction is not locked yet.", bracketNotResolved: "This bracket slot is not resolved yet.", kickoffCountdown: "Kickoff countdown", finalScorePending: "Final score has not synced yet. Accuracy will update after full time.", predictedScore: "Predicted score", officialPaulPick: "Official PAUL Pick", upsetWatch: "Upset Watch", proofStatus: "Proof Status", upsetRisk: "Upset Risk", proofLockedPublicRecord: "After full time, this pick is added to PAUL's public record.", finalScoresVerify: "Final scores will verify this pick after the match.", officialPredictionFallback: "PAUL has returned an official prediction.", lockedWithoutDetails: "PAUL has locked this pick without a detailed explanation.", awaitingGroups: "Awaiting groups", awaitingGroupPick: "Awaiting Group-stage PAUL Pick", awaitingKnockoutPick: "Awaiting Knockout Oracle Pick", waitingBracketResults: "Waiting for bracket results", pendingGroupPickCopy: "This group-stage pick will be proof-locked before kickoff and counted in PAUL's public baseline record.", pendingKnockoutPickCopy: "Knockout Oracle Mode will lock this win-or-go-home pick before kickoff, with upset risk and bracket-path reasoning.", unresolvedSlotCopy: "This knockout slot will become predictable after earlier real results fill the official bracket.", pendingModelCopy: "The proof-locked official pick is still pending. Daily PAUL probabilities can update above before the lock window.", unresolvedModelCopy: "This match will become predictable after the earlier winners are known.", knockoutFixturesPending: "Knockout fixtures will appear only after real group-stage results and the official bracket are available.", groupStageRecord: "Group-stage record", knockoutOracleMode: "Knockout Oracle Mode", noMatchingProofs: "No matching proofs", noProofsMatchCopy: "Change the round filter or search term. The official proof ledger still keeps every locked prediction.", proofServiceUnavailable: "Proof service unavailable", copy: "Copy", loadInVerifier: "Load in verifier", downloadCanonical: "Download canonical", downloadOts: "Download .ots", copiedProofJson: "Proof JSON copied.", copiedProofForMatch: "Copied proof for match", proofJsonLoaded: "Proof JSON loaded. Click Verify Proof.", demoProofLoaded: "Fixed demo proof with bundled .ots loaded. Click Verify Proof.", proofVerificationComplete: "Proof verification completed locally in this browser.", proofInputPlaceholder: "Paste proof JSON here...", proofVerifierEyebrow: "Public Proof Verifier", proofVerifierTitle: "Verify a PAUL proof yourself.", proofVerifierCopy: "Paste proof JSON from any card. The browser recalculates SHA-256 locally, checks canonical consistency, and shows GitHub/OpenTimestamps evidence.", loadDemoProof: "Load Demo Proof", verifyProof: "Verify Proof", clear: "Clear", noProofLoaded: "No proof loaded.", showLatest: "Show latest", showAll: "Show all", retainedProofs: "retained official proofs", matchingProofs: "matching proofs", showing: "Showing", latest: "latest", of: "of", hashVerified: "Hash verified", hashMismatch: "Hash mismatch", beforeKickoff: "Before kickoff", checkTime: "Check time", otsReceipt: "OTS receipt", unknown: "Unknown", pick: "Pick", githubProof: "GitHub proof", noGithubTimestamp: "No GitHub timestamp", githubPending: "GitHub pending", noOtsProof: "No OpenTimestamps proof", otsPending: "OpenTimestamps pending", openOtsVerifier: "Open OTS verifier"
  , all: "All"
});
Object.assign(languageCopy.zh, {
  entertainmentNoticeTitle: "仅供娱乐参考", entertainmentNoticeCopy: "本网站仅供娱乐和参考，不构成投注、投资或财务建议。",
  recordEyebrow: "PAUL 战绩", recordTitle: "逐场公开统计命中率。", recordCopy: "每个赛前锁定预测都会在赛后计入战绩。所有访客看到同一份公开、带证明、可追踪的记录。",
  publicFavorite: "市场热门", teamRead: "球队判断", paulGain: "PAUL 增益", calibration: "校准", referenceRecord: "参考战绩。", extraCorrectPicks: "比参考多命中的场次。", actualVsConfidence: "实际命中率对比信心值。",
  predictorEyebrow: "PK 预测器", predictorTitle: "先积累小组赛战绩，再进入淘汰赛神谕模式。", predictorCopy: "PAUL 会在开赛前预测每一场可预测比赛，包括小组赛。32 强签表确定后，每个预测都会变成一场定生死的淘汰赛判断。",
  round: "轮次", group: "小组", groupLabel: "小组", search: "搜索", searchPlaceholder: "球队、国家、比赛编号...",
  automationEyebrow: "自动化引擎", automationTitle: "每日刷新赔率、同步赛果、推进签表，并在赛前锁定预测。", automationCopy: "Vercel Cron 会刷新市场赔率快照、检查最终比分、记录胜者、填充下一轮淘汰赛，并在每场比赛前锁定 PAUL 预测，让所有访客看到一致的公开战绩。",
  lockedPredictions: "已锁定预测", syncedResults: "已同步赛果", predictionAccuracy: "预测命中率", nextScheduledPick: "下一次赛前预测", runDueTasks: "运行到期任务", loadingAutomation: "正在加载自动化状态...",
  proofEyebrow: "预测证明", proofTitle: "每个 PAUL 预测都会生成公开哈希和时间戳证明。", proofCopy: "当 PAUL 锁定预测后，完整预测内容会转换为标准 JSON 并计算 SHA-256 哈希。正式预测还会尝试生成 OpenTimestamps .ots 收据，方便任何人在站外验证同一个哈希。",
  totalProofs: "总证明数", allRounds: "全部轮次", groupStage: "小组赛", knockout: "淘汰赛", otsReceipts: "OTS 收据", noLockedProofs: "还没有锁定证明", proofsAppear: "PAUL 锁定正式预测后，证明记录会显示在这里。", proofSearchPlaceholder: "比赛、球队、哈希、轮次...", showAllProofs: "显示全部证明",
  groupsEyebrow: "48 支球队", groupsTitle: "A-L 小组", groupsCopy: "每张球队卡包含国旗、小组，以及 PK 页使用的本国语言文本。",
  primaryLanguages: "主要语言", localLanguage: "本国语言", bracketStatus: "签表状态", slotFilled: "前序比赛结果同步后，这个席位会自动填充。",
  fanVote: "观众投票", bracketSlotPending: "签表席位待定", votes: "票", dailyRead: "PAUL 每日判断", waitingTeams: "等待球队确定", nextRefreshPending: "等待下次刷新", dailyRefreshCopy: "当这场比赛进入每日分析窗口后，PAUL 会自动刷新这一场对阵。", currentLean: "当前倾向", confidence: "信心", draw: "平局",
  correct: "命中", missed: "未命中", final: "已完赛", locked: "已锁定", proofLocked: "证明已锁定", notLocked: "未锁定", lockedAt: "锁定时间", kickoff: "开赛时间", generatedAt: "生成时间", updated: "已更新", officialConfidence: "正式信心", officialPredictionPending: "正式预测待定", officialPredictionNotLocked: "PAUL 正式预测还未锁定。", bracketNotResolved: "这个签表席位还没有确定。", kickoffCountdown: "开赛倒计时", finalScorePending: "最终比分还未同步。完赛后会更新命中率。", predictedScore: "预测比分", officialPaulPick: "PAUL 正式选择", upsetWatch: "冷门观察", proofStatus: "证明状态", upsetRisk: "冷门风险", proofLockedPublicRecord: "完赛后，这个预测会计入 PAUL 公开战绩。", finalScoresVerify: "赛后比分会验证这个预测。", officialPredictionFallback: "PAUL 已返回正式预测。", lockedWithoutDetails: "PAUL 已锁定本场预测，但没有提供详细说明。", awaitingGroups: "等待小组赛", awaitingGroupPick: "等待小组赛 PAUL 预测", awaitingKnockoutPick: "等待淘汰赛 PAUL 神谕", waitingBracketResults: "等待签表结果", pendingGroupPickCopy: "这场小组赛预测会在开赛前生成证明并锁定，并计入 PAUL 公开基础战绩。", pendingKnockoutPickCopy: "淘汰赛神谕模式会在开赛前锁定这场定生死预测，并考虑冷门风险和签表路径。", unresolvedSlotCopy: "前序真实赛果填充正式签表后，这个淘汰赛席位才会进入可预测状态。", pendingModelCopy: "正式证明预测仍在等待锁定。锁定窗口前，上方每日概率仍可更新。", unresolvedModelCopy: "前序胜者确定后，这场比赛才会进入可预测状态。", knockoutFixturesPending: "真实小组赛结果和正式签表可用后，淘汰赛列表才会显示。", groupStageRecord: "小组赛战绩", knockoutOracleMode: "淘汰赛神谕模式", noMatchingProofs: "没有匹配的证明", noProofsMatchCopy: "请更换轮次筛选或搜索词。正式证明账本仍会保留每一个锁定预测。", proofServiceUnavailable: "证明服务暂时不可用", copy: "复制", loadInVerifier: "载入验证器", downloadCanonical: "下载标准 JSON", downloadOts: "下载 .ots", copiedProofJson: "证明 JSON 已复制。", copiedProofForMatch: "已复制比赛证明", proofJsonLoaded: "证明 JSON 已载入。点击验证证明。", demoProofLoaded: "固定演示证明和内置 .ots 已载入。点击验证证明。", proofVerificationComplete: "证明已在本浏览器本地验证完成。", proofInputPlaceholder: "在这里粘贴证明 JSON...", proofVerifierEyebrow: "公开证明验证器", proofVerifierTitle: "自己验证 PAUL 证明。", proofVerifierCopy: "粘贴任意卡片中的证明 JSON。浏览器会在本地重新计算 SHA-256，检查标准内容一致性，并显示 GitHub/OpenTimestamps 证据。", loadDemoProof: "载入演示证明", verifyProof: "验证证明", clear: "清空", noProofLoaded: "还没有载入证明。", showLatest: "显示最新", showAll: "显示全部", retainedProofs: "条已保留正式证明", matchingProofs: "条匹配证明", showing: "显示", latest: "最新", of: "/", hashVerified: "哈希已验证", hashMismatch: "哈希不匹配", beforeKickoff: "早于开赛", checkTime: "检查时间", otsReceipt: "OTS 收据", unknown: "未知", pick: "选择", githubProof: "GitHub 证明", noGithubTimestamp: "暂无 GitHub 时间戳", githubPending: "GitHub 待处理", noOtsProof: "暂无 OpenTimestamps 证明", otsPending: "OpenTimestamps 待处理", openOtsVerifier: "打开 OTS 验证器"
  , all: "全部"
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
    publicFavorite: "Favorito publico",
    teamRead: "Lectura del equipo",
    paulGain: "Ventaja PAUL",
    calibration: "Calibracion",
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
    publicFavorite: "Favori public",
    teamRead: "Lecture d'equipe",
    paulGain: "Gain PAUL",
    calibration: "Calibration",
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
    publicFavorite: "Offentlicher Favorit",
    teamRead: "Team-Einschatzung",
    paulGain: "PAUL Vorteil",
    calibration: "Kalibrierung",
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
    publicFavorite: "Favorito publico",
    teamRead: "Leitura da equipe",
    paulGain: "Ganho PAUL",
    calibration: "Calibracao",
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
    publicFavorite: "Favorito pubblico",
    teamRead: "Lettura squadra",
    paulGain: "Vantaggio PAUL",
    calibration: "Calibrazione",
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
    publicFavorite: "Publieke favoriet",
    teamRead: "Teamlezing",
    paulGain: "PAUL voordeel",
    calibration: "Kalibratie",
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
    publicFavorite: "Halk favorisi",
    teamRead: "Takim okuması",
    paulGain: "PAUL avantaji",
    calibration: "Kalibrasyon",
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
    publicFavorite: "المرشح العام",
    teamRead: "قراءة الفريق",
    paulGain: "ميزة PAUL",
    calibration: "المعايرة",
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
    publicFavorite: "公開人気",
    teamRead: "チーム判定",
    paulGain: "PAUL 増分",
    calibration: "較正",
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
    publicFavorite: "공개 인기",
    teamRead: "팀 분석",
    paulGain: "PAUL 이득",
    calibration: "보정",
    referenceRecord: "참고 기록.",
    extraCorrectPicks: "추가 적중.",
    actualVsConfidence: "실제 정확도 vs 신뢰도."
  }
};

Object.entries(recordSectionCopy).forEach(([key, copy]) => {
  Object.assign(languageCopy[key], copy);
});

Object.assign(languageCopy.es, {
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
      matches.push({
        id: id++,
        round: "Group Stage",
        group,
        date: `${groupDates[group][idx]}, 2026`,
        venue: cityRoute[group],
        aCode,
        bCode,
        slot: `Group ${group}`
      });
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
  marketTrace: {},
  accuracy: { accuracy: 0, completed: 0, graded: 0, correct: 0 },
  stageAccuracy: {
    group: { accuracy: 0, completed: 0, graded: 0, correct: 0 },
    knockout: { accuracy: 0, completed: 0, graded: 0, correct: 0 },
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
      const matchTime = new Date(`${match.date} 20:00:00 GMT+0000`);
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
  return new Date(`${match.date} 20:00:00 GMT+0000`);
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
    day: "numeric"
  }).format(kickoff);
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

function marketTraceFor(match) {
  return automationState.marketTrace?.[match.id] || automationState.marketTrace?.[String(match.id)] || null;
}

function dailyReadPercent(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return tr("pending");
  return `${Math.max(0, Math.min(100, Math.round(number)))}%`;
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
        <strong>${tr("nextRefreshPending")}</strong>
      </div>
      <p class="daily-read__empty">${tr("dailyRefreshCopy")}</p>
    `;
    return;
  }

  const probabilities = read.probabilities || {};
  const pickCode = read.pick?.winnerCode;
  const pickName = read.pick?.winnerName || teams[pickCode]?.name || tr("pending");
  const updatedAt = read.generatedAt ? formatProofTime(read.generatedAt) : tr("unknown");
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

function tracePaulPick(match, official, daily) {
  if (official) {
    const code = officialPickCode(official);
    return {
      code,
      name: official.analysis?.winnerName || teamNameForCode(code, match),
      confidence: official.analysis?.confidence || null,
      probabilities: official.analysis?.probabilities || null,
      status: "Official locked"
    };
  }
  if (daily?.pick?.winnerCode) {
    return {
      code: daily.pick.winnerCode,
      name: daily.pick.winnerName || teamNameForCode(daily.pick.winnerCode, match),
      confidence: daily.pick.confidence || null,
      probabilities: daily.probabilities || null,
      status: "Daily read"
    };
  }
  return { code: null, name: tr("pending"), confidence: null, probabilities: null, status: tr("pending") };
}

function traceResult(match, result) {
  if (!result?.status || result.status !== "final") return { label: tr("pending"), winnerCode: null };
  const resolved = resolvedTeams(match);
  const winnerCode = result.winnerCode || (Number(result.homeScore) === Number(result.awayScore)
    ? "DRAW"
    : Number(result.homeScore) > Number(result.awayScore)
      ? resolved.aCode
      : resolved.bCode);
  return {
    label: `${teams[resolved.aCode]?.name || "Home"} ${result.homeScore}-${result.awayScore} ${teams[resolved.bCode]?.name || "Away"}`,
    winnerCode
  };
}

function traceMarketImpact(paulCode, marketCode, winnerCode) {
  if (!paulCode || !marketCode || !winnerCode) return tr("pending");
  const paulCorrect = String(paulCode).toUpperCase() === String(winnerCode).toUpperCase() ? 1 : 0;
  const marketCorrect = String(marketCode).toUpperCase() === String(winnerCode).toUpperCase() ? 1 : 0;
  const impact = paulCorrect - marketCorrect;
  return `${impact >= 0 ? "+" : ""}${impact}`;
}

function renderPublicTrace() {
  const container = document.getElementById("publicTrace");
  const summary = document.getElementById("publicTraceSummary");
  if (!container) return;
  const rows = tournament.matches
    .filter((match) => {
      const resolved = resolvedTeams(match);
      return resolved.aCode && resolved.bCode;
    })
    .map((match) => {
      const official = officialPrediction(match);
      const daily = dailyReadFor(match);
      const market = marketTraceFor(match) || officialMarketTrace(match, official);
      const paul = tracePaulPick(match, official, daily);
      const result = traceResult(match, officialResult(match));
      return { match, official, daily, market, paul, result };
    });

  const officialCount = rows.filter((row) => row.official).length;
  const dailyCount = rows.filter((row) => !row.official && row.daily).length;
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
      ${rows.map(({ match, market, paul, result }) => {
        const resolved = resolvedTeams(match);
        const matchName = `${teams[resolved.aCode]?.name || slotLabel(match, "a")} vs ${teams[resolved.bCode]?.name || slotLabel(match, "b")}`;
        const marketName = market?.favoriteName || teamNameForCode(market?.favoriteCode, match);
        const marketProb = market?.favoriteSide ? traceProbability(market.probabilities?.[market.favoriteSide]) : "";
        const paulConfidence = paul.confidence ? ` · ${traceProbability(paul.confidence)}` : "";
        const paulProbabilities = probabilityTriple(match, paul.probabilities);
        const marketProbabilities = probabilityTriple(match, market?.probabilities);
        const impact = traceMarketImpact(paul.code, market?.favoriteCode, result.winnerCode);
        return `
          <div class="trace-row" role="row">
            <span>
              <strong>#${match.id} ${escapeHtml(matchName)}</strong>
              <em>${roundLabel(match.round)} · ${formatMatchDate(match)} · ${match.venue}</em>
            </span>
            <span>
              <strong>${escapeHtml(paul.name)}${paulConfidence}</strong>
              <em>${escapeHtml(paul.status)}${paulProbabilities ? ` · ${paulProbabilities}` : ""}</em>
            </span>
            <span>
              <strong>${market?.favoriteCode ? `${escapeHtml(marketName)}${marketProb ? ` · ${marketProb}` : ""}` : tr("pending")}</strong>
              <em>${market?.provider ? `${escapeHtml(market.provider)}${market.bookmakerCount ? ` · ${market.bookmakerCount} books` : ""}${marketProbabilities ? ` · ${marketProbabilities}` : ""}` : tr("noMarket")}</em>
            </span>
            <span>
              <strong>${escapeHtml(result.label)}</strong>
              <em>${result.winnerCode ? `${tr("winner")}: ${escapeHtml(teamNameForCode(result.winnerCode, match))}` : countdownMarkup(match)}</em>
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
  const record = officialPrediction(match);
  const result = officialResult(match);
  if (result?.status === "final" && record) {
    return String(officialPickCode(record)).toUpperCase() === String(resultWinner(result)).toUpperCase() ? tr("correct") : tr("missed");
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
  const record = officialPrediction(match);
  if (!record) return tr("pending");
  const pick = officialPickCode(record);
  if (!pick || pick === "DRAW") return tr("draw");
  return teams[pick]?.name || record.analysis.winnerName || tr("locked");
}

function officialModelCards(official, match) {
  return `
    <article class="model-card">
      <h3>${tr("officialPaulPick")}</h3>
      <div class="vote">${official.analysis?.winnerName || resultLabel(match)} · ${official.analysis?.confidence || "N/A"}%</div>
      <p>${official.analysis?.reasoning || tr("officialPredictionFallback")}</p>
    </article>
    <article class="model-card">
      <h3>${tr("predictedScore")}</h3>
      <div class="vote">${official.analysis?.predictedScore || official.analysis?.score || "N/A"}</div>
      <p>${tr("lockedAt")}: ${formatDisplayDateTime(official.generatedAt, { year: "numeric" })}.</p>
    </article>
    <article class="model-card">
      <h3>${tr("upsetWatch")}</h3>
      <div class="vote">${official.analysis?.upsetRisk || "N/A"}</div>
      <p>${official.analysis?.upsetCase || tr("finalScoresVerify")}</p>
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

function renderMatchList() {
  const round = document.getElementById("roundFilter").value;
  const group = document.getElementById("groupFilter").value;
  const query = document.getElementById("searchBox").value.trim().toLowerCase();
  const list = document.getElementById("matchList");

  const filtered = tournament.matches.filter((match) => {
    const resolved = resolvedTeams(match);
    const aLabel = resolved.aCode ? teams[resolved.aCode].name : slotLabel(match, "a");
    const bLabel = resolved.bCode ? teams[resolved.bCode].name : slotLabel(match, "b");
    const haystack = `${match.id} ${match.round} ${match.group || ""} ${aLabel} ${bLabel} ${match.venue}`.toLowerCase();
    return (round === "All" || match.round === round) && (group === "All" || match.group === group) && (!query || haystack.includes(query));
  });

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
  const official = officialPrediction(match);
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
  document.getElementById("pkMeta").textContent = `${mode} · ${tr("match")} ${match.id} · ${roundLabel(match.round)} · ${formatMatchDate(match)} · ${match.venue}`;
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
      <p>${official.analysis?.reasoning || tr("lockedWithoutDetails")}</p>
      <p>${resultCopy}</p>
    `;
  } else {
    const pendingCopy = resolved.aCode && resolved.bCode
      ? match.round === "Group Stage"
        ? tr("pendingGroupPickCopy")
        : tr("pendingKnockoutPickCopy")
      : tr("unresolvedSlotCopy");
    document.getElementById("predictionCopy").innerHTML = `
      <p><strong>${resolved.aCode && resolved.bCode ? tr("officialPredictionNotLocked") : tr("bracketNotResolved")}</strong></p>
      <p>${pendingCopy}</p>
      <p class="countdown-detail">${tr("kickoffCountdown")}: <strong>${countdownMarkup(match)}</strong></p>
    `;
  }

  document.getElementById("modelGrid").innerHTML = official
    ? `
      <article class="model-card">
        <h3>${tr("officialPaulPick")}</h3>
        <div class="vote">${official.analysis?.winnerName || resultLabel(match)} · ${official.analysis?.confidence || "N/A"}%</div>
        <p>${official.analysis?.reasoning || tr("officialPredictionFallback")}</p>
      </article>
      <article class="model-card">
        <h3>${tr("predictedScore")}</h3>
        <div class="vote">${official.analysis?.predictedScore || official.analysis?.score || "N/A"}</div>
        <p>${tr("generatedAt")}: ${formatDisplayDateTime(official.generatedAt, { year: "numeric" })}</p>
      </article>
      <article class="model-card">
        <h3>${tr("upsetRisk")}</h3>
        <div class="vote">${official.analysis?.upsetRisk || "N/A"}</div>
        <p>${tr("finalScoresVerify")}</p>
      </article>
    `
    : `
      <article class="model-card model-card--wide">
        <h3>${match.round === "Group Stage" ? tr("awaitingGroupPick") : tr("awaitingKnockoutPick")}</h3>
        <div class="vote">${resolved.aCode && resolved.bCode ? tr("notLocked") : tr("waitingBracketResults")}</div>
        <p>${resolved.aCode && resolved.bCode ? tr("pendingModelCopy") : tr("unresolvedModelCopy")}</p>
      </article>
    `;

  if (official) {
    document.getElementById("modelGrid").innerHTML = officialModelCards(official, match);
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
  return `${nextPrediction.label} · ${dueAt.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`;
}

function formatLocalizedNextPrediction(nextPrediction) {
  if (!nextPrediction) return tr("none");
  if (!nextPrediction.dueAt) return `${nextPrediction.label} · ${tr("timePending")}`;
  const dueAt = new Date(nextPrediction.dueAt);
  if (Number.isNaN(dueAt.getTime())) return `${nextPrediction.label} · ${tr("timePending")}`;
  return `${nextPrediction.label} · ${formatDisplayDateTime(dueAt)}`;
}

function formatNextPredictionSynced(nextPrediction) {
  if (!nextPrediction) return tr("none");
  if (!nextPrediction.dueAt) return `${nextPrediction.label} · ${tr("timePending")}`;
  const dueAt = new Date(nextPrediction.dueAt);
  if (Number.isNaN(dueAt.getTime())) return `${nextPrediction.label} · ${tr("timePending")}`;
  return `${nextPrediction.label} · ${formatDisplayDateTime(dueAt)}`;
}

formatNextPrediction = formatNextPredictionSynced;
formatLocalizedNextPrediction = formatNextPredictionSynced;

async function loadAutomationStatus() {
  const statusText = document.getElementById("automationStatus");
  try {
    const response = await fetch("/api/automation/status");
    const status = await response.json();
    if (!response.ok) throw new Error(status.error || "Failed to load automation status.");

    const mergedPredictions = status.predictions || {};
    const nextPrediction = nextPredictionFromMatches(mergedPredictions, status.predictionLeadHours || 24) || status.nextPrediction;

    const stageAccuracy = status.stageAccuracy || automationState.stageAccuracy;
    setText("autoPredicted", Object.keys(mergedPredictions).length);
    setText("autoResults", status.resultCount || 0);
    setText("autoAccuracy", `${status.accuracy?.accuracy || 0}%`);
    setText("autoNext", formatLocalizedNextPrediction(nextPrediction));
    setText("groupAccuracyStat", `${stageAccuracy.group?.accuracy || 0}%`);
    setText("knockoutAccuracyStat", `${stageAccuracy.knockout?.accuracy || 0}%`);
    setText("upsetHitsStat", `${stageAccuracy.upsets?.hit || 0}/${stageAccuracy.upsets?.called || 0}`);
    setText("proofVerifiedStat", stageAccuracy.proofVerified || status.auditCount || 0);
    const baselines = stageAccuracy.baselines || {};
    setText("marketBaselineStat", baselines.market?.graded ? `${baselines.market.accuracy}%` : tr("pending"));
    setText("ratingBaselineStat", baselines.rating?.graded ? `${baselines.rating.accuracy}%` : tr("pending"));
    const edge = baselines.paulVsMarket?.edge;
    setText("paulEdgeStat", Number.isFinite(edge) ? `${edge >= 0 ? "+" : ""}${edge}` : tr("pending"));
    const calibration = stageAccuracy.calibration || {};
    setText(
      "calibrationStat",
      calibration.graded ? `${calibration.actualAccuracy}% / ${calibration.averageConfidence}%` : tr("pending")
    );
    automationState = {
      predictions: mergedPredictions,
      results: status.results || {},
      dailyAnalysis: status.dailyAnalysis || automationState.dailyAnalysis || {},
      marketTrace: status.marketTrace || automationState.marketTrace || {},
      accuracy: status.accuracy || automationState.accuracy,
      stageAccuracy
    };
    updateChampionLabel();
    renderMatchList();
    renderPK();
    renderPublicTrace();

    const qwenState = status.hasQwenKey ? "PAUL AI ready" : "PAUL AI not connected";
    const resultState = status.hasResultsApi ? "Results API ready" : "Results API not connected";
    const readiness = status.dataReadiness || {};
    const evidenceState = readiness.evidenceCacheCount
      ? `${readiness.evidenceCacheCount} odds snapshots cached${readiness.latestEvidenceAt ? `, latest ${formatProofTime(readiness.latestEvidenceAt)}` : ""}`
      : "no cached odds snapshots yet";
    const dailyState = readiness.dailyAnalysisCount
      ? `${readiness.dailyAnalysisCount} daily PAUL reads cached${readiness.latestDailyReadAt ? `, latest ${formatProofTime(readiness.latestDailyReadAt)}` : ""}`
      : "no daily PAUL reads yet";
    const cronState = status.cronProtected ? "Cron protected" : "Cron secret missing";
    const oddsState = readiness.liveOddsProvider
      ? `live odds via ${readiness.liveOddsProvider}`
      : readiness.marketOdds
        ? "market odds loaded"
        : "market odds missing";
    const ratingState = readiness.teamRatings ? "team ratings loaded" : "team ratings missing";
    statusText.textContent = `${qwenState}; ${cronState}; ${oddsState}; ${evidenceState}; ${dailyState}; ${ratingState}; ${resultState}; ${status.totalMatches || 0} fixtures loaded.`;
  } catch (error) {
    statusText.textContent = error.message;
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
  return JSON.stringify({
    id: entry.id,
    version: entry.version,
    matchId: entry.matchId,
    match: entry.match,
    round: entry.round,
    lockedAt: entry.lockedAt,
    kickoffAt: entry.kickoffAt,
    algorithm: entry.algorithm,
    hash: entry.hash,
    canonical: entry.canonical,
    payload: entry.payload,
    externalProof: entry.externalProof || null
  }, null, 2);
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
    await navigator.clipboard.writeText(value);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
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
        <button class="button button--ghost proof-copy-button" type="button" data-proof-id="${entry.id}">${tr("copy")}</button>
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
      await copyText(publicProofJson(entry));
      const status = document.getElementById("copyProofStatus");
      if (status) status.textContent = `${tr("copiedProofForMatch")} #${entry.matchId}.`;
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
    const envelopeMatchesCanonical = parsed
      ? ["matchId", "round", "match", "lockedAt", "kickoffAt"].every((key) => parsed[key] === undefined || parsed[key] === canonicalPayload?.[key])
      : true;
    const proofStructureOk = payloadMatchesCanonical && envelopeMatchesCanonical;
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
    const current = roundFilter.value || "All";
    roundFilter.innerHTML = roundOptions.map((round) => `<option value="${round}">${roundLabel(round)}</option>`).join("");
    roundFilter.value = current;
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
