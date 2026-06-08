import { useState, useRef, useEffect } from "react";

// ── نظام الألوان الأربعة ──
const COLOR_SYSTEM = [
  { key:"م", label:"أحكام فقهية", desc:"مسألة فقهية أو حكم رئيسي", color:"#FFF275", bg:"#FFF27522", border:"#FFF27566", dark:"#8a8600" },
  { key:"خ", label:"خلاصة وترجيح",  desc:"خلاصة المسألة وترجيح القرطبي النهائي", color:"#D6B4FC", bg:"#D6B4FC22", border:"#D6B4FC66", dark:"#5a1f8a" },
  { key:"د", label:"أدلة وأحاديث",  desc:"دليل، حديث نبوي، أو سبب نزول", color:"#A3E635", bg:"#A3E63522", border:"#A3E63566", dark:"#3d6600" },
  { key:"ت", label:"لطائف تربوية", desc:"لفتة تربوية، موعظة، أو ملاحظة شخصية", color:"#FF9F1C", bg:"#FF9F1C22", border:"#FF9F1C66", dark:"#7a4000" },
];

const TOPICS = [
  { category: "العقيدة والتوحيد", color: "#4A90D9", items: ["الأسماء والصفات", "التوحيد ونفي الشرك", "الإيمان بالغيب", "الإيمان بالملائكة", "الإيمان بالكتب", "القضاء والقدر"] },
  { category: "التوبة والتزكية", color: "#27AE60", items: ["التوبة والمغفرة", "تزكية النفس", "الخوف والرجاء", "الشكر والصبر", "الإخلاص والنية"] },
  { category: "أحوال الآخرة", color: "#E74C3C", items: ["يوم القيامة وأهواله", "الجنة ونعيمها", "النار وعذابها", "الحساب والميزان", "الشفاعة"] },
  { category: "قصص القرآن", color: "#F39C12", items: ["قصص الأنبياء", "قصص الأمم السابقة", "العبرة من القصص"] },
  { category: "الأحكام والفقه", color: "#E67E22", items: ["العبادات", "المعاملات", "الأسرة والنكاح", "الحدود والعقوبات"] },
  { category: "الإنسان والنفس", color: "#8E44AD", items: ["طبائع النفس البشرية", "الغفلة والتذكير", "الابتلاء والاختبار", "الموت وسكراته"] },
  { category: "الكون والآيات", color: "#16A085", items: ["آيات الكون والطبيعة", "الخلق والتدبير", "التفكر والتأمل"] },
  { category: "المنافقون والكافرون", color: "#7F8C8D", items: ["صفات المنافقين", "صفات الكافرين", "مصير المكذبين"] },
  { category: "الدعوة والعلاقات", color: "#C0392B", items: ["الأمر بالمعروف والنهي عن المنكر", "العلاقة مع غير المسلمين", "الجهاد والدفاع"] },
];
const ALL_TOPICS = TOPICS.flatMap(t => t.items);

const SURAHS = [
  { name:"الفاتحة", verses:7, revelation:"مكية" },
  { name:"البقرة", verses:286, revelation:"مدنية" },
  { name:"آل عمران", verses:200, revelation:"مدنية" },
  { name:"النساء", verses:176, revelation:"مدنية" },
  { name:"المائدة", verses:120, revelation:"مدنية" },
  { name:"الأنعام", verses:165, revelation:"مكية" },
  { name:"الأعراف", verses:206, revelation:"مكية" },
  { name:"الأنفال", verses:75, revelation:"مدنية" },
  { name:"التوبة", verses:129, revelation:"مدنية" },
  { name:"يونس", verses:109, revelation:"مكية" },
  { name:"هود", verses:123, revelation:"مكية" },
  { name:"يوسف", verses:111, revelation:"مكية" },
  { name:"الرعد", verses:43, revelation:"مدنية" },
  { name:"إبراهيم", verses:52, revelation:"مكية" },
  { name:"الحجر", verses:99, revelation:"مكية" },
  { name:"النحل", verses:128, revelation:"مكية" },
  { name:"الإسراء", verses:111, revelation:"مكية" },
  { name:"الكهف", verses:110, revelation:"مكية" },
  { name:"مريم", verses:98, revelation:"مكية" },
  { name:"طه", verses:135, revelation:"مكية" },
  { name:"الأنبياء", verses:112, revelation:"مكية" },
  { name:"الحج", verses:78, revelation:"مدنية" },
  { name:"المؤمنون", verses:118, revelation:"مكية" },
  { name:"النور", verses:64, revelation:"مدنية" },
  { name:"الفرقان", verses:77, revelation:"مكية" },
  { name:"الشعراء", verses:227, revelation:"مكية" },
  { name:"النمل", verses:93, revelation:"مكية" },
  { name:"القصص", verses:88, revelation:"مكية" },
  { name:"العنكبوت", verses:69, revelation:"مكية" },
  { name:"الروم", verses:60, revelation:"مكية" },
  { name:"لقمان", verses:34, revelation:"مكية" },
  { name:"السجدة", verses:30, revelation:"مكية" },
  { name:"الأحزاب", verses:73, revelation:"مدنية" },
  { name:"سبأ", verses:54, revelation:"مكية" },
  { name:"فاطر", verses:45, revelation:"مكية" },
  { name:"يس", verses:83, revelation:"مكية" },
  { name:"الصافات", verses:182, revelation:"مكية" },
  { name:"ص", verses:88, revelation:"مكية" },
  { name:"الزمر", verses:75, revelation:"مكية" },
  { name:"غافر", verses:85, revelation:"مكية" },
  { name:"فصلت", verses:54, revelation:"مكية" },
  { name:"الشورى", verses:53, revelation:"مكية" },
  { name:"الزخرف", verses:89, revelation:"مكية" },
  { name:"الدخان", verses:59, revelation:"مكية" },
  { name:"الجاثية", verses:37, revelation:"مكية" },
  { name:"الأحقاف", verses:35, revelation:"مكية" },
  { name:"محمد", verses:38, revelation:"مدنية" },
  { name:"الفتح", verses:29, revelation:"مدنية" },
  { name:"الحجرات", verses:18, revelation:"مدنية" },
  { name:"ق", verses:45, revelation:"مكية" },
  { name:"الذاريات", verses:60, revelation:"مكية" },
  { name:"الطور", verses:49, revelation:"مكية" },
  { name:"النجم", verses:62, revelation:"مكية" },
  { name:"القمر", verses:55, revelation:"مكية" },
  { name:"الرحمن", verses:78, revelation:"مكية" },
  { name:"الواقعة", verses:96, revelation:"مكية" },
  { name:"الحديد", verses:29, revelation:"مدنية" },
  { name:"المجادلة", verses:22, revelation:"مدنية" },
  { name:"الحشر", verses:24, revelation:"مدنية" },
  { name:"الممتحنة", verses:13, revelation:"مدنية" },
  { name:"الصف", verses:14, revelation:"مدنية" },
  { name:"الجمعة", verses:11, revelation:"مدنية" },
  { name:"المنافقون", verses:11, revelation:"مدنية" },
  { name:"التغابن", verses:18, revelation:"مدنية" },
  { name:"الطلاق", verses:12, revelation:"مدنية" },
  { name:"التحريم", verses:12, revelation:"مدنية" },
  { name:"الملك", verses:30, revelation:"مكية" },
  { name:"القلم", verses:52, revelation:"مكية" },
  { name:"الحاقة", verses:52, revelation:"مكية" },
  { name:"المعارج", verses:44, revelation:"مكية" },
  { name:"نوح", verses:28, revelation:"مكية" },
  { name:"الجن", verses:28, revelation:"مكية" },
  { name:"المزمل", verses:20, revelation:"مكية" },
  { name:"المدثر", verses:56, revelation:"مكية" },
  { name:"القيامة", verses:40, revelation:"مكية" },
  { name:"الإنسان", verses:31, revelation:"مدنية" },
  { name:"المرسلات", verses:50, revelation:"مكية" },
  { name:"النبأ", verses:40, revelation:"مكية" },
  { name:"النازعات", verses:46, revelation:"مكية" },
  { name:"عبس", verses:42, revelation:"مكية" },
  { name:"التكوير", verses:29, revelation:"مكية" },
  { name:"الانفطار", verses:19, revelation:"مكية" },
  { name:"المطففين", verses:36, revelation:"مكية" },
  { name:"الانشقاق", verses:25, revelation:"مكية" },
  { name:"البروج", verses:22, revelation:"مكية" },
  { name:"الطارق", verses:17, revelation:"مكية" },
  { name:"الأعلى", verses:19, revelation:"مكية" },
  { name:"الغاشية", verses:26, revelation:"مكية" },
  { name:"الفجر", verses:30, revelation:"مكية" },
  { name:"البلد", verses:20, revelation:"مكية" },
  { name:"الشمس", verses:15, revelation:"مكية" },
  { name:"الليل", verses:21, revelation:"مكية" },
  { name:"الضحى", verses:11, revelation:"مكية" },
  { name:"الشرح", verses:8, revelation:"مكية" },
  { name:"التين", verses:8, revelation:"مكية" },
  { name:"العلق", verses:19, revelation:"مكية" },
  { name:"القدر", verses:5, revelation:"مكية" },
  { name:"البينة", verses:8, revelation:"مدنية" },
  { name:"الزلزلة", verses:8, revelation:"مدنية" },
  { name:"العاديات", verses:11, revelation:"مكية" },
  { name:"القارعة", verses:11, revelation:"مكية" },
  { name:"التكاثر", verses:8, revelation:"مكية" },
  { name:"العصر", verses:3, revelation:"مكية" },
  { name:"الهمزة", verses:9, revelation:"مكية" },
  { name:"الفيل", verses:5, revelation:"مكية" },
  { name:"قريش", verses:4, revelation:"مكية" },
  { name:"الماعون", verses:7, revelation:"مكية" },
  { name:"الكوثر", verses:3, revelation:"مكية" },
  { name:"الكافرون", verses:6, revelation:"مكية" },
  { name:"النصر", verses:3, revelation:"مدنية" },
  { name:"المسد", verses:5, revelation:"مكية" },
  { name:"الإخلاص", verses:4, revelation:"مكية" },
  { name:"الفلق", verses:5, revelation:"مكية" },
  { name:"الناس", verses:6, revelation:"مكية" },
];

const emptyNote = { surah:"", ayahFrom:"", ayahTo:"", page:"", colorKeys:[], meaning:"", masail:[], reflection:"", topics:[], tags:[] };
const emptyIntro = { userNotes:"" };

// ── خريطة الموضوعات التلقائية لكل سورة ──
const SURAH_DEFAULT_TOPICS = {
  "الفاتحة":    ["التوحيد ونفي الشرك","الخوف والرجاء"],
  "البقرة":     ["الإيمان بالغيب","العبادات","المعاملات","الأسرة والنكاح","قصص الأنبياء"],
  "آل عمران":  ["الإيمان بالكتب","قصص الأنبياء","الجهاد والدفاع"],
  "النساء":     ["الأسرة والنكاح","المعاملات","الحدود والعقوبات","العلاقة مع غير المسلمين"],
  "المائدة":    ["العبادات","المعاملات","الحدود والعقوبات","العهود والمواثيق"],
  "الأنعام":    ["التوحيد ونفي الشرك","الأسماء والصفات","آيات الكون والطبيعة"],
  "الأعراف":    ["قصص الأنبياء","قصص الأمم السابقة","التوحيد ونفي الشرك"],
  "الأنفال":    ["الجهاد والدفاع","الإخلاص والنية","الشكر والصبر"],
  "التوبة":     ["الجهاد والدفاع","صفات المنافقين","التوبة والمغفرة"],
  "يونس":       ["قصص الأنبياء","التوحيد ونفي الشرك","الغفلة والتذكير"],
  "هود":        ["قصص الأنبياء","قصص الأمم السابقة","العبرة من القصص"],
  "يوسف":       ["قصص الأنبياء","الإخلاص والنية","الابتلاء والاختبار"],
  "الرعد":      ["الأسماء والصفات","آيات الكون والطبيعة","التفكر والتأمل"],
  "إبراهيم":    ["قصص الأنبياء","التوحيد ونفي الشرك","الشكر والصبر"],
  "الحجر":      ["قصص الأمم السابقة","الإيمان بالملائكة","التوحيد ونفي الشرك"],
  "النحل":      ["آيات الكون والطبيعة","الخلق والتدبير","الشكر والصبر"],
  "الإسراء":    ["العبادات","طبائع النفس البشرية","الإيمان بالكتب"],
  "الكهف":      ["قصص الأنبياء","الابتلاء والاختبار","الغفلة والتذكير"],
  "مريم":       ["قصص الأنبياء","التوحيد ونفي الشرك","الإيمان بالغيب"],
  "طه":         ["قصص الأنبياء","التوبة والمغفرة","العبادات"],
  "الأنبياء":   ["قصص الأنبياء","التوحيد ونفي الشرك","يوم القيامة وأهواله"],
  "الحج":       ["العبادات","يوم القيامة وأهواله","الجهاد والدفاع"],
  "المؤمنون":   ["تزكية النفس","الإخلاص والنية","يوم القيامة وأهواله"],
  "النور":      ["الحدود والعقوبات","الأسرة والنكاح","تزكية النفس"],
  "الفرقان":    ["التوحيد ونفي الشرك","صفات الكافرين","تزكية النفس"],
  "الشعراء":    ["قصص الأنبياء","العبرة من القصص","الأمر بالمعروف والنهي عن المنكر"],
  "النمل":      ["قصص الأنبياء","التوحيد ونفي الشرك","آيات الكون والطبيعة"],
  "القصص":      ["قصص الأنبياء","العبرة من القصص","التوكل على الله"],
  "العنكبوت":   ["الابتلاء والاختبار","قصص الأنبياء","التوحيد ونفي الشرك"],
  "الروم":      ["آيات الكون والطبيعة","التفكر والتأمل","يوم القيامة وأهواله"],
  "لقمان":      ["الخلق والتدبير","الأسرة والنكاح","الشكر والصبر"],
  "السجدة":     ["الإيمان بالغيب","الخلق والتدبير","يوم القيامة وأهواله"],
  "الأحزاب":    ["الأسرة والنكاح","الجهاد والدفاع","صفات المنافقين"],
  "سبأ":        ["التوحيد ونفي الشرك","الشكر والصبر","يوم القيامة وأهواله"],
  "فاطر":       ["الخلق والتدبير","التوحيد ونفي الشرك","صفات الكافرين"],
  "يس":         ["يوم القيامة وأهواله","التوحيد ونفي الشرك","الغفلة والتذكير"],
  "الصافات":    ["قصص الأنبياء","الإيمان بالملائكة","الجنة ونعيمها"],
  "ص":          ["قصص الأنبياء","الابتلاء والاختبار","التوبة والمغفرة"],
  "الزمر":      ["الإخلاص والنية","التوبة والمغفرة","يوم القيامة وأهواله"],
  "غافر":       ["التوبة والمغفرة","الأسماء والصفات","صفات الكافرين"],
  "فصلت":       ["التوحيد ونفي الشرك","آيات الكون والطبيعة","صفات الكافرين"],
  "الشورى":     ["الأسماء والصفات","القضاء والقدر","الإخلاص والنية"],
  "الزخرف":     ["التوحيد ونفي الشرك","قصص الأنبياء","الغفلة والتذكير"],
  "الدخان":     ["يوم القيامة وأهواله","النار وعذابها","قصص الأمم السابقة"],
  "الجاثية":    ["التوحيد ونفي الشرك","يوم القيامة وأهواله","الحساب والميزان"],
  "الأحقاف":    ["قصص الأمم السابقة","الإيمان بالغيب","صفات الكافرين"],
  "محمد":       ["الجهاد والدفاع","صفات المنافقين","الجنة ونعيمها"],
  "الفتح":      ["الجهاد والدفاع","الإخلاص والنية","التوكل على الله"],
  "الحجرات":    ["الأمر بالمعروف والنهي عن المنكر","العلاقة مع غير المسلمين","تزكية النفس"],
  "ق":          ["يوم القيامة وأهواله","الغفلة والتذكير","الخلق والتدبير"],
  "الذاريات":   ["التوحيد ونفي الشرك","قصص الأنبياء","يوم القيامة وأهواله"],
  "الطور":      ["يوم القيامة وأهواله","الجنة ونعيمها","التوحيد ونفي الشرك"],
  "النجم":      ["الإيمان بالغيب","الأسماء والصفات","التوحيد ونفي الشرك"],
  "القمر":      ["الغفلة والتذكير","قصص الأمم السابقة","يوم القيامة وأهواله"],
  "الرحمن":     ["الأسماء والصفات","الجنة ونعيمها","آيات الكون والطبيعة"],
  "الواقعة":    ["يوم القيامة وأهواله","الجنة ونعيمها","النار وعذابها"],
  "الحديد":     ["الإيمان بالغيب","الجهاد والدفاع","الشكر والصبر"],
  "المجادلة":   ["العبادات","صفات المنافقين","الأمر بالمعروف والنهي عن المنكر"],
  "الحشر":      ["التوحيد ونفي الشرك","الأسماء والصفات","صفات المنافقين"],
  "الممتحنة":   ["العلاقة مع غير المسلمين","الجهاد والدفاع","الأسرة والنكاح"],
  "الصف":       ["الجهاد والدفاع","الإخلاص والنية","قصص الأنبياء"],
  "الجمعة":     ["العبادات","الأمر بالمعروف والنهي عن المنكر","الغفلة والتذكير"],
  "المنافقون":  ["صفات المنافقين","الغفلة والتذكير","الإخلاص والنية"],
  "التغابن":    ["يوم القيامة وأهواله","الابتلاء والاختبار","الإيمان بالغيب"],
  "الطلاق":     ["الأسرة والنكاح","المعاملات","التوكل على الله"],
  "التحريم":    ["الأسرة والنكاح","التوبة والمغفرة","الإخلاص والنية"],
  "الملك":      ["الخلق والتدبير","يوم القيامة وأهواله","التفكر والتأمل"],
  "القلم":      ["الأخلاق والآداب","طبائع النفس البشرية","الابتلاء والاختبار"],
  "الحاقة":     ["يوم القيامة وأهواله","قصص الأمم السابقة","الإيمان بالكتب"],
  "المعارج":    ["يوم القيامة وأهواله","تزكية النفس","الخوف والرجاء"],
  "نوح":        ["قصص الأنبياء","التوبة والمغفرة","مصير المكذبين"],
  "الجن":       ["الإيمان بالغيب","التوحيد ونفي الشرك","الأسماء والصفات"],
  "المزمل":     ["العبادات","تزكية النفس","الصبر والمصابرة"],
  "المدثر":     ["الغفلة والتذكير","النار وعذابها","الأمر بالمعروف والنهي عن المنكر"],
  "القيامة":    ["يوم القيامة وأهواله","الموت وسكراته","الخلق والتدبير"],
  "الإنسان":    ["الجنة ونعيمها","الشكر والصبر","الإخلاص والنية"],
  "المرسلات":   ["يوم القيامة وأهواله","الإيمان بالملائكة","مصير المكذبين"],
  "النبأ":      ["يوم القيامة وأهواله","الخلق والتدبير","آيات الكون والطبيعة"],
  "النازعات":   ["الإيمان بالملائكة","يوم القيامة وأهواله","قصص الأنبياء"],
  "عبس":        ["الغفلة والتذكير","طبائع النفس البشرية","التوحيد ونفي الشرك"],
  "التكوير":    ["يوم القيامة وأهواله","الإيمان بالملائكة","الإيمان بالكتب"],
  "الانفطار":   ["يوم القيامة وأهواله","الحساب والميزان","الإيمان بالملائكة"],
  "المطففين":   ["يوم القيامة وأهواله","الحساب والميزان","طبائع النفس البشرية"],
  "الانشقاق":   ["يوم القيامة وأهواله","الابتلاء والاختبار","الخلق والتدبير"],
  "البروج":     ["الابتلاء والاختبار","قصص الأمم السابقة","مصير المكذبين"],
  "الطارق":     ["الخلق والتدبير","آيات الكون والطبيعة","يوم القيامة وأهواله"],
  "الأعلى":     ["التوحيد ونفي الشرك","تزكية النفس","الغفلة والتذكير"],
  "الغاشية":    ["يوم القيامة وأهواله","الجنة ونعيمها","النار وعذابها"],
  "الفجر":      ["يوم القيامة وأهواله","قصص الأمم السابقة","طبائع النفس البشرية"],
  "البلد":      ["طبائع النفس البشرية","الابتلاء والاختبار","الأمر بالمعروف والنهي عن المنكر"],
  "الشمس":      ["تزكية النفس","الابتلاء والاختبار","قصص الأنبياء"],
  "الليل":      ["الإخلاص والنية","الشكر والصبر","الخوف والرجاء"],
  "الضحى":      ["الأسماء والصفات","الشكر والصبر","التوكل على الله"],
  "الشرح":      ["الابتلاء والاختبار","الشكر والصبر","التوكل على الله"],
  "التين":      ["الخلق والتدبير","يوم القيامة وأهواله","الحساب والميزان"],
  "العلق":      ["طبائع النفس البشرية","العبادات","الغفلة والتذكير"],
  "القدر":      ["الإيمان بالملائكة","الإيمان بالكتب","القضاء والقدر"],
  "البينة":     ["الإيمان بالكتب","صفات الكافرين","الإخلاص والنية"],
  "الزلزلة":    ["يوم القيامة وأهواله","الحساب والميزان","الغفلة والتذكير"],
  "العاديات":   ["طبائع النفس البشرية","يوم القيامة وأهواله","الغفلة والتذكير"],
  "القارعة":    ["يوم القيامة وأهواله","الحساب والميزان","الجنة ونعيمها"],
  "التكاثر":    ["الغفلة والتذكير","طبائع النفس البشرية","يوم القيامة وأهواله"],
  "العصر":      ["الشكر والصبر","الأمر بالمعروف والنهي عن المنكر","تزكية النفس"],
  "الهمزة":     ["طبائع النفس البشرية","النار وعذابها","الغفلة والتذكير"],
  "الفيل":      ["قصص الأمم السابقة","التوحيد ونفي الشرك","الأسماء والصفات"],
  "قريش":       ["الشكر والصبر","التوحيد ونفي الشرك","العبادات"],
  "الماعون":    ["الإخلاص والنية","الأمر بالمعروف والنهي عن المنكر","صفات المنافقين"],
  "الكوثر":     ["الأسماء والصفات","العبادات","التوحيد ونفي الشرك"],
  "الكافرون":   ["التوحيد ونفي الشرك","العلاقة مع غير المسلمين","الإخلاص والنية"],
  "النصر":      ["التوبة والمغفرة","الأسماء والصفات","الشكر والصبر"],
  "المسد":      ["مصير المكذبين","طبائع النفس البشرية","يوم القيامة وأهواله"],
  "الإخلاص":    ["التوحيد ونفي الشرك","الأسماء والصفات","الإيمان بالغيب"],
  "الفلق":      ["التوحيد ونفي الشرك","الإيمان بالغيب","الأسماء والصفات"],
  "الناس":      ["التوحيد ونفي الشرك","الإيمان بالغيب","طبائع النفس البشرية"],
};

// ── Export HTML generator ──
function generateExportHTML(notes, surahIntros, opts = {}) {
  const {
    includeMeaning    = true,
    includeMasail     = true,
    includeReflection = true,
    includeTopicsTags = true,
    includePageNums   = true,
  } = opts;

  // ── Color helpers ──
  const MASALA_BG = { م:"#FFF27533", خ:"#D6B4FC33", د:"#A3E63533", ت:"#FF9F1C33" };
  const MASALA_BORDER = { م:"#FFF27588", خ:"#D6B4FC88", د:"#A3E63588", ت:"#FF9F1C88" };
  const MASALA_COLOR  = { م:"#7a6400", خ:"#5a1f8a", د:"#3d6600", ت:"#7a4000" };

  // ── Legend page ──
  const colorCards = COLOR_SYSTEM.map(cs => `
    <div class="legend-color-card" style="background:${cs.color}33;border:1px solid ${cs.color}88;border-radius:10px;padding:10px 14px;flex:1;min-width:120px">
      <div style="font-size:18px;font-weight:700;color:${cs.dark || "#333"}">${cs.key}</div>
      <div style="font-size:13px;font-weight:600;margin-top:2px">${cs.label}</div>
      <div style="font-size:11px;color:#666;margin-top:4px">${cs.desc || ""}</div>
    </div>`).join("");

  const topicPills = TOPICS.map(cat => {
    const pills = cat.items.map(t =>
      `<span style="display:inline-block;background:${cat.color}22;border:1px solid ${cat.color}55;color:${cat.color};border-radius:20px;padding:2px 10px;font-size:11px;margin:2px 3px">${t}</span>`
    ).join("");
    return `<div style="margin-bottom:8px"><span style="font-size:11px;font-weight:700;color:#888;display:block;margin-bottom:3px">${cat.category}</span>${pills}</div>`;
  }).join("");

  const legendPage = `
  <div class="legend-page" style="background:#1a1208;color:#e8d5a0;padding:32px 36px;border-radius:0;min-height:100vh;page-break-after:always">
    <div style="text-align:center;margin-bottom:28px">
      <div style="font-family:'Amiri',serif;font-size:28px;font-weight:700;color:#C9A84C;margin-bottom:6px">📖 مفكرة التفسير — القرطبي</div>
      <div style="font-size:13px;color:#888">تصدير بتاريخ ${new Date().toLocaleDateString("ar-SA")} · ${notes.length} ملاحظة</div>
      <div style="margin-top:10px;border-top:1px solid #C9A84C44;padding-top:10px;font-size:12px;color:#C9A84C99">﴿ وَنَزَّلْنَا عَلَيْكَ الْكِتَابَ تِبْيَانًا لِكُلِّ شَيْءٍ ﴾</div>
    </div>

    <div style="margin-bottom:24px">
      <div style="font-size:14px;font-weight:700;color:#C9A84C;margin-bottom:12px;border-right:3px solid #C9A84C;padding-right:10px">نظام الألوان الأربعة</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">${colorCards}</div>
    </div>

    <div style="margin-bottom:24px">
      <div style="font-size:14px;font-weight:700;color:#C9A84C;margin-bottom:12px;border-right:3px solid #C9A84C;padding-right:10px">الموضوعات القرآنية</div>
      <div style="background:#ffffff11;border-radius:10px;padding:14px 16px">${topicPills}</div>
    </div>

    <div>
      <div style="font-size:14px;font-weight:700;color:#C9A84C;margin-bottom:8px;border-right:3px solid #C9A84C;padding-right:10px">الوسوم</div>
      <div style="font-size:12px;color:#aaa">أسماء أعلام، مصطلحات، أو كلمات مفتاحية مسبوقة بـ <span style="background:#33333388;border-radius:6px;padding:1px 7px;font-family:monospace">#</span></div>
    </div>
  </div>`;

  // ── Notes pages ──
  const surahsWithNotes = [...new Set(notes.map(n => n.surah))];
  let body = "";
  for (const surahName of surahsWithNotes) {
    const surahNotes = notes.filter(n => n.surah === surahName);
    const surahData  = SURAHS.find(s => s.name === surahName);
    body += `<div class="surah-section">
      <div class="surah-header">
        <span class="surah-name">${surahName}</span>
        <span class="surah-meta">${surahData?.revelation ?? ""} · ${surahData?.verses ?? ""} آية</span>
      </div>`;

    for (const note of surahNotes) {
      const ayah = note.ayahFrom === note.ayahTo ? note.ayahFrom : `${note.ayahFrom}–${note.ayahTo}`;
      const pageStr = (includePageNums && note.page) ? `<span class="page-num">ص ${note.page}</span>` : "";

      // masail with color-coded rows
      const masailRows = includeMasail ? (note.masail || []).filter(m => m?.trim()).map((m, i) => {
        const { colorKey, text } = (() => {
          const match = m.match(/^([مخدت])\s*[—–-]\s*/);
          return match ? { colorKey: match[1], text: m.slice(match[0].length).trim() } : { colorKey: null, text: m.trim() };
        })();
        const bg  = colorKey ? MASALA_BG[colorKey]     : "#f5f5f533";
        const br  = colorKey ? MASALA_BORDER[colorKey] : "#ccc";
        const col = colorKey ? MASALA_COLOR[colorKey]  : "#555";
        const badge = colorKey ? `<span style="background:${COLOR_SYSTEM.find(c=>c.key===colorKey)?.color||"#eee"};color:#111;border-radius:12px;padding:1px 8px;font-size:11px;font-weight:700;margin-left:6px">${colorKey}</span>` : "";
        return `<div class="masala-row" style="background:${bg};border:1px solid ${br};border-radius:8px;padding:7px 12px;margin-bottom:6px;display:flex;align-items:flex-start;gap:8px">
          <span style="color:#aaa;font-size:11px;min-width:20px;padding-top:2px">${ARABIC_ORDINALS[i] || i+1}</span>
          <div style="flex:1;color:#222;font-size:14px;line-height:1.8">${badge}${text}</div>
        </div>`;
      }).join("") : "";

      // topics as colored category pills
      const topicPillsRow = (includeTopicsTags && note.topics?.length) ? note.topics.map(t => {
        const cat = TOPICS.find(c => c.items.includes(t));
        return `<span style="background:${cat?.color||"#888"}22;border:1px solid ${cat?.color||"#888"}55;color:${cat?.color||"#555"};border-radius:20px;padding:2px 11px;font-size:11px;margin:2px 3px;display:inline-block">${t}</span>`;
      }).join("") : "";

      const tagPillsRow = (includeTopicsTags && note.tags?.length) ?
        note.tags.map(t => `<span style="background:#33333322;border:1px solid #55555544;color:#666;border-radius:20px;padding:2px 10px;font-size:11px;margin:2px 3px;display:inline-block">#${t}</span>`).join("") : "";

      body += `<div class="note-card">
        <div class="note-header">
          <span>آية ${ayah}</span>
          ${pageStr}
        </div>
        ${includeMeaning && note.meaning ? `
        <div class="field-meaning">
          <div class="flabel">المعنى الإجمالي</div>
          <div class="meaning-text">${note.meaning.replace(/\n/g,"<br>")}</div>
        </div>` : ""}
        ${masailRows ? `
        <div class="field-masail">
          <div class="flabel">مسائل القرطبي</div>
          ${masailRows}
        </div>` : ""}
        ${includeReflection && note.reflection ? `
        <div class="field-reflection">
          <div class="flabel">الفوائد والاستنباطات + ما استوقفني + استفسارات ✦</div>
          <div class="reflection-text">${note.reflection.replace(/\n/g,"<br>")}</div>
        </div>` : ""}
        ${topicPillsRow ? `<div class="field-topics">${topicPillsRow}</div>` : ""}
        ${tagPillsRow   ? `<div class="field-tags">${tagPillsRow}</div>` : ""}
      </div>`;
    }
    body += `</div>`;
  }

  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="UTF-8">
<title>مفكرة التفسير — القرطبي</title>
<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  * { box-sizing:border-box; }
  body { font-family:'Cairo','Amiri',serif; direction:rtl; margin:0; color:#1a1a1a; background:#fff; font-size:14px; line-height:1.9; }
  .legend-page .legend-color-card { color:#1a1208; }
  .surah-section { margin-bottom:48px; padding:0 36px; }
  .surah-header { background:#1a1208; color:#C9A84C; border-radius:10px; padding:12px 20px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; font-size:22px; font-family:'Amiri',serif; font-weight:700; }
  .surah-meta { font-size:13px; color:#C9A84C99; font-weight:400; font-family:'Cairo',sans-serif; }
  .note-card { border:1px solid #e0d0b0; border-radius:10px; padding:16px 20px; margin-bottom:14px; background:#fffef8; page-break-inside:avoid; }
  .note-header { font-size:17px; font-weight:700; color:#6b4c10; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; }
  .page-num { font-size:12px; color:#bbb; font-weight:400; }
  .flabel { font-size:12px; font-weight:700; color:#C9A84C; margin-bottom:6px; }
  .field-meaning { border-right:3px solid #C9A84C; padding-right:12px; margin-bottom:12px; }
  .meaning-text { font-size:15px; color:#222; line-height:1.9; }
  .field-masail { margin-bottom:12px; }
  .field-reflection { border-right:3px solid #C9A84C55; padding-right:12px; margin-bottom:12px; }
  .reflection-text { font-size:14px; color:#444; line-height:1.9; background:#fffbf0; border-radius:8px; padding:10px 14px; }
  .field-topics { margin-bottom:6px; }
  .field-tags { margin-bottom:4px; }
  ol { margin:6px 0; padding-right:20px; }
  li { margin-bottom:4px; font-size:14px; }
  @media print {
    body { margin:0; }
    .surah-section { padding:0 20px; }
    .legend-page { min-height:auto; }
    .surah-section:not(:first-child) { page-break-before:always; }
    .note-card { page-break-inside:avoid; }
  }
</style>
</head>
<body>
${legendPage}
<div style="padding:28px 36px 0">
${body}
<p style="text-align:center;color:#ccc;font-size:11px;margin-top:40px;padding-bottom:20px">﴿ وَنَزَّلْنَا عَلَيْكَ الْكِتَابَ تِبْيَانًا لِكُلِّ شَيْءٍ ﴾</p>
</div>
</body>
</html>`;
}

// ── Storage helpers ──
const STORAGE_KEY_NOTES   = "tafsir-notes-v2";
const STORAGE_KEY_INTROS  = "tafsir-intros-v2";

function loadFromStorage(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch { return fallback; }
}
function saveToStorage(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

// ── Highlight badge ──
function HighlightBadge({ colorKey, size = "md" }) {
  const cs = COLOR_SYSTEM.find(c => c.key === colorKey);
  if (!cs) return null;
  const pad = size === "sm" ? "1px 8px" : "2px 11px";
  const fs  = size === "sm" ? 11 : 12;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:cs.bg, color:cs.dark, border:`1px solid ${cs.border}`, borderRadius:20, padding:pad, fontSize:fs, fontWeight:700, fontFamily:"inherit" }}>
      <span style={{ display:"inline-block", width:8, height:8, borderRadius:"50%", background:cs.color }} />
      {cs.key} · {cs.label}
    </span>
  );
}

function TopicBadge({ topic, onRemove }) {
  const cat = TOPICS.find(t => t.items.includes(topic));
  const color = cat?.color || "#888";
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:color+"22", color, border:`1px solid ${color}55`, borderRadius:20, padding:"2px 10px", fontSize:12, fontFamily:"inherit" }}>
      {topic}
      {onRemove && <span onClick={onRemove} style={{ cursor:"pointer", fontWeight:"bold", opacity:.7 }}>×</span>}
    </span>
  );
}

function TagBadge({ tag, onRemove, onClick }) {
  return (
    <span onClick={onClick} style={{ display:"inline-flex", alignItems:"center", gap:3, background:"#1e1e3a", color:"#8ab4f8", border:"1px solid #3a3a6a", borderRadius:20, padding:"2px 10px", fontSize:12, fontFamily:"inherit", cursor:onClick?"pointer":"default" }}>
      #{tag}
      {onRemove && <span onClick={e=>{ e.stopPropagation(); onRemove(); }} style={{ cursor:"pointer", fontWeight:"bold", opacity:.7 }}>×</span>}
    </span>
  );
}

function RevealBadge({ revelation }) {
  const isMakki = revelation === "مكية";
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:isMakki?"#2a1a00":"#001a2a", color:isMakki?"#e6a020":"#4ab4e6", border:`1px solid ${isMakki?"#e6a02044":"#4ab4e644"}`, borderRadius:20, padding:"2px 12px", fontSize:12, fontWeight:600 }}>
      {isMakki?"🕋":"🕌"} {revelation}
    </span>
  );
}

function Field({ label, value, color }) {
  return (
    <div style={{ marginTop:12 }}>
      <div style={{ color:color||"#8899bb", fontSize:12, marginBottom:4, fontWeight:600 }}>{label}</div>
      <div style={{ color:"#ccc", fontSize:14, lineHeight:1.8, whiteSpace:"pre-wrap" }}>{value}</div>
    </div>
  );
}

// ── Color System Legend ──
function ColorLegend() {
  return (
    <div style={{ background:"#13132a", border:"1px solid #2a2a4a", borderRadius:14, padding:"16px 20px", marginBottom:20 }}>
      <div style={{ color:"#8899bb", fontSize:11, fontWeight:700, marginBottom:12, letterSpacing:2 }}>نظام الألوان الأربعة — القرطبي</div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {COLOR_SYSTEM.map(cs => (
          <div key={cs.key} style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:28, height:28, borderRadius:8, background:cs.color, color:"#000", fontWeight:900, fontSize:14, flexShrink:0 }}>{cs.key}</span>
            <div>
              <span style={{ color:"#e0e0e0", fontSize:13, fontWeight:600 }}>{cs.label}</span>
              <span style={{ color:"#666", fontSize:12, marginRight:6 }}> — {cs.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Color Picker ──
function ColorPicker({ selected, onChange }) {
  return (
    <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:6 }}>
      {COLOR_SYSTEM.map(cs => {
        const active = selected.includes(cs.key);
        return (
          <button key={cs.key} onClick={() => onChange(active ? selected.filter(k=>k!==cs.key) : [...selected, cs.key])}
            title={cs.label + " — " + cs.desc}
            style={{ display:"inline-flex", alignItems:"center", gap:5, background:active?cs.bg:"#0d0d1a", color:active?cs.dark:"#555", border:`1.5px solid ${active?cs.color:"#2a2a4a"}`, borderRadius:20, padding:"4px 13px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit", transition:"all .15s" }}>
            <span style={{ display:"inline-block", width:9, height:9, borderRadius:"50%", background:cs.color, flexShrink:0 }} />
            {cs.key} · {cs.label}
          </button>
        );
      })}
    </div>
  );
}


// ── Arabic ordinals ──
const ARABIC_ORDINALS = ["الأولى","الثانية","الثالثة","الرابعة","الخامسة","السادسة","السابعة","الثامنة","التاسعة","العاشرة","الحادية عشرة","الثانية عشرة","الثالثة عشرة","الرابعة عشرة","الخامسة عشرة","السادسة عشرة","السابعة عشرة","الثامنة عشرة","التاسعة عشرة","العشرون"];

// ── Masail color prefix parser ──
function parseMasalaColor(text = "") {
  const match = text.match(/^([مخدت])\s*[—–-]\s*/);
  if (match) return { colorKey: match[1], text: text.slice(match[0].length).trim() };
  return { colorKey: null, text: text.trim() };
}

// ── Masail Editor ──
// masail is array of { text: string, colorKey: string }
function MasailEditor({ masail, onChange }) {
  const [count, setCount] = useState(masail.length || 0);

  const handleCountChange = (n) => {
    const num = Math.min(20, Math.max(0, Number(n)));
    setCount(num);
    const next = Array.from({ length: num }, (_, i) => masail[i] ?? { text: "", colorKey: "" });
    onChange(next);
  };

  const handleText = (i, val) => {
    const next = masail.map((m,idx) => idx===i ? { ...m, text: val } : m);
    onChange(next);
  };

  const handleColor = (i, key) => {
    const next = masail.map((m,idx) => idx===i ? { ...m, colorKey: m.colorKey===key ? "" : key } : m);
    onChange(next);
  };

  return (
    <div style={{ marginBottom:14 }}>
      {/* عداد المسائل */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
        <Label>مسائل القرطبي في هذه الآية</Label>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginRight:"auto" }}>
          <button onClick={()=>handleCountChange(count-1)} disabled={count===0}
            style={{ width:28, height:28, borderRadius:8, border:"1px solid #3a3a6a", background:"#1e1e3a", color:"#8ab4f8", fontSize:16, cursor:"pointer", fontFamily:"inherit", lineHeight:1 }}>−</button>
          <input type="number" min={0} max={20} value={count}
            onChange={e=>handleCountChange(e.target.value)}
            style={{ width:52, textAlign:"center", background:"#0d0d1a", border:"1px solid #C9A84C66", borderRadius:8, color:"#C9A84C", fontWeight:700, fontSize:16, padding:"3px 0", fontFamily:"inherit" }} />
          <button onClick={()=>handleCountChange(count+1)} disabled={count===20}
            style={{ width:28, height:28, borderRadius:8, border:"1px solid #3a3a6a", background:"#1e1e3a", color:"#8ab4f8", fontSize:16, cursor:"pointer", fontFamily:"inherit", lineHeight:1 }}>+</button>
          <span style={{ color:"#555", fontSize:12 }}>مسألة</span>
        </div>
      </div>

      {count === 0 && (
        <div style={{ color:"#444", fontSize:13, fontStyle:"italic", textAlign:"center", padding:"14px 0" }}>
          اختر عدد المسائل بالضغط على +
        </div>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {Array.from({ length: count }, (_, i) => {
          const item = masail[i] || { text: "", colorKey: "" };
          return (
            <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
              {/* رقم */}
              <div style={{ flexShrink:0, width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#C9A84C,#a07830)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13, color:"#fff", marginTop:8 }}>
                {i+1}
              </div>
              {/* المحتوى */}
              <div style={{ flex:1 }}>
                {/* Label + mini color picker */}
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                  <div style={{ color:"#8899bb", fontSize:11, fontWeight:600 }}>المسألة {ARABIC_ORDINALS[i]||(i+1)}</div>
                  <div style={{ display:"flex", gap:3 }}>
                    {COLOR_SYSTEM.map(cs => (
                      <button key={cs.key} onClick={()=>handleColor(i, cs.key)}
                        title={cs.label}
                        style={{
                          width:22, height:22, borderRadius:6, border: item.colorKey===cs.key ? `2px solid ${cs.color}` : "1px solid #2a2a4a",
                          background: item.colorKey===cs.key ? cs.color : "transparent",
                          color: item.colorKey===cs.key ? "#111" : cs.color,
                          fontWeight:700, fontSize:11, cursor:"pointer", fontFamily:"inherit",
                          transition:"all .15s"
                        }}>
                        {cs.key}
                      </button>
                    ))}
                  </div>
                  {item.colorKey && <HighlightBadge colorKey={item.colorKey} size="sm" />}
                </div>
                <textarea
                  value={item.text}
                  onChange={e=>handleText(i, e.target.value)}
                  rows={2}
                  placeholder={`ملخص المسألة ${ARABIC_ORDINALS[i]||(i+1)}...`}
                  style={{ background:"#0d0d1a", border:`1px solid ${item.colorKey ? COLOR_SYSTEM.find(c=>c.key===item.colorKey)?.border || "#C9A84C33" : "#C9A84C33"}`, borderRadius:8, color:"#e0e0e0", padding:"8px 12px", fontSize:13, fontFamily:"inherit", outline:"none", width:"100%", boxSizing:"border-box", resize:"vertical", lineHeight:1.8, transition:"border-color .15s" }}
                  onFocus={e=>e.target.style.borderColor="#C9A84C99"}
                  onBlur={e=>e.target.style.borderColor= item.colorKey ? (COLOR_SYSTEM.find(c=>c.key===item.colorKey)?.border||"#C9A84C33") : "#C9A84C33"}
                />
              </div>
            </div>
          );
        })}
      </div>

      {count > 0 && (
        <div style={{ marginTop:6, color:"#444", fontSize:11, textAlign:"left" }}>
          {masail.filter(m=>m?.text?.trim()).length} / {count} مسألة مكتملة
        </div>
      )}
    </div>
  );
}

// ── Note Card ──
function NoteCard({ note, index, onDelete, onTagClick }) {
  const [open, setOpen] = useState(false);
  const ayah = note.ayahFrom === note.ayahTo ? note.ayahFrom : `${note.ayahFrom}–${note.ayahTo}`;
  return (
    <div style={{ background:"#1a1a2e", border:"1px solid #2a2a4a", borderRadius:12, marginBottom:10, overflow:"hidden" }}>
      <div onClick={()=>setOpen(!open)} style={{ padding:"12px 16px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
            <span style={{ color:"#C9A84C", fontWeight:700, fontSize:14 }}>{note.surah} ({ayah||"—"})</span>
            {note.page && <span style={{ color:"#555", fontSize:11 }}>ص {note.page}</span>}
          </div>
          {note.colorKeys?.length > 0 && (
            <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:5 }}>
              {note.colorKeys.map(k => <HighlightBadge key={k} colorKey={k} size="sm" />)}
            </div>
          )}
          <div style={{ color:"#aaa", fontSize:13, maxWidth:360, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{note.meaning||"بلا ملخص"}</div>
          <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginTop:4 }}>
            {note.topics?.map(t=><TopicBadge key={t} topic={t} />)}
            {note.tags?.map(t=><TagBadge key={t} tag={t} onClick={()=>onTagClick(t)} />)}
          </div>
        </div>
        <span style={{ color:"#444", fontSize:14, marginRight:8 }}>{open?"▲":"▼"}</span>
      </div>
      {open && (
        <div style={{ padding:"0 16px 14px", borderTop:"1px solid #2a2a4a" }}>
          {note.meaning && <Field label="المعنى الإجمالي" value={note.meaning} />}

          {/* المسائل */}
          {note.masail?.length > 0 && (
            <div style={{ marginTop:14 }}>
              <div style={{ color:"#8899bb", fontSize:12, fontWeight:600, marginBottom:8, display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:20, height:20, borderRadius:"50%", background:"linear-gradient(135deg,#C9A84C,#a07830)", fontSize:11, color:"#fff", fontWeight:700 }}>{note.masail.filter(m=>m?.trim()).length}</span>
                مسائل القرطبي
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {note.masail.map((m, i) => {
                  if (!m?.trim()) return null;
                  const { colorKey, text } = parseMasalaColor(m);
                  return (
                    <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
                      <div style={{ flexShrink:0, width:22, height:22, borderRadius:"50%", background:"linear-gradient(135deg,#C9A84C,#a07830)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:11, color:"#fff", marginTop:2 }}>{i+1}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
                          <div style={{ color:"#8899bb", fontSize:11 }}>المسألة {ARABIC_ORDINALS[i]||i+1}</div>
                          {colorKey && <HighlightBadge colorKey={colorKey} size="sm" />}
                        </div>
                        <div style={{ color:"#ccc", fontSize:13, lineHeight:1.8, background:"#0d0d1a55", borderRadius:8, padding:"6px 10px", border:"1px solid #C9A84C22" }}>{text}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {note.reflection && <Field label="الفوائد والاستنباطات + ما استوقفني + استفسارات ✦" value={note.reflection} color="#C9A84C" />}
          <button onClick={()=>onDelete(index)} style={{ marginTop:12, background:"#3a0000", color:"#ff6b6b", border:"1px solid #ff6b6b44", borderRadius:8, padding:"5px 14px", cursor:"pointer", fontSize:12 }}>حذف</button>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════
// ── MIND MAP COMPONENT ──
// ══════════════════════════════════════════════

const MM_COLORS = {
  center:   "#C9A84C",
  topics:   "#4A90D9",
  masail:   "#C9A84C",
  tags:     "#F39C12",
  reflection:"#27AE60",
  personal: "#C0392B",
};

function useContainerWidth(ref) {
  const [w, setW] = useState(700);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(entries => setW(entries[0].contentRect.width));
    ro.observe(ref.current);
    setW(ref.current.offsetWidth);
    return () => ro.disconnect();
  }, []);
  return w;
}

// رسم خط منحنٍ بين نقطتين
function CurvedPath({ x1,y1,x2,y2,color,opacity=1,width=1.5 }) {
  const mx = (x1+x2)/2;
  return <path d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`}
    fill="none" stroke={color} strokeWidth={width} strokeOpacity={opacity} />;
}

// عقدة نصية مع تقطيع النص
function MapNode({ x,y,text,color,bg,fontSize=12,maxW=120,bold=false,onClick,highlight,dimmed }) {
  const lines = wrapText(text, maxW, fontSize);
  const lh = fontSize*1.4;
  const h  = lines.length * lh + 12;
  const w  = Math.min(maxW+16, 200);
  return (
    <g transform={`translate(${x-w/2},${y-h/2})`}
       style={{ cursor: onClick?"pointer":"default", opacity: dimmed?0.25:1, transition:"opacity .2s" }}
       onClick={onClick}>
      <rect width={w} height={h} rx={h/2} fill={bg||"#1a1a2e"}
        stroke={color} strokeWidth={highlight?2:1} strokeOpacity={highlight?1:0.6} />
      {lines.map((l,i)=>(
        <text key={i} x={w/2} y={12+lh*(i+0.75)} textAnchor="middle"
          fill={color} fontSize={fontSize} fontWeight={bold?"700":"400"}
          fontFamily="Cairo,serif" dominantBaseline="middle">{l}</text>
      ))}
    </g>
  );
}

function wrapText(text="", maxW, fs) {
  if (!text) return [""];
  const charsPerLine = Math.floor(maxW / (fs*0.6));
  const words = text.split(" ");
  const lines=[]; let cur="";
  for (const w of words) {
    if ((cur+" "+w).trim().length > charsPerLine) { if(cur) lines.push(cur); cur=w; }
    else cur=(cur+" "+w).trim();
  }
  if(cur) lines.push(cur);
  return lines.slice(0,3); // max 3 lines
}

// ── خريطة السورة ──
function SurahMindMap({ surahName, notes, intro, width }) {
  const [active, setActive] = useState(null);
  const surahNotes = notes.filter(n=>n.surah===surahName);
  const cx = width/2, cy = 200;

  // بناء الفروع من البيانات
  const allTopics  = [...new Set(surahNotes.flatMap(n=>n.topics||[]))].slice(0,6);
  const allTags    = [...new Set(surahNotes.flatMap(n=>n.tags||[]))].slice(0,6);
  const masailSamples = surahNotes.flatMap(n=>(n.masail||[]).filter(m=>m?.trim()).slice(0,1)).slice(0,5);
  const reflections   = surahNotes.filter(n=>n.reflection?.trim()).map(n=>n.reflection.slice(0,30)+"…").slice(0,4);

  const branches = [
    { key:"topics",    label:"الموضوعات",     color:MM_COLORS.topics,    children:allTopics,       angle:-130 },
    { key:"masail",    label:"المسائل",        color:MM_COLORS.masail,    children:masailSamples,   angle:-50  },
    { key:"tags",      label:"الوسوم",          color:MM_COLORS.tags,      children:allTags,         angle:50   },
    { key:"reflection",label:"الفوائد",         color:MM_COLORS.reflection,children:reflections,     angle:130  },
  ].filter(b=>b.children.length>0);

  const svgH = Math.max(420, branches.reduce((acc,b)=>Math.max(acc,b.children.length*52+120),0));

  // توزيع الفروع على الجانبين
  const left  = branches.filter((_,i)=>i%2===0);
  const right = branches.filter((_,i)=>i%2===1);

  function layoutBranch(branch, side, branchIdx, totalOnSide) {
    const isLeft = side==="left";
    const armX   = isLeft ? cx-130 : cx+130;
    const spread = 130;
    const startY = cy - ((totalOnSide-1)*spread)/2;
    const armY   = startY + branchIdx*spread;
    const leafX  = isLeft ? armX-140 : armX+140;
    return { armX, armY, leafX, isLeft };
  }

  const nodes = [];
  const paths = [];

  // رسم الفروع اليسرى
  left.forEach((branch, i) => {
    const { armX, armY, leafX } = layoutBranch(branch,"left",i,left.length);
    paths.push(<CurvedPath key={`arm-l-${i}`} x1={cx} y1={cy} x2={armX} y2={armY} color={branch.color} width={2} opacity={active&&active!==branch.key?0.15:0.7} />);
    nodes.push(<MapNode key={`lbl-l-${i}`} x={armX} y={armY} text={branch.label} color={branch.color} bold fontSize={13} maxW={90}
      highlight={active===branch.key} dimmed={active&&active!==branch.key} onClick={()=>setActive(active===branch.key?null:branch.key)} />);
    const cStep = 46;
    const cStart= armY - ((branch.children.length-1)*cStep)/2;
    branch.children.forEach((c,j)=>{
      const cy2 = cStart + j*cStep;
      paths.push(<CurvedPath key={`c-l-${i}-${j}`} x1={armX} y1={armY} x2={leafX} y2={cy2} color={branch.color} opacity={active&&active!==branch.key?0.08:0.4} />);
      nodes.push(<MapNode key={`leaf-l-${i}-${j}`} x={leafX} y={cy2} text={c} color={branch.color} fontSize={11} maxW={100}
        dimmed={active&&active!==branch.key} />);
    });
  });

  // رسم الفروع اليمنى
  right.forEach((branch, i) => {
    const { armX, armY, leafX } = layoutBranch(branch,"right",i,right.length);
    paths.push(<CurvedPath key={`arm-r-${i}`} x1={cx} y1={cy} x2={armX} y2={armY} color={branch.color} width={2} opacity={active&&active!==branch.key?0.15:0.7} />);
    nodes.push(<MapNode key={`lbl-r-${i}`} x={armX} y={armY} text={branch.label} color={branch.color} bold fontSize={13} maxW={90}
      highlight={active===branch.key} dimmed={active&&active!==branch.key} onClick={()=>setActive(active===branch.key?null:branch.key)} />);
    const cStep = 46;
    const cStart= armY - ((branch.children.length-1)*cStep)/2;
    branch.children.forEach((c,j)=>{
      const cy2 = cStart + j*cStep;
      paths.push(<CurvedPath key={`c-r-${i}-${j}`} x1={armX} y1={armY} x2={leafX} y2={cy2} color={branch.color} opacity={active&&active!==branch.key?0.08:0.4} />);
      nodes.push(<MapNode key={`leaf-r-${i}-${j}`} x={leafX} y={cy2} text={c} color={branch.color} fontSize={11} maxW={100}
        dimmed={active&&active!==branch.key} />);
    });
  });

  const surahData = SURAHS.find(s=>s.name===surahName);

  return (
    <svg width={width} height={svgH} style={{ display:"block", overflow:"visible" }}>
      <defs>
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0"/>
        </radialGradient>
      </defs>
      {/* وهج المركز */}
      <circle cx={cx} cy={cy} r={80} fill="url(#centerGlow)" />
      {/* الخطوط */}
      {paths}
      {/* عقدة المركز */}
      <g onClick={()=>setActive(null)} style={{ cursor:"pointer" }}>
        <circle cx={cx} cy={cy} r={48} fill="#0d0d1a" stroke="#C9A84C" strokeWidth={2} />
        <text x={cx} y={cy-8}  textAnchor="middle" fill="#C9A84C" fontSize={15} fontWeight="700" fontFamily="Amiri,serif">{surahName}</text>
        <text x={cx} y={cy+10} textAnchor="middle" fill="#888" fontSize={10} fontFamily="Cairo,serif">{surahData?.revelation}</text>
        <text x={cx} y={cy+24} textAnchor="middle" fill="#666" fontSize={10} fontFamily="Cairo,serif">{surahNotes.length} ملاحظة</text>
      </g>
      {/* العقد */}
      {nodes}
    </svg>
  );
}

// ── خريطة الآية ──
function AyahMindMap({ note, width }) {
  const [active, setActive] = useState(null);
  const cx = width/2, cy = 210;

  const masailList = (note.masail||[]).filter(m=>m?.trim());
  const topicList  = (note.topics||[]);
  const tagList    = (note.tags||[]);

  const branches = [
    { key:"meaning",    label:"المعنى",       color:"#64DFDF",           children: note.meaning ? [note.meaning.slice(0,40)+"…"] : [],    angle:-150 },
    { key:"masail",     label:"المسائل",       color:MM_COLORS.masail,    children: masailList.map((m,i)=>`${i+1}. ${m.slice(0,28)}…`),    angle:-90  },
    { key:"reflection", label:"الفوائد",       color:MM_COLORS.reflection,children: note.reflection ? [note.reflection.slice(0,40)+"…"] : [], angle:30  },
    { key:"topics",     label:"الموضوعات",     color:MM_COLORS.topics,    children: topicList,                                              angle:90   },
    { key:"tags",       label:"الوسوم",         color:MM_COLORS.tags,      children: tagList.map(t=>"#"+t),                                  angle:150  },
  ].filter(b=>b.children.length>0);

  const svgH = Math.max(440, branches.length * 80 + 100);

  const left  = branches.filter((_,i)=>i%2===0);
  const right = branches.filter((_,i)=>i%2===1);

  const paths=[]; const nodes=[];

  function drawSide(list, side) {
    const isLeft = side==="left";
    const armX   = isLeft ? cx-120 : cx+120;
    const spread = Math.min(110, (svgH-80)/Math.max(list.length,1));
    const startY = cy - ((list.length-1)*spread)/2;
    list.forEach((branch,i) => {
      const armY  = startY + i*spread;
      const leafX = isLeft ? armX-130 : armX+130;
      paths.push(<CurvedPath key={`arm-${side}-${i}`} x1={cx} y1={cy} x2={armX} y2={armY} color={branch.color} width={2} opacity={active&&active!==branch.key?0.1:0.7}/>);
      nodes.push(<MapNode key={`lbl-${side}-${i}`} x={armX} y={armY} text={branch.label} color={branch.color} bold fontSize={12} maxW={85}
        highlight={active===branch.key} dimmed={active&&active!==branch.key} onClick={()=>setActive(active===branch.key?null:branch.key)}/>);
      const cStep  = 40;
      const cStart = armY - ((branch.children.length-1)*cStep)/2;
      branch.children.forEach((c,j)=>{
        const cy2 = cStart+j*cStep;
        paths.push(<CurvedPath key={`c-${side}-${i}-${j}`} x1={armX} y1={armY} x2={leafX} y2={cy2} color={branch.color} opacity={active&&active!==branch.key?0.06:0.35}/>);
        nodes.push(<MapNode key={`leaf-${side}-${i}-${j}`} x={leafX} y={cy2} text={c} color={branch.color} fontSize={10} maxW={95}
          dimmed={active&&active!==branch.key}/>);
      });
    });
  }
  drawSide(left,"left");
  drawSide(right,"right");

  const ayah = note.ayahFrom===note.ayahTo ? note.ayahFrom : `${note.ayahFrom}–${note.ayahTo}`;

  return (
    <svg width={width} height={svgH} style={{ display:"block", overflow:"visible" }}>
      <defs>
        <radialGradient id="ayahGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={75} fill="url(#ayahGlow)"/>
      {paths}
      <g onClick={()=>setActive(null)} style={{ cursor:"pointer" }}>
        <circle cx={cx} cy={cy} r={52} fill="#0d0d1a" stroke="#C9A84C" strokeWidth={2}/>
        <text x={cx} y={cy-14} textAnchor="middle" fill="#C9A84C" fontSize={13} fontWeight="700" fontFamily="Amiri,serif">{note.surah}</text>
        <text x={cx} y={cy+4}  textAnchor="middle" fill="#aaa"     fontSize={12} fontFamily="Cairo,serif">آية {ayah}</text>
        {note.colorKeys?.length>0 && (
          <text x={cx} y={cy+20} textAnchor="middle" fill="#666" fontSize={10} fontFamily="Cairo,serif">{note.colorKeys.join(" · ")}</text>
        )}
      </g>
      {nodes}
    </svg>
  );
}

// ── واجهة الخرائط الذهنية ──
function MindMapView({ notes, surahIntros }) {
  const [mapType, setMapType]     = useState("surah"); // surah | ayah
  const [selSurah, setSelSurah]   = useState("");
  const [selNoteIdx, setSelNoteIdx] = useState(0);
  const containerRef = useRef(null);
  const width = useContainerWidth(containerRef);

  const surahsWithNotes = [...new Set(notes.map(n=>n.surah))];
  const surahNotes = notes.filter(n=>n.surah===selSurah);

  // اختر السورة الأولى تلقائياً
  useEffect(()=>{ if(!selSurah && surahsWithNotes.length) setSelSurah(surahsWithNotes[0]); },[notes]);
  useEffect(()=>{ setSelNoteIdx(0); },[selSurah, mapType]);

  const exportPNG = () => {
    const svg = containerRef.current?.querySelector("svg");
    if (!svg) return;
    const data = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([data], {type:"image/svg+xml"});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href=url; a.download=`خريطة-${selSurah||"الآية"}.svg`; a.click();
    URL.revokeObjectURL(url);
  };

  if (surahsWithNotes.length===0) return (
    <div style={{ maxWidth:700, margin:"0 auto", textAlign:"center", color:"#555", padding:60 }}>
      <div style={{ fontSize:40, marginBottom:12 }}>🧠</div>
      أضف ملاحظات أولاً لتظهر الخرائط الذهنية
    </div>
  );

  return (
    <div style={{ maxWidth:860, margin:"0 auto" }}>
      {/* أدوات التحكم */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16, alignItems:"center", background:"#13132a", borderRadius:12, padding:"12px 16px", border:"1px solid #2a2a4a" }}>
        {/* نوع الخريطة */}
        <div style={{ display:"flex", gap:4 }}>
          {[["surah","🗺 خريطة السورة"],["ayah","🔍 خريطة الآية"]].map(([v,l])=>(
            <button key={v} onClick={()=>setMapType(v)}
              style={{ padding:"5px 14px", borderRadius:20, border:"1px solid", borderColor:mapType===v?"#C9A84C":"#2a2a4a", background:mapType===v?"#C9A84C22":"transparent", color:mapType===v?"#C9A84C":"#888", fontFamily:"inherit", fontSize:13, cursor:"pointer" }}>{l}</button>
          ))}
        </div>

        {/* اختيار السورة */}
        <select value={selSurah} onChange={e=>setSelSurah(e.target.value)}
          style={{ background:"#0d0d1a", border:"1px solid #2a2a4a", borderRadius:8, color:"#e0e0e0", padding:"5px 10px", fontSize:13, fontFamily:"inherit", flex:1, minWidth:120 }}>
          {surahsWithNotes.map(s=><option key={s} value={s}>{s}</option>)}
        </select>

        {/* اختيار الآية (في وضع الآية) */}
        {mapType==="ayah" && surahNotes.length>0 && (
          <select value={selNoteIdx} onChange={e=>setSelNoteIdx(Number(e.target.value))}
            style={{ background:"#0d0d1a", border:"1px solid #2a2a4a", borderRadius:8, color:"#e0e0e0", padding:"5px 10px", fontSize:13, fontFamily:"inherit" }}>
            {surahNotes.map((n,i)=>(
              <option key={i} value={i}>آية {n.ayahFrom}{n.ayahTo&&n.ayahTo!==n.ayahFrom?"–"+n.ayahTo:""}</option>
            ))}
          </select>
        )}

        {/* تصدير */}
        <button onClick={exportPNG}
          style={{ background:"transparent", color:"#C9A84C", border:"1px solid #C9A84C55", borderRadius:8, padding:"5px 12px", cursor:"pointer", fontFamily:"inherit", fontSize:12, marginRight:"auto" }}>
          ⬇ تصدير SVG
        </button>
      </div>

      {/* لوحة الخريطة */}
      <div ref={containerRef}
        style={{ background:"#0d0d1a", borderRadius:16, border:"1px solid #2a2a4a", padding:"10px 0", overflowX:"auto", minHeight:300 }}>
        {mapType==="surah" && selSurah && (
          <SurahMindMap
            surahName={selSurah}
            notes={notes}
            intro={surahIntros[selSurah]}
            width={Math.max(width, 640)}
          />
        )}
        {mapType==="ayah" && surahNotes.length>0 && (
          <AyahMindMap
            note={surahNotes[selNoteIdx]}
            width={Math.max(width, 640)}
          />
        )}
        {mapType==="ayah" && surahNotes.length===0 && (
          <div style={{ textAlign:"center", color:"#555", padding:60 }}>لا توجد ملاحظات لهذه السورة</div>
        )}
      </div>

      {/* تلميح */}
      <div style={{ color:"#444", fontSize:11, textAlign:"center", marginTop:8 }}>
        اضغط على أي فرع لتمييزه · اضغط على المركز لإظهار الكل
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// ── QUICK INPUT COMPONENT ──
// ══════════════════════════════════════════════

function parseNotes(text) {
  // Split into blocks by --- or by detecting a new surah header line
  const blocks = text.split(/\n---+\n/).map(b => b.trim()).filter(Boolean);
  const results = [];

  for (const block of blocks) {
    const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
    if (!lines.length) continue;

    const note = { ...emptyNote, masail: [], colorKeys: [], topics: [], tags: [] };
    let currentMasala = null;

    for (const line of lines) {
      // Surah + ayah on first line: e.g. "الكهف ١" or "الكهف آية ١" or "الكهف ١-٢"
      if (!note.surah) {
        const surahMatch = line.match(/^([^\d٠-٩:]+?)\s*([\d٠-٩]+)?\s*[-–]?\s*([\d٠-٩]+)?$/);
        if (surahMatch && surahMatch[1].trim().length > 1) {
          note.surah = surahMatch[1].trim();
          note.ayahFrom = surahMatch[2] || "";
          note.ayahTo   = surahMatch[3] || surahMatch[2] || "";
          continue;
        }
      }
      // التاريخ: — ignore
      if (/^التاريخ[:：]/.test(line)) continue;
      // السورة: الكهف  or  سورة: الكهف
      if (/^(السورة|سورة)[:：]/.test(line)) { note.surah = line.replace(/^[^:：]+[:：]\s*/, ""); continue; }
      // الآية من: ١  or  آية: ١  or  من آية: ١
      if (/^(الآية من|آية من|آية|من آية|من|رقم الآية)[:：]/.test(line)) { note.ayahFrom = line.replace(/^[^:：]+[:：]\s*/, ""); continue; }
      // إلى: ٢  or  إلى آية: ٢
      if (/^(إلى آية|إلى|حتى آية|حتى)[:：]/.test(line)) { note.ayahTo = line.replace(/^[^:：]+[:：]\s*/, ""); continue; }
      // رقم الصفحة: ١٥٠  or  صفحة: ١٥٠
      if (/^(رقم الصفحة|الصفحة|صفحة)[:：]/.test(line)) { note.page = line.replace(/^[^:：]+[:：]\s*/, ""); continue; }

      // م: المعنى
      if (/^م[:：]/.test(line)) {
        note.meaning = (note.meaning ? note.meaning + "\n" : "") + line.replace(/^م[:：]\s*/, "");
        if (!note.colorKeys.includes("م")) note.colorKeys.push("م");
        continue;
      }
      // خ: خلاصة القرطبي → goes into masail
      if (/^خ[:：]/.test(line)) {
        note.masail.push("خلاصة القرطبي: " + line.replace(/^خ[:：]\s*/, ""));
        if (!note.colorKeys.includes("خ")) note.colorKeys.push("خ");
        continue;
      }
      // د: دليل → goes into masail
      if (/^د[:：]/.test(line)) {
        note.masail.push("دليل: " + line.replace(/^د[:：]\s*/, ""));
        if (!note.colorKeys.includes("د")) note.colorKeys.push("د");
        continue;
      }
      // ت: لطيفة → reflection
      if (/^ت[:：]/.test(line)) {
        note.reflection = (note.reflection ? note.reflection + "\n" : "") + line.replace(/^ت[:：]\s*/, "");
        if (!note.colorKeys.includes("ت")) note.colorKeys.push("ت");
        continue;
      }
      // مسألة ١: [م/خ/د/ت]: text  or  مسألة ١: text
      if (/^مسألة\s*[\d٠-٩]*[:：]/.test(line)) {
        const body = line.replace(/^مسألة\s*[\d٠-٩]*[:：]\s*/, "");
        // detect inline color key: "خ: text" or "م — text"
        const colorMatch = body.match(/^([مخدت])[:：]\s*(.+)/);
        if (colorMatch) {
          const [, ck, txt] = colorMatch;
          note.masail.push(`${ck} — ${txt}`);
          if (!note.colorKeys.includes(ck)) note.colorKeys.push(ck);
        } else {
          note.masail.push(body);
        }
        continue;
      }
      // الفوائد والاستنباطات...: text (reflection section header — take text after colon)
      if (/^الفوائد/.test(line)) {
        const afterColon = line.replace(/^[^:：]*[:：]\s*/, "");
        if (afterColon && afterColon !== line) note.reflection = (note.reflection ? note.reflection + "\n" : "") + afterColon;
        continue;
      }
      // وسوم: وسم١، وسم٢
      if (/^(وسوم|وسم|tags)[:：]/.test(line)) {
        const tags = line.replace(/^[^:：]+[:：]\s*/, "").split(/[،,]/).map(t=>t.trim()).filter(Boolean);
        note.tags.push(...tags);
        continue;
      }
      // الموضوعات المختارة: — preferred topics field
      if (/^الموضوعات المختارة[:：]/.test(line)) {
        const tops = line.replace(/^[^:：]+[:：]\s*/, "").split(/[،,\/]/).map(t=>t.trim()).filter(Boolean);
        note.topics.push(...tops.filter(t => ALL_TOPICS.includes(t)));
        continue;
      }
      // موضوعات: ... (skip if it looks like the full reference legend — too many items)
      if (/^(موضوع|موضوعات|topics)[:：]/.test(line)) {
        const tops = line.replace(/^[^:：]+[:：]\s*/, "").split(/[،,\/]/).map(t=>t.trim()).filter(Boolean);
        const valid = tops.filter(t => ALL_TOPICS.includes(t));
        if (valid.length <= 6) note.topics.push(...valid); // skip legend lines with many items
        continue;
      }
    }

    if (note.surah) {
      if (!note.ayahTo) note.ayahTo = note.ayahFrom;
      results.push(note);
    }
  }
  return results;
}

function QuickInputView({ onSaveNotes }) {
  const [stage, setStage]   = useState("input");
  const [rawText, setRawText] = useState("");
  const [parsed, setParsed]   = useState([]);
  const [error, setError]     = useState("");
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setRawText(ev.target.result); setError(""); };
    reader.readAsText(file, "UTF-8");
  };

  const [copied, setCopied] = useState(false);

  const analyze = () => {
    if (!rawText.trim()) return setError("الرجاء كتابة الملاحظات أولاً");

    // If Claude.ai returned JSON directly, parse it without any API call
    const trimmed = rawText.trim();
    if (trimmed.startsWith("{") && trimmed.includes('"notes"')) {
      try {
        const result = JSON.parse(trimmed);
        const notes = (result.notes || []).map(n => ({
          ...emptyNote, ...n,
          ayahFrom: String(n.ayahFrom || ""),
          ayahTo:   String(n.ayahTo || ""),
          masail:   Array.isArray(n.masail) ? n.masail.filter(m => m?.trim()) : [],
          topics:   (n.topics || []).filter(t => ALL_TOPICS.includes(t)),
          tags:     Array.isArray(n.tags) ? n.tags : [],
          colorKeys:Array.isArray(n.colorKeys) ? n.colorKeys.filter(k => COLOR_SYSTEM.some(c => c.key === k)) : [],
        }));
        if (notes.length > 0) {
          setParsed(notes);
          setStage("reviewing");
          setError("");
          return;
        }
      } catch {}
    }

    // Otherwise use the local text parser
    const results = parseNotes(rawText);
    if (results.length === 0) return setError("لم يُعثر على ملاحظات — تأكد من الصيغة في المثال أدناه");
    setParsed(results);
    setStage("reviewing");
    setError("");
  };

  const copyClaudePrompt = () => {
    const userNotes = rawText.trim() || "[الصق ملاحظاتك هنا]";
    const prompt = `تنبيه: هذه مهمة تنسيق بيانات فقط. لا تبنِ تطبيقاً ولا تشرح ولا تضف أي نص. أعد JSON فقط.

مهمتك الوحيدة: حول الملاحظات أدناه إلى هذا الـ JSON بالضبط:

{"notes":[{"surah":"اسم السورة","ayahFrom":"رقم","ayahTo":"رقم","page":"رقم","colorKeys":[],"meaning":"المعنى الإجمالي","masail":["م — نص","خ — نص","د — نص","ت — نص"],"reflection":"الفوائد","topics":["من القائمة فقط"],"tags":["وسم"]}]}

قواعد المسائل: كل مسألة تبدأ بـ "مسألة N: [م/خ/د/ت]: النص" حيث م — أحكام | خ — خلاصة | د — أدلة | ت — تربوية. في الـ JSON ضع كل مسألة بصيغة "م — نص" أو "خ — نص" إلخ. حقل "reflection" للفوائد والاستنباطات. "الموضوعات المختارة" تذهب إلى topics.

الموضوعات المتاحة فقط:
التوحيد ونفي الشرك، الأسماء والصفات، الإيمان بالغيب، الإيمان بالملائكة، الإيمان بالكتب، القضاء والقدر، التوبة والمغفرة، تزكية النفس، الخوف والرجاء، الشكر والصبر، الإخلاص والنية، يوم القيامة وأهواله، الجنة ونعيمها، النار وعذابها، الحساب والميزان، الشفاعة، قصص الأنبياء، قصص الأمم السابقة، العبرة من القصص، العبادات، المعاملات، الأسرة والنكاح، الحدود والعقوبات، طبائع النفس البشرية، الغفلة والتذكير، الابتلاء والاختبار، الموت وسكراته، آيات الكون والطبيعة، الخلق والتدبير، التفكر والتأمل، صفات المنافقين، صفات الكافرين، مصير المكذبين، الأمر بالمعروف والنهي عن المنكر، العلاقة مع غير المسلمين، الجهاد والدفاع

ملاحظة: أعد JSON فقط. لا شرح. لا مقدمة. لا نص إضافي.

الملاحظات:
${userNotes}`;
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const saveAll = () => { onSaveNotes(parsed); setParsed([]); setRawText(""); setStage("done"); };
  const removeNote = (i) => setParsed(p => p.filter((_,idx)=>idx!==i));
  const updateNote = (i, field, val) => setParsed(p => p.map((n,idx)=>idx===i?{...n,[field]:val}:n));

  if (stage === "done") return (
    <div style={{ maxWidth:600, margin:"0 auto", textAlign:"center", padding:60 }}>
      <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
      <div style={{ color:"#27AE60", fontSize:20, fontWeight:700, marginBottom:8 }}>تم الحفظ بنجاح</div>
      <div style={{ color:"#555", fontSize:14, marginBottom:24 }}>انتقل إلى "الملاحظات" لمراجعتها</div>
      <button onClick={()=>setStage("input")} style={{ background:"#C9A84C", color:"#000", border:"none", borderRadius:10, padding:"10px 28px", fontFamily:"inherit", fontWeight:700, fontSize:15, cursor:"pointer" }}>
        إدخال جديد
      </button>
    </div>
  );

  if (stage === "reviewing") return (
    <div style={{ maxWidth:700, margin:"0 auto" }}>
      <div style={{ background:"#13132a", borderRadius:12, padding:"14px 20px", marginBottom:16, border:"1px solid #2a2a4a", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
        <div>
          <div style={{ color:"#C9A84C", fontWeight:700, fontSize:16 }}>مراجعة الملاحظات</div>
          <div style={{ color:"#555", fontSize:12, marginTop:3 }}>استُخرجت {parsed.length} ملاحظة — راجع وعدّل ثم اعتمد</div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={()=>setStage("input")} style={{ background:"transparent", color:"#888", border:"1px solid #2a2a4a", borderRadius:8, padding:"6px 14px", cursor:"pointer", fontFamily:"inherit", fontSize:13 }}>↺ تعديل النص</button>
          <button onClick={saveAll} disabled={parsed.length===0}
            style={{ background:"linear-gradient(135deg,#C9A84C,#a07830)", color:"#fff", border:"none", borderRadius:8, padding:"6px 18px", cursor:"pointer", fontFamily:"inherit", fontWeight:700, fontSize:14 }}>
            اعتماد الكل ({parsed.length}) ←
          </button>
        </div>
      </div>
      {parsed.map((note, i) => (
        <ParsedNoteCard key={i} note={note} index={i}
          onUpdate={(f,v)=>updateNote(i,f,v)}
          onRemove={()=>removeNote(i)} />
      ))}
      {parsed.length === 0 && (
        <div style={{ textAlign:"center", color:"#555", padding:40 }}>حذفت كل الملاحظات — اضغط "تعديل النص" للرجوع</div>
      )}
    </div>
  );

  // stage === "input"
  return (
    <div style={{ maxWidth:620, margin:"0 auto" }}>
      {/* صيغة الكتابة */}
      <div style={{ background:"linear-gradient(135deg,#0f1a2e,#1a1a0f)", border:"1px solid #C9A84C33", borderRadius:16, padding:"18px 20px", marginBottom:20 }}>
        <div style={{ color:"#C9A84C", fontWeight:700, fontSize:15, marginBottom:10 }}>⚡ صيغة الإدخال السريع</div>
        <div style={{ color:"#8899bb", fontSize:12, lineHeight:2, marginBottom:12 }}>
          اكتب ملاحظاتك بالصيغة التالية ثم اضغط "تحليل" — بدون إنترنت أو API
        </div>
        <div style={{ background:"#0d0d1a", borderRadius:10, padding:"12px 14px", border:"1px solid #2a2a3a" }}>
          <div style={{ color:"#555", fontSize:11, marginBottom:6 }}>مثال:</div>
          <pre style={{ color:"#aaa", fontSize:12, lineHeight:2, margin:0, whiteSpace:"pre-wrap", fontFamily:"Cairo,serif" }}>{`التاريخ: …..
السورة: الكهف
الآية من: 1
إلى: 1
رقم الصفحة: 293

م: الحمد لله الذي أنزل القرآن على محمد

مسألة ١: خ: ما المراد بالعبد في الآية؟
مسألة ٢: د: لماذا أضاف الهاء في الأخير؟
مسألة ٣: ت: القرآن أفضل الكتب السماوية
مسألة ٤: م: الحمد لله الذي أنزل القرآن على محمد

الفوائد والاستنباطات + ما استوقفني + استفسارات:

الموضوعات المختارة: التوحيد ونفي الشرك، الأسماء والصفات

وسوم: القرطبي، فضائل القرآن`}</pre>
        </div>
        <div style={{ marginTop:10, color:"#666", fontSize:11, lineHeight:1.8 }}>
          <strong style={{color:"#C9A84C"}}>م:</strong> المعنى الإجمالي &nbsp;·&nbsp;
          <strong style={{color:"#D6B4FC"}}>خ:</strong> خلاصة القرطبي &nbsp;·&nbsp;
          <strong style={{color:"#A3E635"}}>د:</strong> دليل أو حديث &nbsp;·&nbsp;
          <strong style={{color:"#FF9F1C"}}>ت:</strong> لطيفة تربوية &nbsp;·&nbsp;
          <strong style={{color:"#aaa"}}>---</strong> للفصل بين الآيات
        </div>
      </div>

      {/* منطقة الإدخال */}
      <div style={{ background:"#13132a", borderRadius:16, padding:24, border:"1px solid #2a2a4a" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <Label>اكتب أو الصق ملاحظاتك هنا</Label>
          <button onClick={()=>fileRef.current?.click()}
            style={{ background:"transparent", color:"#C9A84C", border:"1px solid #C9A84C44", borderRadius:8, padding:"4px 12px", cursor:"pointer", fontFamily:"inherit", fontSize:12 }}>
            📄 رفع ملف .txt
          </button>
          <input ref={fileRef} type="file" accept=".txt,.md,text/*" onChange={handleFile} style={{ display:"none" }} />
        </div>
        <textarea
          value={rawText}
          onChange={e=>{ setRawText(e.target.value); setError(""); }}
          rows={12}
          placeholder={"الكهف ١\nم: ...\nخ: ...\nمسألة ١: ..."}
          style={{ ...textareaStyle, fontSize:13, lineHeight:2, marginBottom:12 }}
        />
        {error && <div style={{ color:"#ff6b6b", fontSize:13, marginBottom:10, padding:"8px 12px", background:"#3a000022", borderRadius:8, border:"1px solid #ff6b6b33" }}>{error}</div>}

        {/* زر Claude.ai */}
        <div style={{ background:"#0d0d1a", border:"1px solid #C9A84C33", borderRadius:12, padding:"14px 16px", marginBottom:12 }}>
          <div style={{ color:"#C9A84C", fontWeight:700, fontSize:13, marginBottom:6 }}>✨ استخدم Claude.ai مجاناً لتنسيق ملاحظاتك</div>
          <div style={{ color:"#666", fontSize:11, marginBottom:10, lineHeight:1.8 }}>
            ١. اكتب ملاحظاتك بحرية في الخانة أعلاه<br/>
            ٢. اضغط "نسخ الـ Prompt" — يُنسخ تلقائياً<br/>
            ٣. افتح <a href="https://claude.ai" target="_blank" rel="noreferrer" style={{color:"#C9A84C"}}>claude.ai</a> والصق الـ prompt<br/>
            ٤. قل لـ Claude: <span style={{color:"#C9A84C", fontWeight:700}}>"حول هذه الملاحظات إلى JSON جاهز للصق في التطبيق"</span><br/>
            ٥. انسخ رد Claude (JSON) والصقه في الخانة أعلاه<br/>
            ٦. اضغط "تحليل الملاحظات"
          </div>
          <button onClick={copyClaudePrompt}
            style={{ width:"100%", padding:"9px", background: copied?"#27AE6022":"#C9A84C22", color: copied?"#27AE60":"#C9A84C", border:`1px solid ${copied?"#27AE6055":"#C9A84C55"}`, borderRadius:8, fontFamily:"inherit", fontWeight:700, fontSize:13, cursor:"pointer", transition:"all .3s" }}>
            {copied ? "✅ تم النسخ — افتح claude.ai والصق!" : "📋 نسخ الـ Prompt لـ Claude.ai"}
          </button>
        </div>

        <button onClick={analyze} disabled={!rawText.trim()}
          style={{ width:"100%", padding:"12px", background: rawText.trim()?"linear-gradient(135deg,#C9A84C,#a07830)":"#2a2a4a", color: rawText.trim()?"#fff":"#555", border:"none", borderRadius:10, fontFamily:"inherit", fontWeight:700, fontSize:16, cursor: rawText.trim()?"pointer":"not-allowed", transition:"all .2s" }}>
          ⚡ تحليل الملاحظات ←
        </button>
      </div>
    </div>
  );
}

// ── بطاقة ملاحظة محللة قابلة للتعديل ──
function ParsedNoteCard({ note, index, onUpdate, onRemove }) {
  const [open, setOpen] = useState(true);
  const ayah = note.ayahFrom===note.ayahTo ? note.ayahFrom : `${note.ayahFrom}–${note.ayahTo}`;

  return (
    <div style={{ background:"#1a1a2e", border:"1px solid #C9A84C33", borderRadius:12, marginBottom:12, overflow:"hidden" }}>
      {/* Header */}
      <div style={{ padding:"11px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid #2a2a4a", cursor:"pointer" }} onClick={()=>setOpen(!open)}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ color:"#C9A84C", fontWeight:700 }}>{note.surah} ({ayah||"—"})</span>
          {note.colorKeys?.map(k=><HighlightBadge key={k} colorKey={k} size="sm"/>)}
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <button onClick={e=>{e.stopPropagation();onRemove();}} style={{ background:"transparent", color:"#ff6b6b55", border:"none", cursor:"pointer", fontSize:16, padding:"2px 6px" }}>✕</button>
          <span style={{ color:"#444", fontSize:13 }}>{open?"▲":"▼"}</span>
        </div>
      </div>

      {open && (
        <div style={{ padding:"14px 16px", display:"flex", flexDirection:"column", gap:10 }}>
          {/* المعنى */}
          {note.meaning && (
            <div>
              <div style={{ color:"#8899bb", fontSize:11, fontWeight:600, marginBottom:4 }}>المعنى الإجمالي</div>
              <textarea value={note.meaning} onChange={e=>onUpdate("meaning",e.target.value)} rows={2}
                style={{ ...textareaStyle, fontSize:13 }} />
            </div>
          )}

          {/* المسائل */}
          {note.masail?.length > 0 && (
            <div>
              <div style={{ color:"#8899bb", fontSize:11, fontWeight:600, marginBottom:6 }}>المسائل ({note.masail.length})</div>
              {note.masail.map((m,i)=>{
                const { colorKey, text } = parseMasalaColor(m || "");
                return (
                  <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:6 }}>
                    <div style={{ width:22, height:22, borderRadius:"50%", background:"linear-gradient(135deg,#C9A84C,#a07830)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:"#fff", fontWeight:700, flexShrink:0, marginTop:6 }}>{i+1}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                        <div style={{ color:"#8899bb", fontSize:11 }}>المسألة {ARABIC_ORDINALS[i]||i+1}</div>
                        {colorKey && <HighlightBadge colorKey={colorKey} size="sm" />}
                      </div>
                      <textarea value={text} rows={2} onChange={e=>{ const next=[...note.masail]; next[i]= colorKey ? `${colorKey} — ${e.target.value}` : e.target.value; onUpdate("masail",next); }}
                        style={{ ...textareaStyle, fontSize:13, width:"100%" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* الفوائد */}
          {note.reflection && (
            <div>
              <div style={{ color:"#8899bb", fontSize:11, fontWeight:600, marginBottom:4 }}>الفوائد والاستنباطات + ما استوقفني + استفسارات ✦</div>
              <textarea value={note.reflection} onChange={e=>onUpdate("reflection",e.target.value)} rows={2}
                style={{ ...textareaStyle, fontSize:13, borderColor:"#C9A84C33" }} />
            </div>
          )}

          {/* الموضوعات والوسوم */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
            {note.topics?.map(t=><TopicBadge key={t} topic={t}/>)}
            {note.tags?.map(t=><TagBadge key={t} tag={t}/>)}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Export Modal ──
function ExportModal({ notes, surahIntros, onClose }) {
  const [scope, setScope]   = useState("all");        // all | surah | topic | color
  const [surah, setSurah]   = useState("");
  const [topic, setTopic]   = useState(ALL_TOPICS[0]);
  const [color, setColor]   = useState(COLOR_SYSTEM[0].key);
  const [fmt,   setFmt]     = useState("pdf");
  const [inc, setInc] = useState({
    meaning: true, masail: true, reflection: true, topicsTags: true, pageNumbers: true,
  });

  const toggleInc = k => setInc(p => ({ ...p, [k]: !p[k] }));

  // Derive filtered note set
  const filtered = (() => {
    if (scope === "surah") return notes.filter(n => n.surah === surah);
    if (scope === "topic") return notes.filter(n => n.topics?.includes(topic));
    if (scope === "color") return notes.filter(n => n.colorKeys?.includes(color) || (n.masail||[]).some(m => m.startsWith(color + " —")));
    return notes;
  })();

  // Derive file name
  const fileName = (() => {
    if (scope === "surah"  && surah) return `تفسير-${surah}`;
    if (scope === "topic"  && topic) return `موضوع-${topic}`;
    if (scope === "color"  && color) return `ملاحظات-${color}`;
    return "مفكرة-التفسير-كاملة";
  })();

  const opts = {
    includeMeaning:    inc.meaning,
    includeMasail:     inc.masail,
    includeReflection: inc.reflection,
    includeTopicsTags: inc.topicsTags,
    includePageNums:   inc.pageNumbers,
  };

  const doExport = () => {
    if (filtered.length === 0) { alert("لا توجد ملاحظات مطابقة"); return; }
    const html = generateExportHTML(filtered, surahIntros, opts);
    if (fmt === "pdf") {
      const win = window.open("", "_blank");
      if (!win) { alert("يرجى السماح بالنوافذ المنبثقة"); return; }
      win.document.write(html);
      win.document.close();
      win.onload = () => win.print();
    } else {
      const blob = new Blob(["﻿" + html], { type: "application/msword;charset=utf-8" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url;
      a.download = `${fileName}.doc`;
      a.click();
      URL.revokeObjectURL(url);
    }
    onClose();
  };

  const radio = (val, cur, set, label) => (
    <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", padding:"6px 0", color: cur===val?"#C9A84C":"#aaa", fontWeight: cur===val?700:400 }}>
      <input type="radio" checked={cur===val} onChange={()=>set(val)} style={{ accentColor:"#C9A84C" }} />
      {label}
    </label>
  );
  const check = (key, label) => (
    <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", padding:"4px 0", color:"#ccc" }}>
      <input type="checkbox" checked={inc[key]} onChange={()=>toggleInc(key)} style={{ accentColor:"#C9A84C" }} />
      {label}
    </label>
  );

  const secTitle = t => (
    <div style={{ color:"#C9A84C", fontWeight:700, fontSize:13, marginBottom:10, borderRight:"3px solid #C9A84C", paddingRight:10 }}>{t}</div>
  );

  return (
    <div style={{ position:"fixed", inset:0, background:"#000000cc", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} onClick={onClose}>
      <div style={{ background:"#13132a", border:"1px solid #C9A84C44", borderRadius:16, padding:24, maxWidth:480, width:"100%", maxHeight:"90vh", overflowY:"auto", direction:"rtl" }} onClick={e=>e.stopPropagation()}>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <span style={{ color:"#C9A84C", fontWeight:700, fontSize:16 }}>📤 تصدير الملاحظات</span>
          <span onClick={onClose} style={{ cursor:"pointer", color:"#666", fontSize:18 }}>✕</span>
        </div>

        {/* Step 1 */}
        <div style={{ background:"#0d0d1a", borderRadius:10, padding:"14px 16px", marginBottom:14 }}>
          {secTitle("الخطوة ١ — ماذا تصدّرين؟")}
          {radio("all",   scope, setScope, "كل الملاحظات")}
          {radio("surah", scope, setScope, "سورة محددة")}
          {scope === "surah" && (
            <select value={surah} onChange={e=>setSurah(e.target.value)} style={{ background:"#1a1a2e", border:"1px solid #C9A84C44", borderRadius:8, color:"#e0e0e0", padding:"6px 10px", fontFamily:"inherit", fontSize:12, width:"100%", marginTop:6, outline:"none" }}>
              <option value="">اختر السورة...</option>
              {SURAHS.map(s=><option key={s.name} value={s.name}>{s.name}</option>)}
            </select>
          )}
          {radio("topic", scope, setScope, "موضوع محدد")}
          {scope === "topic" && (
            <select value={topic} onChange={e=>setTopic(e.target.value)} style={{ background:"#1a1a2e", border:"1px solid #C9A84C44", borderRadius:8, color:"#e0e0e0", padding:"6px 10px", fontFamily:"inherit", fontSize:12, width:"100%", marginTop:6, outline:"none" }}>
              {ALL_TOPICS.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          )}
          {radio("color", scope, setScope, "نوع لون محدد")}
          {scope === "color" && (
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:8 }}>
              {COLOR_SYSTEM.map(cs=>(
                <button key={cs.key} onClick={()=>setColor(cs.key)}
                  style={{ background: color===cs.key ? cs.color+"44":"transparent", border:`1px solid ${cs.color}88`, borderRadius:8, padding:"4px 12px", cursor:"pointer", color: color===cs.key?"#fff":"#aaa", fontFamily:"inherit", fontSize:12, fontWeight: color===cs.key?700:400 }}>
                  {cs.key} · {cs.label}
                </button>
              ))}
            </div>
          )}
          <div style={{ marginTop:10, color: filtered.length===0?"#e74c3c":"#27AE60", fontSize:12 }}>
            {filtered.length} ملاحظة ستُصدَّر · اسم الملف: {fileName}
          </div>
        </div>

        {/* Step 2 */}
        <div style={{ background:"#0d0d1a", borderRadius:10, padding:"14px 16px", marginBottom:14 }}>
          {secTitle("الخطوة ٢ — ماذا تضمّنين؟")}
          {check("meaning",    "المعنى الإجمالي")}
          {check("masail",     "المسائل")}
          {check("reflection", "الفوائد والاستنباطات")}
          {check("topicsTags", "الموضوعات والوسوم")}
          {check("pageNumbers","أرقام الصفحات")}
        </div>

        {/* Step 3 */}
        <div style={{ background:"#0d0d1a", borderRadius:10, padding:"14px 16px", marginBottom:20 }}>
          {secTitle("الخطوة ٣ — الصيغة")}
          {radio("pdf",  fmt, setFmt, "🖨 PDF (عبر نافذة الطباعة)")}
          {radio("word", fmt, setFmt, "📄 Word (.doc)")}
        </div>

        <button onClick={doExport} disabled={filtered.length===0}
          style={{ width:"100%", padding:"12px", background: filtered.length>0?"linear-gradient(135deg,#C9A84C,#a07830)":"#2a2a4a", color: filtered.length>0?"#fff":"#555", border:"none", borderRadius:10, fontFamily:"inherit", fontWeight:700, fontSize:15, cursor: filtered.length>0?"pointer":"not-allowed" }}>
          تصدير ←
        </button>
      </div>
    </div>
  );
}

// ── Main App ──
export default function App() {
  const [notes, setNotes]             = useState([]);
  const [surahIntros, setSurahIntros] = useState({});
  const [form, setForm]               = useState(emptyNote);
  const [view, setView]               = useState("add");
  const [topicSearch, setTopicSearch] = useState("");
  const [showTopicDrop, setShowTopicDrop] = useState(false);
  const [tagInput, setTagInput]       = useState("");
  const [filterTopic, setFilterTopic] = useState("");
  const [filterSurah, setFilterSurah] = useState("");
  const [filterTag, setFilterTag]     = useState("");
  const [filterColor, setFilterColor] = useState("");
  const [searchText, setSearchText]   = useState("");
  const [ready, setReady]             = useState(false);
  const topicRef = useRef(null);

  // Load from storage on mount
  useEffect(() => {
    const savedNotes  = loadFromStorage(STORAGE_KEY_NOTES, []);
    const savedIntros = loadFromStorage(STORAGE_KEY_INTROS, {});
    setNotes(savedNotes);
    setSurahIntros(savedIntros);
    setReady(true);
  }, []);

  // Persist notes
  useEffect(() => { if (ready) saveToStorage(STORAGE_KEY_NOTES, notes); }, [notes, ready]);
  // Persist intros
  useEffect(() => { if (ready) saveToStorage(STORAGE_KEY_INTROS, surahIntros); }, [surahIntros, ready]);

  useEffect(() => {
    const handler = e => { if (topicRef.current && !topicRef.current.contains(e.target)) setShowTopicDrop(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const [backupMsg, setBackupMsg] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);
  const importRef = useRef(null);

  // ── تصدير نسخة احتياطية JSON ──
  const exportBackup = () => {
    const backup = {
      version: 2,
      exportedAt: new Date().toISOString(),
      notesCount: notes.length,
      notes,
      surahIntros,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    const date = new Date().toLocaleDateString("ar-SA").replace(/\//g, "-");
    a.href = url;
    a.download = `مفكرة-التفسير-backup-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupMsg(`✅ تم تصدير ${notes.length} ملاحظة`);
    setTimeout(() => setBackupMsg(""), 3000);
  };

  // ── تصدير PDF ──
  const exportToPDF = () => {
    const html = generateExportHTML(notes, surahIntros);
    const win = window.open("", "_blank");
    if (!win) { alert("يرجى السماح بالنوافذ المنبثقة"); return; }
    win.document.write(html);
    win.document.close();
    win.onload = () => win.print();
  };

  // ── تصدير Word ──
  const exportToWord = () => {
    const html = generateExportHTML(notes, surahIntros);
    const blob = new Blob(["﻿" + html], { type: "application/msword;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    const date = new Date().toLocaleDateString("ar-SA").replace(/\//g, "-");
    a.href = url;
    a.download = `ملاحظات-التفسير-${date}.doc`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupMsg("✅ تم تصدير ملف Word");
    setTimeout(() => setBackupMsg(""), 3000);
  };

  // ── استيراد نسخة احتياطية JSON ──
  const importBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.notes || !Array.isArray(data.notes)) throw new Error("ملف غير صالح");
        const confirmMsg = `سيتم إضافة ${data.notes.length} ملاحظة إلى ملاحظاتك الحالية (${notes.length}).\nهل تريدين الاستمرار؟`;
        if (!window.confirm(confirmMsg)) return;
        setNotes(prev => {
          // تجنب التكرار بناءً على surah+ayahFrom+ayahTo
          const existing = new Set(prev.map(n => `${n.surah}-${n.ayahFrom}-${n.ayahTo}`));
          const newOnes  = data.notes.filter(n => !existing.has(`${n.surah}-${n.ayahFrom}-${n.ayahTo}`));
          return [...newOnes, ...prev];
        });
        if (data.surahIntros) setSurahIntros(prev => ({ ...data.surahIntros, ...prev }));
        setBackupMsg(`✅ تم استيراد ${data.notes.length} ملاحظة`);
        setTimeout(() => setBackupMsg(""), 3000);
      } catch {
        setBackupMsg("❌ ملف غير صالح — تأكد أنه ملف backup من المفكرة");
        setTimeout(() => setBackupMsg(""), 4000);
      }
    };
    reader.readAsText(file, "UTF-8");
    e.target.value = ""; // reset input
  };

  const selectedSurah = SURAHS.find(s => s.name === form.surah);
  const maxVerses     = selectedSurah?.verses || 999;
  const set = (k, v) => setForm(f => ({ ...f, [k]:v }));

  // عند تغيير السورة: إعادة ضبط الآيات + مسح الموضوعات (ستُعبَّأ عند اختيار الآية)
  const handleSurahChange = (surahName) => {
    setForm(f => ({ ...f, surah: surahName, ayahFrom:"", ayahTo:"", topics: [] }));
  };

  const handleAyahFromChange = (ayahNum) => {
    set("ayahFrom", ayahNum);
    set("ayahTo", ayahNum);
  };

  const addTopic = t => { if (!form.topics.includes(t)) set("topics",[...form.topics,t]); setShowTopicDrop(false); setTopicSearch(""); };
  const removeTopic = t => set("topics", form.topics.filter(x=>x!==t));
  const addTag = () => { const t=tagInput.trim().replace(/^#+/,""); if(t&&!form.tags.includes(t)) set("tags",[...form.tags,t]); setTagInput(""); };
  const removeTag = t => set("tags", form.tags.filter(x=>x!==t));

  const save = () => {
    if (!form.surah) return alert("اختر السورة");
    if (!surahIntros[form.surah]) setSurahIntros(s=>({...s,[form.surah]:{...emptyIntro}}));
    // Convert masail objects → strings with color prefix, derive colorKeys from masail
    const masailStrings = form.masail
      .filter(m => m?.text?.trim())
      .map(m => m.colorKey ? `${m.colorKey} — ${m.text.trim()}` : m.text.trim());
    const derivedColorKeys = [...new Set(form.masail.filter(m=>m?.colorKey).map(m=>m.colorKey))];
    setNotes(n=>[{ ...form, masail: masailStrings, colorKeys: derivedColorKeys },...n]);
    setForm(emptyNote);
    setView("list");
  };

  const deleteNote = i => setNotes(n=>n.filter((_,idx)=>idx!==i));
  const updateIntro = (surahName, intro) => setSurahIntros(s=>({...s,[surahName]:intro}));

  const allTags = [...new Set(notes.flatMap(n=>n.tags))];
  const surahsWithNotes = [...new Set(notes.map(n=>n.surah))];

  const filtered = notes.filter(n => {
    const mT  = !filterTopic || n.topics?.includes(filterTopic);
    const mS  = !filterSurah || n.surah===filterSurah;
    const mTag= !filterTag   || n.tags?.includes(filterTag);
    const mC  = !filterColor || n.colorKeys?.includes(filterColor);
    const masailText = n.masail?.join(" ") || "";
    const mSrc= !searchText  || [n.meaning, masailText, n.reflection, n.surah].some(f=>f?.includes(searchText));
    return mT && mS && mTag && mC && mSrc;
  });

  const topicGroups = TOPICS.map(cat=>({...cat, notes:notes.filter(n=>cat.items.some(t=>n.topics?.includes(t)))})).filter(g=>g.notes.length>0);
  const filteredTopics = ALL_TOPICS.filter(t=>t.includes(topicSearch));
  const ayahOptions = max => Array.from({length:max},(_,i)=>i+1);

  if (!ready) return (
    <div dir="rtl" style={{ minHeight:"100vh", background:"#0d0d1a", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Cairo,serif", color:"#C9A84C" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:32, marginBottom:12 }}>📖</div>
        <div>جارٍ تحميل ملاحظاتك...</div>
      </div>
    </div>
  );

  return (
    <div dir="rtl" style={{ minHeight:"100vh", background:"#0d0d1a", fontFamily:"'Cairo','Amiri',serif", color:"#e0e0e0", padding:"20px 14px" }}>
      <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;600;700&display=swap" rel="stylesheet" />
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}} * { box-sizing:border-box; }`}</style>
      {showExportModal && <ExportModal notes={notes} surahIntros={surahIntros} onClose={()=>setShowExportModal(false)} />}

      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:16 }}>
        <div style={{ fontSize:11, letterSpacing:4, color:"#C9A84C", marginBottom:4 }}>مفكرة التفسير</div>
        <h1 style={{ fontFamily:"Amiri", fontSize:28, color:"#fff", margin:0 }}>ملاحظات تفسير القرآن</h1>
        <div style={{ fontSize:11, color:"#555", marginTop:4 }}>تفسير القرطبي · {notes.length} ملاحظة محفوظة</div>
        <div style={{ width:60, height:2, background:"linear-gradient(90deg,transparent,#C9A84C,transparent)", margin:"8px auto 0" }} />
      </div>

      {/* ── شريط النسخ الاحتياطي ── */}
      <div style={{ maxWidth:700, margin:"0 auto 16px", background:"#13132a", borderRadius:12, padding:"10px 16px", border:"1px solid #2a2a4a", display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
        <span style={{ fontSize:12, color:"#666", display:"flex", alignItems:"center", gap:5 }}>
          🔒 النسخ الاحتياطي
        </span>
        <div style={{ flex:1, fontSize:11, color:"#444" }}>
          {notes.length > 0
            ? `${notes.length} ملاحظة محفوظة — صدّري نسخة احتياطية بانتظام`
            : "لا توجد ملاحظات بعد"}
        </div>
        {backupMsg && (
          <span style={{ fontSize:12, color: backupMsg.startsWith("✅") ? "#27AE60" : "#ff6b6b", fontWeight:600, padding:"2px 10px", background: backupMsg.startsWith("✅") ? "#27AE6022" : "#ff6b6b22", borderRadius:20 }}>
            {backupMsg}
          </span>
        )}
        <button onClick={exportBackup} disabled={notes.length===0}
          style={{ background: notes.length===0?"#1a1a2e":"linear-gradient(135deg,#C9A84C,#a07830)", color: notes.length===0?"#444":"#fff", border:"none", borderRadius:8, padding:"6px 14px", cursor: notes.length===0?"not-allowed":"pointer", fontFamily:"inherit", fontWeight:700, fontSize:12, display:"flex", alignItems:"center", gap:5 }}>
          ⬇ JSON
        </button>
        <button onClick={()=>setShowExportModal(true)} disabled={notes.length===0}
          style={{ background:"transparent", color: notes.length===0?"#444":"#e74c3c", border:`1px solid ${notes.length===0?"#2a2a4a":"#e74c3c55"}`, borderRadius:8, padding:"5px 12px", cursor: notes.length===0?"not-allowed":"pointer", fontFamily:"inherit", fontSize:12 }}>
          📤 تصدير PDF / Word
        </button>
        <button onClick={()=>importRef.current?.click()}
          style={{ background:"transparent", color:"#C9A84C", border:"1px solid #C9A84C55", borderRadius:8, padding:"5px 12px", cursor:"pointer", fontFamily:"inherit", fontSize:12 }}>
          ⬆ استيراد
        </button>
        <input ref={importRef} type="file" accept=".json" onChange={importBackup} style={{ display:"none" }} />
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", justifyContent:"center", gap:5, marginBottom:20, flexWrap:"wrap" }}>
        {[["add","＋ إضافة"],["quick","⚡ إدخال سريع"],["list",`الملاحظات${notes.length?" ("+notes.length+")":""}`],["topics","الموضوعات"],["tags","الوسوم"],["colors","نظام الألوان"],["mindmap","🧠 الخرائط"]].map(([v,l])=>(
          <button key={v} onClick={()=>setView(v)} style={{ padding:"6px 16px", borderRadius:30, border:"1px solid", borderColor:view===v?"#C9A84C":"#2a2a4a", background:view===v?"#C9A84C":"transparent", color:view===v?"#0d0d1a":"#aaa", fontFamily:"inherit", fontWeight:600, cursor:"pointer", fontSize:13, transition:"all .2s" }}>{l}</button>
        ))}
      </div>

      {/* ── QUICK INPUT ── */}
      {view==="quick" && (
        <QuickInputView onSaveNotes={newNotes => {
          newNotes.forEach(n => {
            if (n.surah && !surahIntros[n.surah]) setSurahIntros(s=>({...s,[n.surah]:{...emptyIntro}}));
          });
          setNotes(prev => [...newNotes, ...prev]);
          setView("list");
        }} />
      )}

      {/* ── ADD ── */}
      {view==="add" && (
        <div style={{ maxWidth:640, margin:"0 auto", background:"#13132a", borderRadius:16, padding:22, border:"1px solid #2a2a4a" }}>

          <div style={{ marginBottom:12 }}>
            <Label>السورة</Label>
            <select value={form.surah} onChange={e=>handleSurahChange(e.target.value)} style={selectStyle}>
              <option value="">اختر السورة...</option>
              {SURAHS.map((s,i)=>(
                <option key={s.name} value={s.name}>{i+1}. {s.name} — {s.revelation} ({s.verses} آية)</option>
              ))}
            </select>
          </div>

          {selectedSurah && (
            <div style={{ display:"flex", gap:8, marginBottom:12, alignItems:"center", flexWrap:"wrap" }}>
              <RevealBadge revelation={selectedSurah.revelation} />
              <span style={{ color:"#555", fontSize:12 }}>{selectedSurah.verses} آية</span>
              <span style={{ color: surahIntros[form.surah]?"#27AE60":"#8899bb", fontSize:12, marginRight:"auto" }}>
                {surahIntros[form.surah] ? "✓ المقدمة موجودة" : "⚡ ستُنشأ مقدمة عند الحفظ"}
              </span>
            </div>
          )}

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:12 }}>
            <div>
              <Label>الآية من</Label>
              <select value={form.ayahFrom} onChange={e=>handleAyahFromChange(e.target.value)} style={selectStyle} disabled={!form.surah}>
                <option value="">—</option>
                {form.surah && ayahOptions(maxVerses).map(n=><option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <Label>الآية إلى</Label>
              <select value={form.ayahTo} onChange={e=>set("ayahTo",e.target.value)} style={selectStyle} disabled={!form.ayahFrom}>
                <option value="">—</option>
                {form.ayahFrom && ayahOptions(maxVerses).filter(n=>n>=+form.ayahFrom).map(n=><option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <Label>رقم الصفحة</Label>
              <input type="number" value={form.page} onChange={e=>set("page",e.target.value)} placeholder="45" style={inputStyle} />
            </div>
          </div>

          {/* Topics */}
          <div style={{ marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
              <Label>الموضوعات</Label>
              {form.topics.length === 0 && form.surah && !form.ayahFrom && (
                <span style={{ fontSize:11, color:"#555" }}>اختر الآية أولاً</span>
              )}
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:6 }}>
              {form.topics.map(t=><TopicBadge key={t} topic={t} onRemove={()=>removeTopic(t)} />)}
            </div>
            <div style={{ position:"relative" }} ref={topicRef}>
              <input value={topicSearch} onChange={e=>{ setTopicSearch(e.target.value); setShowTopicDrop(true); }} onFocus={()=>setShowTopicDrop(true)}
                placeholder="ابحث لإضافة موضوع آخر..." style={{ ...inputStyle, width:"100%" }} />
              {showTopicDrop && (
                <div style={{ position:"absolute", top:"100%", right:0, left:0, background:"#1a1a2e", border:"1px solid #2a2a4a", borderRadius:8, zIndex:200, maxHeight:180, overflowY:"auto" }}>
                  {filteredTopics.filter(t=>!form.topics.includes(t)).map(t=>{
                    const cat=TOPICS.find(c=>c.items.includes(t));
                    return <div key={t} onClick={()=>addTopic(t)} style={{ padding:"7px 14px", cursor:"pointer", display:"flex", justifyContent:"space-between", borderBottom:"1px solid #1e1e3a" }}
                      onMouseEnter={e=>e.currentTarget.style.background="#2a2a4a"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <span style={{ fontSize:13 }}>{t}</span>
                      <span style={{ fontSize:11, color:cat?.color, opacity:.7 }}>{cat?.category}</span>
                    </div>;
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div style={{ marginBottom:12 }}>
            <Label>وسوم حرة (للبحث السريع)</Label>
            <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:6 }}>
              {form.tags.map(t=><TagBadge key={t} tag={t} onRemove={()=>removeTag(t)} />)}
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <input value={tagInput} onChange={e=>setTagInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTag()}
                placeholder='مثال: موسى، فرعون... ثم Enter' style={{ ...inputStyle, flex:1 }} />
              <button onClick={addTag} style={{ background:"#1e1e3a", color:"#8ab4f8", border:"1px solid #3a3a6a", borderRadius:8, padding:"0 14px", cursor:"pointer", fontFamily:"inherit", fontSize:13 }}>إضافة</button>
            </div>
          </div>

          {/* Text fields */}
          <div style={{ marginBottom:12 }}>
            <Label>المعنى الإجمالي</Label>
            <textarea value={form.meaning} onChange={e=>set("meaning",e.target.value)} rows={2} placeholder="ملخص سريع لمعنى الآية..." style={textareaStyle} />
          </div>

          {/* نظام المسائل */}
          <div style={{ background:"#0d0d1a", border:"1px solid #C9A84C33", borderRadius:12, padding:"14px 16px", marginBottom:12 }}>
            <MasailEditor masail={form.masail||[]} onChange={v=>set("masail",v)} />
          </div>

          <div style={{ marginBottom:18 }}>
            <Label>الفوائد والاستنباطات + ما استوقفني + استفسارات ✦</Label>
            <textarea value={form.reflection} onChange={e=>set("reflection",e.target.value)} rows={3}
              placeholder="ما تستنبطه من الآية، ملاحظة شخصية، تساؤل، أو ارتباط بشيء..." style={{ ...textareaStyle, borderColor:"#C9A84C44" }} />
          </div>
          <button onClick={save} style={{ width:"100%", padding:"12px", background:"linear-gradient(135deg,#C9A84C,#a07830)", color:"#fff", border:"none", borderRadius:10, fontFamily:"inherit", fontWeight:700, fontSize:16, cursor:"pointer" }}>
            حفظ الملاحظة ←
          </button>
        </div>
      )}

      {/* ── LIST ── */}
      {view==="list" && (
        <div style={{ maxWidth:700, margin:"0 auto" }}>
          <input value={searchText} onChange={e=>setSearchText(e.target.value)} placeholder="🔍 ابحث في كل الملاحظات..." style={{ ...inputStyle, marginBottom:10, fontSize:15 }} />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:8 }}>
            <select value={filterSurah} onChange={e=>setFilterSurah(e.target.value)} style={selectStyle}>
              <option value="">كل السور</option>
              {surahsWithNotes.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filterTopic} onChange={e=>setFilterTopic(e.target.value)} style={selectStyle}>
              <option value="">كل الموضوعات</option>
              {ALL_TOPICS.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
            <select value={filterTag} onChange={e=>setFilterTag(e.target.value)} style={selectStyle}>
              <option value="">كل الوسوم</option>
              {allTags.map(t=><option key={t} value={t}>#{t}</option>)}
            </select>
          </div>
          {/* Color filter */}
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10, alignItems:"center" }}>
            <span style={{ color:"#666", fontSize:12 }}>فلتر اللون:</span>
            <span onClick={()=>setFilterColor("")} style={{ display:"inline-flex", alignItems:"center", padding:"2px 10px", borderRadius:20, border:"1px solid", borderColor:!filterColor?"#C9A84C":"#2a2a4a", background:!filterColor?"#C9A84C22":"transparent", color:!filterColor?"#C9A84C":"#555", fontSize:12, cursor:"pointer" }}>الكل</span>
            {COLOR_SYSTEM.map(cs=>(
              <span key={cs.key} onClick={()=>setFilterColor(filterColor===cs.key?"":cs.key)}
                style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"2px 10px", borderRadius:20, border:`1px solid`, borderColor:filterColor===cs.key?cs.color:"#2a2a4a", background:filterColor===cs.key?cs.bg:"transparent", color:filterColor===cs.key?cs.dark:"#666", fontSize:12, cursor:"pointer" }}>
                <span style={{ width:7, height:7, borderRadius:"50%", background:cs.color, display:"inline-block" }} />{cs.key}
              </span>
            ))}
          </div>

          {(filterSurah||filterTopic||filterTag||filterColor||searchText) && (
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10, alignItems:"center" }}>
              <span style={{ color:"#666", fontSize:12 }}>فلاتر نشطة:</span>
              {filterSurah && <TagBadge tag={filterSurah} onRemove={()=>setFilterSurah("")} />}
              {filterTopic && <TagBadge tag={filterTopic} onRemove={()=>setFilterTopic("")} />}
              {filterTag   && <TagBadge tag={filterTag}   onRemove={()=>setFilterTag("")} />}
              {filterColor && <HighlightBadge colorKey={filterColor} size="sm" />}
              {searchText  && <TagBadge tag={`"${searchText}"`} onRemove={()=>setSearchText("")} />}
              <span onClick={()=>{ setFilterSurah(""); setFilterTopic(""); setFilterTag(""); setFilterColor(""); setSearchText(""); }} style={{ color:"#E74C3C", fontSize:12, cursor:"pointer" }}>مسح الكل</span>
            </div>
          )}

          {notes.length===0
            ? <div style={{ textAlign:"center", color:"#555", padding:60, fontSize:16 }}>لا توجد ملاحظات بعد — ابدأ بالإضافة!</div>
            : surahsWithNotes.map(surahName=>{
                const surahNotes = filtered.filter(n=>n.surah===surahName);
                if (!surahNotes.length) return null;
                const surahData = SURAHS.find(s=>s.name===surahName);
                return (
                  <div key={surahName} style={{ marginBottom:28 }}>
                    <div style={{ color:"#555", fontSize:12, marginBottom:8 }}>{surahNotes.length} ملاحظة</div>
                    {surahNotes.map((n,i)=><NoteCard key={i} note={n} index={notes.indexOf(n)} onDelete={deleteNote} onTagClick={t=>{setFilterTag(t);}} />)}
                  </div>
                );
              })
          }
        </div>
      )}

      {/* ── TOPICS ── */}
      {view==="topics" && (
        <div style={{ maxWidth:700, margin:"0 auto" }}>
          {topicGroups.length===0
            ? <div style={{ textAlign:"center", color:"#555", padding:60 }}>أضف ملاحظات وصنّفها بموضوعات لترى التجميع هنا</div>
            : topicGroups.map(group=>(
              <div key={group.category} style={{ marginBottom:24 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                  <div style={{ width:10, height:10, borderRadius:"50%", background:group.color }} />
                  <span style={{ color:group.color, fontWeight:700, fontSize:16 }}>{group.category}</span>
                  <span style={{ color:"#444", fontSize:12 }}>({group.notes.length})</span>
                </div>
                {group.notes.map((n,i)=>(
                  <div key={i} style={{ background:"#13132a", border:`1px solid ${group.color}33`, borderRadius:10, padding:"11px 15px", marginBottom:8 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ color:"#C9A84C", fontWeight:600 }}>{n.surah} {n.ayahFrom&&`(${n.ayahFrom}${n.ayahTo&&n.ayahTo!==n.ayahFrom?"–"+n.ayahTo:""})`}</span>
                      {n.page&&<span style={{ color:"#555", fontSize:12 }}>ص {n.page}</span>}
                    </div>
                    {n.colorKeys?.length>0&&<div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:5 }}>{n.colorKeys.map(k=><HighlightBadge key={k} colorKey={k} size="sm" />)}</div>}
                    <div style={{ color:"#bbb", fontSize:13, marginBottom:6 }}>{n.meaning}</div>
                    <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                      {n.topics?.map(t=><TopicBadge key={t} topic={t} />)}
                      {n.tags?.map(t=><TagBadge key={t} tag={t} />)}
                    </div>
                  </div>
                ))}
              </div>
            ))
          }
        </div>
      )}

      {/* ── TAGS ── */}
      {view==="tags" && (
        <div style={{ maxWidth:700, margin:"0 auto" }}>
          {allTags.length===0
            ? <div style={{ textAlign:"center", color:"#555", padding:60 }}>لم تُضف أي وسوم بعد</div>
            : <>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:24, padding:16, background:"#13132a", borderRadius:12, border:"1px solid #2a2a4a" }}>
                {allTags.map(t=>{ const count=notes.filter(n=>n.tags?.includes(t)).length; return (
                  <span key={t} onClick={()=>{ setFilterTag(t); setView("list"); }} style={{ display:"inline-flex", alignItems:"center", gap:5, background:"#1e1e3a", color:"#8ab4f8", border:"1px solid #3a3a6a", borderRadius:20, padding:"4px 12px", fontSize:13, cursor:"pointer" }}>
                    #{t} <span style={{ background:"#2a2a5a", borderRadius:10, padding:"0 6px", fontSize:11, color:"#aaa" }}>{count}</span>
                  </span>
                ); })}
              </div>
              {allTags.map(tag=>{ const tagNotes=notes.filter(n=>n.tags?.includes(tag)); return (
                <div key={tag} style={{ marginBottom:20 }}>
                  <div style={{ color:"#8ab4f8", fontWeight:700, fontSize:15, marginBottom:8 }}>#{tag} <span style={{ color:"#444", fontSize:12, fontWeight:400 }}>({tagNotes.length})</span></div>
                  {tagNotes.map((n,i)=>(
                    <div key={i} style={{ background:"#13132a", border:"1px solid #2a2a4a", borderRadius:10, padding:"10px 14px", marginBottom:6 }}>
                      <span style={{ color:"#C9A84C", fontWeight:600, fontSize:14 }}>{n.surah} {n.ayahFrom&&`(${n.ayahFrom})`}</span>
                      {n.colorKeys?.length>0&&<div style={{ display:"flex", gap:4, flexWrap:"wrap", margin:"4px 0" }}>{n.colorKeys.map(k=><HighlightBadge key={k} colorKey={k} size="sm" />)}</div>}
                      <div style={{ color:"#999", fontSize:13, marginTop:3 }}>{n.meaning}</div>
                    </div>
                  ))}
                </div>
              ); })}
            </>
          }
        </div>
      )}

      {/* ── COLOR SYSTEM ── */}
      {view==="colors" && (
        <div style={{ maxWidth:700, margin:"0 auto" }}>
          <ColorLegend />
          <div style={{ background:"#13132a", borderRadius:14, padding:"16px 20px", border:"1px solid #2a2a4a", marginBottom:20 }}>
            <div style={{ color:"#8899bb", fontSize:11, fontWeight:700, marginBottom:14, letterSpacing:2 }}>الملاحظات حسب اللون</div>
            {COLOR_SYSTEM.map(cs=>{
              const colorNotes = notes.filter(n=>n.colorKeys?.includes(cs.key));
              return (
                <div key={cs.key} style={{ marginBottom:20 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                    <span style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:26, height:26, borderRadius:7, background:cs.color, color:"#000", fontWeight:900, fontSize:13 }}>{cs.key}</span>
                    <span style={{ color:"#e0e0e0", fontWeight:600 }}>{cs.label}</span>
                    <span style={{ color:"#444", fontSize:12 }}>({colorNotes.length})</span>
                  </div>
                  {colorNotes.length===0
                    ? <div style={{ color:"#333", fontSize:13, paddingRight:34 }}>لا توجد ملاحظات بعد</div>
                    : colorNotes.map((n,i)=>(
                      <div key={i} style={{ background:cs.bg, border:`1px solid ${cs.border}`, borderRadius:10, padding:"10px 14px", marginBottom:6, marginRight:34 }}>
                        <span style={{ color:"#C9A84C", fontWeight:600, fontSize:13 }}>{n.surah} {n.ayahFrom&&`(${n.ayahFrom})`}</span>
                        <div style={{ color:"#ccc", fontSize:13, marginTop:3 }}>{n.meaning}</div>
                      </div>
                    ))
                  }
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── MIND MAP ── */}
      {view==="mindmap" && (
        <MindMapView notes={notes} surahIntros={surahIntros} />
      )}

      <div style={{ textAlign:"center", color:"#2a2a4a", fontSize:11, marginTop:40, paddingBottom:20 }}>﴿ وَنَزَّلْنَا عَلَيْكَ الْكِتَابَ تِبْيَانًا لِكُلِّ شَيْءٍ ﴾</div>
    </div>
  );
}

const inputStyle = { background:"#0d0d1a", border:"1px solid #2a2a4a", borderRadius:8, color:"#e0e0e0", padding:"8px 12px", fontSize:14, fontFamily:"inherit", outline:"none", width:"100%", boxSizing:"border-box" };
const selectStyle = { ...inputStyle };
const textareaStyle = { ...inputStyle, resize:"vertical", lineHeight:1.8 };
const Label = ({children}) => <div style={{ color:"#8899bb", fontSize:12, marginBottom:5, fontWeight:600 }}>{children}</div>;
