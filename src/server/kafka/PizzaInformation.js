const pizzaBranches = [
  {
    branch_id: "1",
    branch_name: "אום אל פאחם",
    district: "חיפה",
  },
  {
    branch_id: "2",
    branch_name: "אופקים",
    district: "דרום",
  },
  {
    branch_id: "3",
    branch_name: "אור עקיבא",
    district: "חיפה",
  },
  {
    branch_id: "4",
    branch_name: "אילת - טיילת",
    district: "דרום",
  },
  {
    branch_id: "5",
    branch_name: "איילת -הרים",
    district: "דרום",
  },
  {
    branch_id: "6",
    branch_name: "אילת - קניון אדום",
    district: "דרום",
  },
  {
    branch_id: "7",
    branch_name: "אשדוד",
    district: "דרום",
  },
  {
    branch_id: "8",
    branch_name: "אשקלון",
    district: "דרום",
  },
  {
    branch_id: "9",
    branch_name: "באקה אל גרבייה",
    district: "מרכז",
  },
  {
    branch_id: "10",
    branch_name: "באר שבע - רמות",
    district: "דרום",
  },
  {
    branch_id: "11",
    branch_name: "באר שבע - קניון",
    district: "דרום",
  },
  {
    branch_id: "12",
    branch_name: "באר שבע - אביסרור ",
    district: "דרום",
  },
  {
    branch_id: "13",
    branch_name: "בילו סנטר",
    district: "מרכז",
  },
  {
    branch_id: "14",
    branch_name: "בית שאן",
    district: "צפון",
  },
  {
    branch_id: "15",
    branch_name: "בית שמש",
    district: "מרכז",
  },
  {
    branch_id: "16",
    branch_name: "בני ברק",
    district: "דן",
  },
  {
    branch_id: "18",
    branch_name: "בת ים",
    district: "דן",
  },

  {
    branch_id: "19",
    branch_name: "גבעת שמואל",
    district: "דן",
  },

  {
    branch_id: "20",
    branch_name: "גדרה",
    district: "מרכז",
  },

  {
    branch_id: "21",
    branch_name: "קרית אונו",
    district: "דן",
  },

  {
    branch_id: "22",
    branch_name: "בני דרור",
    district: "דן",
  },

  {
    branch_id: "23",
    branch_name: "דלית אל כרמל",
    district: "חיפה",
  },

  {
    branch_id: "24",
    branch_name: "דימונה",
    district: "דרום",
  },

  {
    branch_id: "25",
    branch_name: "הוד השרון",
    district: "דן",
  },

  {
    branch_id: "26",
    branch_name: "זכרון יעקב",
    district: "חיפה",
  },

  {
    branch_id: "27",
    branch_name: "הרצליה",
    district: "דן",
  },

  {
    branch_id: "28",
    branch_name: "חדרה",
    district: "חיפה",
  },

  {
    branch_id: "29",
    branch_name: "חולון מזרח",
    district: "דן",
  },

  {
    branch_id: "30",
    branch_name: "חולון מערב",
    district: "דן",
  },

  {
    branch_id: "31",
    branch_name: "חיפה - טכניון",
    district: "חיפה",
  },

  {
    branch_id: "32",
    branch_name: "חיפה - מוריה",
    district: "חיפה",
  },

  {
    branch_id: "33",
    branch_name: "חיפה - מושבה גרמנית",
    district: "חיפה",
  },

  {
    branch_id: "34",
    branch_name: "חריש",
    district: "חיפה",
  },

  {
    branch_id: "35",
    branch_name: "טבריה",
    district: "צפון",
  },

  {
    branch_id: "36",
    branch_name: "טייבה",
    district: "מרכז",
  },

  {
    branch_id: "37",
    branch_name: "טירה",
    district: "מרכז",
  },

  {
    branch_id: "38",
    branch_name: "יבנה",
    district: "מרכז",
  },

  {
    branch_id: "39",
    branch_name: "יהוד",
    district: "מרכז",
  },

  {
    branch_id: "40",
    branch_name: "יקנעם",
    district: "חיפה",
  },

  {
    branch_id: "41",
    branch_name: "ירושלים - בית הלל",
    district: "מרכז",
  },
  {
    branch_id: "42",
    branch_name: "ירושלים - מלחה",
    district: "מרכז",
  },
  {
    branch_id: "43",
    branch_name: "ירושלים - ניות",
    district: "מרכז",
  },
  {
    branch_id: "44",
    branch_name: "ירושלים - פסגת זאב",
    district: "מרכז",
  },
  {
    branch_id: "45",
    branch_name: "ירושלים - רמות",
    district: "מרכז",
  },
  {
    branch_id: "46",
    branch_name: "ירושלים - שועפט",
    district: "מרכז",
  },
  {
    branch_id: "47",
    branch_name: "ירושלים - תחנה מרכזית",
    district: "מרכז",
  },
  {
    branch_id: "48",
    branch_name: "ירקה",
    district: "צפון",
  },
  {
    branch_id: "49",
    branch_name: "כפר יסעיף",
    district: "צפון",
  },
  {
    branch_id: "50",
    branch_name: "כפר יונה",
    district: "מרכז",
  },
  {
    branch_id: "51",
    branch_name: "כפר מרר",
    district: "צפון",
  },
  {
    branch_id: "52",
    branch_name: "כפר סבא",
    district: "מרכז",
  },
  {
    branch_id: "53",
    branch_name: "כפר קסם",
    district: "מרכז",
  },
  {
    branch_id: "54",
    branch_name: "כפר קרע",
    district: "Hafia",
  },
  {
    branch_id: "55",
    branch_name: "כרמיאל",
    district: "צפון",
  },
  {
    branch_id: "56",
    branch_name: "כרמיאל - אקספרס",
    district: "צפון",
  },
  {
    branch_id: "57",
    branch_name: "מבשרת ציון",
    district: "מרכז",
  },
  {
    branch_id: "58",
    branch_name: "מגדל",
    district: "צפון",
  },
  {
    branch_id: "59",
    branch_name: "גבעתיים",
    district: "דן",
  },
  {
    branch_id: "60",
    branch_name: "מודיעין",
    district: "מרכז",
  },
  {
    branch_id: "61",
    branch_name: "מעלה אדומים",
    district: "מרכז",
  },
  {
    branch_id: "61",
    branch_name: "מעלות",
    district: "צפון",
  },
  {
    branch_id: "62",
    branch_name: "מצפה רמון",
    district: "דרום",
  },
  {
    branch_id: "63",
    branch_name: "נהריה",
    district: "צפון",
  },
  {
    branch_id: "64",
    branch_name: "נס ציונה",
    district: "מרכז",
  },
  {
    branch_id: "65",
    branch_name: "נצרת",
    district: "חיפה",
  },
  {
    branch_id: "66",
    branch_name: "נטיבות",
    district: "דרום",
  },
  {
    branch_id: "67",
    branch_name: "נתניה - מרכז העיר",
    district: "מרכז",
  },
  {
    branch_id: "68",
    branch_name: "נתניה - פולג ",
    district: "מרכז",
  },
  {
    branch_id: "69",
    branch_name: "סכנין",
    district: "צפון",
  },
  {
    branch_id: "70",
    branch_name: "עכו",
    district: "צפון",
  },
  {
    branch_id: "71",
    branch_name: "עפולה",
    district: "צפון",
  },
  {
    branch_id: "72",
    branch_name: "ערד",
    district: "דרום",
  },
  {
    branch_id: "73",
    branch_name: "פארק אדיסון",
    district: "צפון",
  },
  {
    branch_id: "74",
    branch_name: "רמת גן - מרום נווה",
    district: "דן",
  },
  {
    branch_id: "75",
    branch_name: "רמת גן - קניון ביאליק",
    district: "דן",
  },
  {
    branch_id: "76",
    branch_name: "פרדס חנה",
    district: "חיפה",
  },
  {
    branch_id: "77",
    branch_name: "פתח תקווה - אם המושבות",
    district: "דן",
  },
  {
    branch_id: "78",
    branch_name: "פתח תקווה - בלינסון",
    district: "דן",
  },
  {
    branch_id: "79",
    branch_name: "פתח תקווה כפר - גנים",
    district: "דן",
  },
  {
    branch_id: "80",
    branch_name: "פתח תקווה - סירקין",
    district: "דן",
  },
  {
    branch_id: "81",
    branch_name: "קרית מוצקין",
    district: "חיפה",
  },
  {
    branch_id: "82",
    branch_name: "קרית אתא",
    district: "חיפה",
  },
  {
    branch_id: "83",
    branch_name: "קרית גת",
    district: "דרום",
  },
  {
    branch_id: "82",
    branch_name: "ירושלים - קרית יובל",
    district: "מרכז",
  },
  {
    branch_id: "83",
    branch_name: "קרית - שמונה",
    district: "צפון",
  },
  {
    branch_id: "84",
    branch_name: "ראש העין",
    district: "דן",
  },
  {
    branch_id: "85",
    branch_name: "ראש פינה",
    district: "צפון",
  },
  {
    branch_id: "86",
    branch_name: "ראשון לציון - מזרח",
    district: "מרכז",
  },
  {
    branch_id: "87",
    branch_name: "ראשון לציון - מערב",
    district: "מרכז",
  },
  {
    branch_id: "88",
    branch_name: "רהט",
    district: "דרום",
  },
  {
    branch_id: "89",
    branch_name: "רחובות",
    district: "מרכז",
  },
  {
    branch_id: "90",
    branch_name: "רמת השרון",
    district: "דן",
  },
  {
    branch_id: "91",
    branch_name: "רמלה לוד",
    district: "מרכז",
  },
  {
    branch_id: "92",
    branch_name: "רמת ישי",
    district: "חיפה",
  },
  {
    branch_id: "93",
    branch_name: "רעננה",
    district: "מרכז",
  },
  {
    branch_id: "94",
    branch_name: "שדרות",
    district: "דרום",
  },
  {
    branch_id: "95",
    branch_name: "שוהם",
    district: "מרכז",
  },
  {
    branch_id: "96",
    branch_name: "שפרעם - קניון האחים סמרה",
    district: "חיפה",
  },
  {
    branch_id: "97",
    branch_name: "תל אביב - יד אליהו",
    district: "דן",
  },
  {
    branch_id: "98",
    branch_name: "תל אביב - רמת החייל",
    district: "דן",
  },
  {
    branch_id: "99",
    branch_name: "תל אביב - חשמונאים",
    district: "דן",
  },
  {
    branch_id: "100",
    branch_name: "תל אביב - רמת אביב",
    district: "דן",
  },
];

const pizzaTopping = [
  "עגבניה",
  "אקסטרה גבינה",
  "גבינה כחולה",
  "פפרוני",
  "פטריות",
  "זיתים שחורים",
  "פלפל חריף",
  "אננס",
  "חלפיניוס",
  "בייקון",
  "בשר בקר טחון",
  "זיתים ירוקים",
  "תירס",
  "בצל",
  "שום",
  "עוף",
  "תרד",
  "גבינת פטה",
  "אנשובי",
  "לבבות ארטישוק",
];
const openingTime = ["09:00", "09:30", "10:00", "10:30", "11:00"];
const closingTime = ["22:00", "22:30", "23:00", "23:30", "23:30"];

module.exports = {
  openingTime,
  closingTime,
  pizzaTopping,
  pizzaBranches,
};