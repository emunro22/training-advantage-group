// Blog content for Training Advantage Group Ltd. Every post below is grounded in the
// training/course facts already published elsewhere on this site (course pages, accreditations
// page, TM CPC/news pages) — no invented statistics, participant counts, founding dates or
// testimonials. Where a course's price is admin-managed elsewhere (e.g. /pricing), posts link to
// the relevant service page rather than repeating a figure that could drift out of date.

export interface BlogBodyBlock {
  type: "heading" | "paragraph" | "list";
  text?: string;
  items?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  metaDescription: string;
  publishDate: string; // ISO date (yyyy-mm-dd)
  excerpt: string;
  body: BlogBodyBlock[];
  relatedHref: string;
  relatedLabel: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "understanding-the-driver-cpc-35-hour-rule",
    title: "Understanding the Driver CPC 35-Hour Rule",
    category: "Driver CPC",
    metaDescription:
      "What Driver CPC actually requires: the 35-hour periodic training cycle, who needs it, and how the modules and DVSA hours upload work at Training Advantage Group.",
    publishDate: "2026-07-14",
    excerpt:
      "Driver CPC is the mandatory qualification behind every professional HGV and PCV licence. Here's what the 35-hour rule means in practice, and how the training modules fit together.",
    body: [
      {
        type: "paragraph",
        text: "Driver CPC (Certificate of Professional Competence) is a mandatory qualification for professional HGV and PCV drivers. If you hold a Category C, C+E, C1, D, D+E or D1 licence and drive for a living, you're likely required to hold a valid Driver Qualification Card (DQC), with some exemptions depending on your circumstances.",
      },
      {
        type: "heading",
        text: "What the 35-hour rule means",
      },
      {
        type: "paragraph",
        text: "To keep a DQC valid, drivers must complete 35 hours of periodic training every 5 years. That training doesn't need to happen in one block. Training Advantage Group runs both 3.5-hour sessions and full 7-hour sessions, and each counts proportionally towards the 35-hour total, so drivers can fit sessions around rotas and operational demands.",
      },
      {
        type: "heading",
        text: "What the modules cover",
      },
      {
        type: "paragraph",
        text: "DVSA-approved Driver CPC training is delivered across a set of core modules, including:",
      },
      {
        type: "list",
        items: [
          "Drivers' Hours & Working Time",
          "Emergency First Aid",
          "Vulnerable Road Users",
          "Vehicle Safety & Security",
          "Health & Safety for Drivers",
          "Tachograph Use & Records",
          "Load Security",
          "Eco-friendly Driving",
          "Customer Relations",
          "Road Traffic Law",
        ],
      },
      {
        type: "heading",
        text: "Classroom or remote",
      },
      {
        type: "paragraph",
        text: "Driver CPC training is available as classroom sessions at our Bothwell, Motherwell and Glasgow centres, or remotely online for drivers who have a computer or tablet with a webcam and a stable internet connection. As a JAUPT-approved training provider (consortium reference AC00591), TAG uploads completed hours directly to the DVSA JAUPT system, so there's no separate paperwork for drivers to submit.",
      },
      {
        type: "paragraph",
        text: "Assessment is attendance-based rather than exam-based: drivers who participate and engage throughout the session receive their certificate, with hours typically uploaded to DVSA within 3 working days of completion.",
      },
    ],
    relatedHref: "/driver-cpc",
    relatedLabel: "View Driver CPC training",
  },
  {
    slug: "iosh-managing-safely-what-to-expect",
    title: "IOSH Managing Safely: What to Expect from the Course",
    category: "Health & Safety",
    metaDescription:
      "A breakdown of the IOSH Managing Safely course structure: the seven modules, how it's assessed, and who the qualification is designed for.",
    publishDate: "2026-07-28",
    excerpt:
      "IOSH Managing Safely is a benchmark qualification for managers and supervisors. Here's how the seven course modules and two-part assessment fit together.",
    body: [
      {
        type: "paragraph",
        text: "IOSH Managing Safely® is one of the most widely recognised health and safety qualifications for people who manage or supervise others. Training Advantage Group's course is delivered 100% online, is independently rated 'Outstanding' by IOSH (the highest possible grade), and gives learners 190 days of access from enrolment.",
      },
      {
        type: "heading",
        text: "The seven course modules",
      },
      {
        type: "list",
        items: [
          "Introduction — health and safety management, legal context and management responsibilities",
          "Assessing Risks — understanding hazards and carrying out effective risk assessments",
          "Controlling Risks — the hierarchy of controls and selecting appropriate measures",
          "Understanding Responsibilities — legal duties and the role of managers and supervisors",
          "Understanding Hazards — physical, chemical, biological and ergonomic risks",
          "Investigating Incidents — reporting, root cause analysis and learning from accidents",
          "Measuring Performance — monitoring and reviewing health and safety performance",
        ],
      },
      {
        type: "heading",
        text: "How it's assessed",
      },
      {
        type: "paragraph",
        text: "Assessment happens in two parts, both completed online after finishing the modules: a multiple-choice examination of 30 interactive questions, and a practical work-based risk assessment where learners apply what they've covered to a real workplace situation. Most learners complete the whole course, study and assessment included, in 16–24 hours, working at their own pace.",
      },
      {
        type: "heading",
        text: "Who it's for",
      },
      {
        type: "paragraph",
        text: "The course is aimed at supervisors and team leaders responsible for staff, managers at any level in any industry, business owners and directors, and anyone moving into a management role for the first time. No prior qualifications are required. Successful candidates receive the official IOSH Managing Safely® Digital Certificate, issued directly by IOSH.",
      },
    ],
    relatedHref: "/iosh-managing-safely",
    relatedLabel: "View IOSH Managing Safely",
  },
  {
    slug: "choosing-the-right-first-aid-course",
    title: "Choosing the Right First Aid Course for Your Workplace",
    category: "First Aid",
    metaDescription:
      "EFAW, FAW, FAW Refresher or Paediatric First Aid — a plain guide to which NLTC Level 3 OFQUAL regulated first aid course fits your workplace.",
    publishDate: "2026-08-11",
    excerpt:
      "With four different first aid qualifications on offer, it isn't always obvious which one a workplace actually needs. Here's how EFAW, FAW and Paediatric First Aid differ.",
    body: [
      {
        type: "paragraph",
        text: "Under the Health and Safety (First Aid) Regulations 1981, every workplace needs adequate first aid provision, but which qualification counts as 'adequate' depends on the type of workplace. Training Advantage Group delivers four first aid qualifications, all either NLTC Level 3 OFQUAL regulated or in-house accredited.",
      },
      {
        type: "heading",
        text: "Emergency First Aid at Work (EFAW) — 1 day",
      },
      {
        type: "paragraph",
        text: "The most widely held first aid at work qualification. It covers core emergency response skills including CPR, use of an AED, choking, severe bleeding and shock, and is generally suitable for all industries, particularly lower-risk workplaces such as offices and retail.",
      },
      {
        type: "heading",
        text: "First Aid at Work (FAW) — 3 days",
      },
      {
        type: "paragraph",
        text: "The full First Aid at Work qualification, aimed at higher-risk environments such as construction, manufacturing and warehousing. It builds on all EFAW content and adds head, neck and spinal injuries, chest injuries, eye injuries and poisoning, anaphylaxis, and managing multiple casualties.",
      },
      {
        type: "heading",
        text: "FAW Refresher — 2 days",
      },
      {
        type: "paragraph",
        text: "For qualified first aiders who already hold a FAW certificate and need to renew it before it expires. It refreshes CPR and AED skills and covers updated best practice, without repeating the full 3-day course.",
      },
      {
        type: "heading",
        text: "Paediatric First Aid — 1–2 days",
      },
      {
        type: "paragraph",
        text: "A specialist course for anyone working with children and infants, covering CPR for infants and children, choking management, febrile convulsions, and allergic reactions, aimed at nurseries, childminders, schools, sports coaches and youth workers.",
      },
      {
        type: "paragraph",
        text: "All four qualifications are valid for 3 years, and every course can be delivered on-site at your premises as well as at our training centres, with all equipment and manikins provided.",
      },
    ],
    relatedHref: "/first-aid",
    relatedLabel: "View First Aid training",
  },
  {
    slug: "transport-manager-cpc-explained",
    title: "Transport Manager CPC: What's Involved and Why Exam Fees Are Included",
    category: "TM CPC",
    metaDescription:
      "What the Transport Manager CPC qualification covers, why an Operator Licence needs a nominated TM, and how TAG's included NLTC exam fees affect the total cost.",
    publishDate: "2026-08-19",
    excerpt:
      "Transport Manager CPC is the mandatory route to holding a Standard National or International Operator Licence. Here's what the qualification actually covers.",
    body: [
      {
        type: "paragraph",
        text: "The Transport Manager CPC (Certificate of Professional Competence) is the qualification required to become a professional Transport Manager, or to be the nominated Transport Manager on a Standard National or International Operator Licence. Training Advantage Group's classroom-intensive programme covers all four DVSA modules across topics including:",
      },
      {
        type: "list",
        items: [
          "Operator Licensing",
          "Drivers' Hours & Tachographs",
          "Vehicle Maintenance & Roadworthiness",
          "Health & Safety",
          "Transport Operations",
          "Financial Standing",
          "Employment Law",
          "Fleet Compliance",
          "Loading & Security",
          "International Transport Operations",
        ],
      },
      {
        type: "heading",
        text: "NLTC exam fees are included",
      },
      {
        type: "paragraph",
        text: "TAG's TM CPC course price includes all four NLTC examination fees, rather than charging them separately, which TAG has confirmed can save candidates up to £250 compared with providers who charge exam fees on top of course fees.",
      },
      {
        type: "heading",
        text: "What else is included",
      },
      {
        type: "paragraph",
        text: "Alongside the classroom teaching, the course includes a full study manual, 12 months of access to the EOS e-learning platform after the course finishes, and a bank of over 1,000 practice questions to prepare for the exams. Both Road Haulage and PSV/Bus streams are available, taught by experienced Transport Manager professionals in small class sizes.",
      },
      {
        type: "heading",
        text: "Already qualified? Refresher training is available",
      },
      {
        type: "paragraph",
        text: "For Transport Managers who already hold their CPC, TAG also runs TM CPC Refresher Training, covering updates to operator licensing, drivers' hours and tachograph rules, vehicle maintenance standards and fleet compliance best practice, useful for CPD or ahead of a DVSA audit.",
      },
    ],
    relatedHref: "/tm-cpc",
    relatedLabel: "View Transport Manager CPC",
  },
  {
    slug: "npors-plant-training-explained",
    title: "NPORS Plant Training Explained: Forklift, Telehandler and MEWP Courses",
    category: "Plant & MHE",
    metaDescription:
      "What NPORS accreditation means, and how forklift, reach truck, telehandler, MEWP and excavator/dumper training differ at Training Advantage Group.",
    publishDate: "2026-08-27",
    excerpt:
      "NPORS cards are recognised across the UK construction and industrial sectors. Here's what the main plant and MHE courses actually cover.",
    body: [
      {
        type: "paragraph",
        text: "NPORS (the National Plant Operators Registration Scheme) is one of the UK's leading plant operator training and registration schemes. NPORS operator cards, issued on successful completion of training, are widely recognised and accepted across UK construction and industrial sites, and all plant and MHE training at Training Advantage Group is delivered by NPORS accredited trainers and assessors.",
      },
      {
        type: "heading",
        text: "Counterbalance Forklift — Novice and Refresher",
      },
      {
        type: "paragraph",
        text: "The Novice course is a full training programme for new operators with no prior experience. The Refresher course is aimed at operators who already have experience but need their qualification renewed.",
      },
      {
        type: "heading",
        text: "Reach Truck",
      },
      {
        type: "paragraph",
        text: "Covers narrow-aisle reach truck operation and safety, distinct from counterbalance forklift training due to the different handling characteristics of reach trucks in warehouse environments.",
      },
      {
        type: "heading",
        text: "Telehandler",
      },
      {
        type: "paragraph",
        text: "Covers all-terrain telescopic handler operation, commonly used across construction and agricultural sites.",
      },
      {
        type: "heading",
        text: "MEWP (Mobile Elevated Work Platforms)",
      },
      {
        type: "paragraph",
        text: "Covers powered access equipment across all categories, for work that requires safe operation at height.",
      },
      {
        type: "heading",
        text: "Excavator / Dumper",
      },
      {
        type: "paragraph",
        text: "Covers plant machinery training including 360-degree excavators and dumpers, for operators working on groundworks and civils sites.",
      },
      {
        type: "paragraph",
        text: "All courses can be delivered on-site at your premises or at TAG's training centres, with novice and refresher options and group booking discounts available. Current course pricing is kept up to date on the plant and MHE training page.",
      },
    ],
    relatedHref: "/plant-training",
    relatedLabel: "View Plant & MHE training",
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}
