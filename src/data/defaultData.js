export const defaultCategories = [
  {
    category_id: 1,
    category_name: "Case Study",
    parent_id: null,
    description: "All case studies related to law",
    image_url: null
  },
  {
    category_id: 20,
    category_name: "Criminal Law",
    parent_id: 1,
    description: "Senior",
    image_url: "backend/images/1791528597375-Copilot_20260925_132054.png"
  },
  {
    category_id: 21,
    category_name: "Criminal Law",
    parent_id: 1,
    description: "Senior",
    image_url: "backend/images/1791528596466-Copilot_20260925_132054.png"
  },
  {
    category_id: 22,
    category_name: "civil law",
    parent_id: 1,
    description: "Senior",
    image_url: "backend/images/1791901372190-134255487544495404.jpg"
  },
  {
    category_id: 24,
    category_name: "Matrimonial",
    parent_id: 1,
    description: "family cases",
    image_url: "images/1791985257930-slide3.jpg"
  }
];

export const defaultMembers = [
  {
    id: 24,
    name: "Bittoo Sharma",
    role: "Senior Advocate ",
    description: "Bail Granted",
    image_url: "images/1791529791240-WhatsApp Image 2026-05-25 at 12.59.02 PM.jpeg"
  },
  {
    id: 28,
    name: "Kaushal Rana",
    role: "Advocate",
    description: "Legal Adviser",
    image_url: "images/1791984806425-person_1.jpg"
  },
  {
    id: 29,
    name: "Abhishek",
    role: "Advocate",
    description: "Criminal Cases",
    image_url: "images/1791984840887-bg_1.jpg"
  }
];

export const defaultOrders = [
  {
    id: 12,
    name: "Bittoo Sharma",
    case_title: "Amit vs pretty",
    image_url: "images/1791984973105-bg_2.jpg",
    pdf_url: "pdfs/1791984973132-302ipc.pdf",
    description: "Bail granted"
  },
  {
    id: 13,
    name: "Poonam Sharma",
    case_title: "sajid vs sabana",
    image_url: "images/1791985018976-slide3.jpg",
    pdf_url: "pdfs/1791985018979-302ipc.pdf",
    description: "Bail granted"
  },
  {
    id: 14,
    name: "Abhishek",
    case_title: "State vs Gaurav Nagar",
    image_url: "images/1791985059583-slide1.jpg",
    pdf_url: "pdfs/1791985059624-302ipc.pdf",
    description: "Bail Granted"
  },
  {
    id: 15,
    name: "Kaushal Rana",
    case_title: "Poonam vs sajid",
    image_url: "images/1791985099188-slide1.jpg",
    pdf_url: "pdfs/1791985099189-302ipc.pdf",
    description: "Bail Pending"
  }
];
