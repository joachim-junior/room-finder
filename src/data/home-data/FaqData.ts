interface DataType {
  id: number;
  page: string;
  question: string;
  answer: string;
  showAnswer: boolean;
}

const faq_data: DataType[] = [
  {
    id: 1,
    page: "home_2_faq_1",
    question: "Advance Search",
    answer:
      "It only takes 5 minutes. Set-up is smooth & simple, with fully customisable filter to the right one.",
    showAnswer: false,
  },
  {
    id: 2,
    page: "home_2_faq_1",
    question: "Exert Agents for any help",
    answer:
      "It only takes 5 minutes. Set-up is smooth & simple, with fully customisable filter to the right one.",
    showAnswer: false,
  },
  {
    id: 3,
    page: "home_2_faq_1",
    question: "Protected payments, every time",
    answer:
      "It only takes 5 minutes. Set-up is smooth & simple, with fully customisable filter to the right one.",
    showAnswer: false,
  },

  // home_2_faq_2

  {
    id: 1,
    page: "home_2_faq_2",
    question: "Can foreigners rent guesthouses in Cameroon?",
    answer:
      "Yes, foreigners can rent guesthouses in Cameroon using Roomfinder. Simply browse available listings, provide the required identification, and book your stay online.",
    showAnswer: false,
  },
  {
    id: 2,
    page: "home_2_faq_2",
    question: "What documents are needed to rent a guesthouse?",
    answer:
      "You typically need a valid ID or passport to rent a guesthouse. Some hosts may request additional information for verification.",
    showAnswer: false,
  },
  {
    id: 3,
    page: "home_2_faq_2",
    question: "How do I confirm my guesthouse booking?",
    answer:
      "After selecting your guesthouse and completing payment, you will receive a booking confirmation by email or SMS. You can also view your booking details in your Roomfinder account.",
    showAnswer: false,
  },
  {
    id: 4,
    page: "home_2_faq_2",
    question: "What payment methods are accepted for guesthouse rentals?",
    answer:
      "Roomfinder accepts secure payments via bank transfer, mobile money, and other local payment options. Always pay through the platform for your security.",
    showAnswer: false,
  },

  // home_six

  {
    id: 1,
    page: "home_six",
    question: "Who we are?",
    answer:
      "Our founders Dustin Moskovitz and Justin Rosenstein met while leading Engineering .",
    showAnswer: false,
  },
  {
    id: 2,
    page: "home_six",
    question: "What’s our goal",
    answer:
      "Our founders Dustin Moskovitz and Justin Rosenstein met while leading Engineering .",
    showAnswer: false,
  },
  {
    id: 3,
    page: "home_six",
    question: "Our vision",
    answer:
      "Our founders Dustin Moskovitz and Justin Rosenstein met while leading Engineering .",
    showAnswer: false,
  },
];

export default faq_data;
