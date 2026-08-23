export interface TrainingCentre {
  id: "bothwell" | "motherwell" | "glasgow";
  name: string;
  emoji: string;
  address: string;
  streetAddress: string;
  addressLocality: string;
  postcode: string;
  description: string;
  features: string[];
  gradient: string;
  transport: string;
  /** Short, location-specific pitch used on the dedicated /training-centres/[id] page. */
  intro: string;
  /** Nearby towns/areas this centre serves — used for local SEO copy. */
  areasServed: string[];
}

export const TRAINING_CENTRES: TrainingCentre[] = [
  {
    id: "bothwell",
    name: "Bothwell HQ & Exam Suite",
    emoji: "🏢",
    address: "1st Floor Training Suite, APC Depot, Coalburn Road, Bothwell, G71 8DA",
    streetAddress: "1st Floor Training Suite, APC Depot, Coalburn Road",
    addressLocality: "Bothwell",
    postcode: "G71 8DA",
    description:
      "Our main headquarters and primary exam suite. The Bothwell site is co-located at the APC Depot on Coalburn Road and serves as our flagship training facility. Home to our management team and primary classroom and examination facilities.",
    features: [
      "Main TAG Headquarters",
      "Exam Suite & Assessment Rooms",
      "Fully Equipped Classrooms",
      "Free Visitor Parking on Site",
      "Candidate Shuttle Service from St Bride's Church",
      "DVSA-Approved Testing Facility",
    ],
    gradient: "from-navy to-navy-light",
    transport:
      "Free shuttle every 10 minutes from St Bride's Church, Fallside Road, Bothwell. Shuttle runs from 40 minutes before course start until 40 minutes after course end.",
    intro:
      "TAG's flagship headquarters and DVSA-approved exam suite, serving Bothwell, Uddingston, Hamilton, Blantyre and the wider South Lanarkshire area.",
    areasServed: ["Uddingston", "Hamilton", "Blantyre", "East Kilbride", "South Lanarkshire"],
  },
  {
    id: "motherwell",
    name: "Motherwell Training Centre",
    emoji: "🏫",
    address: "28 Hope Street, Motherwell, ML1 1TA",
    streetAddress: "28 Hope Street",
    addressLocality: "Motherwell",
    postcode: "ML1 1TA",
    description:
      "Our Motherwell training centre is located at 28 Hope Street in Motherwell town centre. Modern training facilities with easy access by public transport and good local parking options.",
    features: [
      "Full Training Facilities",
      "Modern Classrooms",
      "Central Motherwell Location",
      "Public Transport Links",
      "Local Parking Available",
      "Classroom & Practical Training",
    ],
    gradient: "from-blue-brand to-blue-dark",
    transport:
      "Motherwell train station is a short walk away. Local bus routes serve Hope Street. Street and car park parking available nearby.",
    intro:
      "A modern town-centre training centre serving Motherwell, Wishaw, Bellshill and North Lanarkshire, a short walk from Motherwell train station.",
    areasServed: ["Wishaw", "Bellshill", "Coatbridge", "Airdrie", "North Lanarkshire"],
  },
  {
    id: "glasgow",
    name: "Glasgow Training Centre",
    emoji: "🏙️",
    address: "South Street, Glasgow, G14 0BX",
    streetAddress: "South Street",
    addressLocality: "Glasgow",
    postcode: "G14 0BX",
    description:
      "Our Glasgow training centre is located in the west of Glasgow on South Street, close to the Clydeside and easily accessible from across the city and surrounding areas.",
    features: [
      "West Glasgow Location",
      "Excellent Transport Links",
      "Modern Training Facilities",
      "Easy City Access",
      "Local Parking Available",
      "Classroom & Practical Training",
    ],
    gradient: "from-orange-dark to-red-brand",
    transport: "The centre is accessible by bus and local transport links. Parking is available on and around South Street.",
    intro:
      "A West Glasgow training centre on South Street near the Clydeside, serving Glasgow city, Clydebank, Renfrewshire and the wider West of Scotland.",
    areasServed: ["Clydebank", "Renfrew", "Paisley", "Yoker", "West of Scotland"],
  },
];

export function getTrainingCentre(id: string): TrainingCentre | undefined {
  return TRAINING_CENTRES.find((c) => c.id === id);
}
